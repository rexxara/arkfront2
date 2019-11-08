import React from 'react'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game, NO_IMG, displayCharacter, DisplayCharacters, selectedBGM } from '../../utils/types'
import classnames from 'classnames'
import _omit from 'lodash/omit'
import styles from './style.css'
import BGMplayer from './BGMplayer'
interface IProps {
    data: Game
}
interface IState {
    chapterPointer: number
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
    preloadJSX: any,
    clickDisable: boolean
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}

const TEXT_DISPLAY_SPEEED = 50
const iniState = {
    auto: false,
    chapterPointer: 0,
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
    clickDisable: false
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

    }

    componentDidMount() {
        window.reset = this.reset
        const { data: { chapters } } = this.props
        const currentChapter = chapters[0]
        this.setImgCache(currentChapter)
        const currentLine = currentChapter.line[0]
        this.start(currentLine)
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
                const element = preLoadCharaters[key]
                element.map(v => {
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
            this.setState({ displayText: line.value as string })
        }
    }
    displayLineProcess(line: DisplayLine) {
        const { displayName, displaycharacters } = this.state
        const { value, name, emotion } = line
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
        this.setState({
            auto: false,
            chapterPointer: 0,
            displayText: '',
            displayName: '',
            linePointer: 0
        })
        this.clearTimers()
        const currentChapter = chapters[0]
        const currentLine = currentChapter.line[0]
        this.start(currentLine)
    }
    nextChapter() {
        const { chapterPointer } = this.state
        const { data: { chapters } } = this.props
        if (chapterPointer === chapters.length - 1) {
            //end
        } else {
            //nextChapter
            this.setState({ ...iniState, chapterPointer: chapterPointer + 1 })
            const currentLine = chapters[chapterPointer + 1].line[0]
            this.start(currentLine)
            this.setImgCache(chapters[chapterPointer + 1])
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
                } else {
                    needLoadImg = true//没人
                }
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
            default:
                //'invalidCommand')
                break
        }
        if (needLoadImg) {
            this.setState({ ...newParam, clickDisable: true })
        } else {
            this.setState(newParam, () => { this.clickHandle() })
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
        if (value.length > 0) {
            this.textAnimationInner(1)
        }
        this.setState({
            displayName: name || '',
            rawLine: value
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
    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { chapterPointer, timers, auto, linePointer, clickDisable } = this.state
        const { data: { chapters } } = this.props
        if (ev && clickDisable) {
            console.log('你也点的太快了')
            return 0
        }

        config = config || {}
        if (ev) {//手动点击取消自动播放
            if (auto) this.setState({ auto: false })
            if (timers) this.clearTimers()
        }
        const currentChapter = chapters[chapterPointer] as Chapter
        if (!timers) {//如果一行播放结束
            if (linePointer >= currentChapter.line.length - 1) {//一章结束
                return this.nextChapter()
            } else {
                const nextLine = currentChapter.line[linePointer + 1] as (DisplayLine | CommandLine)
                this.setState({ linePointer: linePointer + 1 })
                this.start(nextLine)
            }
        } else {
            this.skipThisLine(currentChapter.line[linePointer])
        }
    }

    render() {
        const { data: { chapters } } = this.props
        const { chapterPointer, auto, background, displayName, displayText, linePointer, displaycharacters, bgm, cg, preloadJSX } = this.state
        const displaycharactersArray = Object.keys(displaycharacters).map(v => {
            return {
                name: v,
                ...displaycharacters[v]
            }
        })
        return <React.Fragment>
            <div className={styles.ctrlPanle}>
                <p>第<button >{chapterPointer}</button>章</p>
                <p>在场人物<span></span></p>
                <p>{displaycharactersArray.map(v => v.name)}</p>
                <p>第<button onClick={(ev) => this.clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
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
                <div className={styles.displayCharactersCon}>
                    {displaycharactersArray.length && displaycharactersArray.map(v => v.emotion ? <img
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

