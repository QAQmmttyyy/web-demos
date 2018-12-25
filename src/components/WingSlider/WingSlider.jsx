import React from 'react';
import './WingSlider.scss';

class WingSlider extends React.Component {
  constructor(props) {
    super(props);

    // TODO 从api获取url等数据
    this.state = {
      activeIndex: 0,
      bannerNum: 8,
      bannerNames: [
        'b1.jpg',
        'b2.png',
        'b3.jpg',
        'b4.jpg',
        'b5.jpg',
        'b6.jpg',
        'b7.jpg',
        'b8.jpg',
      ],
    };
  }

  componentDidMount() {
    this.setSliderTimer();
  }

  componentWillUnmount() {
    this.clearSliderTimer();
  }

  // custom util
  setSliderTimer() {
    this.timerID = setInterval(
      () => this.autoToggleBanner(),
      4000
    );
  }
  clearSliderTimer() {
    clearInterval(this.timerID);
  }
  autoToggleBanner() {
    const { activeIndex, bannerNum } = this.state;
    const newActiveIndex = (activeIndex + 1) % bannerNum;

    this.setState({ activeIndex: newActiveIndex });
  }

  // click
  handleClickLeftBtn() {
    const { activeIndex, bannerNum } = this.state;
    const newActiveIndex = (activeIndex - 1 + bannerNum) % bannerNum;

    this.setState({ activeIndex: newActiveIndex });
  }
  handleClickRightBtn() {
    const { activeIndex, bannerNum } = this.state;
    const newActiveIndex = (activeIndex + 1) % bannerNum;

    this.setState({ activeIndex: newActiveIndex });
  }
  // mouse enter|leave
  handleMouseEnterWingSlider() {
    this.clearSliderTimer();
  }
  handleMouseLeaveWingSlider() {
    this.setSliderTimer();
  }
  // mouse over|out
  handleMouseOverIndicatorItem(ev) {
    const newActiveIndex = parseInt(
      ev.currentTarget.getAttribute('data-index')
    );
    
    this.clearSliderTimer();
    this.setState({ activeIndex: newActiveIndex });
  }
  handleMouseOutIndicatorItem() {
    this.setSliderTimer();
  }

  render() {
    const PUBLIC_URL = process.env.PUBLIC_URL;
    const IMG_DIR = 'img_personality_banner';
    const { activeIndex, bannerNum, bannerNames } = this.state;

    const activeLeftIndex = (activeIndex - 1 + bannerNum) % bannerNum;
    const activeRightIndex = (activeIndex + 1) % bannerNum;

    // <img>[]
    const banners = bannerNames.map((name, index) => {

      let bannerCls = 'wing-slider-banner';

      if (activeIndex === index) {
        bannerCls += ` ${bannerCls}-active`;
      } else if (activeLeftIndex === index) {
        bannerCls += ` ${bannerCls}-active-left`;
      } else if (activeRightIndex === index) {
        bannerCls += ` ${bannerCls}-active-right`;
      }

      return (
        <img
          key={index}
          className={bannerCls}
          src={`${PUBLIC_URL}/${IMG_DIR}/${name}`}
          alt={name}
        />
      );
    });

    // <span>[]
    const indicatorItems = [];
    let itemCls = '';

    for (let i = 0; i < bannerNum; i++) {
      itemCls = `indicator-item ${
        i === activeIndex ? 'indicator-item-active' : ''
      }`;

      indicatorItems.push((
        <span
          key={i}
          data-index={i}
          className={itemCls}
          onMouseOver={(ev) => this.handleMouseOverIndicatorItem(ev)}
          onMouseOut={() => this.handleMouseOutIndicatorItem()}
        />
      ));
    }

    return (
      <React.Fragment>
        <div
          className="wing-slider"
          onMouseEnter={() => this.handleMouseEnterWingSlider()}
          onMouseLeave={() => this.handleMouseLeaveWingSlider()}
        >
          <span
            className="wing-slider-btn p-left-0"
            onClick={() => this.handleClickLeftBtn()}
          >
            <i className="wing-slider-left-arrow"></i>
          </span>
          {banners}
          <span 
            className="wing-slider-btn p-right-0"
            onClick={() => this.handleClickRightBtn()}
          >
            <i className="wing-slider-right-arrow"></i>
          </span>
        </div>
        <div className="indicator">
          {indicatorItems}
        </div>
      </React.Fragment>
    );
  }
}

export default WingSlider;
