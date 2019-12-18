import React from 'react';
import styles from './index.css';
import 'animate.css'
import { Router, Route } from 'react-router'
import { createHashHistory } from 'history'
import IniPage from './IniPage'
import copyrightPage from './copyrightPage'
import alertPage from './alertPage'
import titlePage from './titlePage'
import updatePage from './updatePage'
import playGround from './playGround/index'
import loginPage from './loginPage'
import warpedAnimation from '../components/HOC/animation'
import MainGame from './MainGame'
import HomePage from './HomePage'
import Gallery from './Gallery'
const history = createHashHistory()
const WarpedIniPage = warpedAnimation(IniPage)
const WarpedCopyrightPage = warpedAnimation(copyrightPage)
const WarpedLoginPage = warpedAnimation(loginPage)
const WarpedGallery = warpedAnimation(Gallery)
// document.oncontextmenu = function () {
//   return false;
// }
const App: React.FC = () => {
  return (
    <div >
      <Router history={history}>
        <div className={styles.App}>
          <Route exact path="/" children={props => <WarpedIniPage  {...props} />} />
          <Route path="/copyrightPage" children={props => <WarpedCopyrightPage {...props} />} />
          <Route path="/alertPage" component={alertPage} />
          <Route path="/titlePage" component={titlePage} />
          <Route path="/updatePage" component={updatePage} />
          <Route path="/playGround" component={playGround} />
          <Route path="/homePage" component={HomePage} />
          <Route path="/mainGame" component={MainGame} />
          <Route path="/loginPage" children={props => <WarpedLoginPage {...props} />} />
          <Route path="/gallery" children={props => <WarpedGallery {...props} />} />
        </div>
      </Router>
    </div>
  );
}

export default App;
