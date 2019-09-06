import React from 'react';
import Scence from '../components/scence'
import ini from '../assets/ini.jpg'
import { Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'

interface Istate {
  timer: any
}
class IniPage extends React.Component<RouteComponentProps,Istate>{
  state = {
    timer: null
  }
  componentDidMount() {
    const timer = setTimeout(() => {
      this.props.history.replace("/copyrightPage")
    }, 2000)
    this.setState({timer})
  }
  componentWillUnmount() {
    const {timer}=this.state
    clearTimeout(timer as any)
  }
  render() {
    return (
      <Scence>
        <Link to="/copyrightPage">
          <img src={ini} style={{ width: "100%" }} alt="" />
        </Link>
      </Scence>
    )
  }
}

export default IniPage;
