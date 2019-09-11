/*charCode:
10:回车
32:空格
66:目前配置下一行最长66个字符,显示四行
*/
import { Line, LINE_TYPE, Game, RawScript } from './types'
import { strlen } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4
const spaceLine = [13, 10, 13, 10]

function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}

const GameLoader = (game: RawScript): Game => {
    const { chapters, charaters, variables } = game
    console.log(variables)
    return { chapters: chapters.map(v => ChapterLoader(v, variables)), charaters }
}
function isArrayEqual(arr: number[]) {
    let res = arr.find((v, k) => {
        return v !== spaceLine[k]
    })
    return res ? false : true
}
function ChapterLoader(script: string, variables: Object) {
    let decodedScript = b64_to_utf8(script.slice("data:;base64,".length))
    let chapter: Line[] = []
    let lineText: string[] = []
    let chapterPointer = 0
    let linePointer = 0
    let voidLineCounter = 0
    let lineCache = []
        decodedScript=decodedScript.concat(spaceLine.map(v=>String.fromCharCode(v)).join(""))//添加空行

    for (let i = 0; i < decodedScript.length; i++) {
        if (lineCache.length === 4) {//一行空行是13 10 13 10
            lineCache.shift()
        }
        const currentCharCode = decodedScript.charCodeAt(i)
        console.log(currentCharCode)
        lineCache.push(currentCharCode)
        const currentChar = decodedScript.charAt(i)
        lineText[linePointer++] = currentChar
        
        if (isArrayEqual(lineCache))  {//空行
            if (strlen(lineText.join("")) > SplitLimit) {
                //提示有过长段落
            }
            if (lineText.length > 2) {//回车长度为2
                voidLineCounter = 0
                chapter[chapterPointer++] = lineTextProcess(lineText, variables)
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
    console.log(chapter)
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
function lineTextProcess(lineText: string[], variables: Object): Line {
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
        value: rawLine.slice(0,rawLine.length-4)//去掉两行空行
    }
}
export default GameLoader