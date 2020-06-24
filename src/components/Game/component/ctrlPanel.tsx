import React, { useState } from 'react'
import styles from '../style.css'
import Abutton from '../../Abutton'
import { Icon } from 'antd'
import { vw } from '@/utils/getSize'
import { LoadedChapterModel3 } from '../../../utils/types'
import Log from './Log'
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
    currentChapter: LoadedChapterModel3,
    auto: boolean,
    saveDataConOpen: boolean
}
export default function CtrlPanel({ clickHandle, saveDataConOpen, currentChapter, linePointer, nextChapter, displaycharactersArray, toogleAuto, quickSave, quickLoad, closeSaveCon, openSaveCon, bgm, auto }: IProps) {
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
            <Abutton type='small' onClick={toogleAuto}>{auto ? <Icon type="pause-circle" /> : <Icon type="play-circle" />}</Abutton>
            <Log currentChapter={currentChapter} linePointer={linePointer} />
            <Abutton type='small' onClick={quickSave}><span><Icon type="cloud-download" /></span></Abutton>
            <Abutton type='small' onClick={quickLoad}><Icon type="cloud-upload" /></Abutton>
            <Abutton type='small'
                onClick={saveDataConOpen ? closeSaveCon : openSaveCon}>
                {saveDataConOpen ? <Icon type="close-square" /> : <Icon type="save" />}</Abutton>
            <Abutton type='small' onClick={() => window.history.back()}><Icon type="rollback" /></Abutton>
        </React.Fragment>}
        <Abutton type='small' onClick={openHandle}><Icon type={open ? "double-right" : 'double-left'} /></Abutton>
    </div>
}