import React from 'react'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game, NO_IMG } from '../../utils/types'
import classnames from 'classnames'
import styles from './style.css'
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
    timers: any[]
    linePointer: number
    displaycharacters: displayCharacter[]
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}
interface displayCharacter {
    name: string
    emotion: string
}
const TEXT_DISPLAY_SPEEED = 100

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
            timers: [],
            linePointer: 0,
            displaycharacters: []
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
        if (line.value) {
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
        for (let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i])
        }
        this.setState({ timers: [] })
    }
    toogleAuto() {
        const { auto, timers } = this.state
        this.setState({ auto: !auto })
        if (!auto && timers.length === 0) {//要自动播放但是现在没在滚动
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
        if (currentLine.command) {
            this.commandLineProcess(currentLine as CommandLine)
        } else {
            this.displayLineProcess(currentLine as DisplayLine)
        }
    }
    commandLineProcess(command: CommandLine) {
        let newParam = {}
        switch (command.command) {
            case LINE_TYPE.command_SHOW_BACKGROUND:
                newParam = { background: command.param }
                break;
            case LINE_TYPE.command_LEAVE_CHARATER:
                const { displaycharacters } = this.state
                const res = displaycharacters.filter(v => v.name !== command.param)
                newParam = { displaycharacters: res }
                break;
            default:
                console.warn('invalidCommand')
                break;
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
        let flags = []
        if (!value) {
            return undefined
        }
        if (name) {
            setTimeout(() => {
                this.setState({ displayName: name })
            }, TEXT_DISPLAY_SPEEED)
        }
        for (let i = 0; i <= value.length; i++) {
            const flag = setTimeout(() => {
                this.setState({ displayText: value.slice(0, i) })
            }, i * TEXT_DISPLAY_SPEEED)
            flags.push(flag)//一个个字符显示
        }
        const lastFlag = setTimeout(() => {
            this.clearTimers()
            let { auto } = this.state
            if (auto) {
                this.clickHandle()
            }
        }, TEXT_DISPLAY_SPEEED * value.length)
        flags.push(lastFlag)
        this.setState({ timers: flags })
    }

    clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        const { chapterPointer, timers, auto, linePointer } = this.state
        const { data: { chapters } } = this.props
        config = config || {}
        if (ev) {//手动点击取消自动播放
            if (auto) this.setState({ auto: false })
            if (timers.length) this.clearTimers()
        }
        const currentChapter = chapters[chapterPointer] as Chapter
        if (!timers.length) {//如果一行播放结束
            if (linePointer >= currentChapter.length - 1) {//一章结束
                return this.nextChapter()
            } else {
                const nextLine = currentChapter[linePointer + 1] as (DisplayLine | CommandLine)
                this.setState({ linePointer: linePointer + 1 })
                this.start(nextLine)
            }
        } else {
            this.skipThisLine(currentChapter[linePointer])
        }
    }
    render() {
        const { data: { chapters } } = this.props
        const { chapterPointer, auto, background, displayName, displayText, linePointer, displaycharacters } = this.state
        return <React.Fragment>
            <div className={styles.ctrlPanle}>
                <p>第<button data-chapterpointer={chapterPointer} id="chapterPointer">{chapterPointer}</button>章</p>
                <p>在场人物<span data-displaycharacters='' id="displaycharacters"></span></p>
                <p>{displaycharacters.map(v => v.name)}</p>
                <p>第<button data-linepointer='0' id="linPointer" onClick={(ev) => this.clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
                <button data-auto={auto} id="auto" onClick={this.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
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

