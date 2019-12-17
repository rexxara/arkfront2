
import chapter1 from './chapter1.mi'
import chapter2 from './chapter2.mi'
import chapter3_section1 from './chapter3/section1.mi'
import chapter3_section2_1 from './chapter3/section2.mi'
import chapter3_section2_2 from './chapter3/section3.mi'
import chapter3_section3 from './chapter3/section4.mi'
import chapter3_section4_1 from './chapter3/section5.mi'
import chapter3_section4_2 from './chapter3/section6.mi'

// 　　第一章　Greengreen

// 　　第二章　萤火虫之光

// 　　第三章　Partial Recall

// 　　第四章　一片空白

// 　　第五章　hero

// 　　第六章　 heroine

// 　　第七章　祈祷

// 　　第八章　重奏

// 　　第九章　讲述故事之人

// 　　第十章　boy meets girl

// 　　第十一章　你的故事

// 　　第十二章　我的话

const charaters = {
    临光: {
        images:
        {
            default: 'char_148_nearl_1.png.merge.png',
            笑: "char_148_nearl_2.png.merge.png",
            不笑: "char_148_nearl_9.png.merge.png"
        }
    },
    塔露拉: {
        images: {
            default: 'char_011_talula_1.png.merge.png',
            死妈脸: 'char_011_talula_2.png.merge.png',
            气急败坏: 'char_011_talula_2.png.merge.png',
        }
    }
}
const newChapterModel = {
    chapter3: {
        日常: chapter3_section1,
        不痛不痒选项A: chapter3_section2_1,
        不痛不痒选项B: chapter3_section2_2,
        中间的一段: chapter3_section3,
        正常主线C: chapter3_section4_1,
        选了就暴毙D: chapter3_section4_2,
    }
}
//next:string(下一章的key),array[选项]，null结局 function=>string|null|array
const chapters = [
    { name: 'chapter1', script: chapter1, next: 'chapter2', isBegin: true },
    { name: 'chapter2', script: chapter2, next: 'chapter3_section1' },
    {
        name: 'chapter3_section1', script: chapter3_section1, next: [
            { text: '去音乐会', jumpKey: 'chapter3_section2_1', disable: ({ 女主好感度 }) => 女主好感度 < 1 },
            { text: '去新年参拜', jumpKey: 'chapter3_section2_2' }
        ]
    },
    { name: 'chapter3_section2_1', script: chapter3_section2_1, next: 'chapter3_section3' },
    { name: 'chapter3_section2_2', script: chapter3_section2_2, next: 'chapter3_section3' },
    { name: 'chapter3_section3', script: chapter3_section3, next: ({ 女主好感度 }) => 女主好感度 > 1 ? 'chapter3_section4_1' : 'chapter3_section4_2' },
    { name: 'chapter3_section4_1', script: chapter3_section4_1 },
    { name: 'chapter3_section4_2', script: chapter3_section4_2 },
]
const inputs = {
    第一章输入姓名: {
        key: 'userName',
        afterFix: (string) => '傻逼' + string
    }
}
const chooses = {
    第三章选择A: [{
        text: '冬马好感+1',
        callback: (execCommand, variables) => {
            return { ...variables, 女主好感度: variables.女主好感度 + 1 }
        }
    }, {
        text: '冬马好感-1',
        callback: (execCommand, variables) => {
            return { ...variables, 女主好感度: variables.女主好感度 - 1 }
        }
    }],
    第三章选择B: [{
        text: 'playBgm:無花果',
        callback: (execCommand, variables) => {
            execCommand('[playBgm:無花果]')
        }
    }, {
        text: 'playBgm:晴天前夜',
        callback: (execCommand, variables) => {
            execCommand('[playBgm:晴天前夜]')
        }
    }]
}
const variables = {
    女主好感度: 1
}
const backgrounds = {
    大街: 'bg_abyss_1.png',
    龙门: "bg_lungmen_m.png",
}
const BGMs = {
    無花果: 'ウォルピスカーター - 無花果.mp3',
    晴天前夜: 'ウォルピスカーター - 晴天前夜.mp3'
}

const cgs = {
    HE1: 'avg_11_1.png',
    HE2: 'avg_01.png',
    set1: {
        a: 'set1/avg_40_1.png',
        b: 'set1/avg_40_3.png',
        c: 'set1/avg_40_2.png'
    }
}

export default {
    charaters,
    variables,
    backgrounds,
    BGMs,
    cgs,
    newChapterModel,
    chooses,
    chapters,
    inputs
}