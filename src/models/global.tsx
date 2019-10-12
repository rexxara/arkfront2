import { b64_to_utf8 } from '../utils/loader'
import script from '../scripts/index'
const initalState = {
    script: b64_to_utf8(script.chapters[0].slice("data:;base64,".length)),
    edited: false,
    test:'test',
    ////
    isAuto:false,
}
console.log(initalState)
export default {
    namespace: 'global',
    state: initalState,
    reducers: {
        'submitScript'(state: globalState, { payload }: any) {
            setTimeout(() => {
                window.reset()
            }, 200)
            return { ...state, script: payload.script, edited: payload.edited }
        },
        'nextChapter'(state: globalState, { payload }: any) {
            console.log('nextChapter')
            return { ...state,}
        },
        'toggleAuto'(state: globalState, { payload }: any) {
            console.log('toggleAuto')
            return { ...state,isAuto:!state.isAuto}
        },
    },
};
interface globalState {
    script: string
    isAuto:boolean
}