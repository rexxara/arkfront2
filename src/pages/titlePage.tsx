import React from 'react';
import Scence from '../components/scence'
import title from '../assets/title.jpg'
const titlePage: React.FC = () => {
  return (
        <Scence>
          <img src={title} alt=""/>
        </Scence>
  )
}

export default titlePage;
