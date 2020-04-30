import React from 'react';
import MainGame from '../components/Game'
import loader from '../utils/loader/index'
import styles from './index.css'
import { RawScript } from '../utils/types'
import { SaveData } from '../components/Game/actions'
import { connect } from 'dva'
interface IProps {
  global: {
    RawScript: RawScript,
    isReview: boolean,
    LoadDataFromLoadPage: SaveData
  }
}

const playGround = (props: IProps) => {
  const rs = props.global.RawScript
  const data = loader(rs as any, true, true)
  console.log(rs)
  return <div className={styles.App}>
    {data && <MainGame
      data={data}
      isReview={props.global.isReview}
      RawScript={rs as any}
      LoadDataFromLoadPage={props.global.LoadDataFromLoadPage}
    />}
  </div>
}

export default connect((store) => store)(playGround)