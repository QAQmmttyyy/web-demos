import React from 'react';

class SongDetail extends React.Component {
  render() {
    const { location, match } = this.props;

    return (
      <div 
        style={{
          position: "absolute",
          top: "20px",
          left: 0,
          right: 0,
          bottom: "52px",
          backgroundColor: "#999"
        }}
      >
        <h1>{ `song ${location.search}` }</h1>
        <h2>{ `url:${match.url}` }</h2>
        <p>SongDetail</p>
      </div>
    );
  }
}

export default SongDetail;