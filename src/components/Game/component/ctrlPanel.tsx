import React from 'react'
import styles from '../style.css'
interface IProps {
    clickHandle: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, any: any) => any,
    linePointer: number,
    nextChapter: () => any,
    displaycharactersArray: Array<{ name: string; emotion: string }>,
    toogleAuto: () => any,
    quickSave: () => any,
    quickLoad: () => any,
    openSaveCon: () => any,
    closeSaveCon: () => any,
    auto: boolean
}
export default function CtrlPanel({ clickHandle, linePointer, nextChapter, displaycharactersArray, toogleAuto, quickSave, quickLoad, closeSaveCon, openSaveCon, bgm, auto }: IProps) {
    return <div className={styles.ctrlPanle}>
        <p>第<button onClick={(ev) => clickHandle(ev, { reset: true })}>{linePointer}</button>行</p>
        <button onClick={nextChapter}>下一章</button>
        <p>在场人物<span></span></p>
        <p>{displaycharactersArray.map(v => v.name)}</p>
        <button onClick={toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</button>
        <button onClick={quickSave}>quickSave</button>
        <button onClick={quickLoad}>quickLoad</button>
        <button onClick={openSaveCon}>openSaveCon</button>
        <button onClick={closeSaveCon}>closeSaveCon</button>
        <button onClick={()=>window.history.back()}>back</button>
    </div>
}