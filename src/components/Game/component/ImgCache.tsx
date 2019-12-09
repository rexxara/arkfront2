import React, { useEffect, useState } from 'react'
import styles from '../style.css'
import { LoadedChapterModel3 } from '../../../utils/types'
interface IProps {
    chapter: LoadedChapterModel3
}
export default function saveDataCon({ chapter }: IProps) {
    const [bgs, setBgs]: [Array<string>, Function] = useState([])
    const [cgs, setCgs]: [Array<string>, Function] = useState([])
    const [chs, setChs]: [Array<string>, Function] = useState([])
    function getImgCache() {
        const { preLoadBackgrounds, preLoadCgs, preLoadCharaters } = chapter
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
        setBgs(preloadBGArray)
        setCgs(preloadCGArray)
        setChs(preloadChArray)
    }
    useEffect(() => {
        getImgCache()
    }, [chapter])
    return <div>
        {bgs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            src={require(`../../../scripts/backgrounds/${imgsrc}`)} />
        )}
        {cgs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            src={require(`../../../scripts/CGs/${imgsrc}`)} />
        )}
        {chs.map(imgsrc => <img
            className={styles.cacheImg}
            key={imgsrc}
            src={require(`../../../scripts/charatersImages/${imgsrc}`)} />
        )}
    </div>
}