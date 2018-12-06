import React from 'react';
import { Link } from 'react-router-dom';

class PlayList extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={{ pathname: "/playlist", search: "?id=111" }}>歌单111</Link>
          </li>
          <li>
            <Link to={{ pathname: "/playlist", search: "?id=222" }}>歌单222</Link>
            
          </li>
          <li>
            <Link to={{ pathname: "/playlist", search: "?id=333" }}>歌单333</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default PlayList;
