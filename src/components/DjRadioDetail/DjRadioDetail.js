import React from 'react';

class DjRadioDetail extends React.Component {
  render() {
    const { location, match } = this.props;
    
    return (
      <div>
        <h1>{ `radio ${location.search}` }</h1>
        <h2>{ `url:${match.url}` }</h2>
        <ul>
          <li>program 1</li>
          <li>program 2</li>
          <li>program 3</li>
        </ul>
      </div>
    );
  }
}

export default DjRadioDetail;