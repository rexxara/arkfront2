import React from 'react';
import GameData from '../scripts'
import message from '../components/AMessage'
import MainGame from '../components/Game'
import loader from '../utils/loader'
import { Game ,RawScript} from '../utils/types'
import styles from './index.css'
import txt from '../scripts/test.txt'

interface IProps {
}
const handleClick = () => {

}
const playGround = (props: IProps) => {
  return <div className={styles.App}>
    <button onClick={handleClick}>playGround</button>
    <MainGame
      data={loader(GameData as RawScript)}
    />
  </div>
}


export default playGround


