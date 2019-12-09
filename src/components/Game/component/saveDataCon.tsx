import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import actions from '../actions'
import { SaveData } from '../actions'
interface IProps {
    saveData: Function,
    loadData: (arg0:undefined,arg1: SaveData) => any
}
export default function saveDataCon({ saveData, loadData }: IProps) {
    const [datas, setDatas]: [SaveData[], Function] = useState([])
    useEffect(() => {
        loadDataList()
    }, [])
    const loadDataList = async () => {
        const res = await actions.loadAll()
        setDatas(res || [])
    }
    return <div className={styles.SaveDataCon}>
        <h2>SaveDataCon</h2>
        <div className={styles.saveDataItem} onClick={() => saveData('new')} >新建</div>
        {datas.map(v => {
            return <div key={v.id} className={styles.saveDataItem}>
                <span>id:{v.id}</span>
                <span>currentChapterName:{v.currentChapterName}</span>
                <span>text:{v.displayText}</span>
                <button onClick={()=>loadData(undefined,v)}>加载</button>
            </div>
        })}
    </div>
}