/*charCode:
10:回车
32:空格
66:目前配置下一行最长66个字符,显示四行
*/
import { Line, LINE_TYPE, Game, RawScript } from './types'
import { strlen } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4

function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}

const GameLoader = (game: RawScript): Game => {
    const { chapters, charaters, variables } = game
    console.log(variables)
    return { chapters: chapters.map(v => ChapterLoader(v, variables)), charaters }
}
function ChapterLoader(script: string, variables: Object) {
    let decodedScript = b64_to_utf8(script.slice("data:;base64,".length))
    let chapter: Line[] = []
    let lineText: string[] = []
    let varable = ''
    let chapterPointer = 0
    let linePointer = 0
    let isChat = false
    let voidLineCounter = 0
    // if(decodedScript.charCodeAt(decodedScript.length-1)!==10){
    //     decodedScript=decodedScript.concat(`
    //     `)
    // }//末尾添加enter
    // if(decodedScript.charCodeAt(0)!==10){
    //     decodedScript=(`
    //     `).concat(decodedScript)
    // }
    for (let i = 0; i < decodedScript.length; i++) {
        const currentCharCode = decodedScript.charCodeAt(i)
        const nextCharCode=decodedScript.charCodeAt(i+1)
        const currentChar = decodedScript.charAt(i)
        console.log(currentCharCode,decodedScript.charAt(i))

        if(nextCharCode===10&&currentCharCode===13){
        console.log(currentCharCode,decodedScript.charAt(i))
        }
        if (currentCharCode !== 10) {//13
            lineText[linePointer++] = currentChar
        }
        if (currentCharCode === 10) {//enter
            if (strlen(lineText.join("")) > SplitLimit) {
                //提示有过长段落
            }
            if (lineText.length > 1) {//略过空行
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
function variableLoader(text: string, variables: any):string[] {
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
        value: rawLine
    }
}
export default GameLoader