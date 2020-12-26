import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import Bar from '../../components/bar';
import Sidemenu from '../../components/sidemenu';
import docsConfig from '../../../site_config/docs';
import docsConfig1 from '../../../site_config/docs1-2-1';
import docsConfig2 from '../../../site_config/docs1-3-1';
import docsConfig3 from '../../../site_config/docs1-3-2';
import docsConfig4 from '../../../site_config/docs1-3-3';
import devConfig from '../../../site_config/development';

class Documentation extends Md2Html(Language) {

  render() {
    const language = this.getLanguage();
    let dataSource = docsConfig1[language];
    if (window.location.pathname.indexOf('/development/') >= 0) {
      dataSource = devConfig[language];
    }
    if (window.location.pathname.indexOf('/1.3.3/') >= 0) {
      dataSource = docsConfig4[language];
    }
    if (window.location.pathname.indexOf('/1.3.2/') >= 0) {
      dataSource = docsConfig3[language];
    }
    if (window.location.pathname.indexOf('/1.3.1/') >= 0) {
      dataSource = docsConfig2[language];
    }
    if (window.location.pathname.indexOf('/1.2.1/') >= 0) {
      dataSource = docsConfig1[language];
    }
    if (window.location.pathname.indexOf('/1.2.0/') >= 0) {
      dataSource = docsConfig[language];
    }
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="md2html documentation-page">
        <Header
          currentKey="docs"
          type="normal"
          logo="/img/hlogo_colorful.svg"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <Bar img="/img/system/docs.png" text={dataSource.barText} />
        <section className="content-section">
          <Sidemenu dataSource={dataSource.sidemenu} />
          <div
            className="doc-content markdown-body"
            ref={(node) => { this.markdownContainer = node; }}
            dangerouslySetInnerHTML={{ __html }}
          />
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Documentation />, document.getElementById('root'));

export default Documentation;
