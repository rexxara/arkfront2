import React, { useEffect, useState, useRef } from 'react'
import styles from '../style.css'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
interface IProps {
    cg: string,
    cgList: string[]
}
const main = (props: IProps) => {
    const { cg, cgList } = props
    return <div>
        {cgList.map((v, i) => {
            return <CSSTransition
                key={i}
                in={cg === v}
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
                <div key={i} className={classnames(styles.cgCon)} style={{ background: `url(${require(`../../../scripts/CGs/${v}`)})` }}></div>
            </CSSTransition>
        })}
    </div>
}
export default main