import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PlayerContext from './context/PlayerContext';

import Sider from './components/Sider/Sider.jsx';
import Discover from './components/Discover/Discover.jsx';
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail.jsx';
import DjRadioDetail from './components/DjRadioDetail/DjRadioDetail.jsx';
import VideoDetail from './components/VideoDetail/VideoDetail.jsx';
import SongDetail from './components/SongDetail/SongDetail.jsx';
import Player from './components/Player/Player.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    // PlayerContext value
    // 可用localStorage 存储此状态
    this.state = {
      playingList: [],
      currentSong: {},
      curSongIndex: -1,
      isPause: true,
      isLogin: false
    };
    // bind this to method
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.playAll = this.playAll.bind(this);
    this.addAll = this.addAll.bind(this);
    // TODO:
    // menuInfo 登录与未登录不同。
    // 登陆后更改，然后设置 isLogin 触发更新。
    this.menuInfo = [
      {
        title: '推荐',
        enableOpenClose: false,
        menuItems: [
          {
            // id: 0 对应于‘收藏的歌单’submenu
            to: '/discover' || {},
            iconType: 'discover',
            description: '发现音乐'
          },
          {
            // id: 0 对应于‘收藏的歌单’submenu
            to: '/videos' || {},
            iconType: 'videos',
            description: '视频'
          },
          {
            // id: 0 对应于‘收藏的歌单’submenu
            to: '/friend' || {},
            iconType: 'friend',
            description: '朋友'
          }
        ]
      }
    ];
  }
  // player operation
  play(index) {
    if (index >= 0) {
      if (index === this.state.curSongIndex) {
        // if (this.isPause) {
        this.setState({ isPause: false });
        // }
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

  // render
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
          {/* <div style={{ position: "relative" }}> */}
            <header style={{ 
                position: 'fixed',
                top: 0,
                width: '100%',
                height: 50,
                // backgroundColor: '#cc3333',
              }}
            >
            </header>
            <div style={{ 
                boxSizing: 'border-box',
                height: "100%",
                padding: '50px 0 51px 208px',
              }}
            >
              {/* sideBar */}
              <Sider menuInfo={this.menuInfo}/>

              <div style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
                <Switch>
                  {/* 常规一级路由 */}
                  <Redirect exact from="/" to="/discover"/>
                  <Route path="/discover" component={Discover}/>

                  {/* 提升层级：歌单/电台详情页，会有query params，与一级显示区域相同 */}
                  <Route path="/playlist" component={PlaylistDetail}/>
                  <Route path="/djradio" component={DjRadioDetail}/>

                  {/* 提升层级：song详情页，会有query params，显示区域为：除header/footer以外 */}
                  <Route path="/song" component={SongDetail}/>

                  {/* 提升层级：视频详情页，会有query params，显示区域为：除header以外 */}
                  <Route path="/video" component={VideoDetail}/>
                </Switch>
              </div>
            </div>
            <footer style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                height: 50,
                borderTop: "1px solid #e1e1e1",
                backgroundColor: "#ffffff",
              }}
            >
              <Player />
            </footer>
          {/* </div> */}
        </PlayerContext.Provider>
      </Router>
    );
  }
}

export default App;
