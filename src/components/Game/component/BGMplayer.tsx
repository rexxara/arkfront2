import React from 'react'
import { selectedBGM } from '../../../utils/types'
import { AudioBlob } from './ImgCache'
interface IProps {
    src: selectedBGM,
    cache: AudioBlob[]
}
export default function (props: IProps) {
    const { src: { name, src }, cache } = props
    if (src.length < 1) {
        return <div></div>
    }
    const findedCache = cache.find(v => v.src === src)
    return <div style={{ display: 'none' }}>
        <p>{name}</p>
        <audio id="ARKBGM" loop src={findedCache?findedCache.blob:require(`../../../scripts/BGM/${src}`)} autoPlay controls></audio>
    </div>
}