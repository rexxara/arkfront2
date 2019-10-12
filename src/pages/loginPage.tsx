import React, { useEffect, useState } from 'react';
import Scence from '../components/scence'
import loginPage from '../assets/loginPage.jpg'
import AForm from '../components/AForm'
import Abutton from '../components/Abutton/index'
import AMessage from '../components/AMessage'

import AInput from '../components/AInput'
import {validateFunction} from '../components/AInput/interfaces'

import { login } from '../services/index'
const LoginPage: React.FC = () => {
  // useEffect(() => {
  //   // console.log('I will run only once');
  // }, []);
  const [count, setCount] = useState(0)
  const decode = (localeData: string): string => {
    return "1550****072"
  }
  const localeData = false
  // const localeData=localStorage.getItem("token")
  let encodedPhoneNumber: string = ''
  if (localeData) {
    encodedPhoneNumber = decode(localeData)
  }

  // const handleSubMit = async () => {
  //   const userName: HTMLInputElement = document.getElementsByClassName("userName")[0] as HTMLInputElement
  //   const password: HTMLInputElement = document.getElementsByClassName("password")[0] as HTMLInputElement
  //   await login(userName.value, password.value)
  // }
  const formSubMit = (values:Object[]) => {
    console.log(values)
    AMessage.info('This is a normal message')
  }

  const lessThan5Letter: [validateFunction, string] = [(input: string): boolean => input.length < 5, "用户名应在5个字以内"]
  const lessThan10Letter: [validateFunction, string] = [(input: string): boolean => input.length < 10, "密码应在10个字以内"]
  // const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => { console.log(e.target.value) }
  return (
    <Scence>
      {/* <img src={loginPage} alt=""/> */}
      {localeData &&
        <React.Fragment>
          <Abutton onClick={() => setCount(count + 1)} text="开始唤醒" />
          {/* <button onClick={() => setCount(count + 1)}>开始唤醒</button> */}
          <p>玩家{encodedPhoneNumber}</p>
        </React.Fragment>}
      {!localeData && <AForm button onSubmit={formSubMit}>
        <AInput className='userName' displayName="用户名" label="userName" validator={lessThan5Letter} />
        <br />
        <AInput data-test="????" displayName="密码" className='password' validator={lessThan10Letter} type="password" label="password" />
        <br />
      </AForm>}
        <Abutton to="/playGround" text="游乐场" />
      <p>{count}</p>
        <Abutton to="/mainGame" text="游戏" />
    </Scence>
  )
}

export default LoginPage;
