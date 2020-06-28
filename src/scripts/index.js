
import chapter1 from './chapter1/index'
import chapter2 from './chapter2.mi'
import chapter3 from './chapter3/index'
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

const chapters = {
    chapter1: chapter1,
    chapter2: [{ name: 'chapter2', script: chapter2, next: 'chapter3_section1' }],
    chapter3: chapter3
}
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
    }],
    塔露拉的思考: [
        {
            text: '奥利给！！！', callback: (execCommand, variables) => {
                return { ...variables, 思考结果: '奥利给！！！' }
            }
        },
        {
            text: '哎给喽！！！', callback: (execCommand, variables) => {
                return { ...variables, 思考结果: '哎给喽！！！' }
            }
        }
    ]
}
const variables = {
    女主好感度: 1,
    adminName:'rexxara'
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
    HE3: 'avg_01.png',
    set1: {
        a: 'set1/avg_40_1.png',
        b: 'set1/avg_40_2.png',
        c: 'set1/avg_40_3.png'
    },
    test: {
        1: 'test/1.png',
        2: 'test/2.png',
        3: 'test/3.png',
        4: 'test/4.png',
        5: 'test/5.png',
    }
}
const soundEffects = {
    eff1: 'eff01.mp3'
}
const scences = [
    {
        塔露拉的正义演讲: { script: [chapter1[1], chapter1[2]], cover: cgs.HE1 },
    },//一页一个对象
    {
        白色相簿2: { script: chapter3, cover: cgs.set1.a }
    }
]
export default {
    charaters,
    variables,
    backgrounds,
    BGMs,
    cgs,
    chooses,
    chapters,
    inputs,
    scences,
    soundEffects
}