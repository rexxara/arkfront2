import React, { RefObject } from 'react'
import { Icon } from 'antd'
import styles from '../style.css'
import { vw, vh } from '@/utils/getSize'
import Abutton from '../../Abutton/Abutton'
//@ts-ignore
import { CSSTransition } from 'react-transition-group'
const MAX = 50
interface IProps {
    displayName: string
    rawLine: string
}
interface Row {
    displayName: string
    rawLine: string
}
interface IState {
    open: boolean,
    willClose: boolean
    willOpen: boolean,
    row: Row[]
}
export default class App extends React.Component<IProps>{
    state: IState = {
        open: false,
        willClose: false,
        willOpen: false,
        row: []
    }
    backBtn: RefObject<HTMLDivElement> = React.createRef()
    toggleLog = () => {
        if (this.state.open) {
            this.setState({ willClose: true })
        } else {
            this.setState({ willOpen: true })
        }
    }
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const { displayName, rawLine } = nextProps
        const data = { displayName: displayName, rawLine: rawLine }
        if (prevState.row.length) {
            const last = prevState.row[prevState.row.length - 1]
            if (displayName !== last.displayName || rawLine !== last.rawLine) {
                const row = prevState.row.length >= MAX ? prevState.row.slice(1) : prevState.row
                return { ...prevState, row: [...row, data] }
            }
        } else {
            return { ...prevState, row: [data] }
        }
        return null
    }
    componentDidUpdate = () => {
        if (this.state.open) { if (this.backBtn.current) { this.backBtn.current.scrollIntoView() } }
    }
    render() {
        const { open, willClose, willOpen, row } = this.state
        let animateStatus = false
        if (open && willClose) {//关闭
            animateStatus = false
        } else if (open || willOpen) {
            animateStatus = true
        }
        return <div>
            <CSSTransition
                in={animateStatus}
                timeout={1000}
                onEntered={() => {
                    this.setState({
                        open: true, willOpen: false
                    })
                }}
                classNames={{
                    enter: 'animate__animated',
                    enterActive: 'animate__backInUp',
                    exit: 'animate__animated',
                    exitActive: 'animate__backOutDown'
                }}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={() => {this.setState({ open: false, willClose: false })}}>
                {(open || willClose || willOpen) ? <div className={styles.logCon} style={{ width: vw(90), height: vh(85), marginLeft: vw(5), marginTop: vh(2) }}>
                    {row.map((v, key) => {
                        return <p className={styles.logItem} key={key}>{v.displayName && <span>{v.displayName} &nbsp;:&nbsp;</span>}{v.rawLine}</p>
                    })}
                    <div ref={this.backBtn} >
                        <Abutton onClick={this.toggleLog} type='small' ><span>返回<Icon type="vertical-align-bottom" /></span></Abutton>
                    </div>
                </div> : <div></div>}
            </CSSTransition>
            <Abutton onClick={this.toggleLog} type='small' >{open ? <Icon type="vertical-align-bottom" /> : <Icon type="vertical-align-top" />}</Abutton>
        </div>
    }
}