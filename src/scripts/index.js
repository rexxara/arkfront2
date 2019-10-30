
import chapter1 from './chapter1.mi'
import chapter2 from './chapter2.mi'


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

const charaters=[{
    name:'临光',
    images:
        {
            default:'char_148_nearl_1.png.merge.png',
            笑:"char_148_nearl_2.png.merge.png",
            不笑:"char_148_nearl_9.png.merge.png"
        }
},{
    name:'塔露拉',
    images:{
        default:'char_011_talula_1.png.merge.png',
        死妈脸:'char_011_talula_2.png.merge.png',
        气急败坏:'char_011_talula_2.png.merge.png',
    }
}]
const chapters=[chapter1]
const variables={
    userName:"rexxara"
}
const backgrounds={
    大街:'bg_abyss_1.png',
    龙门:"bg_lungmen_m.png",
}

const cgs={}

export default {
    charaters,
    chapters,
    variables,
    backgrounds
}