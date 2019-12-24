import React from 'react'
import { selectedBGM } from '../../../utils/types'
interface IProps {
    src: selectedBGM
}
export default function (props: IProps) {
    const { src: { name, src } } = props
    return <div style={{ display: 'none' }}>
        <p>{name}</p>
        {src.length > 1 && <audio id="ARKBGM" loop src={require(`../../../scripts/BGM/${src}`)} autoPlay controls></audio>}
    </div>
}