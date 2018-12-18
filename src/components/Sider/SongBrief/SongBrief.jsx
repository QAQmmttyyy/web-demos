import React from 'react';
import { Link } from 'react-router-dom';

import PlayerContext from '../../../context/PlayerContext';
import './SongBrief.scss';
import cover from './images/cover-eg.jpg'

class SongBrief extends React.Component {
  
  // TODO 换用lodash
  isEmptyObj(value) {
    for (let key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <PlayerContext.Consumer>
        {({ playerState }) => {
          const currentSong = playerState.currentSong;
          const songLocation = {
            pathname: "/song",
            search: `?id=${currentSong.id}`
          };
          const songBriefContainCls = `mty-song-brief-container ${
            this.isEmptyObj(currentSong) ? 'dis-hide' : ''
          }`;
          
          return (
            <div className={songBriefContainCls}>
              <div className="mty-song-brief">
            		{/* <!--cover--> */}
            		<div className="mty-song-brief-cover">
            			<Link to={songLocation}>
                    {/* TODO 之后currentSong会包含cover url */}
            				<img src={cover} alt="cover"/>
                  </Link>
            		</div>
            		{/* <!--info--> */}
            		<div className="mty-song-brief-info">
            			<div className="mty-song-brief-info-name">
            				<Link to={songLocation}>{currentSong.name}</Link>
            			</div>
            			<div className="mty-song-brief-info-artists">
                    {/* TODO 连接到歌手详情页 */}
            				<Link to={songLocation}>{currentSong.artists}</Link>
            			</div>
            		</div>
            		{/* <!--operation--> */}
            		<div className="mty-song-brief-operation">
                  {/* TODO 添加真实icon图片以及业务逻辑 */}
            			<i>like</i>
            			<i>share</i>
            		</div>
            	</div>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default SongBrief;
