import React from 'react';
import { Link } from 'react-router-dom';

import './Pager.scss';

class Pager extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      pageTotal: this.props.pageTotal,
      pageNumArr: [],
    };
    this.currentPage = this.props.currentPage;
    this.diffPage = false;
    this.pNumArrLE = [];
    this.pNumArrRE = [];
  }

  componentDidMount() {
    console.log('pager-DidMount');
    const 
      pTotal = this.state.pageTotal,
      curPage = this.currentPage,
      pNumArrLE = this.pNumArrLE,
      pNumArrRE = this.pNumArrRE;
    
    let pageNumArr = [];
    
    // 计算 pageNumArr 只提供九个页码块
    if (pTotal > 10) {
      // pNumArrLE
      for (let i = 1; i < 9; i++) {
        pNumArrLE.push(i);
      }
      pNumArrLE.push('···', pTotal);

      // pNumArrRE
      for (let j = pTotal; j > (pTotal - 8); j--) {
        pNumArrRE.push(j);
      }
      pNumArrRE.push('···', 1);
      pNumArrRE.reverse();

      // 根据curpage 选定pager布局
      if (curPage <= 5) {
        pageNumArr = pNumArrLE;

      } else if ((pTotal - curPage) < 5) {
        pageNumArr = pNumArrRE;
        
      } else {
        const pNumArrMid = [];
        pNumArrMid.push(1, '···');

        for (let i = (curPage - 3); i <= (curPage + 3); i++) {
          pNumArrMid.push(i)
        }

        pNumArrMid.push('···', pTotal);
        pageNumArr = pNumArrMid;
      }

    } else {
      for (let i = 1; i <= pTotal; i++) {
        pageNumArr.push(i);
      }
    }
    

    this.setState({ pageNumArr: pageNumArr });
  }

  componentDidUpdate() {
    console.log('pager-Update');
    const pTotal = this.state.pageTotal;
    const curPage = this.currentPage;
    let pageNumArr = [];

    if (this.diffPage) {
      // 计算 pageNumArr currentPage
      
      if (pTotal > 10) {
  
        if (curPage <= 5) {
          pageNumArr = this.pNumArrLE;
  
        } else if ((pTotal - curPage) < 5) {
          pageNumArr = this.pNumArrRE;
          
        } else {
          const pNumArrMid = [];
          pNumArrMid.push(1, '···');
  
          for (let i = (curPage - 3); i <= (curPage + 3); i++) {
            pNumArrMid.push(i)
          }
  
          pNumArrMid.push('···', pTotal);
          pageNumArr = pNumArrMid;
        }
  
        this.setState({ 
          pageNumArr: pageNumArr
        });

      }
    }

  }

  handleClickNum(funcGetList, pNum) {
    const pTotal = this.state.pageTotal;
    const curPage = this.currentPage;
    let pageNumArr = [];

    if (pNum === curPage) {
      return;
    }

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
        pageNumArr: pageNumArr
      });
      // currentPage: pNum
    }
    // 获取数据
    // funcGetList(pNum - 1);
    // } else {
    //   this.setState({ currentPage: pNum });
    // }
  }

  render() {
    if (this.state.pageNumArr.length === 0) {
      return <div></div>;
    }

    // Playlists 传过来的获取数据方法。由props驱动页码render
    const { pageTotal, currentPage, urlPath, getListData } = this.props;

    this.diffPage = this.currentPage !== currentPage;
    this.currentPage = currentPage;

    const pNumElArr = this.state.pageNumArr.map((val, idx) => {
      let el = null;

      if ((typeof val) === 'number') {
        el = (val === currentPage) ? (
          <span
            key={idx}
            className="p-num selected"
          >
            {val}
          </span>
        ) : (
          <Link 
            key={idx}
            to={{
              pathname: urlPath,
              search: `?page=${val}`
            }}
            className="p-num"
            onClick={() => this.handleClickNum(getListData, val)}
          >
            {val}
          </Link>
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
      prvPage = (currentPage - 1) < 1 ? 1 : currentPage - 1,
      nxtPage = (currentPage + 1) > pageTotal ? pageTotal : currentPage + 1;

    return (
      <div className="p-pager">
        {currentPage === 1 ? (
          <span className="btn prev">
            上一页
          </span>
        ) : (
          <Link 
            to={{
              pathname: urlPath,
              search: `?page=${prvPage}`
            }}
            className="btn prev"
            onClick={() => this.handleClickNum(getListData, prvPage)}
          >
            上一页
          </Link>
        )}
        {pNumElArr}
        {currentPage === pageTotal ? (
          <span className="btn next">
            下一页
          </span>
        ) : (
          <Link 
            to={{
              pathname: urlPath,
              search: `?page=${nxtPage}`
            }}
            className="btn next"
            onClick={() => this.handleClickNum(getListData, nxtPage)}
          >
            下一页
          </Link>
        )}
      </div>
    );
  }
}

export default Pager;