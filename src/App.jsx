import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import l_array from 'lodash/array';

import PlayerContext from './context/PlayerContext';

import Header from './components/Header/Header.jsx';
import Discover from './components/Discover/Discover.jsx';
import Playlists from './components/Playlists/Playlists.jsx';
import Albums from './components/Albums/Albums.jsx';
import Player from './components/Player/Player.jsx';

import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail.jsx';
import AlbumDetail from './components/AlbumDetail/AlbumDetail.jsx';
import VideoDetail from './components/VideoDetail/VideoDetail.jsx';
import SongDetail from './components/SongDetail/SongDetail.jsx';

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
    this.deleteSong = this.deleteSong.bind(this);
    this.clearPlaylist = this.clearPlaylist.bind(this);
    this.playAll = this.playAll.bind(this);
    this.addAll = this.addAll.bind(this);
    this.playSong = this.playSong.bind(this);
    this.addSongToNext = this.addSongToNext.bind(this);
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

  componentDidMount() {
    const localData = window.localStorage.getItem('playData');
    this.setState(JSON.parse(localData));
  }

  componentDidUpdate() {
    const { playingList, currentSong, curSongIndex } = this.state;
    window.localStorage.setItem('playData',JSON.stringify({ playingList, currentSong, curSongIndex }));
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
          isPause: false,
        });
      } 
    }
  }

  pause() {
    this.setState({ isPause: true });
  }

  // 删除歌曲
  deleteSong(songIndex) {
    const appState = this.state;

    const playingList = appState.playingList;
    let curSongIndex = appState.curSongIndex;

    l_array.remove(playingList, (val, idx) => idx === songIndex);

    if (playingList.length) {
      
      if (songIndex < curSongIndex) {
        this.setState({
          playingList: playingList,
          curSongIndex: curSongIndex - 1,
        });
      } else if (songIndex === curSongIndex) {

        curSongIndex = songIndex === playingList.length ? 0 : songIndex;

        this.setState({
          playingList: playingList,
          currentSong: playingList[curSongIndex],
          curSongIndex: curSongIndex,
          isPause: false,
        });
      } else {
        this.setState({ playingList: playingList });
      }
      
    } else {
      this.clearPlaylist();
    }
  }

  clearPlaylist() {
    this.setState({
      playingList: [],
      currentSong: {},
      curSongIndex: -1,
      isPause: true,
    });
  }

  playAll(songlist) {
    this.setState({
      playingList: songlist,
      curSongIndex: -1,
    }, () => this.play(0));
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
  // 添加并播放单首歌曲
  playSong(song) {
    const appState = this.state;
    const playingList = appState.playingList;
    const curSongIndex = appState.curSongIndex;
    const indexToInsert = curSongIndex + 1;

    if (playingList.length) {// 播放列表不为空

      const matchedSongIdx = l_array.findIndex(playingList, ['id', song.id]);
  
      // 已有这首歌
      if (matchedSongIdx !== -1) {
        
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
          }, () => this.play(indexToInsert - 1));

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
        console.log(playingList);
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
      if (matchedSongIdx !== -1) {
        
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
  // render
  render() {
    return (
      <Router>
        <PlayerContext.Provider 
          value={{
            playerState: this.state,
            play: this.play,
            pause: this.pause,
            deleteSong: this.deleteSong,
            clearPlaylist: this.clearPlaylist,
            playAll: this.playAll,
            addAll: this.addAll,
            playSong: this.playSong,
            addSongToNext: this.addSongToNext,
          }}
        >
          <Header />
          <div style={{
            width: 900,
            minHeight: '80vh',
            padding: '40px 40px 10px',
            margin: '10px auto 80px',
            backgroundColor: 'white',
            borderRadius: '2px',
            boxShadow: '0 1px 3px rgba(26, 26, 26, 0.1)',
          }}>
            <Switch>
              {/* 常规一级路由 */}
              <Redirect exact from="/" to="/discover"/>
              <Route path="/discover" component={Discover}/>
              <Route path="/playlists" component={Playlists}/>
              <Route path="/albums" component={Albums}/>

              {/* 提升层级：歌单/电台详情页，会有query params，与一级显示区域相同 */}
              <Route path="/playlist" component={PlaylistDetail}/>
              <Route path="/album" component={AlbumDetail}/>

              {/* 提升层级：song详情页，会有query params，显示区域为：除header/footer以外 */}
              {/* <Route path="/song" component={SongDetail}/> */}

              {/* 提升层级：视频详情页，会有query params，显示区域为：除header以外 */}
              <Route path="/video" component={VideoDetail}/>
            </Switch>
          </div>
          <footer style={{
              position: 'fixed',
              zIndex: '50',
              bottom: 0,
              width: '100%',
              backgroundColor: "#ffffff",
            }}
          >
            <Player />
          </footer>
        </PlayerContext.Provider>
      </Router>
    );
  }
}

export default App;
