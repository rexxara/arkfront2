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
    const { chapters, charaters } = game
    return { chapters: chapters.map(v => loader(v)), charaters }
}
function loader(script: string) {
    const decodedScript = b64_to_utf8(script.slice("data:;base64,".length))
    let chapter: Line[] = []
    let lineText: string[] = []

    let chapterPointer = 0
    let linePointer = 0
    let isChat = false
    let voidLineCounter = 0
    for (let i = 0; i < decodedScript.length; i++) {
        const currentCharCode = decodedScript.charCodeAt(i)
        const currentChar = decodedScript.charAt(i)
        if (currentCharCode !== 10) {
            lineText[linePointer++] = currentChar
        }
        if (currentCharCode === 10) {//enter
            if (strlen(lineText.join("")) > SplitLimit) {
                //提示有过长段落
                console.log(lineText.length,strlen(lineText.join("")))
            }
            if (lineText.length > 1) {//略过空行
                voidLineCounter = 0
                chapter[chapterPointer++] = lineTextProcess(lineText)
            } else {
                voidLineCounter++
                if (voidLineCounter === ALLOW_MAX_SPACE_LINE) {
                    chapter[chapterPointer++] = { type: LINE_TYPE.spaceLine }
                }
            }
            lineText = []
            linePointer = 0
        }

    }
    console.log(chapter)
    return chapter
}
function lineTextProcess(lineText: string[]): Line {
    let spliterIndex = 0
    lineText.find((v, i) => {
        if (v === ":" || v === "：") {
            spliterIndex = i
        }
    })
    if (spliterIndex) {//是对话
        let owner = []
        let value = []
        for (let i = 0; i < lineText.length; i++) {
            if (i < spliterIndex) {
                owner.push(lineText[i])
            } else if (i > spliterIndex) {
                value.push(lineText[i])
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
        value: lineText.join("")
    }
}
export default GameLoader