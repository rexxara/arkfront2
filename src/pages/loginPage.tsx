import React from 'react';
import Scence from '../components/scence'
import Abutton from '../components/Abutton/index'
import { connect } from 'dva'
import { AnyAction } from 'redux'
interface Iprops {
  dispatch: (a: AnyAction) => AnyAction
}
const LoginPage = (props: Iprops) => {
  const startGame = () => {
    props.dispatch({
      type: 'global/start'
    })
  }
  return <Scence>
    {/* <Abutton to="/playGround" text="游乐场" /> */}
    <Abutton onClick={startGame} text="开始游戏" />
    <Abutton to='/loadPage' text="加载" />
    <Abutton to="/gallery" text="画廊" />
    <Abutton to="/ScenceReview" text="场景回想" />
  </Scence>
}

export default connect((store) => store)(LoginPage)