import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface IProps {
}
interface IState {
}

interface messageArray {
    key: number,
    text: string
}
let messageId = 0
let outerSetMessageList: any = () => { }
const con = document.createElement("div")
con.className = "AMessageCon"
document.body.appendChild(con)
function removeMessage(messageId: number): void {
    outerSetMessageList((array: messageArray[]) => array.filter((v: messageArray, k) => v.key !== messageId))
}

const AMessage = () => {
    ReactDOM.render(<MessageCon />, con)
    const createMessage = (type: string, text: string) => {
        // console.log(type, "123", text)
        console.log(messageId)
        setTimeout(removeMessage.bind(null,messageId), 2000)
        outerSetMessageList((array: messageArray[]) => [...array, { text: text, key: messageId++ }])
    }
    return {
        "info": (text: string) => createMessage('info', text)
    }
}

const MessageCon: React.FC = () => {
    const [messageList, setMessageList] = useState([])
    outerSetMessageList = setMessageList
    return <div style={{position:"fixed",top:0,left:0,background:"AAAAAA"}} className="messageCon">
        {messageList.map((v: messageArray, k) => {
            return <p key={k}>{v.text}</p>
        })}
    </div>
}

export default AMessage()