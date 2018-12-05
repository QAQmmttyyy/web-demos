import React from 'react';

class PlayListDetail extends React.Component {
  render() {
    const { location, match } = this.props;
    
    return (
      <div>
        <h1>{ `playlist ${location.search}` }</h1>
        <h2>{ `url:${match.url}` }</h2>
        <ul>
          <li>song 1</li>
          <li>song 2</li>
          <li>song 3</li>
        </ul>
      </div>
    );
  }
}

export default PlayListDetail;