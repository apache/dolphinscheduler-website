import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import siteConfig from '../../../site_config/site';
import { getLink } from '../../../utils';
import MobileMenu from '../mobileMenu/index';
import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style/index.css';
import './index.scss';

const { SubMenu } = Menu;
const languageSwitch = [
  {
    text: '中',
    value: 'en-us',
  },
  {
    text: 'En',
    value: 'zh-cn',
  },
];
const searchSwitch = {
  baidu: {
    logo: 'https://img.alicdn.com/tfs/TB1n6DQayLaK1RjSZFxXXamPFXa-300-300.png',
    url: 'https://www.baidu.com/s?wd=',
  },
  google: {
    logo: 'https://img.alicdn.com/tfs/TB1REfuaCzqK1RjSZFjXXblCFXa-300-300.jpg',
    url: 'https://www.google.com/search?q=',
  },
};
const noop = () => { };
const propTypes = {
  currentKey: PropTypes.string,
  logo: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'normal', 'dark']),
  language: PropTypes.oneOf(['en-us', 'zh-cn']),
  onLanguageChange: PropTypes.func,
};
const defaultProps = {
  type: 'primary',
  language: 'en-us',
  onLanguageChange: noop,
};

@autobind
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.currentKey,
      mobileMemuVisible: false,
      language: props.language,
      search: siteConfig.defaultSearch,
      searchValue: '',
      showBanner: true
    };
  }

  componentDidMount() {
    const parts = window.location.pathname.split('/');
    if (!parts[2] || parts[2] === 'index.html') {
      this.setCurrent('home');
    } else if (siteConfig[this.state.language].pageMenu.some(menu => menu.key === parts[2]) && (parts[2] !== 'docs' || parts[3] === 'latest')) {
      if (parts[2] !== 'docs') {
        this.setCurrent(parts[2]);
      } else if (parts[3] === 'latest') {
        this.setCurrent('docs0');
      }
    } else if (localStorage.getItem('currents')) {
      this.setCurrent(localStorage.getItem('currents'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      language: nextProps.language,
    });
  }

  setCurrent = (key) => {
    localStorage.setItem('currents', key);
    this.setState({
      current: key,
    });
  }

  handleClick = (e) => {
    const key = e.key === 'docs' ? 'docs0' : e.key;
    this.setCurrent(key);
  }

  switchLang() {
    let language;
    if (this.state.language === 'zh-cn') {
      language = 'en-us';
    } else {
      language = 'zh-cn';
    }
    this.setState({
      language,
    });
    this.props.onLanguageChange(language);
  }

  switchSearch() {
    let search;
    if (this.state.search === 'baidu') {
      search = 'google';
    } else {
      search = 'baidu';
    }
    this.setState({
      search,
    });
  }

  toggleSearch() {
    this.setState({
      searchVisible: !this.state.searchVisible,
    });
  }

  onInputChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  goSearch() {
    const { search, searchValue } = this.state;
    window.open(`${searchSwitch[search].url}${window.encodeURIComponent(`${searchValue} site:${siteConfig.domain}`)}`);
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.goSearch();
    }
  }

  preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  toggleMenu(bool) {
    this.setState({
      mobileMemuVisible: bool,
    });
  }

  handleBannerClose = () => {
    this.state.showBanner = false
    this.setState({...this.state})
  }

  render() {
    const { type, logo, onLanguageChange } = this.props;
    const { mobileMemuVisible, language, search, searchVisible, showBanner } = this.state;
    return (
      <header
        className={
          classnames({
            'header-container': true,
            [`header-container-${type}`]: true,
          })
        }
      >
        {
          showBanner ?
          <div className="banner-tips">
            <div>
              {siteConfig[language].banner.text}
              <a className="link-tips" href={siteConfig[language].banner.link}>join #dolphinscheduler channel</a>
              ! 🌟
            </div>
            {/* <div className="banner-close" onClick={this.handleBannerClose}></div> */}
          </div> : null
        }
        <div className="header-body">
          <span
            className={classnames({
              'mobile-menu-btn': true,
              [`mobile-menu-btn-${type}`]: true,
            })}
            onClick={() => this.toggleMenu(!mobileMemuVisible)}
          />
          <a href={getLink(`/${language}/index.html`)}>
            <img className="logo" alt={siteConfig.name} title={siteConfig.name} src={getLink(logo)} />
          </a>
          {
            siteConfig.defaultSearch ?
              (
                <div
                  className={classnames({
                    search: true,
                    [`search-${type}`]: true,
                  })}
                >
                  <span className="icon-search" onClick={this.toggleSearch} />
                  {
                    searchVisible ?
                      (
                        <div className="search-input">
                          <img src={searchSwitch[search].logo} onClick={this.switchSearch} />
                          <input autoFocus onChange={this.onInputChange} onKeyDown={this.onKeyDown} />
                        </div>
                      ) : null
                  }
                </div>
              ) : null
          }
          {
            onLanguageChange !== noop ?
              (
                <span
                  className={
                    classnames({
                      'language-switch': true,
                      [`language-switch-${type}`]: true,
                    })
                  }
                  onClick={this.switchLang}
                >
                  {languageSwitch.find(lang => lang.value === language).text}
                </span>
              )
              :
              null
          }
          <div
            className="header-menu"
          >
            <div>
              <Menu className={type === 'normal' ? 'blackClass' : 'whiteClass'} onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" forceSubMenuRender>
                {siteConfig[language].pageMenu.map(item => (
                  item.children ?
                    <SubMenu
                      key={item.key}
                      className={this.state.current === item.key ? 'ant-menu-item-selected' : ''}
                      title={
                        <span className="submenu-title-wrapper">
                          <a href={getLink(item.link)} target={item.target || '_self'}>{item.text}</a>
                        </span>
                      }
                    >
                      <Menu.ItemGroup className="showUL">
                        {item.children.map(items => (
                          <Menu.Item key={items.key} ><a href={getLink(items.link)} target={items.target || '_self'}>{items.text}</a></Menu.Item>
                        ))}
                      </Menu.ItemGroup>
                    </SubMenu> :
                    <Menu.Item key={item.key}>
                      <a href={getLink(item.link)} target={item.target || '_self'}>{item.text}</a>
                    </Menu.Item>
                ))}
              </Menu>
            </div>
          </div>
          <MobileMenu menus={siteConfig[language].pageMenu} visible={mobileMemuVisible} setVisible={this.toggleMenu} />
        </div>
      </header>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
