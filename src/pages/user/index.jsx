import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../../components/header';
import Language from '../../components/language';
import homeConfig from '../../../site_config/home';
import './user.scss';

class User extends Language {
  constructor(props) {
    super(props);
    this.state = {
      headerType: 'dark',
      starCount: 0,
      forkCount: 0,
      index: 0,
    };
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
    const { index } = this.state;
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
          <div className="button1-section" id="buttonleft">
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
          <div className="button-section" id="buttonleft">
            <button onClick={() => this.minusClick(dataSource.userreview.list.length)} >
              <img src="/img/gotoleft.png" />
            </button>
            <div className="overflow-section">
              <ul>
                {
                  dataSource.userreview.list.map((ureview, i) => (
                    <li key={i}>
                      <img src={ureview.img} />
                      <div className="name-section">
                        <p className="pr">{ureview.review} </p>
                        <p className="pn">{ureview.name} </p>
                      </div>
                    </li>
                  ))[index]
                }
              </ul>
            </div>
            <button onClick={() => this.addClick(dataSource.userreview.list.length)}>
              <img src="/img/gotoright.png" />
            </button>
          </div>
        </section>
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<User />, document.getElementById('root'));


export default User;
