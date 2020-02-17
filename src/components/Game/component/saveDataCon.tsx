import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import actions from '../actions'
import { SaveData } from '../actions'
import Abutton from '../../Abutton'
import { vw, vh } from '../../../utils/getSize'
interface IProps {
    saveData?: Function,
    loadData: (arg0: undefined, arg1: SaveData) => any,
}
interface saveDataFromDatabase extends SaveData {
    id: number
}
export default function saveDataCon({ saveData, loadData }: IProps) {
    const [datas, setDatas]: [saveDataFromDatabase[], Function] = useState([])
    useEffect(() => {
        loadDataList()
    }, [])
    const loadDataList = async () => {
        const res = await actions.loadAll()
        setDatas(res || [])
    }
    const saveHandle = (key: 'new' | number) => {
        if (saveData) {
            saveData(key)
        }
        loadDataList()
    }
    const loadHandle = (savedata: SaveData) => {
        loadData(undefined, savedata)
    }
    return <div className={styles.SaveDataCon} style={{ width: vw(100), height: vh(100), overflowY: 'scroll' }}>
        <h2>SaveDataCon</h2>
        {saveData && <Abutton type="small" onClick={() => saveHandle('new')} >新建</Abutton>}
        {datas.map(v => {
            return <div key={v.id} className={styles.saveDataItem}>
                <span style={{float:'left',marginLeft:vw(10)}}>
                    <span>id:{v.id}</span>
                    <span>ChapterName:{v.currentChapterName}</span>
                    <span>text:{v.displayText}</span>
                </span>
                <span style={{float:"right",marginRight:vw(10)}}>
                    {saveData && <Abutton type='small' style={{ color: 'red' }} onClick={() => saveHandle(v.id)}>保存</Abutton>}
                    <Abutton type="small" style={{ margin: '0 0' }} onClick={() => loadHandle(v)}>加载</Abutton>
                </span>
            </div>
        })}
    </div>
}