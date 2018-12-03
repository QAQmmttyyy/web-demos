import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function MyApp() {
  return (
    <Router>
      <div style={{position: "relative"}}>
        <header style={{height: "20px"}}>QAQ Music</header>
        <div style={{ display: "flex", height: "600px" }}>
          <div style={{ width: "25%", backgroundColor: "#cccccc" }}>
            <ul style={{ listStyleType: "none", padding: "10px" }}>
              <li>
                <Link to="/discover">发现音乐</Link>
              </li>
              <li>
                <Link to="/fm">私人FM</Link>
              </li>
              <li>
                <Link to="/friend">朋友</Link>
              </li>
            </ul>
          </div>

          <div style={{ flex: "auto", padding: "10px" }}>
            {/* 常规一级路由组件 */}
            <Route path="/discover" component={Discover} />

            {/* 提升层级：歌单/电台详情页路由组件，会有query params，与一级显示区域相同 */}
            <Route path="/playlist" component={PlayListDetail} />
            <Route path="/djradio" component={DjRadioDetail} />

            {/* 提升层级：视频详情页路由组件，会有query params，显示区域为：除header以外 */}
            <Route path="/video" component={VideoDetail} />
          </div>
        </div>
        <footer style={{height: "20px"}}>player</footer>
      </div>
    </Router>
  );
}
// 一级
function Discover({ match }) {
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
// 二级
function Personality() {
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

function PlayList() {
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

function DjRadio() {
  return (
    <div>
      <ul>
        <li>
          <Link to={{ pathname: "/djradio", search: "?id=1" }}>电台1</Link>
        </li>
        <li>
          <Link to={{ pathname: "/djradio", search: "?id=2" }}>电台2</Link>
        </li>
        <li>
          <Link to={{ pathname: "/djradio", search: "?id=3" }}>电台3</Link>
        </li>
      </ul>
    </div>
  );
}

// detail（一级）
function PlayListDetail({ location, match }) {
  return (
    <div>
      <h1>{ `playlist ${location.search}` }</h1>
      <h2>{ `url:${match.url}` }</h2>
      <ul>
        <li>song 1</li>
        <li>song 2</li>
        <li>song 3</li>
      </ul>
    </div>
  );
}

function DjRadioDetail({ location, match }) {
  return (
    <div>
      <h1>{ `radio ${location.search}` }</h1>
      <h2>{ `url:${match.url}` }</h2>
      <ul>
        <li>program 1</li>
        <li>program 2</li>
        <li>program 3</li>
      </ul>
    </div>
  );
}

function VideoDetail({ location, match }) {
  return (
    <div 
      style={{
        position: "absolute",
        top: "20px",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#999"
      }}
    >
      <h1>{ `video ${location.search}` }</h1>
      <h2>{ `url:${match.url}` }</h2>
      <p>video</p>
    </div>
  );
}

export default MyApp;
