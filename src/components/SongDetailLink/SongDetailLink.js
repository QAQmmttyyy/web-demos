import React from 'react';
import { Link } from 'react-router-dom';

class SongDetailLink extends React.Component {
  render() {
    return (
      <div style={{ marginTop: "200px" }}>
        <ul>
          <li>
            <Link to={{
                pathname: "/song",
                search: "?id=11"
              }}
            >
              to Detail
            </Link>
          </li>
          <li>song name</li>
          <li>artist</li>
        </ul>
      </div>
    );
  }
}

export default SongDetailLink;
