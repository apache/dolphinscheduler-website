import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../../components/header';
import Language from '../../components/language';
import homeConfig from '../../../site_config/home';
import './user.scss';
import Footer from '../../components/footer';
import Swiper, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

Swiper.use([Navigation, Pagination]);
class User extends Language {
  constructor(props) {
    super(props);
    this.state = {
      headerType: 'dark',
      starCount: 0,
      forkCount: 0,
      index: 0,
      swiper: null,
    };
  }

  componentDidMount() {
    this.swiper = new Swiper('.swiper-container', {
      loop: true,
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

  render() {
    const language = this.getLanguage();
    const { headerType } = this.state;
    const headerLogo = headerType === 'normal' ? '/img/hlogo_colorful.svg' : '/img/hlogo_white.svg';
    const dataSource = homeConfig[language];
    return (
      <div className="user-page">
        <section className="top-section">
          <Header
            currentKey="user"
            type={headerType}
            logo={headerLogo}
            language={language}
            onLanguageChange={this.onLanguageChange}
          />
        </section>
        <section className="ourusers-section">
          <h3>
            {dataSource.ourusers.title}
          </h3>
          <div className="button1-section">
            <div className="overflow-section">
              <ul>
                {
                  dataSource.ourusers.list.map((ureview, i) => (
                    <li key={i}>
                      <img src={ureview.img} />
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </section>
        <section className="review-section">
          <h3>{dataSource.userreview.title}</h3>
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {
                dataSource.userreview.list.map((ureview, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="slide-content">
                      <div className="img-box">
                        <img src={ureview.img} />
                      </div>
                      <div className="name-section">
                        <p className="pr">{ureview.review} </p>
                        <p className="pn">{ureview.name} </p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="swiper-button-next" />
            <div className="swiper-button-prev" />
            <div className="swiper-pagination" />
          </div>
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<User />, document.getElementById('root'));


export default User;
