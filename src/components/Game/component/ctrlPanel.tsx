import React, { useState } from 'react'
import styles from '../style.css'
import Abutton from '../../Abutton'
import { Icon } from 'antd'
import { vw } from '@/utils/getSize'
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
    auto: boolean,
    saveDataConOpen: boolean
}
export default function CtrlPanel({ clickHandle, saveDataConOpen, linePointer, nextChapter, displaycharactersArray, toogleAuto, quickSave, quickLoad, closeSaveCon, openSaveCon, bgm, auto }: IProps) {
    const [open, setOpen] = useState<boolean>(false)
    const openHandle = () => {
        setOpen((state: boolean) => !state)
    }
    return <div className={styles.ctrlPanle} style={{ width: open ? vw(100) : vw(10) }}>
        {/* <p>第<Abutton onClick={(ev) => clickHandle(ev, { reset: true })}>{linePointer}</Abutton>行</p> */}
        {/* <Abutton onClick={nextChapter}>下一章</Abutton> */}
        {/* <p>在场人物<span></span></p>
        <p>{displaycharactersArray.map(v => v.name)}</p> */}
        {open && <React.Fragment>
            <Abutton type='small' onClick={toogleAuto}>{auto ? '暂停自动播放' : '开始自动播放'}</Abutton>
            <Abutton type='small' onClick={quickSave}>快速保存</Abutton>
            <Abutton type='small' onClick={quickLoad}>快速读取</Abutton>
            <Abutton type='small'
                onClick={saveDataConOpen ? closeSaveCon : openSaveCon}>
                {saveDataConOpen ? '关闭' : '保存/读取'}</Abutton>
            <Abutton type='small' onClick={() => window.history.back()}>回标题</Abutton>
        </React.Fragment>}
        <Abutton type='small' onClick={openHandle}><Icon type={open ? "double-right" : 'double-left'} /></Abutton>
    </div>
}