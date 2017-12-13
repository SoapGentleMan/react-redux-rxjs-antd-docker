const webpack = require('webpack');
const path = require('path');
const {NAMESPACE} = require('./env');

const vendors = ['classnames', 'dexie',  'jjv', 'lodash', 'lz-string', 'moment', 'numeral', 'object-hash', 'react', 'react-dom', 'react-redux', 'react-router', 'react-router-dom', 'redux', 'redux-observable', 'rxjs', 'whatwg-fetch', 'papaparse', 'd3'];

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist/static/', NAMESPACE) + '/',
    filename: '[name]_[chunkHash].js',
    library: '[name]_[chunkHash]',
  },
  entry: {
    dll: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../dist/static/', NAMESPACE) + '/manifest.json',
      name: '[name]_[chunkHash]',
      context: __dirname,
    }),
  ],
};