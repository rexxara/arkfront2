import React, { useEffect, useState, useRef } from 'react'
import styles from '../style.css'
import classnames from 'classnames'
interface IProps {
    cg: string
}
const TRANS_TIME = 2000
const main = (props: IProps) => {
    const { cg } = props
    const [cgList, setCgList]: [string[], Function] = useState([])
    const timerRef: any = useRef()
    useEffect(() => {
        if (cg.length) {
            clearTimeout(timerRef.current)
            const newList = [cg, cgList[0]].filter(Boolean)
            setCgList(newList)
            if (newList.length > 1) {
                const timer = setTimeout(() => {
                    setCgList((cgList: string[]) => [cgList[0]])
                }, TRANS_TIME)
                timerRef.current = timer
            }
        }
    }, [cg])
    if (!cg.length) return <div></div>
    return <>{
        cgList.map((v, i) => <div className={(cgList.length > 1 && i !== 0) ? classnames(styles.cgCon, styles.hiddingCgCon) : styles.cgCon} key={v}
            style={{ background: `url(${require(`../../../scripts/CGs/${v}`)})` }}></div>)
    }</>
}
export default main