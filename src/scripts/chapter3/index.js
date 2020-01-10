
import chapter3_section1 from './section1.mi'
import chapter3_section2_1 from './section2.mi'
import chapter3_section2_2 from './section3.mi'
import chapter3_section3 from './section4.mi'
import chapter3_section4_1 from './section5.mi'
import chapter3_section4_2 from './section6.mi'

const ch3 = [
    {
        name: 'chapter3_section1', script: chapter3_section1, next: [
            { text: '去音乐会', jumpKey: 'chapter3_section2_1', disable: ({ 女主好感度 }) => 女主好感度 < 1 },
            { text: '去新年参拜', jumpKey: 'chapter3_section2_2' }
        ]
    },
    { name: 'chapter3_section2_1', script: chapter3_section2_1, next: 'chapter3_section3' },
    { name: 'chapter3_section2_2', script: chapter3_section2_2, next: 'chapter3_section3' },
    { name: 'chapter3_section3', script: chapter3_section3, next: ({ 女主好感度 }) => 女主好感度 > 1 ? 'chapter3_section4_1' : 'chapter3_section4_2' },
    { name: 'chapter3_section4_1', script: chapter3_section4_1, isEnd: true },
    { name: 'chapter3_section4_2', script: chapter3_section4_2, isEnd: true }
]
export default ch3