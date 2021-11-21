import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Sidemenu from '../../components/sidemenu';
import ContributorItem from './contributorItem';
import communityConfig from '../../../site_config/community.jsx';
import './index.scss';

class Community extends Language {
  render() {
    const language = this.getLanguage();
    let dataSource = communityConfig[language];
    return (
      <div className="community-page">
        <Header
          currentKey="community"
          type="dark"
          logo="/img/hlogo_white.svg"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <section className="content-section">
          <Sidemenu dataSource={dataSource.sidemenu} />
          <div className="doc-content markdown-body">
            <section className="contributor-section">
              <h3>{dataSource.contributorGuide.title}</h3>
              <p>{dataSource.contributorGuide.desc}</p>
              <div className="contributor-list">
              {
                dataSource.contributorGuide.list.map((contributor, i) => (
                  <ContributorItem contributor={contributor} key={i} />
                ))
              }
              </div>
            </section>
          </div>
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Community />, document.getElementById('root'));

export default Community;
