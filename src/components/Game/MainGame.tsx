import React from 'react'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game, NO_IMG, displayCharacter, DisplayCharacters, selectedBGM, NewChapters, Option, RawScript } from '../../utils/types'
import { getValueByObjKeyValue, variableLoader } from '../../utils/utils'
import classnames from 'classnames'
import _omit from 'lodash/omit'
import styles from './style.css'
import BGMplayer from './BGMplayer'
import { commandProcess, actionReg } from '../../utils/loader'

interface IProps {
    data: Game,
    RawScript: RawScript
}
interface IState {
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
    preloadJSX: any
    clickDisable: boolean
    newChapterIndex: number
    newSectionIndex: number
    totalChapter: number,
    totalSection: number,
    choose: Option[],
    gameVariables: any
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}

const TEXT_DISPLAY_SPEEED = 50
const iniState = {
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
    preloadJSX: undefined,
    clickDisable: false,
    newChapterIndex: 1,
    newSectionIndex: 0,
    totalChapter: 0,
    totalSection: 0,
    choose: [],
    gameVariables: {}
}
class MainGame extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = iniState
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
        this.setImgCache = this.setImgCache.bind(this)
        this.startChapterOrSection = this.startChapterOrSection.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.execCommand = this.execCommand.bind(this)
    }

    componentDidMount() {
        window.reset = this.reset
        console.log(this.props)
        const { data: { chapters, variables } } = this.props
        this.setState({ gameVariables: variables })
        this.startChapterOrSection(chapters, 1, 1)
    }
    startChapterOrSection(chapters: NewChapters, chapterIndex: number, sectionIndex?: number) {
        console.log(sectionIndex)
        sectionIndex = sectionIndex || 0
        const { data: { total } } = this.props
        const newChapter: Chapter = getValueByObjKeyValue(chapters, 'index', chapterIndex) as Chapter
        let totalSection = 0
        if (newChapter.line) {
            this.setImgCache(newChapter)
            const currentLine = newChapter.line[0]
            this.start(currentLine)
            this.setState({
                newChapterIndex: chapterIndex,
                totalChapter: total,
                totalSection: totalSection
            })
        } else {
            if (sectionIndex === 0) sectionIndex = 1//如果是第一个小节的话section默认还是0
            const newChapterSection = getValueByObjKeyValue(newChapter.sections, 'index', sectionIndex) as Chapter
            totalSection = newChapter.total || 0
            if (newChapterSection.line) {
                this.setImgCache(newChapterSection)
                const currentLine = newChapterSection.line[0]
                this.start(currentLine)
            }
            this.setState({
                newChapterIndex: chapterIndex,
                newSectionIndex: sectionIndex,
                totalChapter: total,
                totalSection: totalSection
            })
        }
    }
    setImgCache(currentChapter: Chapter) {
        const { preLoadBackgrounds, preLoadCgs, preLoadCharaters } = currentChapter
        let preloadBGArray: string[] = []
        let preloadCGArray: string[] = []
        let preloadChArray: string[] = []
        for (const key in preLoadBackgrounds) {
            if (preLoadBackgrounds.hasOwnProperty(key)) {
                preloadBGArray.push(preLoadBackgrounds[key])
            }
        }
        for (const key in preLoadCgs) {
            if (preLoadCgs.hasOwnProperty(key)) {
                preloadCGArray.push(preLoadCgs[key])
            }
        }
        for (const key in preLoadCharaters) {
            if (preLoadCharaters.hasOwnProperty(key)) {
                preLoadCharaters[key].map(v => {
                    const str = `${key}/${v}`
                    preloadChArray.push(str)
                })
            }
        }
        const preloadJSX = <div>
            {preloadBGArray.map(imgsrc => <img
                className={styles.cacheImg}
                key={imgsrc}
                src={require(`../../scripts/backgrounds/${imgsrc}`)} />
            )}
            {preloadCGArray.map(imgsrc => <img
                className={styles.cacheImg}
                key={imgsrc}
                src={require(`../../scripts/CGs/${imgsrc}`)} />
            )}
            {preloadChArray.map(imgsrc => <img
                className={styles.cacheImg}
                key={imgsrc}
                src={require(`../../scripts/charatersImages/${imgsrc}`)} />
            )}
        </div>
        this.setState({ preloadJSX })
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
        this.startChapterOrSection(chapters, 1, 1)
    }
    nextChapter() {
        this.clearTimers()
        const { newChapterIndex, newSectionIndex, totalChapter, totalSection } = this.state
        const { data: { chapters } } = this.props
        if (newChapterIndex === totalChapter && newSectionIndex === totalSection) {
            //end
            console.log('完结撒花')
        } else {
            this.setState(iniState)
            if (newSectionIndex < totalSection) {//next section
                this.startChapterOrSection(chapters, newChapterIndex, newSectionIndex + 1)
            } else {//nextChapter
                this.startChapterOrSection(chapters, newChapterIndex + 1)
            }
        }
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
        this.setState({ clickDisable: false })
        const { cacheDisplayLineName, cacheDisplayLineText } = this.state
        if (cacheDisplayLineName && cacheDisplayLineText) {
            this.textAnimation(cacheDisplayLineText, cacheDisplayLineName, true)
        } else {
            this.clickHandle()
        }
    }
    cgAndBackgroundOnload() {
        this.setState({ clickDisable: false }, () => {
            this.clickHandle()
        })
    }
    textAnimation(value: string, name?: string, notAnimate?: boolean) {
        // if (notAnimate) {
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
    onSelect(callBack: Function) {
        const { gameVariables } = this.state
        const newGameVariables = callBack(this.execCommand, gameVariables)
        this.setState({ gameVariables: newGameVariables, choose: [], clickDisable: false }, () => {
            this.clickHandle()
        })
    }
    execCommand(commandString: string) {
        const isCommand = commandString.match(actionReg)
        const {backgrounds,charaters, BGMs, cgs, chooses}=this.props.RawScript
        if (isCommand) {
            const commandJSON=commandProcess(isCommand, backgrounds, charaters, BGMs, cgs, {}, {},{}, chooses)
            this.commandLineProcess(commandJSON)
        } else {
            console.warn(commandString + 'unrecognized')
        }
    }
    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { timers, auto, linePointer, clickDisable, newChapterIndex, newSectionIndex } = this.state
        const { data: { chapters } } = this.props
        if (ev && clickDisable) {
            //不然点你还点，点的太快了
            return 0
        }
        let currentChapter = getValueByObjKeyValue(chapters, 'index', newChapterIndex) as Chapter
        let currentLines: Chapter['line'] = []
        if (currentChapter.line) {
            currentLines = currentChapter.line
        } else {
            currentChapter = getValueByObjKeyValue(currentChapter.sections, 'index', newSectionIndex) as Chapter
            if (currentChapter.line) {
                currentLines = currentChapter.line
            }
        }
        config = config || {}
        if (ev) {//手动点击取消自动播放
            if (auto) this.setState({ auto: false })
            if (timers) this.clearTimers()
        }
        if (currentLines) {
            if (!timers) {//如果一行播放结束
                if (linePointer >= currentLines.length - 1) {//一章或者一节结束
                    return this.nextChapter()
                } else {
                    const nextLine = currentLines[linePointer + 1] as (DisplayLine | CommandLine)
                    this.setState({ linePointer: linePointer + 1 })
                    this.start(nextLine)
                }
            } else {
                this.skipThisLine(currentLines[linePointer])//跳过动画
            }
        } else {
            console.log('我也不知道发生了啥')
        }
    }

    render() {
        const { data: { chapters } } = this.props
        const { auto, background, displayName, displayText, linePointer, displaycharacters, bgm, cg, preloadJSX, newChapterIndex, newSectionIndex, choose } = this.state
        let chapterName = (getValueByObjKeyValue(chapters, 'index', newChapterIndex)).name
        let sectionName = ""
        if (newSectionIndex) {
            sectionName = (getValueByObjKeyValue((getValueByObjKeyValue(chapters, 'index', newChapterIndex)).sections, 'index', newSectionIndex)).name || ""
        }
        const displaycharactersArray = Object.keys(displaycharacters).map(v => { return { name: v, ...displaycharacters[v] } })
        return <React.Fragment>
            <div className={styles.ctrlPanle}>
                <p>第<button >{newChapterIndex}</button>章:{chapterName}</p>
                <p>第<button >{newSectionIndex}</button>节:{sectionName}</p>
                <p>第<button onClick={(ev) => this.clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
                <button onClick={this.nextChapter}>下一章</button>
                <p>在场人物<span></span></p>
                <p>{displaycharactersArray.map(v => v.name)}</p>
                <button onClick={this.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
                <button>save</button>
                <button>load</button>
                <BGMplayer src={bgm} />
            </div>
            <div className={styles.container}
                style={{
                    background: background ?
                        `url(${require(`../../scripts/backgrounds/${background}`)})` : undefined
                }}
                onClick={this.clickHandle}>
                <div className={choose.length && styles.chooseCon}>{choose.map((v, k) => {
                    return <p className={styles.choose} onClick={() => { this.onSelect(v.callback) }} key={k}>{v.text}</p>
                })}</div>
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
            {preloadJSX}
        </React.Fragment>
    }
}
export default MainGame
