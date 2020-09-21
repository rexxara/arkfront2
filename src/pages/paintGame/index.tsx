import Abutton from '@/components/Abutton'
import { vh } from '@/utils/getSize'
import * as React from 'react'
import { useState } from 'react'
import Amessage from '@/components/AMessage'
import { message } from 'antd'
const bgStyle: React.CSSProperties = {
    background: 'white',
    height: vh(100)
}
const BtnArray = new Array(11).fill(1).map((v, i) => i * 10)
const PaintGame = () => {
    const [quizCount, setQuizCount] = useState(0)
    const [answerCount, setAnswerCount] = useState(0)
    const [successCount,setSuccessCount]=useState(0)
    const [gray, setGray] = useState(0);
    const gray255 = Math.floor(gray * 2.56)
    const antiGray = Math.abs(gray - 50) < 20 ? 255 : 255 - gray255
    const wrapedStyle: React.CSSProperties = {
        backgroundColor: `rgb(${gray255},${gray255},${gray255})`
    }
    const randomGray = () => {
        const newBg = (Math.random() * 11 | 0) * 10
        setGray(newBg)
        setQuizCount(quizCount + 1)
    }
    const answer = (num: number) => {
        if (num === gray) {
            const str = 'true' + num + "---------" + gray
            message.success(str)
            setSuccessCount(successCount+1)
        } else {
            const str = 'false' + num + "---------" + gray
            message.error(str)
        }
        setAnswerCount(answerCount + 1)
    }
    React.useEffect(() => {
        randomGray()
    }, [])
    return <div style={{ ...bgStyle, ...wrapedStyle }}>
        <div style={{backgroundColor:'white'}}>
            <h2>{successCount}/{answerCount}</h2>
            <h2>{((successCount/answerCount)*100).toFixed(2)}%</h2>
        {/* <h2>{gray}</h2>
        <h2>{gray255}</h2> */}
        </div>
        {quizCount === answerCount ? <Abutton onClick={randomGray}>随机</Abutton> : <div>
            {BtnArray.map(v => <Abutton
                style={{
                    backgroundColor: `rgb(${antiGray},${antiGray},${antiGray})`,
                    color: `rgb(${gray255},${gray255},${gray255})`
                }}
                key={v}
                onClick={() => { answer(v) }}>{v}</Abutton>)}
        </div>}
    </div>
}
export default PaintGame