import snowFall from './snowFall'
interface Effects{
    [arg:string]:any
}
const effects:Effects={
    snowFall: snowFall
}
export default effects