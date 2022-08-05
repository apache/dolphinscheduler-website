import React from 'react';
import PropTypes from 'prop-types';
import siteConfig from '../../../site_config/site';
import { getLink } from '../../../utils';
import './index.scss';

const propTypes = {
  // logo: PropTypes.string.isRequired, // logo地址
  language: PropTypes.oneOf(['zh-cn', 'en-us']),
};

class Footer extends React.Component {
  render() {
    const { language } = this.props;
    const dataSource = siteConfig[language];
    return (
      <footer className="footer-container">
        <div className="footer-body">
          <div>
            <h3>{dataSource.contact.title}</h3>
            <h4>{dataSource.contact.content}</h4>
          </div>
          <div className="contact-container">
            <ul>
              {
                dataSource.contact.list.map((contact, i) => (
                  <li key={i}>
                    <a href={getLink(contact.link)}>
                      <img className="img-base" src={contact.img1} />
                      <img className="img-change" src={contact.img2} />
                      <p>{contact.name}</p>
                    </a>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="copyright"><span>{dataSource.copyright}</span></div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = propTypes;

export default Footer;
