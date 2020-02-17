import React from 'react';
import './style.css'
import { Link } from 'react-router-dom'
import { vw, vh } from '../../utils/getSize'
interface IProps {
    text?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    to?: string,
    children?: React.ReactChild
    style?: React.CSSProperties
    type?: 'small' | 'big'
    [arg: string]: any
}

const Abutton = (props: IProps) => {
    const { type, ...restProps } = props
    const BtnStyle: React.CSSProperties = {
        color: 'white',
        minWidth: type === 'small' ? vw(10) : vw(20),
        height: type === 'small' ? vw(5) : vw(10),
        background: '#313131',
        fontFamily: "Microsoft YaHei",
        border: 0,
        margin: '6px 12px',
        outline: 'none',
        cursor: 'pointer',
        letterSpacing: 1,
        ...props.style
    }
    const res = props.to ? <Link to={props.to}><button
        {...restProps}
        style={BtnStyle}
        onClick={props.onClick}
        className="Abutton">
        {props.text || props.children}
    </button></Link> : <button
        {...restProps}
        style={BtnStyle}
        onClick={props.onClick}
        className="Abutton">
            {props.text || props.children}
        </button>
    return res
}


export default Abutton