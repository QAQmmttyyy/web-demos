import React from 'react';
import './Player.css';

class Player extends React.Component {
  render() {
    return (
      <div className="player clearfix">
        <audio id="myMusic"></audio>
        {/* prev play/pause next */}
        <div className="left-controls f-left clearfix">
          <span className="btn prev-btn f-left"></span>
          <span className="btn play-btn f-left"></span>
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
            <div className="songs-num">4</div>
          </div>
        </div>
        {/* <!-- 播放列表 --> */}
        <div className="playlist-panel">
        </div>
      </div>
    
    );
  }
}

export default Player;