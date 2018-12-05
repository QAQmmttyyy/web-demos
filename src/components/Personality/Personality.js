import React from 'react';
import { Link } from 'react-router-dom';

class Personality extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={{ pathname: "/playlist", search: "?id=444" }}>444歌单</Link>
          </li>
          <li>
            <Link to={{ pathname: "/djradio", search: "?id=4" }}>4电台</Link>
          </li>
          <li>
            <Link to={{ pathname: "/video", search: "?id=1" }}>视频1</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Personality;