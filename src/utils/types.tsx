

export interface CommandLine {
    command:string,
    param:string
}
export interface DisplayLine{
    type: string,
    value: string,
    name?:string
    emotion?:string

}
export const NO_IMG="不显示立绘"
export const LINE_TYPE = {
    raw: 'raw',
    spaceLine: 'spaceLine',
    chat: 'chat',
    monologue: 'monologue',
    //comand
    command: 'command',
    command_SHOW_BACKGROUND:'showbg',
    command_LEAVE_CHARATER:'leave'
}
export type Chapter =(CommandLine|DisplayLine)[]

export interface Charater{
    name:string,
    images:Object[]
}
export interface Game{
    charaters:Charater[],
    chapters:Chapter[],
    backgrounds:Object,
}
export interface RawScript{
    charaters:Charater[],
    chapters:string[],
    variables:Object,
    backgrounds:Object
}
