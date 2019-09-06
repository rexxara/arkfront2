import React from 'react';
import Scence from '../components/scence'
import update from '../assets/update.jpg'

const updatePage: React.FC = () => {
  return (
        <Scence>
          <img src={update} alt=""/>
          <button>Game Start</button>
        </Scence>
  )
}

export default updatePage;
