import React from 'react';
import GameData from '../../scripts'
import message from '../../components/AMessage'
import MainGame from '../../components/Game'
import loader from '../../utils/loader/index'
import { RawScript } from '../../utils/types'
import styles from '../index.css'
import Form from './form'
import { connect } from 'dva'

//暂时废弃

interface IProps {
  script: string
  edited?:boolean
}
const handleClick = () => {

}
const playGround = (props: IProps) => {
  // const { script, edited } = props
  // const ModifiedScript = { ...GameData, chapters: [script] }
  // console.log('playgroundWasCalled')
  // const data = loader(ModifiedScript as RawScript, false, !edited)
  return <div className={styles.App}>
    {/* <button onClick={handleClick}>playGround</button>
    <MainGame
      data={data}
    />
    <Form /> */}
  </div>
}
export default playGround
// export default connect(({ global: { script, edited } }) => ({
//   script, edited
// }))(playGround);