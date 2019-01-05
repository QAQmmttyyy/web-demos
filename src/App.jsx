import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import l_array from 'lodash/array';

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
  // TODO 完善无版权歌曲处理
  // 播放playingList里有的歌曲
  play(index) {
    if (index >= 0) {
      if (index === this.state.curSongIndex) {
        if (this.state.isPause) {
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

  // 添加并播放单首歌曲
  playSong(song) {
    const appState = this.state;
    const playingList = appState.playingList;
    const curSongIndex = appState.curSongIndex;
    const indexToInsert = curSongIndex + 1;

    if (playingList.length) {// 播放列表不为空

      const matchedSongIdx = l_array.findIndex(playingList, ['id', song.id]);
  
      // 已有这首歌
      if (matchedSongIdx) {
        
        if (matchedSongIdx === curSongIndex) {// 且为正在播放的歌
          // 直接播放这首歌
          this.play(matchedSongIdx); 

        } else if (matchedSongIdx < curSongIndex) {// 在正在播放的歌之前
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 更新 ui
          this.setState({
            playingList: playingList,
            curSongIndex: curSongIndex - 1,
          }, () => this.play(indexToInsert));
        } else {// 在正在播放的歌之后
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 更新 ui
          this.setState({ playingList: playingList }, () => this.play(indexToInsert));
        }

      } else {// 没有这首歌
        // 添加到正播放的歌的后面
        playingList.splice(indexToInsert, 0, song);
        // 更新 ui
        this.setState({ playingList: playingList }, () => this.play(indexToInsert));
      }

    } else {// 播放列表为空
      this.setState({ playingList: [song] }, () => this.play(indexToInsert));
    }
  }
  // 下一首播放
  addSongToNext(song) {
    const appState = this.state;
    const playingList = appState.playingList;
    const curSongIndex = appState.curSongIndex;
    const indexToInsert = curSongIndex + 1;

    if (playingList.length) {// 播放列表不为空

      const matchedSongIdx = l_array.findIndex(playingList, ['id', song.id]);
  
      // 已有这首歌
      if (matchedSongIdx) {
        
        if (matchedSongIdx === curSongIndex) {// 且为正在播放的歌
          // 直接播放这首歌
          this.play(matchedSongIdx); 

        } else if (matchedSongIdx < curSongIndex) {// 在正在播放的歌之前
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 更新 ui
          this.setState({
            playingList: playingList,
            curSongIndex: curSongIndex - 1,
          });
        } else {// 在正在播放的歌之后
          // 从原位置移除
          playingList.splice(matchedSongIdx, 1);
          // 添加到正播放的歌的后面
          playingList.splice(indexToInsert, 0, song);
          // 更新 ui
          this.setState({ playingList: playingList });
        }

      } else {// 没有这首歌
        // 添加到正播放的歌的后面
        playingList.splice(indexToInsert, 0, song);
        // 更新 ui
        this.setState({ playingList: playingList });
      }

    } else {// 播放列表为空
      this.setState({ playingList: [song] }, () => this.play(0));
    }

  }

  pause() {
    this.setState({ isPause: true });
  }

  playAll(songlist) {
    this.setState({ playingList: songlist }, () => this.play(0));
  }

  addAll(songlist) {
    const playingList = this.state.playingList;

    if (playingList.length) {

      // 歌单间重复的歌曲也被去重了
      const songToAdd = l_array.differenceBy(songlist, playingList, 'id');
      console.log(songToAdd);

      if (songToAdd.length) {
        // 这一行直接以非 setState 的方式对 this.state 做了修改
        playingList.splice(this.state.curSongIndex + 1, 0, ...songToAdd);
        // 这一行只是单纯地要触发 render
        this.setState({ playingList: playingList });
      }
    } else {
      this.playAll(songlist);
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
                // borderTop: "1px solid #e1e1e1",
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
