import { DisplayCharacters, selectedBGM, LoadedChapterModel3, Option, RawScript, GameModel3, Input } from '../../utils/types'
import { SaveData } from './actions'
import { AudioBlob } from './component/ImgCache'
export type AudioCaches = {
    bgms: AudioBlob[],
    ses: AudioBlob[],
    cgs: string[]
}
export const TitleChapterNameIniValue = {
    chapterName: '',
    sectionName: '',
    total: 0,
    loaded: 0
}

export const iniState = {
    saveDataConOpen: false,
    auto: false,
    displayText: '',
    displayName: '',
    cacheDisplayLineText: '',
    cacheDisplayLineName: '',
    background: '',
    linePointer: 0,
    displaycharacters: {},
    rawLine: '',
    stop: false,
    bgm: { name: '', src: '' },
    cg: '',
    clickDisable: false,
    skipResourseCount: 0,
    narratorMode: undefined,
    choose: [],
    effectKey: '',
    soundEffect: '',
    TitleChapterName: TitleChapterNameIniValue,
    textAreaStop:true,
    input: {
        key: undefined,
        afterFix: () => "",
        id: ""
    },
    currentChapter: {
        line: [],
        name: '',
        next: '',
        preLoadCgs: {},
        preLoadBackgrounds: {},
        preLoadCharaters: {},
        arkMark: ''
    },
    audioCaches: {
        bgms: [],
        ses: [],
        cgs: []
    }
}

export interface IProps {
    data: GameModel3,
    RawScript: RawScript,
    isReview: boolean,
    LoadDataFromLoadPage: SaveData
}
export interface IState {
    saveDataConOpen: boolean,
    auto: boolean
    displayText: string
    displayName: string
    cacheDisplayLineText: string
    cacheDisplayLineName: string
    background: string
    linePointer: number
    displaycharacters: DisplayCharacters
    rawLine: string
    stop: boolean
    bgm: selectedBGM
    soundEffect: string
    textAreaStop:boolean
    cg: string
    narratorMode?: string[]
    clickDisable: boolean
    choose: Option[],
    gameVariables: any,
    currentChapter: LoadedChapterModel3
    skipResourseCount: number//这玩意我得解释一下。加载新的图片资源（立绘，cg，背景）都
    //是异步加载然后callback点击调用clickhandle的因为脚本里showCg啊这些是不算displayLine的 必须自动帮玩家跳过，。然后玩家手动点击
    //但是加载存档的时候也会加载图片，这时候自动调用clickHandle就会跳到下一行，react的setstate也会集中更新所以虽然加载好几个图片触发clickhandle却只是跳到下一行，
    //然后在没有任何资源的行保存就不会跳 所以就试着在加载的时候保存这个counter，在onload的时候读取，判断是否为0，为零就clickHandle，不为零就--
    //然后这个counter计算的时候，还得减去现在已经显示的资源数
    input: Input
    effectref?: any,
    effectKey: string
    TitleChapterName: TitleChapterName
    audioCaches: AudioCaches
}
export interface TitleChapterName {
    chapterName: string
    sectionName: string
    out?: boolean
    total: number
    loaded: number
}
export interface clickHandleConfig {
    reset?: boolean
    plusOne?: boolean
}
