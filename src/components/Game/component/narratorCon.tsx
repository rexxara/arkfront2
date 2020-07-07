import React from 'react'
import styles from '../style.css'
import { vw, vh } from '@/utils/getSize'
//@ts-ignore
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
        return null
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
                enter: 'animate__animated',
                enterActive: 'animate__fadeIn',
                exit: 'animate__animated',
                exitActive: 'animate__fadeOut'
            }}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            {narratorMode ? <div className={styles.narrator} id="narrator" style={{ marginLeft: vw(10), marginTop: vh(10), maxWidth: vw(80), height: vh(80) }}>{
                narratorMode.map((v, i) => {
                    return <p className={styles.narratorLine} key={i}>{v}</p>
                })}
                <p className={styles.narratorLine}>{displayText}</p>
            </div> : <div ></div>}
        </CSSTransition>
    }
}
export default App