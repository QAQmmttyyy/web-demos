import React from 'react';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import PlayerContext from '../../context/PlayerContext';
import Pager from '../Pager/Pager.jsx';
import Loading from '../Loading/Loading.jsx';

import './Playlists.scss';

// TODO: 分页
class Playlists extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      playlists: []
    };
    this.getPlaylists = this.getPlaylists.bind(this);
    this.diffPage = false;
    this.curPage = 1;
  }

  componentDidMount() {
    window.setTimeout(() => {this.getPlaylists(this.curPage - 1);}, 100);
  }
  
  componentDidUpdate() {
    if (this.diffPage) {
      window.setTimeout(() => {this.getPlaylists(this.curPage - 1);}, 100);
    }
  }

  handlePlay(funcPlayAll, plId) {
    const plUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlist_detail/all/pl-${plId}.json`;

    window.fetch(plUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => funcPlayAll(data.songlist)
    ).catch(
      reason => console.log(reason)
    );
  }

  getPlaylists(pageIndex) {

    const plsUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/playlists/all/p${pageIndex}.json`;

    window.fetch(plsUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => {
        window.document.getElementById('root').scrollTo({
          top: 0,
          left: 0,
          // behavior: 'smooth'
        });
        this.setState({ playlists: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    const { location } = this.props;
    const newPageNum = location.search ? parseInt(location.search.split('=')[1]) : 1;

    this.diffPage = this.curPage !== newPageNum;
    this.curPage = newPageNum;

    return (
      <PlayerContext.Consumer>
        {({ playAll }) => (
          <React.Fragment>
            <QueueAnim 
              type="bottom"
              style={{
                minHeight: '90vh'
              }}
            >
              <div key="cate" className="pl-cat">
                全部
              </div>
              {(!this.state.playlists.length || this.diffPage) ? (
                <Loading key="loading"/>
              ) : (
                <ul key="cvrlst" className="pl-cvrlst">
                  {this.state.playlists.map((playlist) => {
                    const {
                      id,
                      coverUrl,
                      name,
                      link,
                      playCount,
                      author,
                    } = playlist;

                    const plPath = link.split('?')[0];

                    return (
                      <li key={id}>
                        <div className="cover">
                          <img src={`${coverUrl}?param=140y140`} alt="cover"/>
                          <Link 
                            className="msk"
                            to={{
                              pathname: plPath,
                              search: `?id=${id}`,
                            }}
                          >
                          </Link>
                          <a 
                            className="icon-play" 
                            title="播放"
                            onClick={() => this.handlePlay(playAll, id)}
                          ></a>
                        </div>
                        <p className="dec f-thide">
                          <Link 
                            className="title"
                            title={name}
                            to={{
                              pathname: plPath,
                              search: `?id=${id}`,
                            }}
                          >
                            {name}
                          </Link>
                        </p>
                        <p className="author f-thide">
                          {author.name}
                        </p>
                        <p className="playcount f-thide">
                          播放：{playCount}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </QueueAnim>
            <Pager 
              pageTotal={15} 
              currentPage={this.curPage}
              urlPath={location.pathname}
              getListData={this.getPlaylists}
            />
          </React.Fragment>
        )}
      </PlayerContext.Consumer>
    );
  }
}

export default Playlists;
