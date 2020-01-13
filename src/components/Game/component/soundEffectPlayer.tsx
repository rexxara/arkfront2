import React from 'react'

interface IProps {
    src: string
    callback: Function
}
export default function (props: IProps) {
    const { src, callback } = props
    const onEnded = () => callback()
    return <div style={{ display: 'none' }}>
        {src.length > 1 && <audio id="ARKSound" src={require(`../../../scripts/SoundEffects/${src}`)} autoPlay controls
            onEnded={onEnded}></audio>}
    </div>
}