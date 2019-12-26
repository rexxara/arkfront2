
export const NO_IMG = "不显示立绘"
export const LINE_TYPE = {
    raw: 'raw',
    spaceLine: 'spaceLine',
    chat: 'chat',
    monologue: 'monologue',
    comment: "comment",
    command: 'command',
    COMMAND_SHOW_BACKGROUND: 'showBg',
    COMMAND_LEAVE_CHARATER: 'leave',
    COMMAND_ENTER_CHARATER: 'showCh',
    COMMAND_PLAY_BGM: 'playBgm',
    COMMAND_PAUSE_BGM: 'pauseBgm',
    COMMAND_RESUME_BGM: 'resumeBgm',
    COMMAND_REMOVE_BACKGROUND: 'removeBg',
    COMMAND_SHOW_CG: 'showCg',
    COMMAND_REMOVE_CG: 'removeCg',
    COMMAND_SHOW_CHOOSE: 'showChoose',
    COMMAND_SHOW_INPUT: 'showInput',
    COMMAND_SHOW_EFFECT: 'showEffect',
    COMMAND_REMOVE_EFFECT: 'removeEffect',
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
    param?: string | displayCharacter | selectedBGM | Option[] | Input|CGParama
}
export interface CGParama{
    cgName:string,
    src:string
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
    chapters: ChapterModel3[],
    variables: Object,
    backgrounds: Backgrounds,
    BGMs: BGMs,
    cgs: CGS,
    chooses: Chooses,
    inputs: Inputs,
    scences:Array<ScencesPage>
}

export interface ScencesPage{
    [arg:string]:ScenceModal
}
export interface ScenceModal{
    script:ChapterModel3,
    cover:string
}
export interface GameModel3 {
    chapters: LoadedChapterModel3[]
}
export interface LoadedChapterModel3 {
    line: (CommandLine | DisplayLine)[]
    preLoadCharaters: PreLoadCharaters
    preLoadBackgrounds: PreLoadBackgrounds
    preLoadCgs: PreLoadCgs,
    name: string,
    next?: string | Function | JumpOption[],
    isBegin?: boolean
}
export interface ChapterModel3 {
    name: string,
    script: string,
    next?: string | Function | undefined | JumpOption[],
    isBegin?: boolean
}
export interface JumpOption {
    text: string,
    jumpKey: string,
    disable?: () => boolean
}

export interface CGS {
    [arg: string]: string | {
        [arg: string]: string
    }
}
export interface BGMs {
    [arg: string]: string
}
export interface Backgrounds {
    [arg: string]: string
}
export interface Chooses {
    [arg: string]: Option[]
}
export interface Inputs {
    [arg: string]: Input
}
export interface Input {
    key: string | undefined,
    afterFix: (string: string) => string,
    id?: string
}
export interface Option {
    text: string,
    chooseKey?: string,
    callback?: Function,
    jumpKey?: string,
    disable?: (variables: any) => boolean
}