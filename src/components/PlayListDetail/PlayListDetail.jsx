import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import l_lang from 'lodash/lang';

import PlayerContext from '../../context/PlayerContext';
import SongTable from '../SongTable/SongTable.jsx';
import Tabs from '../Tabs/Tabs.jsx';

import './PlaylistDetail.scss';

class PlaylistDetail extends React.Component {

  constructor(props) {
    super(props);
    // 动态版从API取数据。
    this.state = {
      plDetail: {}
    };
    this.plID = '';
  }

  componentDidMount() {
    // p0 页数 可变
    const pldUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlist_detail/p0/pl-${this.plID}.json`;

    window.fetch(pldUrl).then(
      response => response.statusText === 'OK' ? response.json() : {}
    ).then(
      data => {
        console.log(data.songlist);
        this.setState({ plDetail: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }


  handleClickPlayallOrAddall(funcPlayallOrAddall) {
    const songlist = l_lang.cloneDeep(this.state.plDetail.songlist);
    funcPlayallOrAddall(songlist);
  }

  render() {
    const { location, match } = this.props;
    this.plID = location.search.split('=')[1];

    if (this.state.plDetail.hasOwnProperty('id')) {
      
      const {
        id,
        coverUrl,
        title,
        author,
        publishTime,
        tags,
        intro,
        songNum,
        playNum,
        cmtNum,
        songlist,
      } = this.state.plDetail;
  
      const playCount = playNum >= 10000 ? `${parseInt(playNum / 10000)}万` : playNum;
      const authorLinkParts = author.link.split('?');

      const tabInfo = [
        {
          to: {
            pathname: `${match.url}`,
            search: `?id=${this.plID}`
          },
          desc: `歌曲(${songNum})`,
        },
        {
          to: {
            pathname: `${match.url}/cmts`,
            search: `?id=${this.plID}`
          },
          desc: `评论(${cmtNum})`,
        }
      ];

      return (
        <PlayerContext.Consumer>
          {({ playAll, addAll }) => (
            <React.Fragment>
              <div className="pld-info">
                {/* cover */}
                <img 
                  className="pld-info-cover"
                  src={`${coverUrl}?param=198y198`}
                  alt="cover"
                />
                {/* title */}
                <div className="pld-info-hd">
                  {/* <span className="pld-info-hd-label">歌单</span> */}
                  <h2 className="pld-info-hd-title">{title}</h2>
                  <div className="pld-info-hd-count">
                    <span>播放量</span>
                    <span>{playCount}</span>
                  </div>
                </div>
                {/* author */}
                <div className="pld-info-author">
                  <Link to={{
                      pathname: authorLinkParts[0],
                      search: authorLinkParts[1],
                    }}
                  >
                    <img 
                      className="pld-info-author-avatar"
                      src={`${author.avatarUrl}?param=30y30`}
                      alt="avatar"/>
                    <span className="pld-info-author-name">
                      {author.name}
                    </span>
                  </Link>
                  <span className="pld-info-author-pubtime">
                    {publishTime}
                  </span>
                </div>
                {/* operation */}
                <div className="pld-info-operation">
                  <span 
                    className="pld-info-operation-btn pld-info-operation-playall"
                    onClick={() => {this.handleClickPlayallOrAddall(playAll)}}
                  >
                    <i className="pld-info-operation-icon playall"></i>
                    播放
                  </span>
                  <span 
                    className="pld-info-operation-btn pld-info-operation-addall"
                    onClick={() => {this.handleClickPlayallOrAddall(addAll)}}
                  >
                    <i className="pld-info-operation-icon addall"></i>
                    添加
                  </span>
                </div>
                {/* tags */}
                <p className="pld-info-tags">
                  <span>标签：</span>
                  {tags.map((tag, index) => {
                    const parts = tag.link.split('?');
                    return (
                      <Link
                        key={index}
                        to={{ pathname: parts[0], search: parts[1] }}
                      >
                        {tag.tagName}
                      </Link>
                    );
                  })}
                </p>
                {/* intro */}
                {/* <p className="pld-info-intro">
                  <span>简介：</span>
                  {intro.slice(3)}
                </p> */}
              </div>

              <Tabs info={tabInfo}/>
              <Switch>
                <Route 
                  path={`${match.path}`} 
                  render={() => {
                    
                    return (<SongTable songlist={songlist}/>);
                  }}
                />
                <Route 
                  path={`${match.path}/cmts`} 
                  render={() => (<div>评论</div>)}
                />
              </Switch>
              
            </React.Fragment>
          )}
        </PlayerContext.Consumer>
      );
    } else {
      // TODO 占位符元素
      return (<div></div>);
    }

  }
}

export default PlaylistDetail;
