import React from 'react';
import './style.css'
interface IProps {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    to?: string
}
const Abutton = (props: IProps) => {

    const res = props.to ? <a href={props.to}><button {...props} onClick={props.onClick} className="Abutton">
        {props.text}
    </button></a> : <button {...props} onClick={props.onClick} className="Abutton">
            {props.text}
        </button>
    return res
}


export default Abutton