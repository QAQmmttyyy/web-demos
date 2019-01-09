import React from 'react';

import Menu from './menu/Menu.jsx';
// import SongBrief from './SongBrief/SongBrief.jsx';

import './Sider.scss';

class Sider extends React.Component {
  render() {
    const { menuInfo } = this.props;
    
    return (
      <div className="mty-sider">
        <Menu info={menuInfo}/>
        {/* <SongBrief /> */}
      </div>
    );
  }
}

export default Sider;
