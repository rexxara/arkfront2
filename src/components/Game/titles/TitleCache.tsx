import React from 'react'
import { imgMap } from './index'
import styles from '../style.css'
export default function () {
    return <div >
        {Object.keys(imgMap).map(v => {
            return <img className={styles.cacheImg} key={v} src={imgMap[v]} alt="" />
        })}
    </div>
}