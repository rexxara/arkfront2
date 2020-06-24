import React, { useEffect, useState, useRef } from 'react'
import styles from '../style.css'
//@ts-ignore
import classnames from 'classnames'
import { vw, vh } from '@/utils/getSize'
interface IProps {
    background: string
}
const TRANS_TIME = 2000
const main = (props: IProps) => {
    const { background } = props
    const [cgList, setCgList]: [string[], Function] = useState([])
    const timerRef: any = useRef()
    useEffect(() => {
        if (background.length) {
            clearTimeout(timerRef.current)
            const newList = [background, cgList[0]].filter(Boolean)
            setCgList(newList)
            if (newList.length > 1) {
                const timer = setTimeout(() => {
                    setCgList((cgList: string[]) => [cgList[0]])
                }, TRANS_TIME)
                timerRef.current = timer
            }
        }
    }, [background])
    if (!background.length) return <div></div>
    return <>{
        cgList.map((v, i) => <div className={(cgList.length > 1 && i !== 0) ? classnames(styles.background, styles.hiddingCgCon) : styles.background} key={v}
            style={{zIndex: 1, width: vw(100),
                height: vh(100), background: `url(${require(`../../../scripts/backgrounds/${v}`)})` }}></div>)
    }</>
}
export default main
