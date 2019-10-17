/*charCode:
10:回车
32:空格
66:目前配置下一行最长66个字符,显示四行
*/
import { Line, LINE_TYPE, Game, RawScript, Charater } from './types'
import { strlen } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4
const CRLF = [13, 10, 13, 10]
const LF = [10, 10]
const enAndChsCharMixJudgement = (a: string, b: string) => {
    return function (str: string) {
        if (str === a || str === b) { return true }
    }
}
interface WithCharaterLine{
    type: String,
    charater: Charater,
    value:String,
    emotion?:String
}
const commaJudger = enAndChsCharMixJudgement(":", "：")
const isLeftBracket = enAndChsCharMixJudgement("(", "（")
const isRightBracket = enAndChsCharMixJudgement(")", "）")
const emotionProcessor = (str: String) => {
    function haveBracket(left: number, right: number): boolean {
        if (left > 0 && right > 0 && left < right) {
            return true
        }
        return false
    }
    let rightBracketIndex = 0
    let lefBracketIndex = 0
    for (let i = 0; i < str.length; i++) {
        if (isLeftBracket(str[i])) {
            lefBracketIndex = i
        }
        if (isRightBracket(str[i])) {
            rightBracketIndex = i
            break;
        }
    }
    if (haveBracket(lefBracketIndex, rightBracketIndex)) {
        return {
            name: str.slice(0, lefBracketIndex),
            emotionKey: str.slice(lefBracketIndex+1,rightBracketIndex)
        }
    } else {
        return { name: str,emotionKey:'default' }
    }
}
function filterSpace(str:string):string{
    let arr=[]
    for (let index = 0; index < str.length; index++) {
        const element = str[index]
        if(element!==" "){
            arr.push(element)
        }
    }
    return arr.join("")
}
export function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}
function charatersPreProcess(characters:Charater[]) {
    return characters.map(v=>{
        v.images.none=''
    return v
})
}
const GameLoader = (game: RawScript, needDecode: boolean, IsCRLF: boolean): Game => {
    let { chapters, charaters, variables } = game
    charaters=charatersPreProcess(charaters)
    const currentSpaceLine = IsCRLF ? CRLF : LF
    console.log(IsCRLF, 'IsCRLF')
    const res = {
        chapters: chapters.map(v =>
            ChapterLoader(needDecode ?
                b64_to_utf8(v.slice("data:;base64,".length)) : v, variables, currentSpaceLine, charaters)), charaters
    }
    console.log(res)
    return res
}
function isArrayEqual(arr: number[], currentSpaceLine: number[]) {
    let res = arr.find((v, k) => {
        return v !== currentSpaceLine[k]
    })
    return res ? false : true
}
function ChapterLoader(script: string, variables: Object, currentSpaceLine: number[], Charaters: Charater[]) {
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
                chapter[chapterPointer++] = lineTextProcess(lineText, variables, currentSpaceLine, Charaters)
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
function lineTextProcess(lineText: string[], variables: Object, currentSpaceLine: number[], Charaters: Charater[]): Line {
    let spliter = 0
    const rawLine = lineText.join("")
    const lineWithVariable = variableLoader(rawLine, variables)
    lineWithVariable.find((v, i) => {
        if (commaJudger(v)) {
            spliter = i
        }
    })

    if (spliter) {//有冒号
        let textBeforeComma = lineWithVariable.slice(0, spliter).join("")
        let value = lineWithVariable.slice(spliter + 1, lineWithVariable.length).join("")
        const charaterWithEmotion = emotionProcessor(filterSpace(textBeforeComma))
        const hitedCharater = Charaters.find(charater => {
            if (charaterWithEmotion.name === charater.name) {
                return true
            }
        })
        if (hitedCharater) {
            console.log(hitedCharater)
            console.log(charaterWithEmotion.emotionKey)
            let res:Line={
                type: LINE_TYPE.chat,
                charater: hitedCharater,
                value,
                emotion:hitedCharater.images[charaterWithEmotion.emotionKey as any] as string
            }
                
            return res
        } else {
            return {
                type: LINE_TYPE.raw,
                value: lineWithVariable.join("")
            }
        }

    }
    return {
        type: LINE_TYPE.raw,
        value: rawLine.slice(0, rawLine.length - currentSpaceLine.length)//去掉两行空行
    }
}
export default GameLoader