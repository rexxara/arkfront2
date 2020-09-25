import RawScript from '../scripts/index'
const initalState = {
    script: '',
    edited: false,
    test: 'test',
    isAuto: false,
    //
    RawScript: RawScript,
    isReview: false,
    LoadDataFromLoadPage: undefined
}
export default {
    namespace: 'global',
    state: initalState,
    reducers: {
        // 'submitScript'(state: globalState, { payload }: any) {
        //     setTimeout(() => {
        //         window.reset()
        //     }, 200)
        //     return { ...state, script: payload.script, edited: payload.edited }
        // },
        'start'(state: globalState, { payload }: any) {
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/mainGame'
            }, 0)
            return initalState
        },
        'load'(state: globalState, { payload }: any) {
            console.log(payload)
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/mainGame'
            }, 0)
            return { ...initalState, LoadDataFromLoadPage: payload }
        },
        'reviewScence'(state: globalState, { payload }: any) {
            const script = payload.script.map((v:any, i: number) => {
                if (i === 0) {
                    return { ...v, isBegin: true }
                }
                return v
            })
            setTimeout(() => {
                const { origin } = window.location
                window.location.href = origin + '#/mainGame'
            }, 0)
            const newConbine = { ...RawScript, chapters: {chapter1:script} }
            console.log(newConbine)
            return { ...state, RawScript: newConbine, isReview: true }
        },
    },
};
interface globalState {
    script: string
    isAuto: boolean
}