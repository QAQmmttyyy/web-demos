import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';

import './SongTable.scss';

class SongTable extends React.Component {

  handleClickPlay(funcPlaySong, songIndex) {
    funcPlaySong(_.cloneDeep(this.props.songlist[songIndex]));
  }

  handleClickAdd(funcAddSongToNext, songIndex) {
    funcAddSongToNext(_.cloneDeep(this.props.songlist[songIndex]));
  }

  render() {
    const { songlist } = this.props;

    const theadField = ['#', '', '音乐', '专辑', '时长'];

    return (
      <PlayerContext.Consumer>
        {({ playerState, pause, playSong, addSongToNext  }) => {

          const {
            currentSong,
            isPause,
          } = playerState;

          const matchedSongIdx = _.findIndex(songlist, ['id', currentSong.id]);

          const thArr = theadField.map((field, index) => (
            <th 
              key={index}
              className="st-th"
            >
              {field}
            </th>
          ));

          const trArr = songlist.map((song, index) => {

            const {
              id,
              link,
              name,
              // alias,
              duration,
              artists,
              album,
              // source,
              // cmtNum,
            } = song;

            const 
              songLinkPart = link.split('?'),
              songLinkLocation = {
                pathname: songLinkPart[0],
                search: `?${songLinkPart[1]}`,
              };

            const 
              lastArtistIdx = artists.length - 1,
              artistArr = artists.map((artist, index, arr) => {

                const
                  linkText = (
                    index !== lastArtistIdx
                  ) ? `${artist.name} / `
                    : `${artist.name}`;

                let 
                  artistLinkPart = '',
                  artistlinkLocation = {};

                if (artist.link) {
                  artistLinkPart = artist.link.split('?');
                  artistlinkLocation = {
                    pathname: artistLinkPart[0],
                    search: `?${artistLinkPart[1]}`,
                  };
                  return (
                    <Link 
                      key={index}
                      to={artistlinkLocation}
                    >
                      {linkText}
                    </Link>
                  );            
                }

                return (
                  <a key={index}>
                    {linkText}
                  </a>
                );
              });

            const 
              albumLinkPart = album.link.split('?'),
              albumLinkLocation = {
                pathname: albumLinkPart[0],
                search: `?${albumLinkPart[1]}`,
              };

            let 
              sttdindexChildren = null,
              operationPlayPauseCls = '',
              operationAddDeleteCls = '',
              funcPlayPauseParam = null;

            if (matchedSongIdx === index) {

              sttdindexChildren = (
                <span className={`wave ${isPause ? 'stop' : ''}`}>
                  <i className="wave-part"></i>
                  <i className="wave-part"></i>
                  <i className="wave-part"></i>
                </span>
              );
              operationPlayPauseCls = `st-btn ${isPause ? 'st-btn-play' : 'st-btn-pause'}`;
              funcPlayPauseParam = isPause ? playSong : pause;
              
            } else {
              sttdindexChildren = index + 1;
              operationPlayPauseCls = 'st-btn st-btn-play';
              funcPlayPauseParam = playSong;
            }

            return (
              <tr key={id} className="st-tr">
                {/* # */}
                <td className="st-td st-td-index">
                  {sttdindexChildren}
                </td>
                {/* 收藏 */}
                <td className="st-td st-td-like">
                  <span className="st-btn st-btn-like">like</span>
                </td>
                {/* 歌名|歌手 */}
                <td className="st-td st-td-music">
                  <div className="st-td-music-cnt-wrap">
                    <div className="st-td-music-info">
                      <h4 className="st-td-music-info-name f-thide">
                        <Link 
                          to={songLinkLocation}
                          title={name}
                        >
                          {name}
                        </Link>
                      </h4>
                      <h5 className="st-td-music-info-artists f-thide">
                        {artistArr}
                      </h5>
                    </div>
                    <div className="st-td-music-operation">
                      <span 
                        className={operationPlayPauseCls}
                        onClick={() => {this.handleClickPlay(funcPlayPauseParam, index)}}
                      >
                        play|pause
                      </span>
                      <span 
                        className="st-btn st-btn-add"
                        onClick={() => this.handleClickAdd(addSongToNext, index)}
                      >
                        add|delete
                      </span>
                    </div>
                  </div>
                </td>
                {/* 专辑 */}
                <td className="st-td st-td-album">
                  <Link 
                    to={albumLinkLocation}
                    title={album.name}
                  >
                    {album.name}
                  </Link>
                </td>
                {/* 时长 */}
                <td className="st-td st-td-duration">
                  {duration}
                </td>
              </tr>
            );
          });

          {/* Consumer return */}
          return (
            <table className="st-table">
              <thead className="st-thead">
                <tr>{thArr}</tr>
              </thead>
              <tbody className="st-tbody">
                {trArr}
              </tbody>
            </table>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

export default SongTable;