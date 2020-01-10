
import chapter1 from './chapter1.mi'
import taluladezhengyiyanjiang from './taluladezhengyiyanjiang.mi'
import chapter1_a from './a.mi'
const ch1 = [
    { name: 'chapter1', script: chapter1, next: '塔露拉的正义演讲', isBegin: true },
    { name: '塔露拉的正义演讲', script: taluladezhengyiyanjiang, next: ({ 思考结果 }) => 思考结果 > 1 ? '哎给楼' : '奥利给' },
    { name: '奥利给', script: chapter1_a, next: 'chapter2' }
]
export default ch1