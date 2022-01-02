import React from 'react';
import ReactDOM from 'react-dom';
import { getScrollTop, getLink, getKiloUnit } from '../../../utils';
import Header from '../../components/header';
import Button from '../../components/button';
import Footer from '../../components/footer';
import Language from '../../components/language';
import Item from './featureItem';
import homeConfig from '../../../site_config/home';
import './index.scss';
import EventCard from '../community/eventCard';
import debounce from 'lodash/debounce';
import Swiper, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

Swiper.use([Navigation, Pagination]);

const MOBILE_WIDTH = 640;

class Home extends Language {
  constructor(props) {
    super(props);
    this.state = {
      headerType: 'primary',
      starCount: 0,
      forkCount: 0,
      index: 0,
      isMobile: document.body.clientWidth <= MOBILE_WIDTH,
    };
    this.swiper = null;
    this.calculateLayout = null;
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const scrollTop = getScrollTop();
      if (scrollTop > 66) {
        this.setState({
          headerType: 'dark',
        });
      } else {
        this.setState({
          headerType: 'primary',
        });
      }
    });
    this.calculateLayout = debounce(() => {
      this.setState({
        isMobile: document.body.clientWidth <= MOBILE_WIDTH,
      });
    }, 200);
    window.addEventListener('resize', this.calculateLayout);
    // 写死协议，因github会做协议跳转，这种跳转会被Safari拦截
    fetch('https://api.github.com/repos/apache/dolphinscheduler')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          ...this.state,
          starCount: data.stargazers_count,
          forkCount: data.forks_count,
        });
      });
    this.initSwiper();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isMobile !== this.state.isMobile) {
      this.initSwiper();
    }
  }

  componentWillUnmount() {
    if (this.calculateLayout) {
      window.removeEventListener('resize', this.calculateLayout);
    }
  }

  initSwiper() {
    const { isMobile } = this.state;
    // Events swiper
    if (this.swiper) this.swiper.destroy();
    this.swiper = new Swiper('.swiper-container', {
      loop: true,
      slidesPerView: isMobile ? 1 : 3,
      spaceBetween: 30,
      slidesPerGroup: isMobile ? 1 : 3,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  addClick = (length) => {
    if (this.state.index < length - 1) {
      this.setState({
        ...this.state,
        index: this.state.index + 1,
      });
    } else {
      this.setState({
        ...this.state,
        index: 0,
      });
    }
  }

  minusClick = (length) => {
    if (this.state.index > 0) {
      this.setState({
        ...this.state,
        index: this.state.index - 1,
      });
    } else {
      this.setState({
        ...this.state,
        index: length - 1,
      });
    }
  }

  render() {
    const { starCount, forkCount, isMobile } = this.state;
    const language = this.getLanguage();
    const dataSource = homeConfig[language];
    const { headerType } = this.state;
    const headerLogo = headerType === 'normal' ? '/img/hlogo_colorful.svg' : '/img/hlogo_white.svg';
    return (
      <div className="home-page">
        <section className="top-section">
          {
            isMobile ? null : <img className="pc-bg" src="/img/banner.jpg" />
          }
          <Header
            currentKey="home"
            type={headerType}
            logo={headerLogo}
            language={language}
            onLanguageChange={this.onLanguageChange}
          />
          <div className="vertical-middle">
            <div className="product-name">
              <h2>{dataSource.brand.brandName}</h2>
            </div>
            <p className="product-desc">{dataSource.brand.briefIntroduction}</p>
            <div className="button-area">
              {
                dataSource.brand.buttons.map(b => <Button type={b.type} key={b.type} link={b.link} target={b.target}>{b.text}</Button>)
              }
            </div>
            <div className="github-buttons">
              <a href="https://github.com/apache/dolphinscheduler" target="_blank" rel="noopener noreferrer">
                <div className="star">
                  <img src="https://img.alicdn.com/tfs/TB1FlB1JwHqK1RjSZFPXXcwapXa-32-32.png" />
                  <span className="count" style={{ display: starCount ? 'inline-block' : 'none' }}>{getKiloUnit(starCount)}</span>
                </div>
              </a>
              <a href="https://github.com/apache/dolphinscheduler/fork" target="_blank" rel="noopener noreferrer">
                <div className="fork">
                  <img src="https://img.alicdn.com/tfs/TB1zbxSJwDqK1RjSZSyXXaxEVXa-32-32.png" />
                  <span className="count" style={{ display: forkCount ? 'inline-block' : 'none' }}>{getKiloUnit(forkCount)}</span>
                </div>
              </a>
            </div>
            {/* <div className="version-note"> */}
            {/*  <a target="_blank" rel="noopener noreferrer" href={getLink(dataSource.brand.versionNote.link)}>{dataSource.brand.versionNote.text}</a> */}
            {/* </div> */}
            {/* <div className="release-date">{dataSource.brand.releaseDate}</div> */}
          </div>
          <div className="animation animation1" />
          <div className="animation animation2" />
          <div className="animation animation3" />
          <div className="animation animation4" />
          <div className="animation animation5" />
        </section>
        <section className="introduction-section">
          <div className="introduction-body">
            <div className="introduction">
              <h3>{dataSource.introduction.title}</h3>
              <p>{dataSource.introduction.desc}</p>
            </div>
            <img src={getLink(dataSource.introduction.img)} />
          </div>
        </section>
        <section className="feature-section">
          <h3>{dataSource.features.title}</h3>
          <ul>
            {
              dataSource.features.list.map((feature, i) => (
                <Item feature={feature} key={i} />
              ))
            }
          </ul>
        </section>
        <section className="events-section">
          <h3>{dataSource.events.title}</h3>
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {
                dataSource.events.list.map((event, i) => (
                  <div key={i} className="swiper-slide">
                    <EventCard event={event} key={i} />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="swiper-button-next" />
          <div className="swiper-button-prev" />
          <div className="swiper-pagination" />
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Home />, document.getElementById('root'));

export default Home;
