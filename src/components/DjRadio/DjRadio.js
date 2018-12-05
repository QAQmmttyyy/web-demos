import React from 'react';
import { Link } from 'react-router-dom';

class DjRadio extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={{ pathname: "/djradio", search: "?id=1" }}>电台1</Link>
          </li>
          <li>
            <Link to={{ pathname: "/djradio", search: "?id=2" }}>电台2</Link>
          </li>
          <li>
            <Link to={{ pathname: "/djradio", search: "?id=3" }}>电台3</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default DjRadio;