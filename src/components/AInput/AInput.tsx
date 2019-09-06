import React, { useState } from 'react';
import {validateFunction} from './interfaces'

interface IProps {
    type?: string,
    label: string,
    displayName?:string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string,
    required?: boolean,
    value?:string,
    validator?: [validateFunction, string]
}
///ttt
const AInput = (props: IProps) => {
    const [warn, setWarn] = useState(false)
    const { displayName,label, type, onChange, required, validator, ...otherProps } = props
    let message=validator?validator[1]:''
    const changeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (validator) {
            const [validate] = validator
            validate(event.target.value) ? setWarn(false) : setWarn(true)
        }
        if (onChange) { onChange(event) }
    }
    return (
        <React.Fragment>
            {displayName||label}<input data-valided={!warn} data-key={label} data-alabel="AInput" {...otherProps} onChange={changeFunc} type={type || "text"} required={required} />
            {validator && <span style={{ display: `${warn ? 'block' : 'none'}` }}>{message}</span>}
        </React.Fragment>
    )
}


export default AInput