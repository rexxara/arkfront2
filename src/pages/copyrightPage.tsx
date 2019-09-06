import React from 'react';
import Scence from '../components/scence'
import cpri from '../assets/copyright.jpg'
import { RouteComponentProps} from 'react-router'
import{Link} from 'react-router-dom'

class CopyrightPage extends React.Component<RouteComponentProps>{
  render() {
    return (
      <Scence>
        <Link to="/loginPage"><img src={cpri} style={{ width: "100%" }} alt="" /></Link>
      </Scence>
    )
  }

}




export default CopyrightPage
