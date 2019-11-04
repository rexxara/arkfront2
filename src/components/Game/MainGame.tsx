import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game, NO_IMG } from '../../utils/types'
import { get, set } from '../../utils/utils'
import classnames from 'classnames'
import styles from './style.css'
interface IProps {
    data: Game
}
interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}
const TEXT_DISPLAY_SPEEED = 100
const MainGame = (props: IProps) => {
    ////////////////props
    const { data: { chapters } } = props
    ///////////////////variables
    const [auto, setAuto] = useState(false)
    const [chapterPointer, setChapterPointer] = useState(0)
    //textarea
    const [displayText, setDisplayText] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [timers, setTimer] = useState([])///控制文字显示
    const [background, setBackground] = useState('')//背景图
    const [cacheDisplayLineText, setCacheDisplayLineText] = useState('')//加载图片之后调用handle
    const [cacheDisplayLineName, setCacheDisplayLineName] = useState('')//加载图片之后调用handle

    ///////////////////////////////actions

    const actions = {
        nextChapter: () => {
            if (chapterPointer === chapters.length - 1) {
                //end
            } else {
                //nextChapter
                set('linPointer', 'data-linepointer', '0')
                setChapterPointer(pre => pre + 1)
                const currentLine = chapters[chapterPointer + 1][0]
                if (currentLine.command) {
                    commandLineProcess(currentLine as CommandLine)
                } else {
                    actions.start(currentLine as DisplayLine)
                }
            }
        },
        skipThisLine: (line: (DisplayLine | CommandLine)) => {
            actions.clearTimers()
            if (line.value) {
                setDisplayText(line.value)
            }
        },
        start: (line: DisplayLine) => {
            const mixCharacters = get('displaycharacters', 'data-displaycharacters', 'displayCharacters')
            const { value, name, emotion } = line
            let needLoadNewCharater = false
            let needLoadNewEmotion = false
            if (name && emotion) {
                needLoadNewCharater = true
                const nextEmo = emotion === NO_IMG ? null : emotion
                needLoadNewEmotion = nextEmo ? true : false
                let nextDisplay = mixCharacters.map(v => {
                    if (v.name === name) { needLoadNewCharater = false }
                    if (v.name === name && v.emotion === nextEmo) { needLoadNewEmotion = false }
                    return v.name !== name ? v : { name, emotion: nextEmo }
                })
                if (needLoadNewCharater) {
                    nextDisplay = [...mixCharacters, { name, emotion: nextEmo }]
                }
                set('displaycharacters', 'data-displaycharacters', nextDisplay, 'displayCharacters')
            }
            if (needLoadNewEmotion) {
                setCacheDisplayLineText(value)
                setCacheDisplayLineName(name || '')
            } else {
                //console.log('driect')
                if (name !== displayName) { setDisplayName('') }
                textAnimation(value, name, true)
            }
        },
        clearTimers: () => {
            for (let i = 0; i < timers.length; i++) {
                clearTimeout(timers[i])
            }
            setTimer([])
        },
        toogleAuto: () => {
            setAuto(pre => !pre)
            if (!auto && timers.length === 0) {//要自动播放但是现在没在滚动
                clickHandle()
            }
        },
        reset: () => {
            setAuto(false)
            set('linPointer', 'data-linepointer', '0')
            setChapterPointer(0)
            setDisplayText('')
            actions.clearTimers()
            setTimer([])
            const currentChapter = chapters[0]
            const currentLine = currentChapter[0]
            if (currentLine.command) {
                commandLineProcess(currentLine as CommandLine)
            } else {
                actions.start(currentLine as DisplayLine)
            }
        }
    }
    function commandLineProcess(command: CommandLine) {
        switch (command.command) {
            case LINE_TYPE.command_SHOW_BACKGROUND:
                setBackground(command.param)
                break;
            case LINE_TYPE.command_LEAVE_CHARATER:
                const asyncCharacters = get('displaycharacters', 'data-displaycharacters', 'displayCharacters')
                const res = asyncCharacters.filter(v => v.name !== command.param)
                set('displaycharacters', 'data-displaycharacters', res, 'displayCharacters')
                break;
            default:
                console.warn('invalidCommand')
                break;
        }
        clickHandle()
    }
    function imgOnload(ev) {
        //console.log('callFromImg')
        textAnimation(cacheDisplayLineText, cacheDisplayLineName, true)
    }
    function textAnimation(value: string, name?: string, notAnimate?: boolean) {
        // if (notAnimate) {
        //     if (name) {
        //         setDisplayName(name)
        //     }
        //     setDisplayText(value)
        //     return 0
        // }
        let flags = []
        if (!value) {
            return undefined
        }
        if (name) {
            setTimeout(() => {
                setDisplayName(name)
            }, TEXT_DISPLAY_SPEEED)
        }
        for (let i = 0; i <= value.length; i++) {
            const flag = setTimeout(() => {
                setDisplayText(value.slice(0, i))
            }, i * TEXT_DISPLAY_SPEEED)
            flags.push(flag)//一个个字符显示
        }
        const lastFlag = setTimeout(() => {
            actions.clearTimers()
            let auto = get("auto", "data-auto", "bool")
            if (auto) {
                clickHandle()
            }
        }, TEXT_DISPLAY_SPEEED * value.length)
        flags.push(lastFlag)
        setTimer(flags as any)
    }
    function clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        config = config || {}
        if (ev) {//手动点击取消自动播放
            setAuto(false)
            actions.clearTimers()
        }
        let asyncLinePointer = get("linPointer", "data-linepointer", "int")
        const currentChapter = chapters[chapterPointer] as Chapter
        if (!timers.length) {//如果一行播放结束
            console.log(asyncLinePointer + 1, currentChapter.length)
            if (asyncLinePointer >= currentChapter.length - 1) {//一章结束
                return actions.nextChapter()
            } else {
                const nextLine = currentChapter[asyncLinePointer + 1] as (DisplayLine | CommandLine)
                set('linPointer', 'data-linepointer', asyncLinePointer + 1)
                if (nextLine.command) {
                    commandLineProcess(nextLine as CommandLine)
                } else {
                    actions.start(nextLine as DisplayLine)
                }
            }
        } else {
            actions.skipThisLine(currentChapter[asyncLinePointer])
        }
    }

    useEffect(() => {
        const currentChapter = chapters[chapterPointer] as Chapter
        const currentLine = currentChapter[get('linPointer', 'data-linepointer', 'int')]
        if (currentLine.command) {
            commandLineProcess(currentLine as CommandLine)
        } else {
            actions.start(currentLine)
        }
    }, [])//autoStartFirstLine

    window.reset = actions.reset
    
    const linePointer = get('linPointer', 'data-linepointer', 'int')
    const asyncCharacters = get('displaycharacters', 'data-displaycharacters', 'displayCharacters')
    return <React.Fragment>
        <div className={styles.ctrlPanle}>
            <p>第<button data-chapterpointer={chapterPointer} id="chapterPointer">{chapterPointer}</button>章</p>
            <p>在场人物<span data-displaycharacters='' id="displaycharacters"></span></p>
            <p>{asyncCharacters.map(v => v.name)}</p>
            <p>第<button data-linepointer='0' id="linPointer" onClick={(ev) => clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
            <button data-auto={auto} id="auto" onClick={actions.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
        </div>
        <div className={styles.container}
            style={{
                background: background ?
                    `url(${require(`../../scripts/backgrounds/${background}`)})` : null
            }}
            onClick={clickHandle}>
            <div className={styles.displayCharactersCon}>
                {asyncCharacters&&asyncCharacters.map(v => v.emotion ? <img
                    onLoad={imgOnload}
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


export default MainGame

