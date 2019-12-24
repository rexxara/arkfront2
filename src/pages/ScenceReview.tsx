import React, { useState } from 'react'
import RawScript from '../scripts/index'
import styles from './index.css'
import { connect } from 'dva'
import {AnyAction} from 'redux'
interface Iprops {
    dispatch: (a: AnyAction) => AnyAction
}
const ScenceReview = (props: Iprops) => {
    const { scences } = RawScript
    const [page, setPage] = useState(0)
    const currentPageScences = scences[page] as any
    const currentPageMap = Object.keys(currentPageScences).map(v => {
        return {
            name: v,
            ...currentPageScences[v]
        }
    })
    const clickHandle = (v) => {
        console.log(v)
        props.dispatch({
            type: 'global/reviewScence',
            payload: v
        })
    }
    return <div style={{position:'absolute',top:0,left:0,width:'100%'}}>
        <div className={styles.cardCon}>
            {currentPageMap.map((v) => {
                return <div onClick={() => clickHandle(v)} key={v.name} style={{ background: `url(${require(`../scripts/CGs/${v.cover}`)})` }} className={styles.galleryCard}>{v.key}</div>
            })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {scences.map((v, i) => <button key={i} onClick={() => { setPage(i) }} className={styles.pagation}>{i + 1}</button>)}
            <button onClick={() => { window.history.back() }} className={styles.pagation}>返回</button>
        </div>
    </div>
}

export default connect((store) => store)(ScenceReview)