import React from 'react';
import SubMenu from './SubMenu';
import './Menu.scss';

class Menu extends React.Component {
  render() {
    const { info } = this.props;
    const subMenus = [];

    info.forEach((subMenuInfo, index) => {
      subMenus.push(
        <SubMenu
          key={index}
          info={subMenuInfo}
        />
      );
    });

    return (
      <ul className="mty-menu">{subMenus}</ul>
    );
  }
}

export default Menu;
