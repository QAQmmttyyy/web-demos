import React from 'react';
import { Link } from 'react-router-dom';
import PlayerContext from '../PlayerContext';

class SongDetailLink extends React.Component {
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
          let style = {};
          if (this.isEmptyObj(currentSong)) {
            style = {
              display: 'none'
            };
          } else {
            style = {
              marginTop: '200px'
            };
          }
          return (
            <div style={style}>
              <ul>
                <li>
                  <Link to={{
                      pathname: "/song",
                      search: `?id=${currentSong.id}`
                    }}
                  >
                    to Detail
                  </Link>
                </li>
                <li>{currentSong.name}</li>
                <li>{currentSong.artists}</li>
              </ul>
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default SongDetailLink;
