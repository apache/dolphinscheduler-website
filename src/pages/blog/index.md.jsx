import React from 'react';
import ReactDOM from 'react-dom';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import './index.md.scss';

class BlogDetail extends Md2Html(Language) {
  render() {
    const language = this.getLanguage();
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="blog-detail-page">
        <Header
          currentKey="blog"
          type="dark"
          logo="/img/hlogo_white.svg"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <section
          className="blog-content markdown-body"
          ref={(node) => { this.markdownContainer = node; }}
          dangerouslySetInnerHTML={{ __html }}
        />
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<BlogDetail />, document.getElementById('root'));

export default BlogDetail;
