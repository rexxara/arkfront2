/*charCode:
10:回车
32:空格
66:目前配置下一行最长66个字符,显示四行
*/
import { Line, LINE_TYPE, Game, RawScript } from './types'
import { strlen } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4
const CRLF = [13, 10, 13, 10]
const LF = [10, 10]

export function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}

const GameLoader = (game: RawScript, needDecode: boolean, IsCRLF: boolean): Game => {
    const { chapters, charaters, variables } = game
    const currentSpaceLine = IsCRLF ? CRLF : LF
    console.log(IsCRLF,'IsCRLF')
    const res = { chapters: chapters.map(v => ChapterLoader(needDecode ? b64_to_utf8(v.slice("data:;base64,".length)) : v, variables, currentSpaceLine)), charaters }
    console.log(res)
    return res
}
function isArrayEqual(arr: number[], currentSpaceLine: number[]) {
    let res = arr.find((v, k) => {
        return v !== currentSpaceLine[k]
    })
    return res ? false : true
}
function ChapterLoader(script: string, variables: Object, currentSpaceLine: number[]) {
    let chapter: Line[] = []
    let lineText: string[] = []
    let chapterPointer = 0
    let linePointer = 0
    let voidLineCounter = 0
    let lineCache = []
    script = script.concat(currentSpaceLine.map(v => String.fromCharCode(v)).join(""))//添加空行

    for (let i = 0; i < script.length; i++) {
        if (lineCache.length === currentSpaceLine.length) {//一行空行是13 10 13 10
            lineCache.shift()
        }
        const currentCharCode = script.charCodeAt(i)
        lineCache.push(currentCharCode)
        const currentChar = script.charAt(i)
        lineText[linePointer++] = currentChar

        if (isArrayEqual(lineCache, currentSpaceLine)) {//空行
            if (strlen(lineText.join("")) > SplitLimit) {
                //提示有过长段落
            }
            if (lineText.length > 2) {//回车长度为2
                voidLineCounter = 0
                chapter[chapterPointer++] = lineTextProcess(lineText, variables,currentSpaceLine)
            } else {
                voidLineCounter++
                if (voidLineCounter === ALLOW_MAX_SPACE_LINE) {
                    chapter[chapterPointer++] = { type: LINE_TYPE.spaceLine, value: "" }
                }
            }
            lineText = []
            linePointer = 0
        }

    }
    return chapter
}
function variableLoader(text: string, variables: any): string[] {
    const reg = /\$\{[^}]+\}/g
    const res = text.replace(reg, function (rs) {
        const key = rs.slice(2, rs.length - 1)
        return variables[key]
    })
    return res.split("")
}
function lineTextProcess(lineText: string[], variables: Object,currentSpaceLine:number[]): Line {
    let spliterIndex = 0
    const rawLine = lineText.join("")
    const lineWithVariable = variableLoader(rawLine, variables)
    lineWithVariable.find((v, i) => {
        if (v === ":" || v === "：") {
            spliterIndex = i
        }
    })
    if (spliterIndex) {//是对话
        let owner = []
        let value = []
        for (let i = 0; i < lineWithVariable.length; i++) {
            if (i < spliterIndex) {
                owner.push(lineWithVariable[i])
            } else if (i > spliterIndex) {
                value.push(lineWithVariable[i])
            }
        }
        return {
            type: LINE_TYPE.chat,
            owner: owner.join(""),
            value: value.join("")
        }
    }
    return {
        type: LINE_TYPE.raw,
        value: rawLine.slice(0, rawLine.length - currentSpaceLine.length)//去掉两行空行
    }
}
export default GameLoader