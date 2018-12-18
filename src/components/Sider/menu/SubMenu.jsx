import React from 'react';
import LinkMenuItem from './LinkMenuItem';

import './SubMenu.scss';

class SubMenu extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true
    };
  }

  toggleOpenClose() {
    this.setState((state) => ({
      isOpen: !state.isOpen
    }));
  }

  render() {
    const { info } = this.props;
    const { title, enableOpenClose, menuItems } = info;
    const items = [];
    
    menuItems.forEach((menuItem, index) => {
      items.push(
        <LinkMenuItem
          to={menuItem.to}
          key={menuItem.id || index}
          iconType={menuItem.iconType}
        >
          {menuItem.description}
        </LinkMenuItem>
      );
    });
    
    let subMenuChildren = [];

    if (enableOpenClose) {
      const subMenuArrowCls = `mty-menu-submenu-arrow mty-menu-submenu-${
        this.state.isOpen ? 'open' : 'close'
      }`;
      const subMenuMenuCls = `mty-menu mty-menu-submenu-menu ${
        this.state.isOpen ? '' : 'dis-hide'
      }`;

      subMenuChildren = [
        <div 
          className="mty-menu-submenu-title"
          onClick={() => this.toggleOpenClose()}
        >
          <span>{title}</span>
          <i className={subMenuArrowCls}>open|close</i>
        </div>,
        <ul className={subMenuMenuCls}>{items}</ul>
      ];
      
    } else {
      subMenuChildren = [
        <div 
          className="mty-menu-submenu-title"
        >
          <span>{title}</span>
        </div>,
        <ul className="mty-menu mty-menu-submenu-menu">{items}</ul>
      ];
    }

    return (
      <li className="mty-menu-submenu">
        {subMenuChildren}
      </li>
    );
  }
}

export default SubMenu;
