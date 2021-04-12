import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import Bar from '../../components/bar';
import Sidemenu from '../../components/sidemenu';
import docsConfig0 from '../../../site_config/docs1-2-0';
import docsConfig1 from '../../../site_config/docs1-2-1';
import docsConfig2 from '../../../site_config/docs1-3-1';
import docsConfig3 from '../../../site_config/docs1-3-2';
import docsConfig4 from '../../../site_config/docs1-3-3';
import docsConfig5 from '../../../site_config/docs1-3-4';
import docsConfig6 from '../../../site_config/docs1-3-5';

const docsSource = {
  '1.2.0': docsConfig0,
  '1.2.1': docsConfig1,
  '1.3.1': docsConfig2,
  '1.3.2': docsConfig3,
  '1.3.3': docsConfig4,
  '1.3.4': docsConfig5,
  '1.3.5': docsConfig6,
};

class Docs extends Md2Html(Language) {
  render() {
    const language = this.getLanguage();
    let dataSource = docsConfig5[language];
    let version = window.location.pathname.split('/')[3];
    if (version && docsSource.hasOwnProperty(version)) {
      dataSource = docsSource[version][language];
    }
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="md2html docs-page">
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

document.getElementById('root') && ReactDOM.render(<Docs />, document.getElementById('root'));

export default Docs;
