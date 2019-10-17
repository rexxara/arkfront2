
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
    name:'紫',
    images:
        {
            default:'不笑.jpg',
            笑:"笑.jpg",
            不笑:"笑.jpg"
        }
},{
    name:'孙笑川',
    images:{
        default:'sml.jpg',
        死妈脸:'sml.jpg',
        气急败坏:'qjbh.gif',
    }
}]
const chapters=[chapter1,chapter2]
const variables={
    userName:"rexxara"
}
export default {
    charaters,
    chapters,
    variables
}