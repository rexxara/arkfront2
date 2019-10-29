

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
export const LINE_TYPE = {
    raw: 'raw',
    spaceLine: 'spaceLine',
    chat: 'chat',
    monologue: 'monologue',
    //comand
    command: 'command',
    command_SHOW_BACKGROUND:'showbg'
}
export type Chapter =Line[]

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
