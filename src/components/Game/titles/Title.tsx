import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { CSSTransition } from 'react-transition-group'
import { imgMap } from './index'
interface IProps {
    chapterName: string
    callback: Function
}
const duration = 2000
const title = (props: IProps) => {
    const { chapterName, callback } = props
    const [inOrOut, setInOrOut] = useState(true)
    const callbackHandle = () => {
        callback()
        setInOrOut(false)
    }
    useEffect(() => {
        // setTimeout(() => {
        // }, duration)
    }, [])
    return <CSSTransition
        in={inOrOut}
        classNames={{
            exit: 'animated',
            exitActive: 'fadeOut'
        }}
        timeout={1000}
        mountOnEnter={true}
        unmountOnExit={true}
    >
        <div className={styles.title}>
            <audio onEnded={callbackHandle} src={require("./title.mp3")} autoPlay></audio>
            <div className={styles.titleImg} style={{ background: `url(${imgMap[chapterName]}) no-repeat center 0` }}></div>
        </div>
    </CSSTransition>

}
export default title
