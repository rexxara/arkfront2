import React from 'react'
import styles from '../style.css'
interface IProps {
    clickCallback: Function
}
export default function Inputs({ clickCallback }: IProps) {
    const submitHandle = (event: any) => {
        event.preventDefault()
        clickCallback(event.target.inputValue.value)
    }
    return <div className={styles.InputCon}>
        <form onSubmit={submitHandle} method="get">
            <input type="text" name='inputValue' />
            <input type="submit" value="Submit" />
        </form>
    </div>
}