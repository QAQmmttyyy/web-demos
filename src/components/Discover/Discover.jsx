import React from 'react';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import PlayerContext from '../../context/PlayerContext';
import WingSlider from '../WingSlider/WingSlider.jsx';
// import './Discover.scss';

class Discover extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rcmdData: {}
    };
  }
  
  componentDidMount() {
    const rcmdUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/dicover/rcmd.json`;

    window.fetch(rcmdUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => {
        window.document.getElementById('root').scrollTo({
          top: 0,
          left: 0,
          // behavior: 'smooth'
        });
        this.setState({ rcmdData: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  handlePlayPl(funcPlayAll, plId) {
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

  handlePlayAlb(funcPlayAll, albId) {
    const albumUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/album_detail/all/album-${albId}.json`;

    window.fetch(albumUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => funcPlayAll(data.songlist)
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    if (this.state.rcmdData.hasOwnProperty('playlists')) {

      return (
        <PlayerContext.Consumer>
          {({ playAll }) => (
            <QueueAnim 
              type="bottom" 
              duration={300}
            >
              <WingSlider key="banner"/>
              <div key="plcat" className="pl-cat">
                推荐歌单
              </div>
              <ul key="plcvrlst" className="pl-cvrlst">
                {this.state.rcmdData.playlists.map((playlist) => {
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
                          onClick={() => this.handlePlayPl(playAll, id)}
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

              <div key="albcat" className="alb-cat">
                新碟上架
              </div>
              <ul key="albcvrlst" className="alb-cvrlst">
                {this.state.rcmdData.albums.map((album) => {
                  const {
                    id,
                    coverUrl,
                    title,
                    link,
                    artists,
                  } = album;

                  const albPath = link.trim().split('?')[0];

                  let artistsTitle = '';
                  const 
                    lastArtistIdx = artists.length - 1,
                    artistArr = artists.map((artist, index) => {

                      const
                        linkText = (
                          index !== lastArtistIdx
                        ) ? `${artist.name} / `
                          : `${artist.name}`;
                      
                      artistsTitle += linkText;

                      let 
                        artistLinkPart = '',
                        artistlinkLocation = {};

                      if (artist.link) {
                        artistLinkPart = artist.link.split('?');
                        artistlinkLocation = {
                          pathname: artistLinkPart[0],
                          search: `?${artistLinkPart[1]}`,
                        };
                        return (
                          <Link 
                            key={index}
                            to={artistlinkLocation}
                          >
                            {linkText}
                          </Link>
                        );            
                      }

                      return (
                        <a key={index}>
                          {linkText}
                        </a>
                      );
                    });

                  return (
                    <li key={id}>
                      {/* cover */}
                      <div className="cover">
                        <img src={`${coverUrl}?param=130y130`} alt="cover"/>
                        <Link 
                          className="msk"
                          to={{
                            pathname: albPath,
                            search: `?id=${id}`,
                          }}
                        >
                        </Link>
                        <a 
                          className="icon-play" 
                          title="播放"
                          onClick={() => this.handlePlayAlb(playAll, id)}
                        ></a>
                      </div>
                      {/* title */}
                      <p className="dec f-thide">
                        <Link 
                          title={title}
                          className="title"
                          to={{
                            pathname: albPath,
                            search: `?id=${id}`,
                          }}
                        >
                          {title}
                        </Link>
                      </p>
                      {/* artists */}
                      <p 
                        className="artists f-thide"
                        title={artistsTitle}
                      >
                        <span className="nm">
                          {artistArr}
                        </span> 
                      </p>
                    </li>
                  );
                })}
              </ul>
            </QueueAnim>
          )}
        </PlayerContext.Consumer>
      );

    } else {
      return <div></div>;
    }
  }
}

export default Discover;
