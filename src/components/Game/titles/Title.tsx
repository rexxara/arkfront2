import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { Icon, Divider } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { imgMap } from './index'
import { vh, vw } from '../../../utils/getSize'
import { TitleChapterName, TitleChapterNameIniValue } from '../gameTypes'
import { Progress } from 'antd'

interface IProps {
    TitleChapterName: TitleChapterName
    children?: React.ReactNode
}
interface IState {
    enter: boolean
    closeAble: boolean
    localState: TitleChapterName
}
const iniState = {
    enter: false,
    localState: TitleChapterNameIniValue,
    closeAble: false
}
const style: React.CSSProperties = { textAlign: "right", userSelect: 'none', width: vw(30), position: 'absolute', padding: '1vw', bottom: '1vw', right: '2vw', background: 'rgba(255,255,255,0.5)' }
class title extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = iniState
    }
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        if (prevState.localState.chapterName) {
            if (!nextProps.TitleChapterName.chapterName) {
                // console.log('之前有现在没了')
                return { closeAble: true }
            } else {
            }
        } else {
            if (nextProps.TitleChapterName.chapterName) {
                // console.log('之前没有现在有了')
                return { localState: nextProps.TitleChapterName, enter: true }
            } else {
            }
        }
        return { localState: nextProps.TitleChapterName }
    }
    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        if (!this.state.closeAble&&nextState.closeAble) {
            if (this.timeRef) clearTimeout(this.timeRef)
            this.timeRef = setTimeout(() => {
                this.setState({ enter: false })//有问题 会运行多次
            }, 1000);
        }
        return true
    }
    timeRef: any = undefined
    render() {
        const { chapterName, total, loaded } = this.state.localState
        const { children } = this.props
        const { enter, closeAble } = this.state
        let percent: number = 0
        if (total) {
            const num = (loaded / total) as any
            percent = num.toFixed(4) * 100
        } else {
            percent = 100
        }
        return <CSSTransition
            in={enter}
            classNames={{
                enter: 'animate__animated',
                enterActive: 'animate__fadeIn',
                exit: 'animate__animated',
                exitActive: 'animate__backOutDown'
            }}
            timeout={2000}
            onExited={() => { this.setState(iniState) }}
            mountOnEnter={true}
            unmountOnExit={true}
        >{chapterName ? <div className={styles.title} style={{ width: vw(100), height: vh(100) }}>
            <audio src={require("./title.mp3")} autoPlay></audio>
            <div className={styles.titleImg} style={{ background: `url(${imgMap[chapterName]}) no-repeat center 0` }}>
                {children}
                <div style={style}>
                    <h3>{closeAble ?
                        <span>加载完毕&nbsp;&nbsp;<Icon type="check-circle" /></span>
                        : <span>少女祈祷中&nbsp;&nbsp;<Icon type="loading" /></span>}</h3>
                    <Progress strokeColor={{ '0%': '#3e468e', '100%': '#af3d47', }} percent={percent} status="active" showInfo={false} />
                </div>
            </div>
        </div> : <div></div>}
        </CSSTransition>

    }

}
export default title
