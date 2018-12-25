import React from 'react';
import { Route } from 'react-router-dom';

import Tabs from '../Tabs/Tabs.jsx';
import Personality from '../Personality/Personality';
import PlayList from '../PlayList/PlayList';
import DjRadio from '../DjRadio/DjRadio';

class Discover extends React.Component {
  render() {
    const { match } = this.props;
    const tabsInfo = [
      {
        to: `${match.url}`,
        desc: '个性推荐',
      },
      {
        to: `${match.url}/playlist`,
        desc: '歌单',
      },
      {
        to: `${match.url}/djradio`,
        desc: '主播电台',
      },
      {
        to: `${match.url}/toplist`,
        desc: '排行榜',
      },
      {
        to: `${match.url}/artist`,
        desc: '歌手',
      },
      {
        to: `${match.url}/latest`,
        desc: '最新音乐',
      }
    ];
    return (
      <React.Fragment>
        <Tabs
          info={tabsInfo}
          justify="center"
        />

        <hr style={{
          margin: '-1px 0 0',
          borderWidth: 0,
          borderTop: '1px solid #e1e1e1',
        }}/>
        {/* 二级路由 */}
        <Route exact path={`${match.path}`} component={Personality}/>
        <Route path={`${match.path}/playlist`} component={PlayList}/>
        <Route path={`${match.path}/djradio`} component={DjRadio}/>
      </React.Fragment>
    );
  }
}

export default Discover;
