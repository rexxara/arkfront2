import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { Icon } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { imgMap } from './index'
import { vh, vw } from '../../../utils/getSize'
import { TitleChapterName } from '../gameTypes'
import { Progress } from 'antd'

interface IProps {
    TitleChapterName: TitleChapterName
    children?: React.ReactNode
}
const style: React.CSSProperties = { textAlign: "right", userSelect: 'none', width: vw(30), position: 'absolute', padding: '1vw', bottom: '1vw', right: '2vw', background: 'rgba(255,255,255,0.5)' }
const title = (props: IProps) => {
    const { chapterName, total, loaded, out } = props.TitleChapterName
    const { children } = props
    let percent: number = 0
    if (total) {
        const num = (loaded / total) as any
        percent = num.toFixed(4) * 100
    }
    return <CSSTransition
        in={!out}
        classNames={{
            enter: 'animate__animated',
            enterActive: 'animate__fadeIn',
            exit: 'animate__animated',
            exitActive: 'animate__fadeOut'
        }}
        timeout={2000}
        mountOnEnter={true}
        unmountOnExit={true}
    >
        <div className={styles.title} style={{ width: vw(100), height: vh(100) }}>
            <audio src={require("./title.mp3")} autoPlay></audio>
            <div className={styles.titleImg} style={{ background: `url(${imgMap[chapterName]}) no-repeat center 0` }}>
                {children}
                <div style={style}>
                    <h3>{out ?
                        <span>加载完毕&nbsp;&nbsp;<Icon type="check-circle" /></span>
                        : <span>少女祈祷中&nbsp;&nbsp;<Icon type="loading" /></span>}</h3>
                    <Progress strokeColor={{ '0%': '#3e468e', '100%': '#af3d47', }} percent={percent} status="active" showInfo={false} />

                </div>
            </div>
        </div>
    </CSSTransition>

}
export default title
