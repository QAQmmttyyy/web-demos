import React from 'react';

class PlayListDetail extends React.Component {
  constructor(props) {
    super(props);
    // 动态版从API取数据。
    this.state = {
      tid: 111,
      songlist: [
        {
          id: 11,
          name: '越伤越爱',
          artists: '何洁',
          url: '何洁 - 越伤越爱.mp3'
        },
        {
          id: 22,
          name: '最后一页',
          artists: '江语晨',
          url: '江语晨 - 最后一页.mp3'
        },
        {
          id: 33,
          name: '无问',
          artists: '毛不易',
          url: '毛不易 - 无问.mp3'
        },
        {
          id: 44,
          name: '放下',
          artists: '徐薇',
          url: '徐薇 - 放下.mp3'
        }
      ]
    }
  }

  render() {
    const { location } = this.props;
    
    return (
      <div>
        <h1>{ `playlist ${location.search}` }</h1>
        <h4><a href="">播放全部</a></h4>
        <ul>
          {this.state.songlist.map((song) => (
            <li key={song.id}>{song.name}-{song.artists}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PlayListDetail;