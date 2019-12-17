import React, { useEffect, useState } from 'react'
import rawScripts from '../scripts/index'
import actions from '../components/Game/actions'
import styles from './index.css'
import { CGS } from '../utils/types'
interface IProps {

}
interface Containers {
    key: string,
    value: string | {
        [arg: string]: string;
    };
}
export default function gallery(props: IProps) {
    useEffect(() => {
        const cgs = rawScripts.cgs as CGS
        const newCons = Object.keys(cgs).map(v => {
            if (typeof cgs[v] === 'string') {
                return {
                    key: v,
                    value: cgs[v],
                }
            } else {
                const subCgs = cgs[v] as { [arg: string]: string }
                const keys = Object.keys(subCgs)
                const lastKey = keys[keys.length - 1]
                return {
                    key: `${v}.${lastKey}`,
                    value: subCgs[lastKey]
                }
            }
        })
        const groupedNewCons = []
        for (let index = 1; index <= newCons.length; index++) {
            if (index % 9 === 0) {
                groupedNewCons.push(newCons.slice(index - 9, index))
            }
            if (index === newCons.length) {
                const backCount = index % 9
                groupedNewCons.push(newCons.slice(index - backCount, index))
            }
        }
        setContainers(groupedNewCons)
        getUnlockData()
    }, [])
    const getUnlockData = async () => {
        const res = await actions.getCgUnlockData() || []
        console.log(res)
        setUnlockKeys(res)
    }
    const [unLockKeys, setUnlockKeys]: [any[], any] = useState([])
    const [containers, setContainers]: [Containers[][], any] = useState([])
    const [current, setCurrent] = useState(0)
    const currentPageCons = containers[current] || []
    console.log(currentPageCons, unLockKeys)
    return <div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
            {currentPageCons.map((v) => {
                const hitedunlockKey = unLockKeys.find(vv => vv.id === v.key)
                let cgUrl = undefined
                if (hitedunlockKey) {
                    cgUrl = v.value
                }
                return <div key={v.key} style={{background:cgUrl?`url(${require(`../scripts/CGs/${cgUrl}`)})`:undefined}} className={styles.galleryCard}>{v.key}</div>
            })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {containers.map((v, i) => <button key={i} onClick={() => { setCurrent(i) }} className={styles.pagation}>{i + 1}</button>)}
        </div>
    </div>
}


// background: background ?
//                 `url(${require(`../../scripts/backgrounds/${background}`)})` : undefined