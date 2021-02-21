const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entry = {};
const targetPath = path.join(__dirname, './src/pages');
fs.readdirSync(targetPath).forEach((page) => {
  const entries = [];
  const pagePath = path.join(targetPath, page);
  if (fs.statSync(pagePath).isDirectory()) {
    if (fs.existsSync(path.join(pagePath, 'index.jsx'))) {
      entries.push(path.join(pagePath, 'index.jsx'));
    }
    if (fs.existsSync(path.join(pagePath, 'index.md.jsx'))) {
      entry[`${page}.md`] = path.join(pagePath, 'index.md.jsx');
    }
    fs.readdirSync(pagePath).forEach((subPage) => {
      const subPagePath = path.join(pagePath, subPage);
      if (fs.existsSync(path.join(subPagePath, 'index.jsx'))) {
        entries.push(path.join(subPagePath, 'index.jsx'));
      }
    });
    if (entries.length) {
      entry[page] = entries;
    }
  }
});
module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist/build'),
    filename: '[name].js',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: [/node_modules/, /build\/lib/, /\.min\.js$/],
        use: 'babel-loader',
      },
      {
        test: /\.(s)?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.json?$/,
        exclude: /node_modules/,
        use: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
};
