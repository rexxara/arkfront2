

export interface Line {
    type: string,
    value: string,
    owner?:string
}
export const LINE_TYPE ={
    raw:'raw',
    spaceLine:'spaceLine',
    chat:'chat'
}
export type Chapter =Line[]

export interface charater{
    name:string
}
export interface Game{
    charaters:charater[],
    chapters:Chapter[]
}
export interface RawScript{
    charaters:charater[],
    chapters:string[],
    variables:Object
}