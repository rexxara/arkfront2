import React, { useEffect, useState } from 'react'
import rawScripts from '../scripts/index'
import actions from '../components/Game/actions'
import styles from './index.css'
import { CGS } from '../utils/types'
import Abutton from '../components/Abutton'
import { vw } from '../utils/getSize'
interface IProps {}
interface Containers {
    key: string,
    value: string
    extra?: {
        [arg: string]: string;
    }
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
                const firstKey = keys[0]
                return {
                    key: `${v}.${firstKey}`,
                    value: subCgs[firstKey],
                    extra: subCgs
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
    const [unLockKeys, setUnlockKeys]: [{ id: string }[], any] = useState([])
    const [containers, setContainers]: [Containers[][], any] = useState([])
    const [current, setCurrent] = useState(0)
    const [currentBigPic, setCurrentBigPic] = useState('')
    const [cgGroups, setCgGroups] = useState()
    const currentPageCons = containers[current] || []
    const imgCaches = unLockKeys.map(v => {
        const dotIndex = v.id.indexOf('.')
        if (dotIndex > -1) {
            const [parentKey, childKey] = [v.id.substring(0, dotIndex), v.id.substring(dotIndex + 1, v.id.length)]
            return ((rawScripts.cgs as CGS)[parentKey] as { [arg: string]: string })[childKey]
        } else {
            return (rawScripts.cgs as CGS)[v.id] as string
        }
    })
    const clickHandle = (item: Containers, cgurl: string | undefined) => {
        const { value, extra } = item
        if (!cgurl) return
        if (extra) {
            const keys = Object.keys(extra)
            const firstKey = keys[0]
            setCgGroups(extra)
            setCurrentBigPic(extra[firstKey])
        } else {
            setCurrentBigPic(value)
        }
    }
    const bigPicClick = () => {
        if (cgGroups) {
            const cgKeys = Object.keys(cgGroups)
            const res = cgKeys.map((v, i) => {
                return {
                    url: cgGroups[v],
                    key: v,
                    nextKey: cgKeys[i + 1]
                }
            })
            const hitedRes = res.find(v => v.url === currentBigPic) || { nextKey: undefined }
            if (hitedRes.nextKey) {
                setCurrentBigPic(cgGroups[hitedRes.nextKey])
            } else {
                setCgGroups(undefined)
                setCurrentBigPic('')
            }
        } else {
            setCurrentBigPic('')
        }
    }
    console.log(currentBigPic)
    return <div>
        {currentBigPic && <div onClick={bigPicClick} className={styles.displayImg} style={{ background: `url(${require(`../scripts/CGs/${currentBigPic}`)})` }} ></div>}
        <div className={styles.cardCon}>
            {currentPageCons.map((v) => {
                const hitedunlockKey = unLockKeys.find(vv => vv.id === v.key)
                let cgUrl: string | undefined = undefined
                if (hitedunlockKey) {
                    cgUrl = v.value as string
                }
                return <div
                    onClick={() => clickHandle(v, cgUrl)} key={v.key}
                    style={{
                        background: cgUrl ? `url(${require(`../scripts/CGs/${cgUrl}`)})` : undefined,
                        width: vw(27.5),
                        height: vw(15.5),
                        margin: vw(2)
                    }}
                    className={styles.galleryCard}>{v.key}</div>
            })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {containers.map((v, i) => <Abutton key={i} onClick={() => { setCurrent(i) }}>{i + 1}</Abutton>)}
            <Abutton onClick={() => { window.history.back() }} >返回</Abutton>
        </div>
        <div>
            {imgCaches.map(v => <div key={v} style={{ background: `url(${require(`../scripts/CGs/${v}`)})` }}></div>)}
        </div>
    </div>
}
