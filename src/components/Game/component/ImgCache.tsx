import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { ChapterCache } from '../../../utils/types'
import { message } from 'antd'
interface IProps {
    callback: Function
    caches: ChapterCache
}
export default function saveDataCon({ callback, caches }: IProps) {
    const [bgs, setBgs]: [Array<string>, Function] = useState([])
    const [cgs, setCgs]: [Array<string>, Function] = useState([])
    const [chs, setChs]: [Array<string>, Function] = useState([])
    const [mountDate, setMountDate] = useState(Date.now())
    const total = bgs.length + cgs.length + chs.length
    const [loadedCount, setLoadedCount] = useState(0)
    useEffect(() => {
        if (total && loadedCount) {
            if (total === loadedCount) {
                const loadedDruation = Date.now() - mountDate
                if (loadedDruation > 4000) {
                    callback()
                    message.success(`加载章节资源耗时${(loadedDruation / 1000).toFixed(2)}`)
                } else {
                    setTimeout(() => {
                        callback()
                        message.success(`加载章节资源耗时${(loadedDruation / 1000).toFixed(2)}，等待时间${((4000 - loadedDruation) / 1000).toFixed(2)}`)
                    }, 4000 - loadedDruation)
                }
            }
        }
    }, [total, loadedCount])
    function getImgCache() {
        if (!caches) return console.warn("ImgCache not rcv cache")
        const { preLoadBackgrounds, preLoadCgs, preLoadCharaters } = caches
        let preloadBGArray: string[] = []
        let preloadCGArray: string[] = []
        let preloadChArray: string[] = []
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
        if (preloadBGArray.length + preloadCGArray.length + preloadChArray.length === 0) {
            console.log(caches, '没有资源')
            setTimeout(() => {
                message.success(`没有资源 标题显示4s`)
                callback()
            }, 4000)
        }
    }
    useEffect(() => {
        getImgCache()
        console.log(caches)
    }, [caches])
    const updateCount = () => {
        setLoadedCount(pre => pre + 1)
    }
    return <div>
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