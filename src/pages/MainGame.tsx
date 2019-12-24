import React from 'react';
import MainGame from '../components/Game'
import loader from '../utils/loader'
import styles from './index.css'
import { RawScript } from '../utils/types'
import { connect } from 'dva'
interface IProps {
  global: {
    RawScript: RawScript,
    isReview:boolean
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
    />}
  </div>
}

export default connect((store) => store)(playGround)