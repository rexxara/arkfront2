
const vw = (num: number): string => {
    let res = num
    const { clientHeight, clientWidth } = document.documentElement
    if (clientHeight > clientWidth) {
        //手机
        res = clientHeight / 100 * num
    } else {
        //pc
        res = clientWidth / 100 * num
    }
    return res + 'px'
}

const vh = (num: number): string => {
    let res = num
    const { clientHeight, clientWidth } = document.documentElement
    if (clientHeight > clientWidth) {
        //手机
        res = clientWidth / 100 * num
    } else {
        //pc
        res = clientHeight / 100 * num
    }
    return res + 'px'
}
export { vw, vh }