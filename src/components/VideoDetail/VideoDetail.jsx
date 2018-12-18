import React from 'react';

class VideoDetail extends React.Component {
  render() {
    const { location, match } = this.props;

    return (
      <div 
        style={{
          position: "absolute",
          top: "20px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#999"
        }}
      >
        <h1>{ `video ${location.search}` }</h1>
        <h2>{ `url:${match.url}` }</h2>
        <p>video</p>
      </div>
    );
  }
}

export default VideoDetail;
