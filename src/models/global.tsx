import RawScript from '../scripts/index'
const initalState = {
    script: '',
    edited: false,
    test: 'test',
    isAuto: false,
    //
    RawScript: RawScript,
    isReview: false
}
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
        'start'(state: globalState, { payload }: any) {
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/mainGame'
            }, 0)
            return initalState
        },
        'reviewScence'(state: globalState, { payload }: any) {
            const script = payload.script.map((v, i: number) => {
                if (i === 0) {
                    return { ...v, isBegin: true }
                }
                if (i === payload.script.length - 1) {
                    return { ...v, next: null }
                }
                return v
            })
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/mainGame'
            }, 0)
            const newConbine = { ...RawScript, chapters: script }
            return { ...state, RawScript: newConbine, isReview: true }
        },
    },
};
interface globalState {
    script: string
    isAuto: boolean
}