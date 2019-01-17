import React from 'react';
import { Link } from "react-router-dom";
import l_lang from 'lodash/lang';

import PlayerContext from '../../context/PlayerContext';
import SongTable from '../SongTable/SongTable.jsx';

import './AlbumDetail.scss';

class AlbumDetail extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      albumInfo: {}
    };
  }

  componentDidMount() {
    // p0 页数 可变
    const albumUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/album_detail/p1/album-${this.albumId}.json`;

    window.fetch(albumUrl).then(
      response => response.statusText === 'OK' ? response.json() : {}
    ).then(
      data => {
        console.log(data.songlist);
        this.setState({ albumInfo: data });
      }
    ).catch(
      reason => console.log(reason)
    );
  }

  handleClickPlayallOrAddall(funcPlayallOrAddall) {
    const songlist = l_lang.cloneDeep(this.state.albumInfo.songlist);
    funcPlayallOrAddall(songlist);
  }

  render() {
    const { location } = this.props;
    this.albumId = location.search.split('=')[1];

    if (this.state.albumInfo.hasOwnProperty('id')) {
      
      const {
        id,
        coverUrl,
        title,
        subTitle,
        artists,
        publishTime,
        publisher,
        songlist,
      } = this.state.albumInfo;

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
        <PlayerContext.Consumer>
          {({ playAll, addAll }) => (

            <React.Fragment>
              <div className="ad-info">
                {/* cover */}
                <div className="ad-info-cover">
                  <img 
                    src={`${coverUrl}?param=177y177`}
                    alt="cover"
                  />
                  <span className="msk"></span>
                </div>
                {/* title */}
                <div className="ad-info-hd">
                  {/* <span className="ad-info-hd-label">歌单</span> */}
                  <h2 className="title">{title}</h2>
                  <p className="subtitle">{subTitle}</p>
                </div>
                {/* artists */}
                <div 
                  className="ad-info-artists"
                  title={artistsTitle}
                >
                  <span>歌手：</span>
                  {artistArr}
                </div>
                {/* publishtime */}
                <div className="ad-info-pubtime">
                  <span>发行时间：</span>
                  {publishTime}
                </div>
                {/* publisher */}
                {publisher ? (
                  <div className="ad-info-publisher">
                    <span>发行公司：</span>
                    {publisher}
                  </div>                  
                ) : null}
                {/* operation */}
                <div className="ad-info-operation">
                  <span 
                    className="btn playall"
                    onClick={() => {this.handleClickPlayallOrAddall(playAll)}}
                  >
                    <i className="icon play"></i>
                    播放
                  </span>
                  <span 
                    className="btn addall"
                    onClick={() => {this.handleClickPlayallOrAddall(addAll)}}
                  >
                    <i className="icon add"></i>
                    添加
                  </span>
                </div>
              </div>
              <SongTable 
                songlist={songlist}
                hasAlbum={false}
              />
            </React.Fragment>
          )}
        </PlayerContext.Consumer>
      );
    } else {
      // TODO 占位符元素
      return (<div>加载中...</div>);
    }

  }
}

export default AlbumDetail;