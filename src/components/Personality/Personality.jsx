import React from 'react';
import { Link } from 'react-router-dom';
import WingSlider from '../WingSlider/WingSlider.jsx';

class Personality extends React.Component {
  render() {
    return (
      <React.Fragment>
        <WingSlider/>

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
      </React.Fragment>
    );
  }
}

export default Personality;