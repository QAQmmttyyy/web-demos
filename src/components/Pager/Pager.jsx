import React from 'react';
import { Link } from 'react-router-dom';

import './Pager.scss';

class Pager extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      pageTotal: this.props.pageTotal,
      pageNumArr: [],
      currentPage: 1,
    };
    this.pNumArrLE = [];
    this.pNumArrRE = [];
  }

  componentDidMount() {
    const 
      pTotal = this.state.pageTotal,
      pNumArrRE = this.pNumArrRE;
    
    let pNumArr = [];
    
    // 计算初始 pageNumArr 只提供九个页码块
    if (pTotal > 10) {
      // pNumArrLE
      for (let i = 1; i < 9; i++) {
        pNumArr.push(i);
      }
      pNumArr.push('···', pTotal);
      this.pNumArrLE = pNumArr;

      // pNumArrRE
      for (let j = pTotal; j > (pTotal - 8); j--) {
        pNumArrRE.push(j);
      }
      pNumArrRE.push('···', 1);
      this.pNumArrRE = pNumArrRE.reverse();

    } else {
      for (let i = 1; i <= pTotal; i++) {
        pNumArr.push(i);
      }
    }
    
    this.setState({ pageNumArr: pNumArr });
  }

  handleClickNum(funcGetList, pNum) {
    const pTotal = this.state.pageTotal;
    const curPage = this.state.currentPage;
    let pageNumArr = [];

    if (pNum === curPage) {
      return;
    }
    // 获取数据
    funcGetList(pNum - 1);
    // 计算 pageNumArr currentPage
    
    if (pTotal > 10) {

      if (pNum <= 5) {
        pageNumArr = this.pNumArrLE;

      } else if ((pTotal - pNum) < 5) {
        pageNumArr = this.pNumArrRE;
        
      } else {
        const pNumArrMid = [];
        pNumArrMid.push(1, '···');

        for (let i = (pNum - 3); i <= (pNum + 3); i++) {
          pNumArrMid.push(i)
        }

        pNumArrMid.push('···', pTotal);
        pageNumArr = pNumArrMid;
      }

      this.setState({ 
        pageNumArr: pageNumArr,
        currentPage: pNum
      });
      
    } else {
      this.setState({ currentPage: pNum });
    }
  }

  render() {
    if (this.state.pageNumArr.length === 0) {
      return <div></div>;
    }

    // Playlists 传过来的获取数据方法。
    const { getListData } = this.props;
    const curPage = this.state.currentPage;
    const pTotal = this.state.pageTotal;

    const pNumElArr = this.state.pageNumArr.map((val, idx) => {
      let el = null;

      if ((typeof val) === 'number') {
        el = (
          <a 
            key={idx}
            className={
              (val === curPage) ? `p-num selected` : 'p-num'
            }
            onClick={() => this.handleClickNum(getListData, val)}
          >
            {val}
          </a>
        );

      } else if ((typeof val) === 'string') {
        el = (
          <span className="p-dot" key={idx}>
            {val}
          </span>
        );
      }

      return el;
    });

    
    const
      prvPage = (curPage - 1) < 1 ? 1 : curPage - 1,
      nxtPage = (curPage + 1) > pTotal ? pTotal : curPage + 1;

    return (
      <div className="p-pager">
        <a 
          className="btn prev"
          onClick={() => this.handleClickNum(getListData, prvPage)}
        >
          上一页
        </a>
        {pNumElArr}
        <a 
          className="btn next"
          onClick={() => this.handleClickNum(getListData, nxtPage)}
        >
          下一页
        </a>
      </div>
    );
  }
}

export default Pager;