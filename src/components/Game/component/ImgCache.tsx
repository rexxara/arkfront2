import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { ChapterCache } from '../../../utils/types'
import { AudioCaches } from '../gameTypes'
import { message } from 'antd'
interface IProps {
    callback: (arg: AudioCaches) => any
    onProgress: (loaded: number, total: number) => any
    caches: ChapterCache
}
export interface AudioBlob {
    src: string,
    blob: string,
    type: 'bgm' | 'se'
}
const TITLE_DISPLAY_TIME = 1000
export default function saveDataCon({ callback, caches, onProgress }: IProps) {
    const [bgs, setBgs]: [Array<string>, Function] = useState([])
    const [cgs, setCgs]: [Array<string>, Function] = useState([])
    const [chs, setChs]: [Array<string>, Function] = useState([])
    const [bgms, setBgms]: [Array<AudioBlob>, Function] = useState([])
    const [ses, setSes]: [Array<AudioBlob>, Function] = useState([])
    const [mountDate, setMountDate] = useState(Date.now())
    const { preloadSoundEffects, preLoadBgms } = caches
    const total = bgs.length + cgs.length + chs.length + Object.keys(preloadSoundEffects).length + Object.keys(preLoadBgms).length
    const [loadedCount, setLoadedCount] = useState(0)
    useEffect(() => {
        if (total && loadedCount) {
            onProgress(total, loadedCount)
            if (total === loadedCount) {
                const loadedDruation = Date.now() - mountDate
                if (loadedDruation > TITLE_DISPLAY_TIME) {
                    callback({ ses, bgms,cgs })
                    message.success(`加载章节资源耗时${(loadedDruation / 1000).toFixed(2)}`)
                } else {
                    setTimeout(() => {
                        callback({ ses, bgms,cgs })
                        message.success(`加载章节资源耗时${(loadedDruation / 1000).toFixed(2)}，等待时间${((TITLE_DISPLAY_TIME - loadedDruation) / 1000).toFixed(2)}`)
                    }, TITLE_DISPLAY_TIME - loadedDruation)
                }
            }
        }
    }, [total, loadedCount])
    function getImgCache() {
        if (!caches) return console.warn("ImgCache not rcv cache")
        const { preLoadBackgrounds, preLoadCgs, preLoadCharaters, preloadSoundEffects, preLoadBgms } = caches
        let preloadBGArray: string[] = []
        let preloadCGArray: string[] = []
        let preloadChArray: string[] = []
        let preloadBgmArray: string[] = []
        let preloadSeArray: string[] = []
        for (const key in preLoadBgms) {
            if (preLoadBgms.hasOwnProperty(key)) {
                preloadBgmArray.push(preLoadBgms[key])
            }
        }
        for (const key in preloadSoundEffects) {
            if (preloadSoundEffects.hasOwnProperty(key)) {
                preloadSeArray.push(preloadSoundEffects[key])
            }
        }
        Promise.all(preloadBgmArray.map(src => {
            return fetch(require(`../../../scripts/BGM/${src}`)).then(async (response) => {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                return {
                    src: src,
                    blob: url,
                    type: 'bgm'
                }
            })
        })).then(data => {
            setBgms(data)
            updateCount()
        })

        Promise.all(preloadSeArray.map(src => {
            return fetch(require(`../../../scripts/SoundEffects/${src}`)).then(async (response) => {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                return {
                    src: src,
                    blob: url,
                    type: 'se'
                }
            })
        })).then(data => {
            setSes(data)
            updateCount()
        })

        for (const key in preLoadBackgrounds) {
            if (preLoadBackgrounds.hasOwnProperty(key)) {
                preloadBGArray.push(preLoadBackgrounds[key])
            }
        }
        for (const key in preLoadCgs) {
            if (preLoadCgs.hasOwnProperty(key)) {
                preloadCGArray.push(preLoadCgs[key])
            }
        }
        for (const key in preLoadCharaters) {
            if (preLoadCharaters.hasOwnProperty(key)) {
                preLoadCharaters[key].map(v => {
                    const str = `${key}/${v}`
                    preloadChArray.push(str)
                })
            }
        }
        setLoadedCount(0)
        setBgs(preloadBGArray)
        setCgs(preloadCGArray)
        setChs(preloadChArray)
        setMountDate(Date.now())
        if (preloadBGArray.length + preloadCGArray.length + preloadChArray.length + preloadSeArray.length + preloadSeArray.length === 0) {
            console.log(caches, '没有资源')
            setTimeout(() => {
                message.success(`没有资源 标题显示4s`)
                callback({ bgms: [], ses: [],cgs:[] })
            }, TITLE_DISPLAY_TIME)
        }
    }
    useEffect(() => {
        getImgCache()
    }, [caches])
    const updateCount = () => {
        setLoadedCount(pre => pre + 1)
    }
    return <div>
        {/* {bgms.map(audioBlob => <audio key={audioBlob.src} src={audioBlob.blob} ></audio>)}
        {ses.map(audioBlob => <audio key={audioBlob.src} src={audioBlob.blob} ></audio>)} */}
        {bgs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            onLoad={updateCount}
            src={require(`../../../scripts/backgrounds/${imgsrc}`)} />
        )}
        {cgs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            onLoad={updateCount}
            src={require(`../../../scripts/CGs/${imgsrc}`)} />
        )}
        {chs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            onLoad={updateCount}
            src={require(`../../../scripts/charatersImages/${imgsrc}`)} />
        )}
    </div>
}