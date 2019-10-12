import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Chapter, Line, LINE_TYPE, Game } from '../../utils/types'
import { getDomAttribute } from '../../utils/utils'
import styles from './style.css'
interface IProps {
    data: Game
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
        skipThisLine: (line: Line) => {
            actions.clearTimers()
            setDisplayText(line.value)
        },
        start: (line: Line) => {
            const { value } = line
            let flags = []
            for (let i = 0; i <= value.length; i++) {
                const flag = setTimeout(() => {
                    setDisplayText(value.slice(0, i))
                }, i * TEXT_DISPLAY_SPEEED)
                flags.push(flag)//一个个字符显示
            }
            const lastFlag = setTimeout(() => {
                actions.clearTimers()
                let auto = getDomAttribute("auto", "data-auto", "bool")
                console.log(auto)
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
    ////computedVar
    const currentChapter = chapters[chapterPointer]
    const currentLine = currentChapter[linePointer]

    function clickHandle(ev?: React.MouseEvent, reset?: boolean) {
        if (ev) {//手动点击取消自动播放
            setAuto(false)
            actions.clearTimers()
        }
        let asyncLinePointer = getDomAttribute("linPointer", "data-linepointer", "int")
        //由于在setTimeOut里调用clickHandle导致reactHook托管的数据全部归零，暂时这么修复一下，考虑日后使用async函数
        const mixedLinePointer = asyncLinePointer > linePointer ? asyncLinePointer : linePointer
        const currentChapter = chapters[chapterPointer]
        if (!timers.length) {//如果一行播放结束
            if (mixedLinePointer === currentChapter.length - 1) {//一章结束
                return actions.nextChapter()
            } else {
                console.log(currentChapter[mixedLinePointer + 1])
                setLinePointer(pre => pre + 1)
                actions.start(currentChapter[mixedLinePointer + 1])
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
            <p>第<button data-linepointer={linePointer} id="linPointer" onClick={(ev) => clickHandle(ev, true)}>{linePointer}</button>行</p>
            <button data-auto={auto} id="auto" onClick={actions.toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
        </div>
        <div className={styles.container} onClick={clickHandle}>
            <div className={styles.dialog}>
                <div className={styles.owner}>{currentLine.owner}</div>
                <div className={styles.textarea} >{displayText}</div>
            </div>
        </div>
    </React.Fragment>
}


export default MainGame