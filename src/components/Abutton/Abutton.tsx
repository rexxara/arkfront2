import React from 'react';
import './style.css'
import { Link } from 'react-router-dom'
interface IProps {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    to?: string
}
const Abutton = (props: IProps) => {

    const res = props.to ? <Link to={props.to}><button {...props} onClick={props.onClick} className="Abutton">
        {props.text}
    </button></Link> : <button {...props} onClick={props.onClick} className="Abutton">
            {props.text}
        </button>
    return res
}


export default Abutton