
import chapter1 from './chapter1.mi'
import chapter2 from './chapter2.mi'
import chapter3_section1 from './chapter3/section1.mi'
import chapter3_section2 from './chapter3/section2.mi'
import chapter3_section3 from './chapter3/section3.mi'
import chapter3_section4 from './chapter3/section4.mi'
import chapter3_section5 from './chapter3/section5.mi'
import chapter3_section6 from './chapter3/section6.mi'

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
        不痛不痒选项A: chapter3_section2,
        不痛不痒选项B: chapter3_section3,
        中间的一段: chapter3_section4,
        正常主线C: chapter3_section6,
        选了就暴毙D: chapter3_section5,
    }
}
const chooses = {
    第三章选择A: [{
        text: '女主好感+1',
        command:'[plus]',
        callback: (execCommand, variables) => {
            console.log('AAAAAAAAAAAAAAA')
            //execCommand('[toSection:不痛不痒选项A]')
            return { ...variables, 女主好感度: variables.女主好感度 + 1 }
        }
    }, {
        text: '女主好感-1',
        callback: (execCommand, variables) => {
            console.log('BBBBBB')
            //execCommand('[toSection:不痛不痒选项B]')
            return { ...variables, 女主好感度: variables.女主好感度 - 1 }
        }
    }]
}
const variables = {
    女主好感度: 233
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
    HE1: 'avg_11_1.png'
}

export default {
    charaters,
    variables,
    backgrounds,
    BGMs,
    cgs,
    newChapterModel,
    chooses
}