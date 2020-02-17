import React, { useState, useEffect } from 'react'
import RawScript from '../scripts/index'
import styles from './index.css'
import { connect } from 'dva'
import { AnyAction } from 'redux'
import { ScencesPage } from '../utils/types'
import actions from '../components/Game/actions'
import Abutton from '../components/Abutton'
import { vw, vh } from '../utils/getSize'
interface Iprops {
    dispatch: (a: AnyAction) => AnyAction
    history: {
        goBack: Function
        replace: Function
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
    const [unLockKeys, setUnlockKeys] = useState<Array<string>>([])
    const currentPageScences = scences[page]
    const currentPageMap = Object.keys(currentPageScences).map(v => {
        const { script } = currentPageScences[v]
        let unlocked = 0
        script.map(v => {
            if (unLockKeys.includes(v.name)) {
                unlocked++
            }
        })
        return {
            name: v,
            unlocked: unlocked === script.length ? true : false,
            ...currentPageScences[v]
        }
    })
    useEffect(() => {
        const caches: Array<string> = []
        getUnlockData()
        scences.map(v => {
            Object.keys(v).map(vv => {
                caches.push(v[vv].cover)
            })
        })
        setCaches(caches)
    }, [])
    const clickHandle = (v: any) => {
        console.log(v)
        props.dispatch({
            type: 'global/reviewScence',
            payload: v
        })
    }
    const setPageHandle = (i: number) => {
        props.history.replace(`/ScenceReview/?page=${i}`)
    }
    const getUnlockData = async () => {
        const res = await actions.getScenceUnlockData()
        setUnlockKeys(res.map(v => v.id))
    }
    console.log(currentPageMap)
    return <div style={{ position: 'absolute', top: 0, left: 0, width: vw(100) }}>
        <div className={styles.cardCon} style={{ height: vw(40) }}>
            {currentPageMap.map((v) => {
                return v.unlocked ? <div
                    onClick={() => clickHandle(v)}
                    key={v.name}
                    style={{
                        background: `url(${require(`../scripts/CGs/${v.cover}`)})`,
                        width: vw(27.5),
                        height: vw(15.5)
                    }}
                    className={styles.galleryCard}>{v.name}</div> : <div
                        key={v.name} className={styles.galleryCard}></div>
            })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {scences.map((v, i) => <Abutton key={i}
                onClick={() => { setPageHandle(i) }}>{i + 1}</Abutton>)}
            <Abutton
                onClick={() => { props.history.goBack() }}>返回</Abutton>
        </div>
        <div style={{ opacity: 0 }}>
            {caches.map(v => <img style={{ position: "absolute", top: 0, left: 0, width: '8vw' }} key={v} src={require(`../scripts/CGs/${v}`)} />)}
        </div>
    </div>
}

export default connect((store) => store)(ScenceReview)