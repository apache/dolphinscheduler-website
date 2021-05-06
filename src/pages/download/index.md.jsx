import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import Sidemenu from '../../components/sidemenu';
import downloadConfig from '../../../site_config/download';

class Download extends Md2Html(Language) {
  render() {
    const language = this.getLanguage();
    let dataSource = downloadConfig[language];
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="md2html download-page">
        <Header
          currentKey="download"
          type="dark"
          logo="/img/hlogo_white.svg"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />

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

document.getElementById('root') && ReactDOM.render(<Download />, document.getElementById('root'));

export default Download;
