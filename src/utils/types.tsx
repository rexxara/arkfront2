export interface displayCharacter {
    name: string
    emotion: string
}

export interface CommandLine {
    command: string,
    param?: string | displayCharacter | selectedBGM
}
export interface selectedBGM {
    name: string,
    src: string
}
export interface DisplayLine {
    type: string,
    value: string,
    name?: string
    emotion?: string
}
export const NO_IMG = "不显示立绘"
export const LINE_TYPE = {
    raw: 'raw',
    spaceLine: 'spaceLine',
    chat: 'chat',
    monologue: 'monologue',
    comment: "comment",
    //comand
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
export interface Chapter {
    line: (CommandLine | DisplayLine)[]
    preLoadCharaters?: Object
    preLoadBackgrounds?: Object
    preLoadCgs?: Object
}
export interface Emotions {
    default: string
}
export interface Charater {
    images: Emotions
}
export interface Game {
    chapters: Chapter[]
}
export interface RawScript {
    charaters: Charater[],
    chapters: string[],
    variables: Object,
    backgrounds: Object,
    BGMs: Object,
    cgs: Object
}

export interface Charaters {
    any: Charater
}