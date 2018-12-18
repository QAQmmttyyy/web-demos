import React from 'react';
import { NavLink } from 'react-router-dom';

import './LinkMenuItem.scss';

class LinkMenuItem extends React.Component {
  render() {
    const { to, iconType, children } = this.props;
    
    const iconPrefixCls = 'mty-menu-item-icon';
    const iconCls = `${iconPrefixCls} ${iconPrefixCls}-${iconType}`;

    return (
      <li className="mty-menu-item">
        <NavLink 
          to={to}
          activeClassName="mty-menu-item-selected"
        >
          <i className={iconCls}></i>
          <span>{children}</span>
        </NavLink>
      </li>
    );
  }
}

export default LinkMenuItem;
