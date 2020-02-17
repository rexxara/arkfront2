import React from 'react'
import { Option } from '../../utils/types'
import styles from './style.css'
import classnames from 'classnames'
import { vh } from '@/utils/getSize'
interface IProps {
    onClick: Function,
    v: Option
    choose: Option[],
    gameVariables: any
}
export default function (props: IProps) {
    const { onClick, v, choose, gameVariables } = props
    const { disable } = v
    let isDisable = false
    if (disable) {
        isDisable = disable(gameVariables)
    }
    return <p
        style={{ fontSize: vh(5) }}
        className={isDisable ? classnames(styles.choose, styles.chooseDisable) : styles.choose} onClick={() => { !isDisable && onClick(v, choose) }} >{v.text}:{isDisable}</p>
}