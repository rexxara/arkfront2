import React from 'react'
import SaveDataCon from '../components/Game/component/saveDataCon'
import styles from './index.css'
import { connect } from 'dva'
import { AnyAction } from 'redux'
import Abutton from '../components/Abutton'
import { vw, vh } from '../utils/getSize'

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
    return <div className={styles.scence} style={{ width: vw(100), height: vh(100) }}>
        <div style={{ position: 'relative', overflowY: 'scroll',overflowX:'hidden', width: vw(100), height: vh(80) }}>
            <SaveDataCon loadData={load} />
        </div>
        <div style={{ position: "absolute", bottom: 0 }}>
            <Abutton onClick={() => { window.history.back() }}>返回</Abutton>
        </div>
    </div>
}
export default connect((store) => store)(LoadPage)