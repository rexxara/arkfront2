import React from 'react'
import styles from '../style.css'
import { vw, vh } from '@/utils/getSize'
import { CSSTransition } from 'react-transition-group'

interface IProps {
    narratorMode: string[] | undefined,
    displayText: string
}
interface IState {
    in: boolean,
    narratorMode: string[] | undefined,
    displayText: string
}
class App extends React.Component<IProps>{
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const { narratorMode, displayText } = nextProps;
        if (Array.isArray(narratorMode)) {
                return { in: true, displayText, narratorMode }
        } else {
            if (prevState.in) {
                return { in: false }
            }
        }
    }
    state = {
        in: false,
        narratorMode: [],
        displayText: ''
    }
    render() {
        const { narratorMode, displayText } = this.state
        return <CSSTransition
            in={this.state.in}
            timeout={1000}
            classNames={{
                enter: 'animated',
                enterActive: 'fadeIn',
                exit: 'animated',
                exitActive: 'fadeOut'
            }}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            {narratorMode ? <div className={styles.narrator} id="narrator" style={{ marginLeft: vw(10), marginTop: vh(10), maxWidth: vw(80), height: vh(80) }}>{
                narratorMode.map((v, i) => {
                    if (i === narratorMode.length - 1) { return null }
                    return <p className={styles.narratorLine} key={v}>{v}</p>
                })}
                <p className={styles.narratorLine}>{displayText}</p>
            </div> : <div ></div>}
        </CSSTransition>
    }
}
export default App