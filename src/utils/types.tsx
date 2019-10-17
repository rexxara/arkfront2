

export interface Line {
    type: string,
    value: string,
    charater?:Charater
    emotion?:String
}
export const LINE_TYPE ={
    raw:'raw',
    spaceLine:'spaceLine',
    chat:'chat'
}
export type Chapter =Line[]

export interface Charater{
    name:string,
    images:Object[]
}
export interface Game{
    charaters:Charater[],
    chapters:Chapter[]
}
export interface RawScript{
    charaters:Charater[],
    chapters:string[],
    variables:Object
}