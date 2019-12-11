import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import actions from '../actions'
import { SaveData } from '../actions'
interface IProps {
    saveData: Function,
    loadData: (arg0: undefined, arg1: SaveData) => any
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
        saveData(key)
        loadDataList()
    }
    const loadHandle = (savedata: SaveData) => {
        loadData(undefined, savedata)
    }
    return <div className={styles.SaveDataCon}>
        <h2>SaveDataCon</h2>
        <button onClick={() => saveHandle('new')} >新建</button>
        {datas.map(v => {
            return <div key={v.id} className={styles.saveDataItem}>
                <span>id:{v.id}</span>
                <span>ChapterName:{v.currentChapterName}</span>
                <span>text:{v.displayText}</span>
                <button onClick={() => saveHandle(v.id)}>保存</button>
                <button onClick={() => loadHandle(v)}>加载</button>
            </div>
        })}
    </div>
}