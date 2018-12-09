import React from 'react';
import { Link } from 'react-router-dom';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    // 动态版从API取数据。
    this.state = {
      playlists: [
        { tid: 111, title: '歌单111' },
        { tid: 222, title: '歌单222' },
        { tid: 333, title: '歌单333' }
      ]
    }
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.playlists.map((playlist) => (
            <li key={playlist.tid}>
              <Link to={{
                  pathname: "/playlist",
                  search: `?tid=${playlist.tid}`
                }}
              >
                {playlist.title}
              </Link>
              <a href="" data-tid={`${playlist.tid}`}>--播放</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PlayList;
