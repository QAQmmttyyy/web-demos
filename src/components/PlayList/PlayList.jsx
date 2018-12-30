import React from 'react';
import { Link } from 'react-router-dom';

import './Playlist.scss';

// TODO: 分页
class Playlist extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      playlists: []
    }
  }

  componentDidMount() {
    const plsUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/discover/playlist/all/p0.json`;

    window.fetch(plsUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => this.setState({ playlists: data })
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    return (
      <div className="pl-wrap">
        <ul className="pl-content">
          {this.state.playlists.map((playlist) => {
            const {
              id,
              coverUrl,
              name,
              link,
              playCount,
              author,
            } = playlist;

            const smallCoverUrl = `${coverUrl}?param=200y200`;
            const plPath = link.split('?')[0];
            {/* const homePath = author.homelink.split('?')[0]; */}

            return (
              <li 
                key={id}
                className="pl-item"
              >
                <div className="pl-item-cover">
                  <Link to={{
                      pathname: plPath,
                      search: `?id=${id}`,
                    }}
                  >
                    <img src={smallCoverUrl} alt="cover"/>
                  </Link>
                  {/* todo: play operation */}
                </div>
                <div className="pl-item-name">
                  <Link to={{
                      pathname: plPath,
                      search: `?id=${id}`,
                    }}
                  >
                    {name}
                  </Link>
                </div>
                <div className="pl-item-author f-thide">
                  <Link to={{
                      pathname: plPath,
                      search: `?id=${id}`,
                    }}
                  >
                    {author.name}
                  </Link>
                </div>
                <div className="pl-item-playcount f-thide">
                  播放量：{playCount}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Playlist;
