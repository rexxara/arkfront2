import React from 'react'
import { LINE_TYPE, DisplayLine, CommandLine, NO_IMG, displayCharacter, DisplayCharacters, selectedBGM, LoadedChapterModel3, Option, RawScript, GameModel3 } from '../../utils/types'
import { variableLoader } from '../../utils/utils'
import classnames from 'classnames'
import _omit from 'lodash/omit'
import styles from './style.css'
import ARKBGMplayer from './component/BGMplayer'
import { commandProcess, actionReg } from '../../utils/loader'
import ARKOption from './Option'
import action, { SaveData } from './actions'
import SaveDataCon from './component/saveDataCon'
import ImgCache from './component/ImgCache'
import CtrlPanel from './component/ctrlPanel'
interface IProps {
    data: GameModel3,
    RawScript: RawScript
}
export interface IState {
    saveDataConOpen: boolean,
    auto: boolean
    displayText: string
    displayName: string
    cacheDisplayLineText: string
    cacheDisplayLineName: string
    background: string
    timers: any
    linePointer: number
    displaycharacters: DisplayCharacters
    rawLine: string
    stop: boolean
    bgm: selectedBGM
    cg: string
    clickDisable: boolean
    choose: Option[],
    gameVariables: any,
    currentChapter: LoadedChapterModel3
    skipResourseCount: number//这玩意我得解释一下。加载新的图片资源（立绘，cg，背景）都
    //是异步加载然后callback点击调用clickhandle的因为脚本里showCg啊这些是不算displayLine的 必须自动帮玩家跳过，。然后玩家手动点击
    //但是加载存档的时候也会加载图片，这时候自动调用clickHandle就会跳到下一行，react的setstate也会集中更新所以虽然加载好几个图片触发clickhandle却只是跳到下一行，
    //然后在没有任何资源的行保存就不会跳 所以就试着在加载的时候保存这个counter，在onload的时候读取，判断是否为0，为零就clickHandle，不为零就--
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}

const TEXT_DISPLAY_SPEEED = 50
const iniState = {
    saveDataConOpen: false,
    auto: false,
    displayText: '',
    displayName: '',
    cacheDisplayLineText: '',
    cacheDisplayLineName: '',
    background: '',
    timers: undefined,
    linePointer: 0,
    displaycharacters: {},
    rawLine: '',
    stop: false,
    bgm: { name: '', src: '' },
    cg: '',
    clickDisable: false,
    skipResourseCount: 0,
    choose: [],
    currentChapter: {
        line: [],
        name: '',
        next: '',
        preLoadCgs: {},
        preLoadBackgrounds: {},
        preLoadCharaters: {}
    }
}
const gameVariables = {}
const saveDataAdapter = (newData: SaveData, props: IProps, state: IState) => {
    //currentChapter(string)=>array //rawLine=displaytext//chooseKey=>choose//isNext=>choose
    const { data: { chapters, chooses } } = props
    const { background, cg, displaycharacters: oldCharater } = state
    const { currentChapterName } = newData
    const loadedChapter = chapters.find(v => v.name === currentChapterName)
    if (loadedChapter) {
        delete newData.currentChapterName
        let choose: Option[] = []
        if (newData.chooseKey) {
            choose = chooses[newData.chooseKey]
            delete newData.chooseKey
        }
        if (newData.isNextChoose && Array.isArray(loadedChapter.next)) {
            choose = loadedChapter.next
        }
        let skipResourseCount = 0
        const { displaycharacters } = newData
        if (newData.background.length && newData.background !== background) skipResourseCount++
        if (newData.cg.length && newData.cg !== cg) skipResourseCount++
        skipResourseCount += Object.keys(displaycharacters).filter(key => {
            const oldEmo = (oldCharater[key] || {}).emotion
            const newEmo = displaycharacters[key].emotion
            if (oldEmo === newEmo) {
                return false
            } else if (newEmo.length) {
                return true
            } else {
                return false
            }
        }).length
        const rawLine = newData.displayText
        const mergedData = {
            ...iniState,
            ...newData,
            rawLine,
            choose,
            currentChapter: loadedChapter,
            skipResourseCount: skipResourseCount
        }
        return mergedData
    } else {
        console.warn('dataBroken')
    }
}
class MainGame extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { ...iniState, gameVariables }
        this.clickHandle = this.clickHandle.bind(this)
        this.textAnimation = this.textAnimation.bind(this)
        this.imgOnload = this.imgOnload.bind(this)
        this.commandLineProcess = this.commandLineProcess.bind(this)
        this.nextChapter = this.nextChapter.bind(this)
        this.reset = this.reset.bind(this)
        this.toogleAuto = this.toogleAuto.bind(this)
        this.clearTimers = this.clearTimers.bind(this)
        this.displayLineProcess = this.displayLineProcess.bind(this)
        this.skipThisLine = this.skipThisLine.bind(this)
        this.start = this.start.bind(this)
        this.textAnimationInner = this.textAnimationInner.bind(this)
        this.cgAndBackgroundOnload = this.cgAndBackgroundOnload.bind(this)
        this.startChapter = this.startChapter.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.execCommand = this.execCommand.bind(this)
        this.quickSave = this.quickSave.bind(this)
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
        this.closeSaveCon = this.closeSaveCon.bind(this)
        this.openSaveCon = this.openSaveCon.bind(this)
    }
    quickSave() {
        action.save(this.state, 0)
    }
    save(param: number) {
        action.save(this.state, param)
    }
    openSaveCon() {
        const { currentChapter, linePointer } = this.state
        this.skipThisLine(currentChapter.line[linePointer])
        this.setState({ saveDataConOpen: true })
    }
    closeSaveCon() {
        this.setState({ saveDataConOpen: false })
    }
    async load(ev?: React.MouseEvent, savedata?: SaveData) {
        const { currentChapter, linePointer, } = this.state
        this.skipThisLine(currentChapter.line[linePointer])
        let newData = savedata|| await action.load(0)
        if (newData) {
            const data = saveDataAdapter(newData, this.props, this.state)
            if (data) {
                this.setState(data)
            }
        } else {
            console.log('noQuick load Data')
        }
    }
    componentDidMount() {
        window.reset = this.reset
        console.log(this.props)
        const { data: { variables } } = this.props
        this.setState({ gameVariables: variables }, this.startChapter)
    }
    startChapter(chapterKey?: string) {
        const { data: { chapters } } = this.props
        this.clearTimers()
        const { gameVariables } = this.state
        this.setState({ ...iniState, gameVariables })
        let chapter = undefined
        if (!chapterKey) {
            chapter = chapters.find(v => v.isBegin)
            console.warn('chapter is undefined ,Auto start same from first chapter')
        } else {
            chapter = chapters.find(v => v.name === chapterKey)
        }
        if (chapter) {
            const currentLine = chapter.line[0]
            this.start(currentLine)
            this.setState({
                currentChapter: chapter
            })
        }
    }
    skipThisLine(line: (DisplayLine | CommandLine)) {
        this.clearTimers()
        if ('value' in line) {
            const { gameVariables } = this.state
            this.setState({ displayText: variableLoader(line.value, gameVariables) as string })
        }
    }
    displayLineProcess(line: DisplayLine) {
        const { displayName, displaycharacters, gameVariables } = this.state
        const { name, emotion } = line
        let { value } = line
        value = variableLoader(value, gameVariables)
        let needLoadNewCharater = false
        let needLoadNewEmotion = false
        if (name && emotion) {
            needLoadNewCharater = true
            const nextEmo = emotion === NO_IMG ? "" : emotion
            needLoadNewEmotion = nextEmo ? true : false
            let nextDisplay: DisplayCharacters = {}
            for (const key in displaycharacters) {
                if (displaycharacters.hasOwnProperty(key)) {
                    const element = displaycharacters[key]
                    if (element.name === name) { needLoadNewCharater = false }
                    if (element.name === name && element.emotion === nextEmo) { needLoadNewEmotion = false }
                    nextDisplay[element.name] = element.name !== name ? element : { name, emotion: nextEmo }
                }
            }
            if (needLoadNewCharater) {
                nextDisplay = { ...displaycharacters, [name]: { name, emotion: nextEmo } as displayCharacter }
            }
            this.setState({ displaycharacters: nextDisplay })
        }
        if (needLoadNewEmotion) {
            this.setState({ cacheDisplayLineText: value, cacheDisplayLineName: name || '', clickDisable: true })
        } else {
            if (name !== displayName) { this.setState({ displayName: '' }) }
            this.textAnimation(value, name, true)
        }
    }
    clearTimers() {
        const { timers } = this.state
        clearTimeout(timers)
        this.setState({ timers: undefined, stop: false })
    }
    toogleAuto() {
        const { auto, timers } = this.state
        this.setState({ auto: !auto })
        if (!auto && !timers) {//要自动播放但是现在没在滚动
            this.clickHandle()
        }
    }
    reset() {
        const { data: { chapters } } = this.props
        this.setState(iniState)
        this.clearTimers()
        this.startChapter()
    }
    nextChapter() {
        const { currentChapter: { next }, gameVariables } = this.state
        switch (typeof next) {
            case 'string':
                return this.startChapter(next)
            case "object":
                return this.commandLineProcess({ "command": "showChoose", "param": next })
            case 'function':
                return this.startChapter(next(gameVariables))
            default:
                console.log('gameOver')
                break
        }
        //console.error('no Next Chapter Or GameOver')
    }
    start(currentLine: (CommandLine | DisplayLine)) {
        if ('command' in currentLine) {
            this.commandLineProcess(currentLine as CommandLine)
        } else {
            this.displayLineProcess(currentLine as DisplayLine)
        }
    }
    commandLineProcess(command: CommandLine) {
        const { background, displaycharacters, cg } = this.state
        const ARKBGM = document.getElementById('ARKBGM') as HTMLAudioElement
        let newParam = {}
        let needLoadImg = false
        let needStop = false
        switch (command.command) {
            case LINE_TYPE.command_SHOW_BACKGROUND:
                needLoadImg = background !== command.param
                if (needLoadImg) {
                    newParam = { background: command.param }
                }
                break
            case LINE_TYPE.command_LEAVE_CHARATER:
                newParam = { displaycharacters: _omit(displaycharacters, [command.param as string]) }
                break
            case LINE_TYPE.command_ENTER_CHARATER:
                const hitedCharater = displaycharacters[(command.param as displayCharacter).name]
                if (hitedCharater) {
                    needLoadImg = hitedCharater.emotion !== (command.param as displayCharacter).emotion//有人表情不一样
                } else { needLoadImg = true }//没人
                newParam = {
                    displaycharacters: { ...displaycharacters, [(command.param as displayCharacter).name]: command.param },
                    cacheDisplayLineName: '',
                    cacheDisplayLineText: ''
                }
                break
            case LINE_TYPE.command_PLAY_BGM:
                newParam = { bgm: command.param }
                break
            case LINE_TYPE.command_REMOVE_BACKGROUND:
                newParam = { background: '' }
            case LINE_TYPE.command_PAUSE_BGM:
                if (ARKBGM) { ARKBGM.pause() } else { throw new Error('bgmNotFound') }
                break
            case LINE_TYPE.command_RESUME_BGM:
                if (ARKBGM) { ARKBGM.play() } else { throw new Error('bgmNotFound') }
                break
            case LINE_TYPE.command_SHOW_CG:
                needLoadImg = cg !== command.param
                if (needLoadImg) {
                    newParam = { cg: command.param }
                }
                break
            case LINE_TYPE.command_REMOVE_CG:
                newParam = { cg: '', displaycharacters: [] }
                break
            case LINE_TYPE.command_SHOW_CHOOSE:
                needStop = true
                newParam = { choose: command.param, clickDisable: true }
                break
            default:
                //'invalidCommand')
                break
        }
        if (needLoadImg) {
            this.setState({ ...newParam, clickDisable: true })
        } else if (!needStop) {
            this.setState(newParam, () => { this.clickHandle() })
        } else if (needStop) {
            this.setState(newParam)
        }
    }
    imgOnload() {
        const { skipResourseCount } = this.state
        if (!skipResourseCount) {
            this.setState({ clickDisable: false })
        } else {
            this.setState((state) => {
                return {
                    ...state,
                    skipResourseCount: state.skipResourseCount - 1
                }
            })
        }
        const { cacheDisplayLineName, cacheDisplayLineText } = this.state
        if (cacheDisplayLineName && cacheDisplayLineText) {
            this.textAnimation(cacheDisplayLineText, cacheDisplayLineName, true)
        } else {
            this.clickHandle()
        }
    }
    cgAndBackgroundOnload() {
        const { skipResourseCount } = this.state
        if (!skipResourseCount) {
            this.setState({ clickDisable: false }, () => {
                this.clickHandle()
            })
        } else {
            this.setState((state) => {
                return {
                    ...state,
                    skipResourseCount: state.skipResourseCount - 1
                }
            })
        }
    }
    textAnimation(value: string, name?: string, skip?: boolean) {
        // if (skip) {
        //     this.setState({ displayName: name || '', displayText: value })
        //     return 0
        // }
        this.setState({
            displayName: name || '',
            rawLine: value
        }, () => {
            if (value.length > 0) {
                this.textAnimationInner(1)
            }
        })
    }
    textAnimationInner(index: number) {
        const flag = setTimeout(() => {
            const { stop, displayText, rawLine } = this.state
            const end = displayText === rawLine
            this.setState({ displayText: rawLine.slice(0, index) })
            if (!stop && !end) {
                const flag = setTimeout(() => this.textAnimationInner(index + 1), TEXT_DISPLAY_SPEEED)
                this.setState({ timers: flag })
            } else {
                this.setState({ timers: null, displayText: rawLine })
                let { auto } = this.state
                if (auto) {
                    this.clickHandle()
                }
            }
        }, TEXT_DISPLAY_SPEEED)
        this.setState({ timers: flag })
    }
    onSelect(selectedOption: Option) {
        const { gameVariables } = this.state
        let newGameVariables = {}
        const { callback, jumpKey } = selectedOption
        if (callback) {
            newGameVariables = { ...gameVariables, ...callback(this.execCommand, gameVariables) }
        }
        if (jumpKey) {
            return this.startChapter(jumpKey)
        }
        this.setState({ gameVariables: newGameVariables, choose: [], clickDisable: false }, () => {
            this.clickHandle()
        })
    }
    execCommand(commandString: string) {
        const isCommand = commandString.match(actionReg)
        const { backgrounds, charaters, BGMs, cgs, chooses } = this.props.RawScript
        if (isCommand) {
            const commandJSON = commandProcess(isCommand, backgrounds, charaters, BGMs, cgs, {}, {}, {}, chooses)
            this.commandLineProcess(commandJSON)
        } else {
            console.warn(commandString + 'unrecognized')
        }
    }
    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { skipResourseCount, timers, auto, linePointer, clickDisable, currentChapter } = this.state
        config = config || {}
        if (skipResourseCount) {//这块和imgOnLoad的逻辑有重复，不过没bug就先不改了,没个j8,到处都是bug
            return
        }
        if (ev && clickDisable) {
            //不让点你还点，点的太快了
            return 0
        }
        if (ev) {//手动点击取消自动播放
            if (auto) this.setState({ auto: false })
            if (timers) this.clearTimers()
        }
        if (currentChapter) {
            const currentLines = currentChapter.line
            if (!timers) {//如果一行播放结束
                if (linePointer >= currentLines.length - 1) {//一章或者一节结束
                    return this.nextChapter()
                } else {
                    const nextLine = currentLines[linePointer + 1]
                    this.setState({ linePointer: linePointer + 1 })
                    this.start(nextLine)
                }
            } else {
                this.skipThisLine(currentLines[linePointer])//跳过动画
            }
        } else {
            console.warn('noChapter')
        }
    }
    render() {
        const { auto, background, displayName, displayText, linePointer, displaycharacters, bgm, cg, choose, gameVariables, saveDataConOpen, currentChapter } = this.state
        const displaycharactersArray = Object.keys(displaycharacters).map(v => { return { name: v, ...displaycharacters[v] } })
        return <React.Fragment>
            <CtrlPanel clickHandle={(ev) => this.clickHandle(ev, { reset: true })}
                linePointer={linePointer}
                auto={auto}
                closeSaveCon={this.closeSaveCon}
                openSaveCon={this.openSaveCon}
                quickSave={this.quickSave}
                quickLoad={this.load}
                displaycharactersArray={displaycharactersArray}
                nextChapter={this.nextChapter}
                toogleAuto={this.toogleAuto}
            />
            <ARKBGMplayer src={bgm} />
            {saveDataConOpen && <SaveDataCon saveData={this.save} loadData={this.load} />}
            <div className={styles.container}
                style={{
                    background: background ?
                        `url(${require(`../../scripts/backgrounds/${background}`)})` : undefined
                }}
                onClick={this.clickHandle}>
                <div className={choose.length && styles.chooseCon}>{choose.map((v, k) => <ARKOption gameVariables={gameVariables} key={k} onClick={this.onSelect} v={v} choose={choose} />)}</div>
                <div className={styles.displayCharactersCon}>
                    {displaycharactersArray.map(v => v.emotion ? <img
                        onLoad={this.imgOnload}
                        className={displayName === v.name ? classnames(styles.displayCharacter, styles.active) : styles.displayCharacter}
                        key={v.name}
                        src={require(`../../scripts/charatersImages/${v.name}/${v.emotion}`)} /> : <p key={v.name} />)}
                </div>
                <div className={styles.cgCon}
                    style={{
                        background: cg ?
                            `url(${require(`../../scripts/CGs/${cg}`)})` : undefined
                    }}></div>
                <div className={styles.dialog}>
                    <div className={styles.owner}>{displayName}</div>
                    <div className={styles.textarea} >{displayText}</div>
                </div>
            </div>
            {background && <img className={styles.hide} onLoad={this.cgAndBackgroundOnload} src={require(`../../scripts/backgrounds/${background}`)} alt="" />}
            {cg && <img className={styles.hide} onLoad={this.cgAndBackgroundOnload} src={require(`../../scripts/CGs/${cg}`)} alt="" />}
            <ImgCache chapter={currentChapter} />
        </React.Fragment>
    }
}
export default MainGame
