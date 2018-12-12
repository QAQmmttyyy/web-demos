import React from 'react';
import PlayerContext from '../PlayerContext';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modeIndex: 0,
      volume: 1.0,
      duration: '00:00',
      curTime: '00:00',
      progress: '0',
      isPauseIco: false,
      isOpen: false
    };
    this.audioRef = React.createRef();
    this.progressFrontRef = React.createRef();
    this.curSongIndex = -1;
    this.audioAmount = 0;
    this.isPause = true; // 指示 进行播放还是暂停

    this.progressBarState = {
      pageX: 0,
      entireWidth: 0,
      progressBtnCenterOffsetToCursorX: 0,
      progress: 0,
      curTime: 0
    };
    this.playMode = [
      {
        desc: '列表循环',
        className: 'loop-mode'
      },
      {
        desc: '随机播放',
        className: 'random-mode'
      }
    ];
  }
  
  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.isNoAudio()) {
      return;
    }
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
      console.log('play.then');
      this.setState({ isPauseIco: true });
    }, (reason) => {
      console.log(reason);
    });
  }
  pauseAudio() {
    this.audioRef.current.pause();
    this.setState({ isPauseIco: false });
  }

  // User ev handler-left-right control
  handleClickPlayBtn(funcPlay, funcPause) {
    if (this.isNoAudio()) {
      return;
    }
    if (this.audioRef.current.paused) {
      const index = this.curSongIndex;
      funcPlay(index);
    } else {
      funcPause();
    }
  }
  handleClickPrevBtn(funcPlay) {
    if (this.isNoAudio()) {
      return;
    }
    const index = this.getIndex(true);
    funcPlay(index);
  }
  handleClickNextBtn(funcPlay) {
    if (this.isNoAudio()) {
      return;
    }
    const index = this.getIndex();
    funcPlay(index);
  }
  handleClickModeBtn() {
    const nextIndex = (this.state.modeIndex + 1) % this.playMode.length;
    this.setState({ modeIndex: nextIndex });
  }
  handleClickListBtn() {
    this.setState((state) => ({
      isOpen: !state.isOpen
    }));
  }

  // User ev handler-progressbar
  handleMouseDownProgBtn(funcPlay, funcPause, ev) {
    if (this.isNoAudio()) {
      return;
    }

    ev.preventDefault();

    const 
      target = ev.currentTarget,
      progressFront = this.progressFrontRef.current,
      state = this.progressBarState;

    state.pageX = this.getElemClientPageLeft(progressFront);
    state.entireWidth = progressFront.parentElement.clientWidth;
    state.progressBtnCenterOffsetToCursorX = 
        this.getElemClientPageLeft(target) + 
        (target.offsetWidth / 2) - 
        ev.pageX;
  
    // bind 鼠标脱离progressBtn也起作用
    const doc = window.document;
    doc.onmousemove = this.handleMouseMoveProgBtn.bind(this);
    doc.onmouseup = this.handleMouseUpProgBtn.bind(this, funcPlay);

    funcPause();
  }
  handleMouseMoveProgBtn(ev) {
    const
      prevCurTime = this.state.curTime,
      duration = this.audioRef.current.duration,
      state = this.progressBarState;
    console.log(duration);
    const entireWidth = state.entireWidth;

    let
      progressFrontWidth = 
        ev.pageX + state.progressBtnCenterOffsetToCursorX - state.pageX;

    if (progressFrontWidth < 0) {
      progressFrontWidth = 0;
    } else if (progressFrontWidth > entireWidth) {
      progressFrontWidth = entireWidth;
    }

    state.progress = parseFloat((progressFrontWidth / entireWidth).toFixed(3));
    state.curTime = parseFloat((state.progress * duration).toFixed(6));

    const
      curTimeStr = this.timeFormat(state.curTime),
      progress = `${state.progress * 100}%`;

    if (prevCurTime !== curTimeStr) {
      this.setState({
        curTime: curTimeStr,
        progress: progress
      });
    } else {
      this.setState({ progress: progress });
    }
  }
  handleMouseUpProgBtn(funcPlay, ev) {
    ev.preventDefault();

    const 
      doc = window.document,
      state = this.progressBarState,
      audio = this.audioRef.current,
      index = this.curSongIndex;

    doc.onmousemove = null;
    doc.onmouseup = null;

    if (state.progress < 1) {
      audio.currentTime = state.curTime;
    } else if (state.progress === 1) {
      audio.currentTime = state.curTime - 0.1;
    }

    funcPlay(index);
  }

  // Audio ev handle
  handleDurationChange() {
    console.log('handleDurationChange');
    this.setState({
      duration: this.timeFormat(this.audioRef.current.duration),
      progress: '0',
      curTime: '00:00'
    });
  }
  handleTimeUpdate() {
    const
      old = this.state.curTime,
      duration = this.audioRef.current.duration,
      currentTime = this.audioRef.current.currentTime;

    const
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
  handleEnded(funcPlay) {
    const index = this.getIndex();
    funcPlay(index);
  }

  // Util
  isNoAudio() {
    return (this.audioAmount === 0 ? true : false);
  }
  timeFormat(timeNum) {// mm:ss
    const minutes = parseInt(timeNum / 60),  // 商
          seconds = parseInt(timeNum % 60),  // 余数
          minStr = minutes < 10 ? `0${minutes}` : `${minutes}`,
          secStr = seconds < 10 ? `0${seconds}` : `${seconds}`,
          curTimeStr = `${minStr}:${secStr}`;
    return curTimeStr;
  }
  getIndex(isPrev) {
    if (isPrev === undefined) {
      isPrev = false;
    }
    let index = 0;
    switch (this.state.modeIndex) {
      case 0:
        if (isPrev) {
          index = (
              this.curSongIndex - 1 + this.audioAmount
            ) % this.audioAmount;
        } else {
          index = (this.curSongIndex + 1) % this.audioAmount;
        }
        break;
      case 1:
        index = parseInt(Math.random() * this.audioAmount);
        break;
      default:
        break;
    }
    return index;
  }
  getElemClientPageLeft(element){
    let wholeLeft = 0;  // elem client left to page
    let parent = element;
    while(parent){
      wholeLeft += parent.offsetLeft + (
          parent.offsetWidth - parent.clientWidth) / 2;
      parent = parent.offsetParent;
    }
    return wholeLeft;
  }

  render() {
    return (
      <PlayerContext.Consumer>
        {({ playerState, play, pause }) => {
          const playingList = playerState.playingList;
          const currentSong = playerState.currentSong;
          let playProgress = '0';
          if (this.curSongIndex === playerState.curSongIndex) {
            playProgress = this.state.progress;
          }

          this.curSongIndex = playerState.curSongIndex;
          this.audioAmount = playingList.length;
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
                onEnded={() => this.handleEnded(play)}
              >
              </audio>

              {/* prev play/pause next */}
              <div className="left-controls f-left clearfix">
                <span 
                  className="btn prev-btn f-left"
                  onClick={() => this.handleClickPrevBtn(play)}
                ></span>
                <span 
                  className={
                    'btn play-btn f-left' + (
                      this.state.isPauseIco ? ' pause' : ''
                    )
                  }
                  onClick={() => this.handleClickPlayBtn(play, pause)}
                ></span>
                <span 
                  className="btn next-btn f-left"
                  onClick={() => this.handleClickNextBtn(play)}
                ></span>
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
                      ref={this.progressFrontRef}
                      className="progress-front"
                      style={{ width: playProgress }}
                    >
                      <i 
                        className="btn progress-btn f-right"
                        onMouseDown={
                          (ev) => this.handleMouseDownProgBtn(play, pause, ev)
                        }
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
          
              {/* <!-- volume 播放模式 歌曲列表（控制区） --> */}
              <div className="right-controls f-left clearfix">
                <div></div>
                <div 
                  className={
                    'mode-btn f-left ' + 
                    this.playMode[this.state.modeIndex].className
                  }
                  onClick={() => this.handleClickModeBtn()}
                >
                </div>
                <div 
                  className="list-btn-wrap f-left"
                  onClick={() => this.handleClickListBtn()}
                >
                  <i className="list-btn f-left"></i>
                  <div className="songs-num">
                    { playingList.length }
                  </div>
                </div>
              </div>

              {/* <!-- 播放列表 --> */}
              <div 
                className={
                  'playlist-panel' + (this.state.isOpen ? '' : ' dis-hide')
                }
              >
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