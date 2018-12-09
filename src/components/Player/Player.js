import React from 'react';
import PlayerContext from '../PlayerContext';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
  }

  render() {
    return (
      <PlayerContext.Consumer>
        {({ playerState }) => {
          const playingList = playerState.playingList;
          const currentSong = playerState.currentSong;
          const isPause = playerState.isPause;
          
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
                  <div className="songs-num">
                    { playingList.length }
                  </div>
                </div>
              </div>

              {/* <!-- 播放列表 --> */}
              <div className="playlist-panel">
                <ul>
                  {playingList.map(song => (
                    <li key={song.id}>{song.name}-{song.artists}</li>
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