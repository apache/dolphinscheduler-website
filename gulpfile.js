require('babel-register')();
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const opn = require('opn');
const path = require('path');
const fs = require('fs-extra');
const WebpackDevServer = require('webpack-dev-server');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const siteConfig = require('./site_config/site').default;
const webpackConfig = require('./webpack.config.js');

const distdir = path.join(__dirname, 'dist');
const port = siteConfig.port || 8080;

gulp.task('webpack-dev-server', () => {
  // modify some webpack config options
  const myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new ExtractTextPlugin('[name].css'),
    new webpack.SourceMapDevToolPlugin({})
  );
  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: `http://127.0.0.1:${port}/build/`,
    stats: {
      colors: true,
      children: false,
    },
  }).listen(port, '127.0.0.1', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    opn(`http://127.0.0.1:${port}/`);
    gutil.log('[webpack-dev-server]', `http://127.0.0.1:${port}/webpack-dev-server/index.html`);
  });
});

gulp.task('webpack:build', (callback) => {
  // modify some webpack config options
  const myConfig = Object.create(webpackConfig);
  myConfig.output.publicPath = `${siteConfig.rootPath}/build/`;
  myConfig.output.filename = '[name].[chunkhash:7].js';
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [distdir] }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:7].css',
      allChunks: true,
    }),
    new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }),
    new webpack.optimize.UglifyJsPlugin({
      uglifyOptions: {
        compress: { warnings: false },
      },
      parallel: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2,
    }),
    new WebpackManifestPlugin({ publicPath: '' }),
    new CopyWebpackPlugin((() => {
      const entries = [];
      const pages = fs.readdirSync(path.join(__dirname, './src/pages'));
      pages.forEach((page) => {
        if (page === 'home') return;
        if (fs.statSync(path.join(__dirname, './src/pages', page)).isDirectory()) {
          if (fs.existsSync(path.join(__dirname, page)) && fs.statSync(path.join(__dirname, page)).isDirectory()) {
            entries.push(page);
          }
        }
      });
      return entries.map(entry => ({
        from: path.join(__dirname, entry),
        to: path.join(distdir, entry),
        ignore: ['*.md', '*.markdown'],
      }));
    })())
  );
  if (process.env.report_analyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    myConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  // run webpack
  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log(
      '[webpack:build]',
      stats.toString({
        colors: true,
      })
    );
    callback();
  });
});

gulp.task('post-build', (callback) => {
  fs.removeSync(path.join(distdir, 'build/manifest.json'), { force: true });
  if (Array.isArray(siteConfig.copyToDist)) {
    siteConfig.copyToDist.forEach((item) => {
      if (fs.existsSync(path.join(__dirname, item))) {
        fs.copySync(path.join(__dirname, item), path.join(distdir, item));
      }
    });
  }
  fs.copySync(path.join(distdir, siteConfig.defaultLanguage, 'index.html'), path.join(distdir, 'index.html'));
  callback();
});

// The development server (the recommended option for development)
gulp.task('default', gulp.series('webpack-dev-server'));

// Production build
gulp.task('build', gulp.series('webpack:build'));
