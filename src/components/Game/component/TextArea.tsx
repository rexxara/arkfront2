import React from 'react'
import { clickHandleConfig } from '../gameTypes'
import { Icon } from 'antd'
import styles from '../style.css'
import { vw, vh } from '@/utils/getSize'
const TEXT_DISPLAY_SPEEED = 50
interface IState {
    localRawLine: string,
    displayText: string,
    textAreaStop: boolean,
}
interface IProps {
    rawLine: string,
    auto: boolean,
    textAreaStop: boolean,
    lineEndHandle: (byskip: boolean) => any
    clickHandle: (ev?: React.MouseEvent, config?: clickHandleConfig) => any
}

class TextArea extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            localRawLine: '',
            displayText: '',
            textAreaStop: false,
        }
    }
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        if (nextProps.textAreaStop && !prevState.textAreaStop) {
            // console.log('stoped')
            return { textAreaStop: true }
        }
        if (nextProps.rawLine !== prevState.localRawLine) {
            return { textAreaStop: false, displayText: "" }
        } else {
            return { localRawLine: nextProps.rawLine }
        }
    }
    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        if (nextProps.rawLine !== this.props.rawLine) {
            // console.log('rawLineChangedINshouldComponentUpdate')
            clearTimeout(this.timer)
            if(nextProps.rawLine.length){
                this.textAnimation(nextProps.rawLine)
            }
        }
        return true
    }
    textAnimation(value: string, name?: string, skip?: boolean) {
        this.setState({
            localRawLine: value
        }, () => {
            if (value.length > 0) {
                this.textAnimationInner(1)
            }
        })
    }
    textAnimationInner(index: number) {
        const flag = setTimeout(() => {
            const { textAreaStop, displayText } = this.state
            const { rawLine } = this.props
            const end = displayText === rawLine
            this.setState({ displayText: rawLine.slice(0, index) })
            if (!textAreaStop && !end) {
                const flag = setTimeout(() => this.textAnimationInner(index + 1), TEXT_DISPLAY_SPEEED)
                this.timer = flag
            } else {
                this.timer = undefined
                this.setState({ displayText: rawLine })
                let { auto } = this.props
                this.props.lineEndHandle(false)
                if (auto) {
                    setTimeout(() => {
                        this.props.clickHandle()
                    }, 500);
                }
            }
        }, TEXT_DISPLAY_SPEEED)
        this.timer = flag
    }
    timer: any = undefined
    render() {
        const { displayText } = this.state
        const { rawLine } = this.props
        return <div className={styles.textarea}
            style={{
                padding: vw(2), minHeight: vh(25), lineHeight: vh(6), fontSize: vh(4),
            }}>{this.state.displayText}{rawLine === displayText && rawLine.length > 0 && <Icon type="step-forward" />}</div>
    }
}

export default TextArea