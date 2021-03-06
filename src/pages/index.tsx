import React, { useEffect } from 'react';
import styles from './index.css';
import 'animate.css'
import { Router, Route } from 'react-router'
import { createHashHistory } from 'history'
import IniPage from './loadingPages/IniPage'
import copyrightPage from './loadingPages/copyrightPage'
import alertPage from './loadingPages/alertPage'
import titlePage from './titlePage'
import updatePage from './updatePage'
import playGround from './playGround/index'
import loginPage from './loginPage'
import warpedAnimation from '../components/HOC/animation'
import MainGame from './MainGame'
import HomePage from './loadingPages/HomePage'
import Gallery from './Gallery'
import ScenceReview from './ScenceReview'
import LoadPage from './loadPage'
import detectOrient from '../utils/detectOrient'
import { vh, vw } from '../utils/getSize'
import PaintGame from './paintGame/index'
import vConsole from 'vconsole'
detectOrient()
const history = createHashHistory()
const WarpedIniPage = warpedAnimation(IniPage)
const WarpedCopyrightPage = warpedAnimation(copyrightPage)
const WarpedLoginPage = warpedAnimation(loginPage)
const WarpedGallery = warpedAnimation(Gallery)
const WarpedScenceReview = warpedAnimation(ScenceReview)
const WarpedMainGame = warpedAnimation(MainGame)
const WarpedLoadPage = warpedAnimation(LoadPage)
// document.oncontextmenu = function () {
//   return false;
// }
const indexStyle: React.CSSProperties = {
  height: vh(100), width: vw(100),
  //backgroundImage: `url(${require('../assets/mainCover.jpg')})`,
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'black',
  backgroundSize: 'Contain',
  backgroundPosition: 'center center'
}

if (location.hash.indexOf("debug=true") !== -1) {
  const Vcon = new vConsole()
}
const App: React.FC = () => {
  return <div >
    <title>kimi no hanashi</title>
    <Router history={history}>
      <div style={indexStyle} className={styles.App}>
        <Route exact path="/" children={props => <WarpedIniPage  {...props} />} />
        <Route path="/copyrightPage" children={props => <WarpedCopyrightPage {...props} />} />
        <Route path="/alertPage" component={alertPage} />
        <Route path="/titlePage" component={titlePage} />
        <Route path="/updatePage" component={updatePage} />
        <Route path="/playGround" component={playGround} />
        <Route path="/homePage" component={HomePage} />
        <Route path="/mainGame" children={props => <WarpedMainGame {...props} />} />
        <Route path="/loginPage" children={props => <WarpedLoginPage {...props} />} />
        <Route path="/gallery" children={props => <WarpedGallery {...props} />} />
        <Route path="/ScenceReview" children={props => <WarpedScenceReview {...props} />} />
        <Route path="/loadPage" children={props => <WarpedLoadPage {...props} />} />
        <Route path="/paintGame">
          <PaintGame />
        </Route>
      </div>
    </Router>
  </div>
}
export default App;
