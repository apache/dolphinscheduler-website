import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import siteConfig from '../../../site_config/site';
import { getScrollTop,getLink } from '../../../utils';
import 'antd/dist/antd.css';
import './index.scss';
import { Menu, Icon } from 'antd'

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
const noop = () => {};
const propTypes = {
  currentKey: PropTypes.string,
  logo: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'normal']),
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
      current: '',
      menuBodyVisible: false,
      language: props.language,
      search: siteConfig.defaultSearch,
      searchValue: '',
      inputVisible: false,
    };
  }
  componentDidMount() {
    if(localStorage.getItem("currents") == null) {
      this.setState({
        current: 'home'
      });
    } else {
      this.setState({
        current: localStorage.getItem("currents")
      });
    }
    window.addEventListener('scroll', () => {
      const scrollTop = getScrollTop();
      if (scrollTop > 66) {
        this.setState({
          type: 'normal',
        });
      } else {
        this.setState({
          type: 'primary',
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      language: nextProps.language,
    });
  }

  

  handleClick = e => {
    localStorage.setItem("currents",e.key); 
    this.setState({
      current: e.key,
    });
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

  render() {
    const { type, logo, onLanguageChange, currentKey } = this.props;
    const { menuBodyVisible, language, search, searchVisible } = this.state;
    return (
      <header
        className={
          classnames({
            'header-container': true,
            [`header-container-${type}`]: true,
          })
        }
      >
        <div className="header-body">
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
            (<span
              className={
                classnames({
                  'language-switch': true,
                  [`language-switch-${type}`]: true,
                })
              }
              onClick={this.switchLang}
            >
              {languageSwitch.find(lang => lang.value === language).text}
            </span>)
            :
            null
          }
          <div
            className={
              classnames({
                'header-menu': true,
                'header-menu-open': menuBodyVisible,
              })
            }
          >
            <img
              className="header-menu-toggle"
              onClick={this.toggleMenu}
              src={type === 'primary' ? getLink('/img/system/menu_white.png') : getLink('/img/system/menu_gray.png')}
            />
            <div>
            <Menu className={type === 'primary'? 'whiteClass': 'blackClass'} onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            {siteConfig[language].pageMenu.map(item => (
              item.children ? <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <a href={getLink(item.link)} target={item.target || '_self'}>{item.text}</a>
                </span>
              }
            >
            <Menu.ItemGroup>
            {item.children.map(items => (
              <Menu.Item key={items.key} ><a href={getLink(items.link)} target={items.target || '_self'}>{items.text}</a></Menu.Item>
            ))}
            </Menu.ItemGroup>
          </SubMenu> : <Menu.Item key={item.key}>
              <a href={getLink(item.link)} target={item.target || '_self'}>{item.text}</a>
            </Menu.Item>
            ))}
          </Menu>
          </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
