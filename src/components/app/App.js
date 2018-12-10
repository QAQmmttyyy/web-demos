import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import PlayerContext from '../PlayerContext';

import Discover from '../Discover/Discover';
import PlayListDetail from '../PlayListDetail/PlayListDetail';
import DjRadioDetail from '../DjRadioDetail/DjRadioDetail';
import VideoDetail from '../VideoDetail/VideoDetail';
import SongDetailLink from '../SongDetailLink/SongDetailLink';
import SongDetail from '../SongDetail/SongDetail';
import Player from '../Player/Player';

class App extends React.Component {
  constructor(props) {
    super(props);
    // PlayerContext value
    // 可用localStorage 存储此状态
    this.state = {
      playingList: [],
      currentSong: {},
      curSongIndex: -1,
      isPause: true
    };
    // bind this to method
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.playAll = this.playAll.bind(this);
    this.addAll = this.addAll.bind(this);
  }
  // player operation
  play(index) {
    if (index >= 0) {
      if (index === this.state.curSongIndex) {
        if (this.isPause) {
          this.setState({ isPause: false });
        }
      } else {
        this.setState({
          currentSong: this.state.playingList[index],
          curSongIndex: index,
          isPause: false
        });
      } 
    }
  }
  pause() {
    this.setState({ isPause: true });
  }
  playAll(songList) {
    this.setState({
      playingList: songList,
      currentSong: songList[0],
      curSongIndex: 0,
      isPause: false
    });
  }
  addAll(songList) {
    if (this.state.playingList.length) {
      this.setState({
        playingList: this.state.playingList.concat(songList)
      });
    } else {
      this.playAll(songList);
    }
  }

  render() {
    return (
      <Router>
        <PlayerContext.Provider 
          value={{
            playerState: this.state,
            play: this.play,
            pause: this.pause,
            playAll: this.playAll,
            addAll: this.addAll
          }}
        >
          {/* app ui */}
          <div style={{ position: "relative" }}>
            <header style={{ height: "20px" }}>QAQ Music</header>
            <div style={{ display: "flex", height: "400px" }}>
              {/* sideBar */}
              <div style={{ width: "25%", backgroundColor: "#cccccc" }}>
                {/* side nav */}
                <ul style={{ listStyleType: "none", padding: "10px" }}>
                  <li>
                    <Link to="/discover">发现音乐</Link>
                  </li>
                  <li>
                    <Link to="/fm">私人FM</Link>
                  </li>
                  <li>
                    <Link to="/friend">朋友</Link>
                  </li>
                </ul>
                {/* SongDetailLink */}
                <SongDetailLink />
              </div>

              <div style={{ flex: "auto", padding: "10px" }}>
                <Switch>
                  {/* 常规一级路由 */}
                  <Redirect exact from="/" to="/discover" />
                  <Route path="/discover" component={Discover} />

                  {/* 提升层级：歌单/电台详情页，会有query params，与一级显示区域相同 */}
                  <Route path="/playlist" component={PlayListDetail} />
                  <Route path="/djradio" component={DjRadioDetail} />

                  {/* 提升层级：song详情页，会有query params，显示区域为：除header/footer以外 */}
                  <Route path="/song" component={SongDetail} />

                  {/* 提升层级：视频详情页，会有query params，显示区域为：除header以外 */}
                  <Route path="/video" component={VideoDetail} />
                </Switch>
              </div>
            </div>
            <footer>
              <Player />
            </footer>
          </div>
        </PlayerContext.Provider>
      </Router>
    );
  }
}

export default App;
