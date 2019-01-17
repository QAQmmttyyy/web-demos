import React from 'react';
import { Link } from 'react-router-dom';

import PlayerContext from '../../context/PlayerContext';
import Pager from '../Pager/Pager.jsx';

import './Albums.scss';

// TODO: 分页
class Albums extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      albums: []
    };
    this.getAlbums = this.getAlbums.bind(this);
  }

  componentDidMount() {
    this.getAlbums(0);
  }

  handlePlay(funcPlayAll, albId) {
    const albumUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/album_detail/p1/album-${albId}.json`;

    window.fetch(albumUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => funcPlayAll(data.songlist)
    ).catch(
      reason => console.log(reason)
    );
  }

  getAlbums(pageIndex) {
    const pageNum = pageIndex + 1;

    const plsUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/albums/all/p${pageNum}.json`;

    window.fetch(plsUrl).then(
      response => response.statusText === 'OK' ? response.json() : ''
    ).then(
      data => {
        window.document.getElementById('root').scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        this.setState({ albums: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  render() {
    return (
      <PlayerContext.Consumer>
        {({ playAll }) => (

          <React.Fragment>
            <div className="alb-cat">
              全部
            </div>
            <ul className="alb-cvrlst">
              {this.state.albums.map((album) => {
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
                        onClick={() => this.handlePlay(playAll, id)}
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
            <Pager pageTotal={10} getListData={this.getAlbums}/>
          </React.Fragment>
        )}
      </PlayerContext.Consumer>
    );
  }
}

export default Albums;
