import React from 'react'
import SaveDataCon from '../components/Game/component/saveDataCon'
import styles from './index.css'
import { connect } from 'dva'
import { AnyAction } from 'redux'
interface Iprops {
    dispatch: (a: AnyAction) => AnyAction
}
const LoadPage = (props: Iprops) => {
    const load = (param: any, data: any) => {
        props.dispatch({
            type: 'global/load',
            payload: data
        })
    }
    return <div className={styles.scence}>
        <div style={{ position: 'relative' }}>
            <SaveDataCon loadData={load} />
        </div>
        <div style={{ position: "absolute", bottom: 0 }}>
            <button onClick={() => { window.history.back() }} className={styles.pagation}>返回</button>
        </div>
    </div>
}
export default connect((store) => store)(LoadPage)