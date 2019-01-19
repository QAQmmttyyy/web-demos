import React from 'react';
import { NavLink } from 'react-router-dom';

import './Tabs.scss';

class Tabs extends React.Component {
  render() {
    const { info } = this.props;

    return (
      <ul className="u-tab">
        {info.map((tab, index) => (
          <li
            key={index}
            className="tab-item"
          >
            <NavLink 
              exact
              to={tab.to}
              activeClassName="tab-item-selected"
              onClick={() => {
                window.document.getElementById('root').scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth'
                });
              }}
            >
              {tab.desc}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }
}

export default Tabs;
