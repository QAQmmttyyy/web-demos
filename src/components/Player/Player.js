import React from 'react';
import PlayerContext from '../PlayerContext';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSetting: {
        mode: 0,  // 播放模式 对应playMode item索引
        volume: 1.0,  // 0.0 ~ 1.0
        autoPlay: false,
        index: 0  // 正播放歌曲在 play queue 中的索引
      },
      playMode: ['列表循环', '随机播放'],
      isPauseUI: false
    };
    this.audioRef = React.createRef();
    this.isPause = true;
  }
  
  componentDidUpdate() {
    this.isPause
      ? this.audioRef.current.paused
        ? null
        : this.pauseAudio()
      : this.audioRef.current.paused
        ? this.playAudio()
        : null;
  }

  playAudio() {
    this.audioRef.current.play().then(() => {
      // PLAYBTN.classList.add('pause'); playbtn UI更新
      this.setState({ isPauseUI: true });
    }, (reason) => {
      console.log(reason);
    });
  }
  pauseAudio() {
    this.audioRef.current.pause();
    // PLAYBTN.classList.remove('pause'); playbtn UI更新
    this.setState({ isPauseUI: false });
  }

  render() {
    // playBtnUI
    let playBtnUI = 'btn play-btn f-left';
    this.state.isPauseUI
      ? playBtnUI += 'pause'
      : playBtnUI.replace(/ pause/, '');
    
    return (
      <PlayerContext.Consumer>
        {({ playerState }) => {
          const playingList = playerState.playingList;
          const currentSong = playerState.currentSong;
          this.isPause = playerState.isPause;
          
          return (
            <div className="player clearfix">
              {/* music */}
              <audio 
                src={currentSong.url ? currentSong.url : ""}
                ref={this.audioRef}
              ></audio>

              {/* prev play/pause next */}
              <div className="left-controls f-left clearfix">
                <span className="btn prev-btn f-left"></span>
                <span className={playBtnUI}></span>
                <span className="btn next-btn f-left"></span>
              </div>
          
              {/* <!-- time progress --> */}
              <div className="mid-controls f-left clearfix">
                <div className="progress f-left">
                  {/* <!-- time --> */}
                  <div className="played-time f-left">00:00</div>
                  <div className="whole-time f-right">00:00</div>
                  {/* <!-- progress --> */}
                  <div className="progress-behind">
                    <div className="progress-front">
                      <i className="btn progress-btn f-right"></i>
                    </div>
                  </div>
                </div>
              </div>
          
              {/* <!-- volume 播放模式 歌曲列表（控制区） --> */}
              <div className="right-controls f-left clearfix">
                <div className="mode-btn loop-mode f-left"></div>
                <div className="list-btn-wrap f-left">
                  <i className="list-btn f-left"></i>
                  <div className="songs-num">
                    { playingList.length }
                  </div>
                </div>
              </div>

              {/* <!-- 播放列表 --> */}
              <div className="playlist-panel">
                <ul>
                  {playingList.map(song => (
                    <li 
                      key={song.id}
                      className={
                        currentSong.id === song.id 
                          ? 'cur-play' 
                          : ''
                      }
                    >
                      {song.name}-{song.artists}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default Player;