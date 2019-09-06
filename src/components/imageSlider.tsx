import React from 'react';
import { Carousel } from 'antd';
import ini from '../assets/ini.jpg'
import cpri from '../assets/copyright.jpg'
import alert from '../assets/alert.jpg'
import title from '../assets/title.jpg'
import update from '../assets/update.jpg'
import loginPage from '../assets/loginPage.jpg'

interface IState {
  timer: number,
  autoplay: boolean | undefined
}

interface IProps { }

export default class imageSlider extends React.Component<IProps, IState> {
  state: IState = {
    timer: 0,
    autoplay: true
  }

  // toggleAnimate = (): void => {
  //   this.setState({
  //   });
  // }
  afterChangeHandle = (current: number): void => {
    console.log('changed', current)
    if (current === 4) {
      this.setState({ autoplay: false })
    }
  }
  render() {
    const { autoplay } = this.state
    return (
      <Carousel afterChange={this.afterChangeHandle} autoplay={autoplay} dots={false} effect="fade">
        <img src={ini} alt="" />
        <img src={cpri} alt="" />
        <img src={alert} alt="" />
        <img src={title} alt="" />
        <img src={update} alt="" />
        <img src={loginPage} alt="" />
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
      </Carousel>
    );
  }
}

