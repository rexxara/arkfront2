import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Chapter, LINE_TYPE, DisplayLine, CommandLine, Game } from '../../utils/types'
import { getDomAttribute } from '../../utils/utils'
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
    const { data } = props
    const { chapters } = data
    ///////////////////variables
    const [auto, setAuto] = useState(false)
    const [linePointer, setLinePointer] = useState(0)
    const [chapterPointer, setChapterPointer] = useState(0)
    //textarea
    const [displayText, setDisplayText] = useState("")
    const [timers, setTimer] = useState([])
    const [background, setBackground] = useState('')
    ///////////////////////////////actions

    const actions = {
        nextChapter: () => {
            if (chapterPointer === chapters.length - 1) {
                //end
            } else {
                //nextChapter
                setLinePointer(0)
                setChapterPointer(pre => pre + 1)
                actions.start(chapters[chapterPointer + 1][0])
            }
        },
        skipThisLine: (line: DisplayLine) => {
            actions.clearTimers()
            setDisplayText(line.value)
        },
        start: (line: DisplayLine) => {
            const { value } = line
            let flags = []
            if (!value) {
                return undefined
            }
            for (let i = 0; i <= value.length; i++) {
                const flag = setTimeout(() => {
                    setDisplayText(value.slice(0, i))
                }, i * TEXT_DISPLAY_SPEEED)
                flags.push(flag)//一个个字符显示
            }
            const lastFlag = setTimeout(() => {
                actions.clearTimers()
                let auto = getDomAttribute("auto", "data-auto", "bool")
                if (auto) {
                    clickHandle()
                }
            }, TEXT_DISPLAY_SPEEED * value.length)
            flags.push(lastFlag)
            setTimer(flags as any)
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
            setLinePointer(0)
            setChapterPointer(0)
            setDisplayText('')
            actions.clearTimers()
            setTimer([])
            const currentChapter = chapters[0]
            const currentLine = currentChapter[0]
            actions.start(currentLine)
        }
    }
    function commandLineProcess(command: CommandLine) {
        switch (command.command) {
            case LINE_TYPE.command_SHOW_BACKGROUND:
                setBackground(command.param)
                break;
        
            default:
                console.warn('invalidCommand')
                break;
        }
    }
    ////computedVar
    const currentChapter = chapters[chapterPointer] as Chapter
    const currentLine = currentChapter[linePointer] as DisplayLine
    function clickHandle(ev?: React.MouseEvent, config?: clickHandleConfig) {
        config = config || {}
        if (ev) {//手动点击取消自动播放
            setAuto(false)
            actions.clearTimers()
        }
        let asyncLinePointer = getDomAttribute("linPointer", "data-linepointer", "int")
        //由于在setTimeOut里调用clickHandle导致reactHook托管的数据全部归零，暂时这么修复一下，考虑日后使用async函数
        let mixedLinePointer = asyncLinePointer > linePointer ? asyncLinePointer : linePointer
        if (config.plusOne) {
            mixedLinePointer += 1
        }
        const currentChapter = chapters[chapterPointer] as Chapter
        if (!timers.length) {//如果一行播放结束
            if (mixedLinePointer === currentChapter.length - 1) {//一章结束
                return actions.nextChapter()
            } else {
                const nextLine = currentChapter[mixedLinePointer + 1] as (DisplayLine|CommandLine)
                console.log(nextLine)
                setLinePointer(pre => pre + 1)
                if (nextLine.command) {
                    commandLineProcess(nextLine as CommandLine)
                    clickHandle(undefined, { plusOne: true })
                } else {
                    actions.start(nextLine as DisplayLine)
                }
            }
        } else {
            actions.skipThisLine(currentChapter[mixedLinePointer])
        }
    }

    useEffect(() => actions.start(currentLine), [])//autoStartFirstLine
    window.reset = actions.reset

    return <React.Fragment>
        <div className={styles.ctrlPanle}>
            <p>第<button data-chapterpointer={chapterPointer} id="linPointer">{chapterPointer}</button>章</p>
            <p>第<button data-linepointer={linePointer} id="linPointer" onClick={(ev) => clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
            <button data-auto={auto} id="auto" onClick={actions.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
        </div>
        <div className={styles.container}
            style={{
                background: background ?
                    `url(${require(`../../scripts/backgrounds/${background}`)})` : null
            }}
            onClick={clickHandle}>
            {(currentLine.name && currentLine.emotion) &&
                <img style={{ width: '100px' }} src={require(`../../scripts/charatersImages/${currentLine.name}/${currentLine.emotion}`)} />}
            <div className={styles.dialog}>
                <div className={styles.owner}>{currentLine.name}</div>
                <div className={styles.textarea} >{displayText}</div>
            </div>
        </div>
    </React.Fragment>
}


export default MainGame