import React, { useState, useEffect } from 'react';
import { Chapter, Line, LINE_TYPE, Game } from '../../utils/types'
import { getDomAttribute } from '../../utils/utils'
import actions from './action'
import styles from './style.css'
interface IProps {
    data: Game,
}
const TEXT_DISPLAY_SPEEED = 100
const MainGame = (props: IProps) => {
    function clickHandle(ev?: React.MouseEvent, reset?: boolean) {
        if (ev) {//手动点击取消自动播放
            setAuto(false)
            clearTimers()
        }
        let asyncLinePointer = getDomAttribute("linPointer", "data-linepointer", "int")
        //由于在setTimeOut里调用clickHandle导致reactHook托管的数据全部归零，暂时这么修复一下，考虑日后使用async函数
        const mixedLinePointer = asyncLinePointer > linePointer ? asyncLinePointer : linePointer
        const currentChapter = chapters[chapterPointer]
        if (!timers.length) {//如果一行播放结束
            if (mixedLinePointer === currentChapter.length - 1) {//一章结束
                return nextChapter()
            } else {
                console.log(currentChapter[mixedLinePointer + 1])
                setLinePointer(pre => pre + 1)
                start(currentChapter[mixedLinePointer + 1])
            }
        } else {
            actions.skipThisLine()
            skipThisLine(currentChapter[mixedLinePointer])
        }
    }
    const nextChapter = () => {
        if (chapterPointer === chapters.length - 1) {
            console.log('end')
        } else {
            console.log('nextChapter')
            setLinePointer(0)
            setChapterPointer(pre => pre + 1)
            start(chapters[chapterPointer + 1][0])
        }
    }
    const { data } = props
    const { chapters } = data
    const [auto, setAuto] = useState(false)
    const [linePointer, setLinePointer] = useState(0)
    const [chapterPointer, setChapterPointer] = useState(0)
    const currentChapter = chapters[chapterPointer]
    const currentLine = currentChapter[linePointer]

    ///////////////
    //textarea
    //////////////
    const [displayText, setDisplayText] = useState("")
    const [timers, setTimer] = useState([])

    const skipThisLine = (line: Line) => {
        clearTimers()
        setDisplayText(line.value)
    }
    const start = (line: Line) => {
        const { value } = line
        let flags = []
        for (let i = 0; i < value.length; i++) {
            const flag = setTimeout(() => {
                setDisplayText(value.slice(0, i))
            }, i * TEXT_DISPLAY_SPEEED)
            flags.push(flag)//一个个字符显示
        }
        const lastFlag = setTimeout(() => {
            clearTimers()
            let auto = getDomAttribute("auto", "data-auto", "bool")
            console.log(auto)
            if (auto) {
                clickHandle()
            }
        }, TEXT_DISPLAY_SPEEED * value.length)
        flags.push(lastFlag)
        setTimer(flags as any)
    }
    const clearTimers = () => {
        for (let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i])
        }
        setTimer([])
    }
    const toogleAuto = () => {
        setAuto(pre => !pre)
        if (!auto && timers.length === 0) {//要自动播放但是现在没在滚动
            clickHandle()
        }
    }
    useEffect(() => start(currentLine), [])
    return <React.Fragment>
        <button data-linepointer={linePointer} id="linPointer" onClick={(ev) => clickHandle(ev, true)}>{linePointer}</button>
        <button data-chapterpointer={chapterPointer} id="linPointer">{chapterPointer}</button>
        <button data-auto={auto} id="auto" onClick={toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
        <div className={styles.container} onClick={clickHandle}>
            <div className={styles.dialog}>
                <div className={styles.owner}>{currentLine.owner}</div>
                <div className={styles.textarea} >{displayText}</div>
            </div>
        </div>
    </React.Fragment>
}


export default MainGame