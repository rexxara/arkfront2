import React, { useState, useEffect } from 'react'
import styles from '../style.css'
import { Input } from 'antd'
import Abutton from '../../Abutton'
import { vw, vh } from '../../../utils/getSize'
interface IProps {
    clickCallback: Function
}
export default function Inputs({ clickCallback }: IProps) {
    const [value, setValue] = useState('')
    const [focusState, setForcusState] = useState('')
    const btnClickHandle = () => {
        clickCallback(value)
    }
    const inputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value)
    }
    const onFocus = (ev: React.FocusEvent<HTMLInputElement>) => {
        setForcusState(document.body.style.cssText)
        const preResize = window.onresize
        window.onresize = () => {
            document.body.style.cssText += 'width:100vw;height:100vh;transform:rotate(0deg);overflow:hidden;'
            window.onresize = preResize
        }
    }
    const onBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
        const preResize = window.onresize
        window.onresize = () => {
            document.body.style.cssText = focusState
            window.onresize = preResize
        }
        setForcusState('')
        clickCallback(value)
    }
    console.log(document.body.style)
    return <div className={styles.InputCon}>
        {focusState.length>0 && <div className={styles.InputCover}>{value}
            <div>
                <Abutton text='提交' onClick={btnClickHandle} />
            </div>
        </div>}
        <Input size='large'
            onBlur={onBlur}
            onChange={inputChange}
            autoComplete="off"
            autoFocus
            onFocus={onFocus}
            value={value}
            type="text"
            name='inputValue' />
    </div>
}