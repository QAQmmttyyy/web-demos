import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Discover from '../Discover/Discover';
import PlayListDetail from '../PlayListDetail/PlayListDetail';
import DjRadioDetail from '../DjRadioDetail/DjRadioDetail';
import VideoDetail from '../VideoDetail/VideoDetail';

class App extends Component {
  render() {
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
}

export default App;
