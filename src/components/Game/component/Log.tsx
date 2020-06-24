import React, { RefObject } from 'react'
import { Icon } from 'antd'
import styles from '../style.css'
import { vw, vh } from '@/utils/getSize'
import Abutton from '../../Abutton/Abutton'
import { LoadedChapterModel3, DisplayLine } from '../../../utils/types'
//@ts-ignore
import { CSSTransition } from 'react-transition-group'
interface IProps {
    currentChapter: LoadedChapterModel3,
    linePointer: number
}
interface IState {
    open: boolean,
    willClose: boolean
    willOpen: boolean
}
export default class App extends React.Component<IProps>{
    state: IState = {
        open: false,
        willClose: false,
        willOpen: false
    }
    backBtn: RefObject<HTMLDivElement> = React.createRef()
    toggleLog = () => {
        if (this.state.open) {
            this.setState({ willClose: true })
        } else {
            this.setState({ willOpen: true })
        }
    }
    componentDidUpdate = () => {
        if (this.state.open) { if (this.backBtn.current) { this.backBtn.current.scrollIntoView() } }
    }
    render() {
        const { open, willClose, willOpen } = this.state
        let resultArray: DisplayLine[] = []
        if (open) {
            const { currentChapter, linePointer } = this.props
            const lines = currentChapter.line.slice(0, linePointer).filter(v => 'command' in v ? false : true)
            resultArray = lines as DisplayLine[]
        }
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
                onExited={() => {
                    this.setState({ open: false, willClose: false })
                }}
            >
                {(open || willClose || willOpen) ? <div className={styles.logCon} style={{ width: vw(90), height: vh(85), marginLeft: vw(5), marginTop: vh(2) }}>
                    {resultArray.map((v, key) => {
                        return <p className={styles.logItem} key={key}>{v.name && <span>{v.name} &nbsp;:&nbsp;</span>}{v.value}</p>
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