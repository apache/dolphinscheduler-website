import React from 'react';
import PropTypes from 'prop-types';
import { getLink } from '../../../utils';
import { autobind } from 'core-decorators';

const propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  menus: PropTypes.array,
};
const defaultProps = {
  visible: false,
  setVisible: () => {},
};

@autobind
class MobileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submenuVisibleMap: {},
    };
  }

  preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  componentDidMount() {
    const { menus } = this.props;
    if (menus && menus.length > 0) {
      const map = {};
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          map[menu.key] = false;
        }
      });
      this.setState({
        submenuVisibleMap: map,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      document.body.addEventListener('touchmove', this.preventScroll, { passive: false });
    } else {
      document.body.removeEventListener('touchmove', this.preventScroll);
    }
  }

  toggoleSubMenu(key) {
    const { submenuVisibleMap } = this.state;
    if (!submenuVisibleMap.hasOwnProperty(key)) return;
    this.setState({
      submenuVisibleMap: {
        ...submenuVisibleMap,
        [key]: !submenuVisibleMap[key],
      },
    });
  }

  render() {
    const { visible, setVisible, menus } = this.props;
    const { submenuVisibleMap } = this.state;

    return (
      <div className={visible ? 'mobile-menu visible' : 'mobile-menu'} onScroll={this.preventScroll}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-list">
            {
              menus.map(item => (
                <div className="mobile-menu-item" onClick={() => this.toggoleSubMenu(item.key)} >
                  <a className="mobile-menu-title" href={getLink(item.link)} target={item.target || '_self'}>{item.text || item.title}</a>
                  {
                    item.children && item.children.length > 0 ?
                      <em className={submenuVisibleMap[item.key] ? 'mobile-menu-icon open' : 'mobile-menu-icon'} /> :
                      null
                  }
                  {
                    item.children && item.children.length > 0 ?
                      <div className={submenuVisibleMap[item.key] ? 'mobile-sub-menus open' : 'mobile-sub-menus'}>
                        {
                          item.children && item.children.map(sub => (
                            <div className="mobile-sub-menu-item"><a href={getLink(sub.link)} target={sub.target || '_self'}>{sub.text || sub.title}</a></div>
                          ))
                        }
                      </div>
                      :
                      null
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div className="mobile-menu-dummy" onClick={() => setVisible(false)} />
      </div>
    );
  }
}

MobileMenu.propTypes = propTypes;
MobileMenu.defaultProps = defaultProps;

export default MobileMenu;

