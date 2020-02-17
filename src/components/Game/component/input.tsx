import React, { useState } from 'react'
import styles from '../style.css'
import { Input } from 'antd'
import Abutton from '../../Abutton'
interface IProps {
    clickCallback: Function
}
export default function Inputs({ clickCallback }: IProps) {
    const [value, setValue] = useState('')
    const btnClickHandle = () => {
        clickCallback(value)
    }
    const inputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value)
    }
    return <div className={styles.InputCon}>
        <Input size='large' onChange={inputChange} value={value} type="text" name='inputValue' />
        <Abutton type='small' text={'提交'} onClick={btnClickHandle} />
    </div>
}