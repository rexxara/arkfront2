import { DisplayCharacters, CommandLine, LINE_TYPE, displayCharacter, CGParama } from '../../utils/types'
import effects from './effects'
import action from './actions'
import _omit from 'lodash/omit'
interface Depdence {
    background: string,
    displaycharacters: DisplayCharacters,
    cg: string,
    effectref: any
    effectCanvasId: string
}
export const commandLineHandle = (command: CommandLine, { background, displaycharacters, cg, effectref, effectCanvasId }: Depdence) => {
    const ARKBGM = document.getElementById('ARKBGM') as HTMLAudioElement
    let newParam = {}
    let needLoadImg = false
    let needStop = false
    let delayTime = 0
    switch (command.command) {
        case LINE_TYPE.COMMAND_SHOW_BACKGROUND:
            needLoadImg = background !== command.param
            if (needLoadImg) {
                newParam = { background: command.param }
            }
            break
        case LINE_TYPE.COMMAND_LEAVE_CHARATER:
            newParam = { displaycharacters: _omit(displaycharacters, [command.param as string]) }
            break
        case LINE_TYPE.COMMAND_ENTER_CHARATER:
            const hitedCharater = displaycharacters[(command.param as displayCharacter).name]
            if (hitedCharater) {
                needLoadImg = hitedCharater.emotion !== (command.param as displayCharacter).emotion//有人表情不一样
            } else { needLoadImg = true }//没人
            newParam = {
                displaycharacters: { ...displaycharacters, [(command.param as displayCharacter).name]: command.param },
                cacheDisplayLineName: '',
                cacheDisplayLineText: ''
            }
            break
        case LINE_TYPE.COMMAND_PLAY_BGM:
            newParam = { bgm: command.param }
            break
        case LINE_TYPE.COMMAND_REMOVE_BACKGROUND:
            newParam = { background: '' }
        case LINE_TYPE.COMMAND_PAUSE_BGM:
            if (ARKBGM) { ARKBGM.pause() } else { throw new Error('bgmNotFound') }
            break
        case LINE_TYPE.COMMAND_RESUME_BGM:
            if (ARKBGM) { ARKBGM.play() } else { throw new Error('bgmNotFound') }
            break
        case LINE_TYPE.COMMAND_SHOW_CG:
            const params = command.param as CGParama
            needLoadImg = cg !== params.src
            if (needLoadImg) {
                action.unlockCg(params.cgName)
                newParam = { cg: params.src }
            }
            break
        case LINE_TYPE.COMMAND_REMOVE_CG:
            newParam = { cg: '', displaycharacters: [] }
            break
        case LINE_TYPE.COMMAND_SHOW_CHOOSE:
            needStop = true
            newParam = { choose: command.param, clickDisable: true }
            break
        case LINE_TYPE.COMMAND_SHOW_INPUT:
            needStop = true
            newParam = { input: command.param, clickDisable: true }
            break
        case LINE_TYPE.COMMAND_SHOW_EFFECT:
            console.log(command)
            newParam = { effectKey: command.param, effectref: effects[command.param as string](effectCanvasId) }
            break
        case LINE_TYPE.COMMAND_REMOVE_EFFECT:
            if (effectref) {
                effectref.stop()
            } else {
                console.log('effectRefNotfound')
            }
            newParam = { effectKey: '' }
            break
        case LINE_TYPE.COMMAND_SHOW_SOUND_EFFECT:
            newParam = { soundEffect: command.param }
            break
        case LINE_TYPE.COMMAND_DELAY:
            needStop = true
            newParam = { clickDisable: true }
            if (typeof command.param === 'number') {
                delayTime = command.param
            }
        default://'invalidCommand')
            break
    }
    return { newParam, needLoadImg, needStop, delayTime }
}
