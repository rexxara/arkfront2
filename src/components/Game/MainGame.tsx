import React from 'react'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game, NO_IMG, displayCharacter, selectedBGM } from '../../utils/types'
import classnames from 'classnames'
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
    displaycharacters: displayCharacter[]
    rawLine: string
    stop: boolean
    bgm: selectedBGM
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}

const TEXT_DISPLAY_SPEEED = 50

class MainGame extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            auto: false,
            chapterPointer: 0,
            displayText: '',
            displayName: '',
            cacheDisplayLineText: '',
            cacheDisplayLineName: '',
            background: '',
            timers: undefined,
            linePointer: 0,
            displaycharacters: [],
            rawLine: '',
            stop: false,
            bgm: { name: '', src: '' }
        }
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
    }

    componentDidMount() {
        window.reset = this.reset
        const { data: { chapters } } = this.props
        const currentChapter = chapters[0]
        const currentLine = currentChapter[0]
        this.start(currentLine)
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
            const nextEmo = emotion === NO_IMG ? null : emotion
            needLoadNewEmotion = nextEmo ? true : false
            let nextDisplay = displaycharacters.map(v => {
                if (v.name === name) { needLoadNewCharater = false }
                if (v.name === name && v.emotion === nextEmo) { needLoadNewEmotion = false }
                return v.name !== name ? v : { name, emotion: nextEmo } as displayCharacter
            })
            if (needLoadNewCharater) {
                nextDisplay = [...displaycharacters, { name, emotion: nextEmo } as displayCharacter]
            }
            this.setState({ displaycharacters: nextDisplay })
        }
        if (needLoadNewEmotion) {
            this.setState({ cacheDisplayLineText: value, cacheDisplayLineName: name || '' })
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
        const currentLine = currentChapter[0]
        this.start(currentLine)
    }
    nextChapter() {
        const { chapterPointer } = this.state
        const { data: { chapters } } = this.props
        if (chapterPointer === chapters.length - 1) {
            //end
        } else {
            //nextChapter
            this.setState({ chapterPointer: chapterPointer + 1, linePointer: 0 })
            const currentLine = chapters[chapterPointer + 1][0]
            this.start(currentLine)
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
        const ARKBGM = document.getElementById('ARKBGM') as HTMLAudioElement
        let newParam = {}
        const { displaycharacters } = this.state
        switch (command.command) {
            case LINE_TYPE.command_SHOW_BACKGROUND:
                newParam = { background: command.param }
                break
            case LINE_TYPE.command_LEAVE_CHARATER:
                newParam = { displaycharacters: displaycharacters.filter(v => v.name !== command.param) }
                break
            case LINE_TYPE.command_ENTER_CHARATER:
                newParam = { displaycharacters: [...displaycharacters, command.param] }
                break
            case LINE_TYPE.command_PLAY_BGM:
                newParam = { bgm: command.param }
                break
            case LINE_TYPE.command_PAUSE_BGM:
                if (ARKBGM) {
                    ARKBGM.pause()
                } else {
                    throw new Error('bgmNotFound')
                }
                break
            case LINE_TYPE.command_RESUME_BGM:
                if (ARKBGM) {
                    ARKBGM.play()
                } else {
                    throw new Error('bgmNotFound')
                }
                break
            default:
                console.warn('invalidCommand')
                break
        }

        this.setState(newParam, () => { this.clickHandle() })
    }
    imgOnload() {
        const { cacheDisplayLineName, cacheDisplayLineText } = this.state
        this.textAnimation(cacheDisplayLineText, cacheDisplayLineName, true)
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
                console.log('stop or end')
            }
        }, TEXT_DISPLAY_SPEEED)
        this.setState({ timers: flag })
    }
    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { chapterPointer, timers, auto, linePointer } = this.state
        const { data: { chapters } } = this.props
        config = config || {}
        if (ev) {//手动点击取消自动播放
            if (auto) this.setState({ auto: false })
            if (timers) this.clearTimers()
        }
        const currentChapter = chapters[chapterPointer] as Chapter
        if (!timers) {//如果一行播放结束
            if (linePointer >= currentChapter.length - 1) {//一章结束
                return this.nextChapter()
            } else {
                const nextLine = currentChapter[linePointer + 1] as (DisplayLine | CommandLine)
                console.log(nextLine)
                this.setState({ linePointer: linePointer + 1 })
                this.start(nextLine)
            }
        } else {
            this.skipThisLine(currentChapter[linePointer])
        }
    }

    render() {
        const { data: { chapters } } = this.props
        const { chapterPointer, auto, background, displayName, displayText, linePointer, displaycharacters, bgm } = this.state
        return <React.Fragment>
            <div className={styles.ctrlPanle}>
                <p>第<button data-chapterpointer={chapterPointer} id="chapterPointer">{chapterPointer}</button>章</p>
                <p>在场人物<span data-displaycharacters='' id="displaycharacters"></span></p>
                <p>{displaycharacters.map(v => v.name)}</p>
                <p>第<button data-linepointer='0' id="linPointer" onClick={(ev) => this.clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
                <button data-auto={auto} id="auto" onClick={this.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
                <BGMplayer src={bgm} />
            </div>
            <div className={styles.container}
                style={{
                    background: background ?
                        `url(${require(`../../scripts/backgrounds/${background}`)})` : undefined
                }}
                onClick={this.clickHandle}>
                <div className={styles.displayCharactersCon}>
                    {displaycharacters && displaycharacters.map(v => v.emotion ? <img
                        onLoad={this.imgOnload}
                        className={displayName === v.name ? classnames(styles.displayCharacter, styles.active) : styles.displayCharacter}
                        key={v.name}
                        src={require(`../../scripts/charatersImages/${v.name}/${v.emotion}`)} /> : <p key={v.name} />)}
                </div>

                <div className={styles.dialog}>
                    <div className={styles.owner}>{displayName}</div>
                    <div className={styles.textarea} >{displayText}</div>
                </div>
            </div>
        </React.Fragment>
    }
}
export default MainGame

