
export const NO_IMG = "不显示立绘"
export const LINE_TYPE = {
    raw: 'raw',
    spaceLine: 'spaceLine',
    chat: 'chat',
    monologue: 'monologue',
    comment: "comment",
    command: 'command',
    command_SHOW_BACKGROUND: 'showbg',
    command_LEAVE_CHARATER: 'leave',
    command_ENTER_CHARATER: 'showCh',
    command_PLAY_BGM: 'playBgm',
    command_PAUSE_BGM: 'pauseBgm',
    command_RESUME_BGM: 'resumeBgm',
    command_REMOVE_BACKGROUND: 'removeBg',
    command_SHOW_CG: 'showCg',
    command_REMOVE_CG: 'removeCg'
}

export interface Game{
    chapters:NewChapters,
    total:number
}
export interface NewChapters {
    [arg: string]: (Chapter | ChapterWithSection)
}

export interface ChapterWithSection {
    [arg: string]: Chapter
}
export interface Chapter {
    line?: (CommandLine | DisplayLine)[]
    preLoadCharaters?: PreLoadCharaters
    preLoadBackgrounds?: PreLoadBackgrounds
    preLoadCgs?: PreLoadCgs,
    name?:string,
    index?:number
    sections?:ChapterWithSection,
    total?:number
}

export interface PreLoadCharaters {
    [arg: string]: string[]
}

export interface PreLoadCgs {
    [arg: string]: string
}

export interface PreLoadBackgrounds {
    [arg: string]: string
}
export interface DisplayLine {
    type: string,
    value: string,
    name?: string
    emotion?: string
}
export interface CommandLine {
    command: string,
    param?: string | displayCharacter | selectedBGM
}
export interface DisplayCharacters {
    [arg: string]: displayCharacter
}
export interface displayCharacter {
    name: string
    emotion: string
}

export interface selectedBGM {
    name: string,
    src: string
}
export interface Emotions {
    default: string,
    [arg: string]: string
}
export interface Charater {
    images: Emotions
}
export interface Characters {
    [arg: string]: Charater
}
/////////before load////
export interface RawScript {
    charaters: Characters,
    chapters: string[],
    variables: Object,
    backgrounds: Backgrounds,
    BGMs: BGMs,
    cgs: CGS,
    newChapterModel: NewChapterModel
}
export interface NewChapterModel {
    [arg: string]: string | SectionString
}
export interface SectionString {
    [arg: string]: string
}
export interface CGS {
    [arg: string]: string
}
export interface BGMs {
    [arg: string]: string
}
export interface Backgrounds {
    [arg: string]: string
}