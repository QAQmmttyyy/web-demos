import React from 'react';

class SongTable extends React.Component {
  render() {
    const { songlist } = this.props;

    const theadField = [
      '#',
      '歌名',
      '歌手',
      '专辑',
      '时长'
    ];
    const thArr = theadField.map((field, index) => (
      <th 
        key={index} 
        style={{ textAlign: 'left' }}>
        {field}
      </th>
    ));
    const trArr = songlist.map((song, index) => {

      const {
        id,
        link,
        name,
        alias,
        duration,
        artists,
        album,
        source,
        cmtNum,
      } = song;

      return (
        <tr key={id}>
          <td style={{width: 36}}>{index}</td>
          <td>
            <span>{name}</span>
          </td>
          <td>
            {artists.map((artist, index, arr) => {
              return (
                (index !== arr.length - 1)
                  ? <a key={index}>{artist.name+'/'}</a>
                  : <a key={index}>{artist.name}</a>
              );
            })}
          </td>
          <td>
            <a>{album.name}</a>
          </td>
          <td>{duration}</td>
        </tr>
      );
    });

    return (
      <table style={{ margin: '0 auto', fontSize: 14, lineHeight: '28px' }}>
        <thead>{thArr}</thead>
        <tbody>{trArr}</tbody>
      </table>
    );
  }
}

export default SongTable;