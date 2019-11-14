import {
    DisplayLine, CommandLine,
    RawScript, LINE_TYPE, NO_IMG, Chapter,
    CGS, BGMs, Backgrounds, Characters,
    PreLoadCharaters, PreLoadCgs, PreLoadBackgrounds, Game, ChapterWithSection
} from './types'
import { strlen, emotionProcessor, filterSpace, b64_to_utf8, isArrayEqual } from './utils'
const ALLOW_MAX_SPACE_LINE = 4
const SplitLimit = 66 * 4
const CRLF = [13, 10]
const LF = [10]



function charatersPreProcess(characters: Characters) {
    for (const key in characters) {
        if (characters.hasOwnProperty(key)) {
            const character = characters[key]
            character.images.none = NO_IMG
        }
    }
    return characters
}
const main = (rawScript: RawScript, needDecode: boolean, IsCRLF: boolean) => {
    const { chapters, variables, backgrounds, BGMs, cgs } = rawScript
    const charaters = charatersPreProcess(rawScript.charaters)
    const { newChapterModel } = rawScript
    let res: Game = { chapters: {}, total: 0 }
    let chapterIndex = 1;
    for (const key in newChapterModel) {
        if (newChapterModel.hasOwnProperty(key)) {
            const chapter = newChapterModel[key]
            res.chapters[key]={}
            if (typeof chapter === 'string') {
                res.chapters[key] = ChapterLoader(needDecode ?
                    b64_to_utf8(chapter.slice("data:;base64,".length)) : chapter, variables, IsCRLF, charaters, backgrounds, BGMs, cgs)
            } else if (typeof chapter === 'object') {
                let sectionIndex = 1
                for (const sectionKey in chapter) {
                    if (chapter.hasOwnProperty(sectionKey)) {
                        const sectionString = chapter[sectionKey] as unknown as string
                        const kkk = res.chapters[key] as unknown as ChapterWithSection
                        kkk.section[sectionKey] = ChapterLoader(needDecode ?
                            b64_to_utf8(sectionString.slice("data:;base64,".length)) : sectionString, variables, IsCRLF, charaters, backgrounds, BGMs, cgs)
                        kkk[sectionKey].index = sectionIndex
                        kkk[sectionKey].name = sectionKey
                        sectionIndex++
                    }
                }
            }
            res.chapters[key].index = chapterIndex
            res.chapters[key].name = key
            chapterIndex++
        }
    }
    res.total = chapterIndex - 1
    console.log(res)
    return res
}


function ChapterLoader(script: string, variables: Object, IsCRLF: boolean, Charaters: Characters, backgrounds: Backgrounds, BGMs: BGMs, cgs: CGS): Chapter {
    let chapter: (DisplayLine | CommandLine)[] = []
    let lineText: string[] = []
    let chapterPointer = 0
    let linePointer = 0
    let voidLineCounter = 0
    let preLoadBackgrounds = {}
    let preLoadCgs = {}
    let preLoadCharaters = {}
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
            const lineStr = lineText.join("")
            if (strlen(lineStr) > SplitLimit) {
                //提示有过长段落
            }
            if (lineText.length > currentSingleSpaceLine.length) {//回车长度为2
                voidLineCounter = 0
                const { type, extra } = lineTypeJudger(lineText, currentSpaceLine, currentSingleSpaceLine)
                switch (type) {
                    case LINE_TYPE.monologue:
                        const res = monologueProcess(lineTextProcess(lineText, variables, currentSpaceLine, Charaters, preLoadCharaters), currentSingleSpaceLine)
                        chapter = [...chapter, ...res]
                        chapterPointer += res.length
                        break;
                    case LINE_TYPE.command:
                        if (extra) {
                            chapter[chapterPointer++] = commandProcess(extra, backgrounds, Charaters, BGMs, cgs, preLoadBackgrounds, preLoadCgs, preLoadCharaters)
                        } else {
                            throw new Error(lineStr)
                        }
                        break;
                    case LINE_TYPE.comment:
                        break;
                    default:
                        chapter[chapterPointer++] = lineTextProcess(lineText, variables, currentSpaceLine, Charaters, preLoadCharaters)
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
    return { line: chapter, preLoadBackgrounds, preLoadCharaters, preLoadCgs }
}
function commandProcess(matchedRawLine: RegExpMatchArray, backgrounds: Backgrounds, Charaters: Characters, BGMs: BGMs, cgs: CGS, preLoadBackgrounds: PreLoadBackgrounds, preLoadCgs: PreLoadCgs, preLoadCharaters: PreLoadCharaters): CommandLine {
    const [command, key] = matchedRawLine[1].split(":")

    switch (command) {
        case LINE_TYPE.command_SHOW_BACKGROUND:
            if (backgrounds[key]) {
                preLoadBackgrounds[key] = backgrounds[key]
                return {
                    command: LINE_TYPE.command_SHOW_BACKGROUND,
                    param: backgrounds[key] as string
                }
            } else {
                throw new Error(`background ${key} isn't registered`)
            }
        case LINE_TYPE.command_LEAVE_CHARATER:
            return {
                command: LINE_TYPE.command_LEAVE_CHARATER,
                param: key as string
            }
        case LINE_TYPE.command_REMOVE_BACKGROUND:
            return {
                command: LINE_TYPE.command_REMOVE_BACKGROUND
            }
        case LINE_TYPE.command_ENTER_CHARATER:
            const characterName = emotionProcessor(key)
            const character = Charaters[characterName.name]
            if (character) {
                const emotion = character.images[characterName.emotionKey]
                if (emotion) {
                    if (!preLoadCharaters[characterName.name]) {
                        preLoadCharaters[characterName.name] = []
                    }
                    if (!preLoadCharaters[characterName.name].find(v => v === emotion)) {
                        preLoadCharaters[characterName.name] = [...preLoadCharaters[characterName.name], emotion]
                    }
                    return {
                        command: LINE_TYPE.command_ENTER_CHARATER,
                        param: {
                            name: characterName.name,
                            emotion: emotion
                        }
                    }
                } else {
                    throw new Error(`Charater ${characterName.name}'s emotion ${characterName.emotionKey}  isn't registered`)
                }
            } else {
                throw new Error(`Charater ${characterName.name} isn't registered`)
            }
        case LINE_TYPE.command_PLAY_BGM:
            if (BGMs[key]) {
                return {
                    command: LINE_TYPE.command_PLAY_BGM,
                    param: {
                        name: key,
                        src: BGMs[key] as string
                    }
                }
            } else {
                throw new Error(`BGM ${key} isn't registered`)
            }
        case LINE_TYPE.command_PAUSE_BGM:
            return {
                command: LINE_TYPE.command_PAUSE_BGM
            }
        case LINE_TYPE.command_RESUME_BGM:
            return {
                command: LINE_TYPE.command_RESUME_BGM
            }
        case LINE_TYPE.command_SHOW_CG:
            if (cgs[key]) {
                preLoadCgs[key] = cgs[key]
                return {
                    command: LINE_TYPE.command_SHOW_CG,
                    param: cgs[key]
                }
            } else {
                throw new Error(`CG ${key} isn't registered`)
            }
        case LINE_TYPE.command_REMOVE_CG:
            return {
                command: LINE_TYPE.command_REMOVE_CG
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
    const actionReg = /(?<!\/\/)\[(.*)\]/
    const commentReg = /\/\//
    if (rawLine.match(commentReg)) {
        return { type: LINE_TYPE.comment }
    }
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
// function variableLoader(text: string, variables: Object): string {
//     const reg = /\$\{[^}]+\}/g
//     const res = text.replace(reg, function (rs) {
//         const key = rs.slice(2, rs.length - 1)
//         return variables[key]
//     })
//     return res
// }
function lineTextProcess(lineText: string[], variables: Object, currentSpaceLine: number[], Charaters: Characters, preLoadCharaters: PreLoadCharaters): DisplayLine {
    const reg = /[/:|：]/g
    const rawLine = lineText.join("")
    // const lineWithVariable = variableLoader(rawLine, variables)
    const lineWithVariable = rawLine
    const haveComma = lineWithVariable.match(reg)
    if (haveComma) {//有冒号
        const res = lineWithVariable.split(haveComma[0])
        const textBeforeComma = res[0]
        const value = res[1]
        const characterName = emotionProcessor(filterSpace(textBeforeComma))
        const hitedCharater = Charaters[characterName.name]
        if (hitedCharater) {
            const emotion = hitedCharater.images[characterName.emotionKey] as string
            if (emotion !== NO_IMG) {
                if (!preLoadCharaters[characterName.name]) {
                    preLoadCharaters[characterName.name] = []
                }
                if (!preLoadCharaters[characterName.name].find(v => v === emotion)) {
                    preLoadCharaters[characterName.name] = [...preLoadCharaters[characterName.name], emotion]
                }
            }
            const res: DisplayLine = {
                type: LINE_TYPE.chat,
                name: characterName.name,
                value,
                emotion
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
export default main