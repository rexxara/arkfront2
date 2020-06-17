import React from 'react'
import { LINE_TYPE, DisplayLine, CommandLine, NO_IMG, displayCharacter, DisplayCharacters, Option, CGParama } from '../../utils/types'
import { variableLoader } from '../../utils/utils'
import classnames from 'classnames'
import { IState, IProps, iniState, clickHandleConfig, AudioCaches } from './gameTypes'
import _omit from 'lodash/omit'
import styles from './style.css'
import ARKBGMplayer from './component/BGMplayer'
import { commandProcess, actionReg } from '../../utils/loader/index'
import ARKOption from './Option'
import action, { SaveData } from './actions'
import SaveDataCon from './component/saveDataCon'
import ImgCache from './component/ImgCache'
import CtrlPanel from './component/ctrlPanel'
import { Icon, message } from 'antd'
import GAMEInput from './component/input'
import effects from './effects'
import SoundEffectPlayer from './component/soundEffectPlayer'
import Title from './titles/Title'
import { vw, vh } from '@/utils/getSize'
import { saveDataAdapter } from './utils'
import CgContainer from './component/CgContainer'
import BackgroundCon from './component/BackgroundContainer'
const effectCanvasId = 'effects'
const TEXT_DISPLAY_SPEEED = 50

class MainGame extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { ...iniState, gameVariables: props.RawScript.variables }
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
        this.onInputSubmit = this.onInputSubmit.bind(this)
        this.reviewBack = this.reviewBack.bind(this)
        this.soundCallback = this.soundCallback.bind(this)
        this.TitleCallback = this.TitleCallback.bind(this)
    }
    quickSave() {
        action.save(this.state, 0)
    }
    save(param: number) {
        action.save(this.state, param)
    }
    openSaveCon() {
        this.skipThisLine()
        this.setState({ saveDataConOpen: true })
    }
    closeSaveCon() {
        this.setState({ saveDataConOpen: false })
    }
    async load(ev?: React.MouseEvent, savedata?: SaveData) {
        this.skipThisLine()
        this.commandLineProcess({ command: LINE_TYPE.COMMAND_REMOVE_EFFECT }, true)
        let newData = savedata || await action.load(0)
        if (newData) {
            const data = saveDataAdapter(newData, this.props, this.state)
            if (data) {
                data.effectKey
                if (data.effectKey.length) {
                    this.commandLineProcess({ command: LINE_TYPE.COMMAND_SHOW_EFFECT, param: data.effectKey }, true)
                }
                this.setState(data)
            }
        } else {
            console.log('noQuick load Data')
        }
    }
    componentDidMount() {
        console.log(this.props)
        const { LoadDataFromLoadPage } = this.props
        if (LoadDataFromLoadPage) {
            this.load(undefined, LoadDataFromLoadPage)
        } else {
            const { RawScript: { variables } } = this.props
            this.setState({ gameVariables: variables }, this.startChapter)
        }

    }
    startChapter(chapterKey?: string) {
        const { data: { chapters } } = this.props
        const { currentChapter: { arkMark } } = this.state
        this.clearTimers()
        this.setState({ clickDisable: true })
        let chapter = undefined
        if (!chapterKey) {
            chapter = chapters.find(v => v.isBegin)
            console.info('chapter is undefined ,Auto start game from first chapter')
        } else {
            chapter = chapters.find(v => v.name === chapterKey)
        }
        if (chapter) {
            const { gameVariables } = this.state
            if (arkMark === chapter.arkMark) {
                const { cg, displaycharacters, bgm, auto, background, effectKey } = this.state
                this.setState({
                    ...iniState, gameVariables, cg, displaycharacters, bgm, auto,
                    background, effectKey, linePointer: 0,
                    currentChapter: chapter, clickDisable: false
                })
                console.log('小节切换')
                action.unlockScence(chapter.name)
                const currentLine = chapter.line[0]
                this.start(currentLine)
            } else {
                console.log('章节切换')
                clearTimeout(this.state.titleLagTimer)
                const tName = { chapterName: chapter.arkMark, sectionName: chapter.name }
                this.setState({ TitleChapterName: { chapterName: '', sectionName: '' }, titleLagTimer: undefined }, () => {
                    this.commandLineProcess({ "command": "removeEffect" }, true)
                    this.setState({ TitleChapterName: tName })
                })
            }

        } else {
            return this.reviewBack()
        }
    }
    skipThisLine() {
        const { currentChapter, linePointer } = this.state
        const line = currentChapter.line[linePointer]
        if (line) {//加载存档的时候调用这个函数是没有line的
            this.clearTimers()
            if ('value' in line) {
                const { gameVariables } = this.state
                this.setState({ displayText: variableLoader(line.value, gameVariables) as string })
            }
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
        this.setState(iniState)
        this.clearTimers()
        this.startChapter()
    }
    reviewBack() {
        this.setState({ clickDisable: true })
        if (this.props.isReview) {
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/ScenceReview'
            }, 2000)
            return 0
        } else {
            throw new Error('chapter Next Node Not Found')
        }
    }
    nextChapter() {
        const { currentChapter: { next, isEnd }, gameVariables } = this.state
        if (isEnd) {
            message.success('gameOver')
            return console.warn("gameOver")
        }
        if (!next) {
            return this.reviewBack()
        }
        switch (typeof next) {
            case 'string':
                return this.startChapter(next)
            case "object":
                return this.commandLineProcess({ "command": "showChoose", "param": next })
            case 'function':
                return this.startChapter(next(gameVariables))
            default:
            //理论上不存在
        }
    }
    start(currentLine: (CommandLine | DisplayLine)) {
        if ('command' in currentLine) {
            this.commandLineProcess(currentLine as CommandLine)
        } else {
            this.displayLineProcess(currentLine as DisplayLine)
        }
    }
    commandLineProcess(command: CommandLine, dontSkip?: boolean) {//commandLine dontSkip是因为每一章开始的时候清特效，然后会跳一行导致每章第一行显示不出来
        const { background, displaycharacters, cg, effectref } = this.state
        const ARKBGM = document.getElementById('ARKBGM') as HTMLAudioElement
        let newParam = {}
        let needLoadImg = false
        let needStop = false
        switch (command.command) {
            case LINE_TYPE.COMMAND_SHOW_BACKGROUND:
                needLoadImg = background !== command.param
                if (needLoadImg) {
                    newParam = { background: command.param }
                }
                break
            case LINE_TYPE.COMMAND_LEAVE_CHARATER:
                newParam = { displaycharacters: _omit(displaycharacters, [command.param as string]) }
                break
            case LINE_TYPE.COMMAND_ENTER_CHARATER:
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
            case LINE_TYPE.COMMAND_PLAY_BGM:
                newParam = { bgm: command.param }
                break
            case LINE_TYPE.COMMAND_REMOVE_BACKGROUND:
                newParam = { background: '' }
            case LINE_TYPE.COMMAND_PAUSE_BGM:
                if (ARKBGM) { ARKBGM.pause() } else { throw new Error('bgmNotFound') }
                break
            case LINE_TYPE.COMMAND_RESUME_BGM:
                if (ARKBGM) { ARKBGM.play() } else { throw new Error('bgmNotFound') }
                break
            case LINE_TYPE.COMMAND_SHOW_CG:
                const params = command.param as CGParama
                needLoadImg = cg !== params.src
                if (needLoadImg) {
                    action.unlockCg(params.cgName)
                    newParam = { cg: params.src }
                }
                break
            case LINE_TYPE.COMMAND_REMOVE_CG:
                newParam = { cg: '', displaycharacters: [] }
                break
            case LINE_TYPE.COMMAND_SHOW_CHOOSE:
                needStop = true
                newParam = { choose: command.param, clickDisable: true }
                break
            case LINE_TYPE.COMMAND_SHOW_INPUT:
                needStop = true
                newParam = { input: command.param, clickDisable: true }
                break
            case LINE_TYPE.COMMAND_SHOW_EFFECT:
                console.log(command)
                newParam = { effectKey: command.param, effectref: effects[command.param as string](effectCanvasId) }
                break
            case LINE_TYPE.COMMAND_REMOVE_EFFECT:
                if (effectref) {
                    effectref.stop()
                } else {
                    console.log('effectRefNotfound')
                }
                newParam = { effectKey: '' }
                break
            case LINE_TYPE.COMMAND_SHOW_SOUND_EFFECT:
                newParam = { soundEffect: command.param }
                break
            default:
                //'invalidCommand')
                break
        }
        if (needLoadImg) {
            this.setState({ ...newParam, clickDisable: true })
        } else if (!needStop) {
            this.setState(newParam, () => { if (!dontSkip) { this.clickHandle() } })
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
    onInputSubmit(value: string) {
        const { gameVariables, input } = this.state
        let newGameVariables: any = gameVariables
        if (input.key) {
            newGameVariables[input.key] = input.afterFix(value)
        } else {
            console.warn('input key is invalid')
        }
        this.setState({ gameVariables: newGameVariables, clickDisable: false, input: iniState.input }, () => {
            this.clickHandle()
        })
    }
    execCommand(commandString: string) {
        const isCommand = commandString.match(actionReg)
        const { backgrounds, charaters, BGMs, cgs, chooses, inputs, soundEffects } = this.props.RawScript
        if (isCommand) {
            const commandJSON = commandProcess(isCommand, backgrounds, charaters, BGMs, cgs, {}, {}, {}, {}, {}, chooses, inputs, soundEffects)
            this.commandLineProcess(commandJSON)
        } else {
            console.warn(commandString + 'unrecognized')
        }
    }
    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { skipResourseCount, timers, auto, linePointer, clickDisable, currentChapter } = this.state
        config = config || {}
        if (skipResourseCount) {//这块和imgOnLoad的逻辑有重复，不过没bug就先不改了,没个j8,到处都是bug
            //好像没bug..
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
                this.skipThisLine()//跳过动画
            }
        } else {
            console.warn('noChapter')
        }
    }
    soundCallback() {
        this.setState({ soundEffect: '' })
    }
    TitleCallback({ ses, bgms }: AudioCaches) {
        const { TitleChapterName, gameVariables } = this.state
        const { data: { chapters } } = this.props
        const chapter = chapters.find(v => v.name === TitleChapterName.sectionName)
        if (chapter) {
            this.setState({
                ...iniState, gameVariables,
                audioCaches: { ses, bgms },
                currentChapter: chapter, clickDisable: false,
                TitleChapterName: { ...TitleChapterName, out: true }//保留这个name维持title显示
            })
            const titleLagTimer = setTimeout(() => {
                this.setState({ TitleChapterName: { sectionName: "", chapterName: "" } })
                action.unlockScence(chapter.name)
                const currentLine = chapter.line[0]
                this.start(currentLine)
            }, 2000)
            this.setState({ titleLagTimer })
        } else {
            //throw new Error('chapterNotFound')//游戏结束时和其他蜜汁情况会触发到这块的逻辑
            console.log('游戏结束时和其他蜜汁情况会触发到这块的逻辑,把缓存从小节改成章节吧')
        }
    }
    render() {
        const { auto, background, displayName, displayText, linePointer, displaycharacters, bgm, cg, choose,
            gameVariables, saveDataConOpen, currentChapter, rawLine, input, soundEffect, TitleChapterName, audioCaches } = this.state
        const { data: { caches } } = this.props
        const displaycharactersArray = Object.keys(displaycharacters).map(v => displaycharacters[v])
        return <div style={{ width: vw(100), height: vh(100), overflow: 'hidden' }}>
            <CtrlPanel clickHandle={(ev) => this.clickHandle(ev, { reset: true })}
                linePointer={linePointer}
                auto={auto}
                saveDataConOpen={saveDataConOpen}
                closeSaveCon={this.closeSaveCon}
                openSaveCon={this.openSaveCon}
                quickSave={this.quickSave}
                quickLoad={this.load}
                displaycharactersArray={displaycharactersArray}
                nextChapter={this.nextChapter}
                toogleAuto={this.toogleAuto}
            />
            {TitleChapterName.chapterName && <Title chapterName={TitleChapterName.chapterName} out={TitleChapterName.out} ></Title>}
            <ARKBGMplayer cache={audioCaches.bgms} src={bgm} />
            <SoundEffectPlayer cache={audioCaches.ses} src={soundEffect} callback={this.soundCallback} />
            {input.key && <GAMEInput placeholder={displayText} clickCallback={this.onInputSubmit} />}
            {saveDataConOpen && <SaveDataCon saveData={this.save} loadData={this.load} />}
            <div className={styles.container} style={{ width: vw(100), height: vh(100) }}
                onClick={this.clickHandle}>
                <div style={{ position: "absolute", height: vh(67) }} className={choose.length && styles.chooseCon}>
                    {choose.map((v, k) => <ARKOption gameVariables={gameVariables} key={k} onClick={this.onSelect} v={v} choose={choose} />)}
                </div>
                <div className={styles.displayCharactersCon}>
                    {displaycharactersArray.map(v => v.emotion ? <img
                        onLoad={this.imgOnload}
                        className={displayName === v.name ? classnames(styles.displayCharacter, styles.active) : styles.displayCharacter}
                        key={v.name}
                        src={require(`../../scripts/charatersImages/${v.name}/${v.emotion}`)} /> : <p key={v.name} />)}
                </div>
                <CgContainer cg={cg} />
                <div className={styles.effects} id={effectCanvasId}></div>
                <div className={styles.dialog}>
                    <div className={styles.owner} style={{ height: vh(8), lineHeight: vh(8), paddingLeft: vw(5), fontSize: vh(6) }}>{displayName}</div>
                    <div className={styles.textarea}
                        style={{
                            padding: vw(2), minHeight: vh(25), lineHeight: vh(6), fontSize: vh(4),
                        }}>
                        {displayText}{rawLine === displayText && rawLine.length > 0 && <Icon type="step-forward" />}</div>
                </div>
                <BackgroundCon background={background} />
            </div>
            {background && <img className={styles.hide} onLoad={this.cgAndBackgroundOnload} src={require(`../../scripts/backgrounds/${background}`)} alt="" />}
            {cg && <img className={styles.hide} onLoad={this.cgAndBackgroundOnload} src={require(`../../scripts/CGs/${cg}`)} alt="" />}
            {(currentChapter.arkMark || TitleChapterName.chapterName) &&
                <ImgCache caches={caches[(TitleChapterName.chapterName || currentChapter.arkMark)]} callback={this.TitleCallback} />}
        </div>
    }
}
export default MainGame
