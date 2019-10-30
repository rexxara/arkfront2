/*charCode:
10:回车
32:空格
66:目前配置下一行最长66个字符,显示四行
*/
import { DisplayLine, CommandLine, Game, RawScript, LINE_TYPE, Charater,NO_IMG } from './types'
import { strlen } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4
const CRLF = [13, 10]
const LF = [10]
const emotionProcessor = (str: String) => {
    const emoReg = /(?<=[\(|（])[^\(\)|）]*(?=[\)|）])/g
    const nameReg = /^(.*)(?:\s*)(?=[\(|（])/g
    const emotion = str.match(emoReg)
    const name = str.match(nameReg)
    if (emotion && name) {
        return {
            name: name[0].trim(),
            emotionKey: emotion[0].trim()
        }
    } else {
        return { name: str, emotionKey: 'default' }
    }
}
function filterSpace(str: string): string {
    return str.replace(/\s/g, '')
}
export function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}
function charatersPreProcess(characters: Charater[]) {
    return characters.map(v => {
        v.images.none = NO_IMG
        return v
    })
}
const GameLoader = (game: RawScript, needDecode: boolean, IsCRLF: boolean): Game => {
    const { chapters, variables, backgrounds } = game
    const charaters = charatersPreProcess(game.charaters)
    const res = {
        chapters: chapters.map(v =>
            ChapterLoader(needDecode ?
                b64_to_utf8(v.slice("data:;base64,".length)) : v, variables, IsCRLF, charaters,backgrounds)),
                 charaters,backgrounds
    }
    console.log(res)
    return res
}
function isArrayEqual(arr: number[], currentSpaceLine: number[]) {
    if (arr.length !== currentSpaceLine.length) {
        return false
    }
    const res = arr.find((v, k) => {
        return v !== currentSpaceLine[k]
    })
    return res ? false : true
}
function ChapterLoader(script: string, variables: Object, IsCRLF: boolean, Charaters: Charater[],backgrounds:Object) {
    let chapter: (DisplayLine | CommandLine)[] = []
    let lineText: string[] = []
    let chapterPointer = 0
    let linePointer = 0
    let voidLineCounter = 0
    const currentSingleSpaceLine = IsCRLF ? CRLF : LF
    const currentSpaceLine = [...currentSingleSpaceLine, ...currentSingleSpaceLine]
    let lineCache = new Array(currentSpaceLine.length).fill(233)//随便填点什么
    script = script.concat(currentSpaceLine.map(v => String.fromCharCode(v)).join(""))//添加空行

    for (let i = 0; i < script.length; i++) {
        if (lineCache.length === currentSpaceLine.length) {//一行空行是13 10 13 10
            lineCache.shift()
        }
        const currentCharCode = script.charCodeAt(i)
        lineCache.push(currentCharCode)
        const currentChar = script.charAt(i)
        lineText[linePointer++] = currentChar
        if (isArrayEqual(lineCache, currentSpaceLine)) {
            if (strlen(lineText.join("")) > SplitLimit) {
                //提示有过长段落
            }
            if (lineText.length > currentSingleSpaceLine.length) {//回车长度为2
                voidLineCounter = 0
                const { type, extra } = lineTypeJudger(lineText, currentSpaceLine, currentSingleSpaceLine)
                switch (type) {
                    case LINE_TYPE.monologue:
                        const res = monologueProcess(lineTextProcess(lineText, variables, currentSpaceLine, Charaters), currentSingleSpaceLine)
                        chapter = [...chapter, ...res]
                        chapterPointer += res.length
                        break;
                    case LINE_TYPE.command:
                        if (extra) {
                            chapter[chapterPointer++] = commandProcess(extra,backgrounds)
                        } else {
                            //warn invalid command
                        }
                        break;
                    default:
                        chapter[chapterPointer++] = lineTextProcess(lineText, variables, currentSpaceLine, Charaters)
                        break;
                }
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
function commandProcess(matchedRawLine: RegExpMatchArray,backgrounds:any): CommandLine {
    console.log(matchedRawLine)
    const command = matchedRawLine[1]
    const key = matchedRawLine[2]
    console.log(command, LINE_TYPE.command_SHOW_BACKGROUND)
    switch (command) {
        case LINE_TYPE.command_SHOW_BACKGROUND:
            return {
                command: LINE_TYPE.command_SHOW_BACKGROUND,
                param:backgrounds[key] as string
            }
        default:
            //warn：unKnowCommand
            return {
                command: LINE_TYPE.command,
                param: 'unKnowCommand'
            }
    }

}
function lineTypeJudger(lineText: string[], currentSpaceLine: number[], currentSingleSpaceLine: number[]) {
    const rawLine = lineText.join("")
    const actionReg = /(?<=\[)(\S+):(\S+)(?=\])/
    const isCommand = rawLine.match(actionReg)
    if (isCommand) {
        return { type: LINE_TYPE.command, extra: isCommand }
    }
    const isMonologue = lineText.find((v, i) => {
        if (i > 1 && i <= lineText.length - currentSpaceLine.length) {
            const enter = currentSingleSpaceLine.length === 1 ? [v.charCodeAt(0)] : [lineText[i - 1].charCodeAt(0), lineText[i].charCodeAt(0)]
            return isArrayEqual(enter, currentSingleSpaceLine)
        } else { return 0 }
    })
    if (isMonologue) { return { type: LINE_TYPE.monologue } }

    return { type: LINE_TYPE.raw }
}
function variableLoader(text: string, variables: any): string {
    const reg = /\$\{[^}]+\}/g
    const res = text.replace(reg, function (rs) {
        const key = rs.slice(2, rs.length - 1)
        return variables[key]
    })
    return res
}
function lineTextProcess(lineText: string[], variables: Object, currentSpaceLine: number[], Charaters: Charater[]): DisplayLine {
    const reg = /[/:|：]/g
    const rawLine = lineText.join("")
    const lineWithVariable = variableLoader(rawLine, variables)
    const haveComma = lineWithVariable.match(reg)
    if (haveComma) {//有冒号
        const res = lineWithVariable.split(haveComma[0])
        const textBeforeComma = res[0]
        const value = res[1]
        const charaterWithEmotion = emotionProcessor(filterSpace(textBeforeComma))
        const hitedCharater = Charaters.find(charater => {
            if (charaterWithEmotion.name === charater.name) {
                return true
            }
        })
        if (hitedCharater) {
            const res: DisplayLine = {
                type: LINE_TYPE.chat,
                name:hitedCharater.name,
                value,
                emotion: hitedCharater.images[charaterWithEmotion.emotionKey as any] as string
            }
            return res
        } else {
            return {
                type: LINE_TYPE.raw,
                value: lineWithVariable
            }
        }

    }
    return {
        type: LINE_TYPE.raw,
        value: rawLine.slice(0, rawLine.length - currentSpaceLine.length)//去掉两行空行
    }
}
function monologueProcess(line: DisplayLine, currentSingleSpaceLine: number[]): DisplayLine[] {
    let values = []
    const rawValue = line.value
    let rawValuePointer = 0
    for (let i = 1; i < line.value.length; i++) {
        const enter = currentSingleSpaceLine.length === 1 ? [rawValue.charCodeAt(i)] : [rawValue.charCodeAt(i - 1), rawValue.charCodeAt(i)]
        if (isArrayEqual(enter, currentSingleSpaceLine)) {
            const trimedValue = rawValue.slice(rawValuePointer, i).trim()
            if (trimedValue.length > 0) {
                values.push({
                    ...line,
                    value: trimedValue
                })
                rawValuePointer = i
            }
        }
    }
    return values
}
export default GameLoader