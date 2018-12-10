import React from 'react';
import PlayerContext from '../PlayerContext';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 0,
      volume: 1.0,
      playMode: ['列表循环', '随机播放'],
      duration: '00:00',
      curTime: '00:00',
      progress: '0',
      isPauseUI: false
    };
    this.audioRef = React.createRef();
    this.curSongIndex = -1;
    this.isPause = true;
  }
  
  componentDidUpdate() {
    if (this.isPause) {
      if (!(this.audioRef.current.paused)) {
        this.pauseAudio();
      }
    } else {
      if (this.audioRef.current.paused) {
        this.playAudio();
      }
    }
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

  // ev handler
  handleClickPlayBtn(funcPlay, funcPause) {
    if (this.curSongIndex >= 0) {
      if (this.audioRef.current.paused) {
        funcPlay(this.curSongIndex);
      } else {
        funcPause();
      }
    }
  }
  handleDurationChange() {
    this.setState({
      duration: this.timeFormat(this.audioRef.current.duration),
      curTime: '00:00'
    });
  }
  handleTimeUpdate() {
    const
      old = this.state.curTime,
      duration = this.audioRef.current.duration,
      currentTime = this.audioRef.current.currentTime,
      curTimeStr = this.timeFormat(currentTime),
      progress = `${(currentTime / duration * 100).toFixed(1)}%`;
  
    if (old !== curTimeStr) {
      this.setState({
        curTime: curTimeStr,
        progress: progress
      });
    } else if (currentTime === duration) {
      this.setState({ progress: progress });
    }
  }
  handleEnded() {
    
  }

  // Util
  timeFormat(timeNum) {// mm:ss
    const minutes = parseInt(timeNum / 60),  // 商
          seconds = parseInt(timeNum % 60),  // 余数
          minStr = minutes < 10 ? `0${minutes}` : `${minutes}`,
          secStr = seconds < 10 ? `0${seconds}` : `${seconds}`,
          curTimeStr = `${minStr}:${secStr}`;
    return curTimeStr;
  }

  render() {
    // playBtnUI
    let playBtnUI = 'btn play-btn f-left';
    playBtnUI = 
      this.state.isPauseUI
        ? playBtnUI + ' pause'
        : playBtnUI.replace(/ pause/, '');
    
    return (
      <PlayerContext.Consumer>
        {({ playerState, play, pause }) => {
          const playingList = playerState.playingList;
          const currentSong = playerState.currentSong;
          this.curSongIndex = playerState.curSongIndex;
          this.isPause = playerState.isPause;
          
          return (
            <div className="player clearfix">
              {/* music */}
              <audio 
                ref={this.audioRef}
                src={
                  currentSong.url 
                    ? `${process.env.PUBLIC_URL}/${currentSong.url}` 
                    : ''
                }
                onDurationChange={() => this.handleDurationChange()}
                onTimeUpdate={() => this.handleTimeUpdate()}
                onEnded={}
              ></audio>

              {/* prev play/pause next */}
              <div className="left-controls f-left clearfix">
                <span className="btn prev-btn f-left"></span>
                <span 
                  className={playBtnUI}
                  onClick={() => this.handleClickPlayBtn(play, pause)}
                ></span>
                <span className="btn next-btn f-left"></span>
              </div>
          
              {/* <!-- time progress --> */}
              <div className="mid-controls f-left clearfix">
                <div className="progress f-left">
                  {/* <!-- time --> */}
                  <div className="played-time f-left">
                    {this.state.curTime}
                  </div>
                  <div className="whole-time f-right">
                    {this.state.duration}
                  </div>
                  {/* <!-- progress --> */}
                  <div className="progress-behind">
                    <div 
                      className="progress-front"
                      style={{ width: this.state.progress }}
                    >
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