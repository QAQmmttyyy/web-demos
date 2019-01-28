import React from 'react';
import { Link } from "react-router-dom";

import _ from 'lodash';

import CoverPlaceholder from '../../images/cover-placeholder.png';
import './SongDetail.scss';

class SongDetail extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      lyric: [],
      timestampArr: [],
      wheelDeltaY: 0,
    };
    this.getLyric = this.getLyric.bind(this);

    this.songId = 0;
    this.diffSong = false;
    this.curLyricIndex = -1;
    this.wheelEvTimerId = -1;
  }

  componentDidMount() {
    this.getLyric();
  }
  componentDidUpdate() {
    // 对应songdetail 一直处于打开状态。
    if (this.diffSong) {
      this.getLyric();
    }
  }

  handleWheelScroll(ev) {
    const wDeltaY = ev.deltaY;

    this.setState(state => ({
      wheelDeltaY: state.wheelDeltaY + wDeltaY
    }));

    if (this.wheelEvTimerId >= 0) {
      console.log(this.wheelEvTimerId);
      window.clearTimeout(this.wheelEvTimerId);
    }

    this.wheelEvTimerId = window.setTimeout(
      () => this.setState({ wheelDeltaY: 0 }), 
      2000
    );
  }

  getLyric() {

    // https://music.163.com/api/song/lyric?id=16835284&lv=0&tv=0
    // lv 表示 lrc 原文歌词
    // tv 表示 tlyric 翻译歌词

    // const lrcUrl = `https://music.163.com/api/song/lyric?id=${this.songId}&lv=1&tv=1`;

    const lrcUrl = `${
      process.env.PUBLIC_URL
    }/api_mock_data/lyric/lyric-${this.songId}.json`;

    window.fetch(lrcUrl).then(
      response => response.statusText === 'OK' ? response.json() : {}
    ).then(
      data => {

        if (data.code === 200 && data.lrc && data.lrc.lyric) {

          const lrcArr = data.lrc.lyric.split('\n');
          // state
          const 
            lyric = [],
            timestampArr = [];

          lrcArr.forEach((lrc) => {
            const matchPart = lrc.match(/\[(.*)\](.*)/);

            if (matchPart) {
              lyric.push(matchPart[2].trim());
              
              const timestampPart = matchPart[1].trim().split(':');
              const part1 = parseInt(timestampPart[0]) * 60;
              const part2 = parseFloat(timestampPart[1]);

              timestampArr.push(part1 + part2);
            }
          });

          console.log(lyric);

          this.setState({
            lyric: lyric,
            timestampArr: timestampArr,
            curLyricIndex: 0,
          });
        }
      }
    ).catch(
      reason => {
        console.log(reason);
        this.setState({
          lyric: [],
          timestampArr: [],
          wheelDeltaY: 0,
        });
      }
    );
  }

  render() {
    // curTimestamp 六位小数
    const { transitionClass, curSong, curTimestamp, toggleSongDetail } = this.props;
    const { lyric, timestampArr, wheelDeltaY } = this.state;

    this.isToReset = _.isEmpty(curSong);

    if (this.isToReset) {
      return (
        <div className={`sd-container ${transitionClass}`}>
          <div 
            className="backimg"
            style={{ backgroundImage: `url(${CoverPlaceholder})` }}
          >
          </div>
          <div className="backimg-mask"></div>
        </div>
      );
    }
    // 歌曲不同 componentDidUpdate 才执行获取数据，避免render-update无限循环
    this.diffSong = this.songId !== curSong.id;
    this.songId = curSong.id;

    let 
      curLyricIndex = 0,
      sentenceArr = [],
      translateY = 0,
      maxTranslateY = 0;

    if (lyric.length) {
      // curLyricIndex
      curLyricIndex = _.findLastIndex(timestampArr, val => val < curTimestamp);
      this.curLyricIndex = curLyricIndex;
      // sentenceArr
      sentenceArr = lyric.map((val, idx) => {
        const lrcCls = `sentence${
          idx === curLyricIndex ? ' is-curSentence' : ''
        }`;

        const sentenceEl = (
          <p 
            id={idx}
            key={idx}
            className={lrcCls}
          >
            {val}
          </p>
        );

        return sentenceEl;
      });

      // 34px 为一行歌词的行高
      translateY = 128 - curLyricIndex * 34 - wheelDeltaY;
      maxTranslateY = 128 - lyric.length * 34;

      if (translateY < maxTranslateY) {
        translateY = maxTranslateY;
      }
    }

    // song info
    const {
      name,
      artists,
      album,
      source,
    } = curSong;

    // album cover 
    let imgSrc = '';
    // 判断条件可能要改
    if (album.picUrl.length) {
      imgSrc = `${album.picUrl}?param=404y404`;
    } else {
      imgSrc = CoverPlaceholder;
    }

    // name
    const 
      matched = name.match(/(.*)( - \(.*\))/),
      songName = matched ? matched[1] : name,
      songAlias = matched ? matched[2] : null;

    // artists
    let artistsTitle = '';
    const 
      lastArtistIdx = artists.length - 1,
      artistArr = artists.map((artist, index) => {

        let 
          artistEl = null,
          artistLinkPart = '',
          artistlinkLocation = {};

        if (artist.link) {

          artistLinkPart = artist.link.split('?');
          artistlinkLocation = {
            pathname: artistLinkPart[0],
            search: `?${artistLinkPart[1]}`,
          };

          artistEl = (
            <Link 
              key={index}
              to={artistlinkLocation}
            >
              {artist.name}
            </Link>
          );

        } else {
          artistEl = (
            <span key={index}>
              {artist.name}
            </span>
          );
        }

        if (index !== lastArtistIdx) {
          artistsTitle += `${artist.name} / `;
          return [artistEl, ' / '];
        }

        artistsTitle += artist.name;
        return artistEl;
        
      });

    // album
    const 
      albumLinkPart = album.link.split('?'),
      albumLinkLocation = {
        pathname: albumLinkPart[0],
        search: `?${albumLinkPart[1]}`,
      };

    // source
    const 
      sourceLinkPart = source.link.split('?'),
      sourceLinkLocation = {
        pathname: sourceLinkPart[0],
        search: `?${sourceLinkPart[1]}`,
      };

    return (
      <div className={`sd-container ${transitionClass}`}>
        
        <div 
          className="sd-content"
          // onMouseDown={(ev) => ev.preventDefault()}
        >
          <span 
            className="close-btn"
            onClick={(ev) => {
              if (ev.button === 0) toggleSongDetail();
            }}
          >
          </span>
          <div 
            className="album-cover"
            style={{ backgroundImage: `url(${imgSrc})` }}
          >
            {/* <img src={imgSrc} alt="cover"/> */}
          </div>
          {/* name */}
          <div className="song-info">
            <h1 
              className="name"
              title={name}
            >
              {songName}
              {songAlias ? (
                <span className="alias">{songAlias}</span>
              ) : null}
            </h1>
            {/* artists */}
            <p 
              className="artists"
              title={artistsTitle}
            >
              歌手：{artistArr}
            </p>
            {/* album */}
            <p className="album">
              专辑：
              <Link 
                to={albumLinkLocation}
                title={album.name}
              >
                {album.name}
              </Link>
            </p>
            {/* source */}
            <p className="source">
              来自：
              <Link 
                to={sourceLinkLocation}
                title={source.title}
              >
                {source.title}
              </Link>
            </p>

            <div className="lyric-box">
              <div 
                className="lyric"
                style={{
                  transition: 'transform 0.35s ease-out 0s',
                  transform: `translateY(${translateY}px)`,
                }}
                onWheel={(ev) => this.handleWheelScroll(ev)}
                
              >
                {sentenceArr}
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className="backimg"
          style={{ backgroundImage: `url(${this.isToReset ? CoverPlaceholder : imgSrc})` }}
        >
        </div>
        <div className="backimg-mask"></div>
      </div>
    );

  }
}

export default SongDetail;