import React from 'react';
import GameData from '../scripts'
import MainGame from '../components/Game'
import loader from '../utils/loader'
import { RawScript } from '../utils/types'
import styles from './index.css'
interface IProps {
  script: string
}

const playGround = (props: IProps) => {
  const data = loader(GameData as RawScript, true,true)
  return <div className={styles.App}>
    <MainGame
      data={data}
      RawScript={GameData}
    />
  </div>
}


export default playGround