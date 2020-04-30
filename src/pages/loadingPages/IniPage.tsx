import React from 'react';
import Scence from '../../components/scence'
import ini from '../../assets/ini.jpg'
import { Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import {imgStyle} from './computedStyle'
interface Istate {
  hash: string
}
class IniPage extends React.Component<RouteComponentProps, Istate>{
  state = {
    hash: ''
  }
  componentDidMount() {
    this.setState({ hash: window.location.hash })
    setTimeout(() => {
      if (window.location.hash == this.state.hash) {
        this.props.history.replace("/copyrightPage")
      }
    }, 2000)
  }
  render() {
    return (
      <Scence>
        <Link to="/copyrightPage">
          <img src={ini} style={imgStyle} alt="" />
        </Link>
      </Scence>
    )
  }
}

export default IniPage;
