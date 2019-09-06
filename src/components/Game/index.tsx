import React, { useState, useEffect } from 'react';
import { Chapter, Line, LINE_TYPE, Game } from '../../utils/types'
import styles from './style.css'
interface IProps {
    data: Game,
}
const MainGame = (props: IProps) => {
    function clickHandle(ev: React.MouseEvent, reset?: boolean) {
        // if (loading) {
        //     return 0
        // } else {
        //     setLoading(true)
        //     setSkip(false)
        // }
        start()
        const currentChapter = chapters[chapterPointer]
        if (reset) {
            setLinePointer(0)
        }
        console.log(linePointer, currentChapter.length)
        if (linePointer === currentChapter.length - 1) {
            nextChapter()
        } else {
            console.log(currentChapter[linePointer + 1])
            setLinePointer(pre => pre + 1)
        }
    }
    const nextChapter = () => {
        if (chapterPointer === chapters.length - 1) {
            console.log('end')
        } else {
            console.log('nextChapter')
            setLinePointer(0)
            setChapterPointer(pre => pre + 1)
        }
    }
    const { data } = props
    const { chapters } = data
    // const [loading, setLoading] = useState(false)
    // const [skip, setSkip] = useState(false)
    const [linePointer, setLinePointer] = useState(0)
    const [chapterPointer, setChapterPointer] = useState(0)
    const currentChapter = chapters[chapterPointer]
    const currentLine = currentChapter[linePointer]

    ///////////////
    //textarea
    //////////////
    const [displayText, setDisplayText] = useState("")
    const [timer, setTimer] = useState()
    const start = () => {
            // setDisplayText("")
            // const label = setTimeout(() => {
            //     nextLine(0)
            // }, 50 )
            // setTimer(label)
    }
    // const nextLine = (i: number) => {
    //     const { value } = currentLine
    //     setDisplayText(value.slice(0, i))
    //     setTimeout(() => {
    //         if (value.length <= i) {
    //             console.log('end')
    //             setTimer(null)
    //         } else {
    //             nextLine(i + 1)
    //         }
    //     }, 50);
    // }
    useEffect(start,[])
    return <div className={styles.container} onClick={clickHandle}>
        <button onClick={(ev) => clickHandle(ev, true)}>{linePointer}</button>
        <div className={styles.dialog}>
            <div className={styles.owner}>{currentLine.owner}</div>
            <div className={styles.textarea} >{displayText||currentLine.value}</div>
        </div>
    </div>
}


export default MainGame