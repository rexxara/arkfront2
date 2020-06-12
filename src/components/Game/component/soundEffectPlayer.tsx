import React, { useCallback } from 'react'
import { AudioBlob } from './ImgCache'

interface IProps {
    src: string
    callback: Function
    cache: AudioBlob[]
}
export default function (props: IProps) {
    const { src, callback, cache } = props
    if (!src.length) { return <div></div> }
    const onEnded = useCallback(() => callback(), [callback])
    const findedCache = cache.find(v => v.src === src)
    return <div style={{ display: 'none' }}>
        {src.length > 1 && <audio id="ARKSound" src={findedCache ? findedCache.blob : require(`../../../scripts/SoundEffects/${src}`)} autoPlay controls
            onEnded={onEnded}></audio>}
    </div>
}