import React, { useState, useEffect } from 'react'
import RawScript from '../scripts/index'
import styles from './index.css'
import { connect } from 'dva'
import { AnyAction } from 'redux'
import { ScencesPage } from '../utils/types'
interface Iprops {
    dispatch: (a: AnyAction) => AnyAction
    history: {
        goBack: Function
        replace:Function
    }
    location: {
        query: {
            page: string
        }
    }
}
const ScenceReview = (props: Iprops) => {
    const scences = RawScript.scences as unknown as Array<ScencesPage>
    const page = parseInt(props.location.query.page) || 0
    const [caches, setCaches]: [Array<string>, any] = useState([])
    const currentPageScences = scences[page] as any
    const currentPageMap = Object.keys(currentPageScences).map(v => {
        return {
            name: v,
            ...currentPageScences[v]
        }
    })
    useEffect(() => {
        const caches: Array<string> = []
        scences.map(v => {
            Object.keys(v).map(vv => {
                caches.push(v[vv].cover)
            })
        })
        setCaches(caches)
    }, [])
    const clickHandle = (v:any) => {
        console.log(v)
        props.dispatch({
            type: 'global/reviewScence',
            payload: v
        })
    }
    const setPageHandle = (i:number) => {
        props.history.replace(`/ScenceReview/?page=${i}`)
    }
    return <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <div className={styles.cardCon}>
            {currentPageMap.map((v) => {
                return <div onClick={() => clickHandle(v)} key={v.name} style={{ background: `url(${require(`../scripts/CGs/${v.cover}`)})` }} className={styles.galleryCard}>{v.key}</div>
            })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {scences.map((v, i) => <button key={i} onClick={() => { setPageHandle(i) }} className={styles.pagation}>{i + 1}</button>)}
            <button onClick={() => { props.history.goBack() }} className={styles.pagation}>返回</button>
        </div>
        <div style={{ opacity: 0 }}>
            {caches.map(v => <img style={{ position: "absolute", top: 0, left: 0, width: '8vw' }} key={v} src={require(`../scripts/CGs/${v}`)} />)}
        </div>
    </div>
}

export default connect((store) => store)(ScenceReview)