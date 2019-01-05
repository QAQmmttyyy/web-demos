import React from 'react';
import { Link } from 'react-router-dom';

import PlayerContext from '../../../context/PlayerContext';

import './SongTable.scss';

class SongTable extends React.Component {
  render() {
    const { songlist } = this.props;

    const theadField = ['#', '', '音乐', '专辑', '时长'];

    const thArr = theadField.map((field, index) => (
      <th 
        key={index}
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

      return (
        <tr 
          key={id}
        >
          {/* # */}
          <td className="st-td-index">
            {index + 1}
          </td>
          {/* 收藏 */}
          <td className="st-td-like">
            <span className="btn like">like</span>
          </td>
          {/* 歌名|歌手 */}
          <td className="st-td-music">
            <div className="cnt-wrap">
              <div className="info">
                <h4 className="name f-thide">
                  <Link 
                    to={songLinkLocation}
                    title={name}
                  >
                    {name}
                  </Link>
                </h4>
                <h5 className="artists f-thide">
                  {artistArr}
                </h5>
              </div>
              <div className="operation">
                <span className="btn play">play|pause</span>
                <span className="btn add">add|delete</span>
              </div>
            </div>
          </td>
          {/* 专辑 */}
          <td className="st-td-album">
            <Link to={albumLinkLocation}>
              {album.name}
            </Link>
          </td>
          {/* 时长 */}
          <td className="st-td-duration">
            {duration}
          </td>
        </tr>
      );
    });

    // render return
    return (
      <table className="st-table">
        <thead>
          <tr>{thArr}</tr>
        </thead>
        <tbody>{trArr}</tbody>
      </table>
    );
  }
}

export default SongTable;