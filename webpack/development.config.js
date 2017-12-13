let webpack = require('webpack');
let fs = require('fs');
let path = require('path');
let HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
let devServerConfig = require('./common.config.js')();
const {DEV_PORT, NAMESPACE} = require('./env');
const manifest = require(path.join(__dirname, '../dist/static', NAMESPACE) + '/manifest.json');


devServerConfig.cache = true;
devServerConfig.devtool = 'inline-source-map';

devServerConfig.plugins.push(
  // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
  new webpack.DefinePlugin({
    DEBUG: true,
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: true,
  }),
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest,
  }),
  new HtmlWebpackIncludeAssetsPlugin({
    assets: [manifest.name + '.js'],
    files: ['index.html'],
    append: false,
    hash: true,
  })
);

devServerConfig.output.publicPath = `https://dev.sitandrelax.net:8765/static/${NAMESPACE}/`;

devServerConfig.devServer = {
  contentBase: path.join(__dirname, '..', 'dist'),
  overlay: true,
  historyApiFallback: {
    index: `/static/${NAMESPACE}/index.html`,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
  },
  stats: {
    modules: false,
    cached: false,
    colors: true,
    chunk: false,
  },
  host: '0.0.0.0',
  disableHostCheck: true,
  port: DEV_PORT,
  https: {
    cert: fs.readFileSync(path.join(__dirname, '../dev/fullchain.pem')),
    key: fs.readFileSync(path.join(__dirname, '../dev/privkey.pem')),
  },
};


module.exports = devServerConfig;