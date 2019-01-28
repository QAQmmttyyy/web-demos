import React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.scss';

class Header extends React.Component {

  render() {
    const info = [
      {
        to: '/discover',
        desc: '发现音乐',
      },
      {
        to: '/playlists',
        desc: '歌单',
      },
      // {
      //   to: '/toplist',
      //   desc: '排行榜',
      // },
      // {
      //   to: '/artist',
      //   desc: '歌手',
      // },
      {
        to: '/albums',
        desc: '新碟上架',
      }
    ];

    return (
      <div className="header">
        <div className="mid">
          <span className="logo"></span>
          {/* <h3>Music</h3> */}
          {/* tab 区 */}
          <ul className="tab">
            {info.map((tab, index) => (
              <li
                key={index}
                className="tab-item"
              >
                <NavLink 
                  exact
                  to={tab.to}
                  activeClassName="tab-item-selected"
                >
                  {tab.desc}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Header;
