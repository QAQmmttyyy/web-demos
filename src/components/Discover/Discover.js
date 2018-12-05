import React from 'react';
import { Route, Link } from 'react-router-dom';
import Personality from '../Personality/Personality';
import PlayList from '../PlayList/PlayList';
import DjRadio from '../DjRadio/DjRadio';

class Discover extends React.Component {
  render() {
    return (
      <div>
        <ul style={{ display: "flex", listStyle: "none" }}>
          <li style={{ marginRight: "20px" }}>
            <Link to={`${match.url}`}>个性推荐</Link>
          </li>
          <li style={{ marginRight: "20px" }}>
            <Link to={`${match.url}/playlist`}>歌单</Link>
          </li>
          <li style={{ marginRight: "20px" }}>
            <Link to={`${match.url}/djradio`}>主播电台</Link>
          </li>
        </ul>

        {/* 二级路由 */}
        <Route exact path={`${match.path}`} component={Personality} />
        <Route path={`${match.path}/playlist`} component={PlayList} />
        <Route path={`${match.path}/djradio`} component={DjRadio} />
      </div>
    );
  }
}

export default Discover;