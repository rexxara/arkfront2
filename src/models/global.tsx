import { b64_to_utf8 } from '../utils/loader'
import script from '../scripts/index'
const initalState = {
    script: b64_to_utf8(script.chapters[0].slice("data:;base64,".length)),
    edited: false
}
console.log(initalState)
export default {
    namespace: 'global',
    state: initalState,
    reducers: {
        'submitScript'(state: globalState, { payload }: any) {
            setTimeout(() => {
                window.reset()
            }, 200);
            return { ...state, script: payload.script, edited: payload.edited }
        },
    },
};
interface globalState {
    script: string
}