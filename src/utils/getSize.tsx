
interface CacheMap {
    [arg: string]: string
}

let vwCacheMap: CacheMap = {}
const vw = (num: number): string => {
    const { clientHeight, clientWidth } = document.documentElement
    if (vwCacheMap[num]) {
        return vwCacheMap[num]
    }
    if (clientHeight > clientWidth) {
        //手机
        const res = clientHeight / 100 * num + 'px'
        vwCacheMap[num] = res
        return res
    } else {
        //pc
        const res = clientWidth / 100 * num + 'px'
        vwCacheMap[num] = res
        return res
    }
}
let vhCacheMap: CacheMap = {}
const vh = (num: number): string => {
    if (vhCacheMap[num]) {
        return vhCacheMap[num]
    }
    const { clientHeight, clientWidth } = document.documentElement
    if (clientHeight > clientWidth) {
        //手机
        const res = clientWidth / 100 * num + 'px'
        vhCacheMap[num] = res
        return res
    } else {
        //pc
        const res = clientHeight / 100 * num + 'px'
        vhCacheMap[num] = res
        return res
    }
}
export { vw, vh }