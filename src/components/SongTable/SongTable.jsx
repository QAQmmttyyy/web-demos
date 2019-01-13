import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import PlayerContext from '../../context/PlayerContext';

import './SongTable.scss';

class SongTable extends React.Component {

  handlePlayPauseSong(funcPlayPauseSong, songIndex) {
    funcPlayPauseSong(_.cloneDeep(this.props.songlist[songIndex]));
  }
  
  handleAddSong(funcAddSongToNext, songIndex) {
    funcAddSongToNext(_.cloneDeep(this.props.songlist[songIndex]));
  }

  handlePlayPause(funcPlayPause, songIndex) {
    funcPlayPause(songIndex);
  }

  render() {
    const {
      songlist,
      hasLike = true,
      hasAlbum = true,
      hasSource = false,
      inPlaylistPanel = false,
    } = this.props;

    // allField = ['#', ' ', '音乐', '歌手', '专辑', '时长', '来源'];

    return (
      <PlayerContext.Consumer>
        {({ playerState, play, pause, playSong, addSongToNext  }) => {

          const {
            currentSong,
            isPause,
          } = playerState;

          const theadTr = (
            <tr className="st-tr">
              <th className="st-th st-th-index">
                #
              </th>
              {hasLike ? (
                <th className="st-th st-th-like">
                  喜欢
                </th>
              ) : null}
              <th className="st-th">
                音乐
              </th>
              <th className="st-th">
                歌手
              </th>
              {hasAlbum ? (
                <th className="st-th st-th-album">
                  专辑
                </th>
              ) : null}
              {hasSource ? (
                <th className="st-th st-th-source">
                  来源
                </th>
              ) : null}
              <th className="st-th">
                时长
              </th>
            </tr>
          );

          
          {/* tbody tr td */}
          const 
            matchedSongIdx = _.findIndex(songlist, ['id', currentSong.id]),
            trArr = songlist.map((song, index) => {

              const {
                id,
                name,
                duration,
                artists,
                album,
                source,
              } = song;

              const 
                matched = name.match(/(.*)( - \(.*\))/),
                songName = matched ? matched[1] : name,
                songAlias = matched ? matched[2] : null;

              let artistsTitle = '';
              const 
                lastArtistIdx = artists.length - 1,
                artistArr = artists.map((artist, index) => {

                  const
                    linkText = (
                      index !== lastArtistIdx
                    ) ? `${artist.name} / `
                      : `${artist.name}`;
                  
                  artistsTitle += linkText;

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
                trCls = '',
                sttdindexChildren = null,
                operationPlayPauseCls = '',
                operationAddDeleteCls = '',
                funcPlayPauseParam = null;

              if (matchedSongIdx === index) {
                trCls = 'st-tr is-playing';
                sttdindexChildren = (
                  <span className={`wave ${isPause ? 'stop' : ''}`}>
                    <i className="wave-part"></i>
                    <i className="wave-part"></i>
                    <i className="wave-part"></i>
                  </span>
                );
                operationPlayPauseCls = `st-btn ${isPause ? 'st-btn-play' : 'st-btn-pause'}`;
                funcPlayPauseParam = isPause 
                  ? inPlaylistPanel 
                    ? play 
                    : playSong 
                  : pause;
                
              } else {
                trCls = 'st-tr';
                sttdindexChildren = index + 1;
                operationPlayPauseCls = 'st-btn st-btn-play';
                funcPlayPauseParam = inPlaylistPanel ? play : playSong;
              }

              const 
                sourceLinkPart = source.link.split('?'),
                sourceLinkLocation = {
                  pathname: sourceLinkPart[0],
                  search: `?${sourceLinkPart[1]}`,
                };

              return (
                <tr key={id} className={trCls}>
                  <td className="st-td st-td-index">
                    {sttdindexChildren}
                  </td>
                  {/* 收藏 */}
                  {(hasLike) ? (
                    <td className="st-td st-td-like">
                      <span className="st-btn st-btn-like">like</span>
                    </td>
                  ) : null}
                  {/* 音乐 */}
                  <td className="st-td">
                    <div className="st-td-music">
                      <div className="st-td-music-info">
                        <h4 
                          className="st-td-music-info-name f-thide"
                          title={name}
                        >
                          {songName}
                          {songAlias ? (
                            <span className="alias">{songAlias}</span>
                          ) : null}
                        </h4>
                        {/* <h5 className="st-td-music-info-artists f-thide">
                          {artistArr}
                        </h5> */}
                      </div>
                      {inPlaylistPanel ? (
                        <div className="st-td-music-operation">
                          <span 
                            className={operationPlayPauseCls}
                            onClick={() => {this.handlePlayPause(funcPlayPauseParam, index)}}
                          >
                            play|pause
                          </span>
                        </div>
                      ) : (
                        <div className="st-td-music-operation">
                          <span 
                            className={operationPlayPauseCls}
                            onClick={() => {this.handlePlayPauseSong(funcPlayPauseParam, index)}}
                          >
                            play|pause
                          </span>
                          <span 
                            className="st-btn st-btn-add"
                            onClick={() => this.handleAddSong(addSongToNext, index)}
                          >
                            add|delete
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="st-td">
                    <div 
                      className="st-td-artists f-thide"
                      title={artistsTitle}
                    >
                      {artistArr}
                    </div>
                  </td>
                  {/* 专辑 */}
                  {hasAlbum ? (
                    <td className="st-td">
                      <div className="st-td-album">
                        <Link 
                          to={albumLinkLocation}
                          title={album.name}
                        >
                          {album.name}
                        </Link>
                      </div>
                    </td>
                  ) : null}
                  {/* 来源 */}
                  {(hasSource) ? (
                    <td className="st-td">
                      <div className="st-td-source">
                        <Link 
                          to={sourceLinkLocation}
                          title={source.title}
                          className="st-btn st-btn-source"
                        >
                          来源
                        </Link>
                      </div>
                    </td>
                  ) : null}
                  {/* 时长 */}
                  <td className="st-td st-td-duration">
                    {/* <div className=""> */}
                    {duration}
                    {/* </div> */}
                  </td>
                </tr>
              );
            });

          {/* Consumer return */}
          return (
            <table className="st-table">
              <thead className="st-thead">
                {theadTr}
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