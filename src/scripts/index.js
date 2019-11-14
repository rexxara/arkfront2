
import chapter1 from './chapter1.mi'
import chapter2 from './chapter2.mi'
import chapter3_section1 from './chapter3/section1.mi'
import chapter3_section2 from './chapter3/section2.mi'
import chapter3_section3 from './chapter3/section3.mi'

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
const chapters = [chapter1, chapter2]
const newChapterModel = {
    chapter1,
    chapter2,
    chapter3: {
        日常: chapter3_section1,
        选了A: chapter3_section2,
        选了B: chapter3_section3
    },
    chapter4: {
        chapter3_section1: chapter3_section1,
        chapter3_section2: chapter3_section2,
        chapter3_section3: chapter3_section3
    }
}
const variables = {
    userName: "rexxara"
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
    HE1: 'TIM图片20190918160845.jpg'
}

export default {
    charaters,
    chapters,
    variables,
    backgrounds,
    BGMs,
    cgs,
    newChapterModel
}