import React from 'react';
import { Link } from 'react-router-dom';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songlists: [
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
          {this.state.songlists.map((songlist) => (
            <li key={songlist.tid}>
              <Link to={{
                  pathname: "/playlist",
                  search: `?tid=${songlist.tid}`
                }}
              >
                {songlist.title}
              </Link>
              <a href="" data-tid={`${songlist.tid}`}>--播放</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PlayList;
