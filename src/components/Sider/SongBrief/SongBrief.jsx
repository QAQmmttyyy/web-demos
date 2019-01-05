import React from 'react';
import { Link } from 'react-router-dom';

import PlayerContext from '../../../context/PlayerContext';
import './SongBrief.scss';

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
          const { currentSong } = playerState;

          if (this.isEmptyObj(currentSong)) {
            return;
          }

          const songLocation = {
            pathname: "/song",
            search: `?id=${currentSong.id}`,
          };
          const coverUrl = `${currentSong.album.picUrl}?param=44y44`;
          const coverImg = <img src={coverUrl} alt="cover"/>;
          
          return (
            <div className="mty-song-brief-container">
              <div className="mty-song-brief">
            		{/* cover */}
            		<div className="mty-song-brief-cover">
            			<Link to={songLocation}>
            				{coverImg}
                  </Link>
            		</div>
            		{/* info */}
            		<div className="mty-song-brief-info">
            			<div className="mty-song-brief-info-name">
            				<Link to={songLocation}>
                      {currentSong.name}
                    </Link>
            			</div>
            			<div className="mty-song-brief-info-artists">
                    {/* TODO 连接到歌手详情页 */}
            				<Link to={songLocation}>
                      {currentSong.artists.map(val => val.name).join('/')}
                    </Link>
            			</div>
            		</div>
            		{/* operation */}
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
