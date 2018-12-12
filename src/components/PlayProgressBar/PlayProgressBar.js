import React from 'react';

class PlayProgressBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.progressFrontRef = React.createRef();
    this.progressBarState = {
      pageX: 0,
      entireWidth: 0,
      progressBtnCenterOffsetToCursorX: 0,
      progress: 0
    };
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

  render() {
    return (
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
          >
          </i>
        </div>
      </div>
    );
  }
}

export default PlayProgressBar;