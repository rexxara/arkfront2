import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { Icon } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { imgMap } from './index'
import { vh, vw } from '../../../utils/getSize'
interface IProps {
    chapterName: string
    children?: React.ReactNode
    out?: boolean
}
const title = (props: IProps) => {
    const { chapterName, children, out } = props
    return <CSSTransition
        in={!out}
        classNames={{
            enter: 'animated',
            enterActive: 'fadeIn',
            exit: 'animated',
            exitActive: 'fadeOut'
        }}
        timeout={2000}
        mountOnEnter={true}
        unmountOnExit={true}
    >
        <div className={styles.title} style={{ width: vw(100), height: vh(100) }}>
            <audio src={require("./title.mp3")} autoPlay></audio>
            <div className={styles.titleImg} style={{ background: `url(${imgMap[chapterName]}) no-repeat center 0` }}>
                {children}
                <h2 style={{ userSelect: 'none', position: 'absolute', padding: '1vw', bottom: '1vw', right: '2vw', background: 'rgba(255,255,255,0.5)' }}>{out ?
                    <span>加载完毕&nbsp;&nbsp;<Icon type="check-circle" /></span>
                    : <span>少女祈祷中&nbsp;&nbsp;<Icon type="loading" /></span>}</h2>
            </div>
        </div>
    </CSSTransition>

}
export default title
