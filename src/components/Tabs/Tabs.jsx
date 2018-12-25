import React from 'react';
import { NavLink } from 'react-router-dom';

import './Tabs.scss';
// TODO 支持定制height
class Tabs extends React.Component {
  render() {
    const { info, justify } = this.props;

    const tabsCls = `mty-tabs mty-tabs-${
      justify ? justify : 'left'
    }`;

    return (
      <ul className={tabsCls}>
        {info.map((tab, index) => (
          <li
            key={index}
            className="mty-tabs-item"
          >
            <NavLink 
              exact
              to={tab.to}
              activeClassName="mty-tabs-item-selected"
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
