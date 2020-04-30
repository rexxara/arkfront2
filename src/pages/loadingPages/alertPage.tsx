import React from 'react';
import Scence from '../../components/scence'
import alert from '../../assets/alert.jpg'
import {imgStyle} from './computedStyle'
const alertPage: React.FC = () => {
  return (
        <Scence>
          <img src={alert} style={imgStyle} alt=""/>
        </Scence>
  )
}

export default alertPage
