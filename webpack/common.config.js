const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {isProd, NAMESPACE, MODULES_DIR} = require('./env');

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};

  /**
   * Resolve Path
   */
  config.resolve = {
    modules: MODULES_DIR,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  };

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = {
    main: './src/main.tsx',
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = {
    // Absolute output directory
    path: require('path').join(__dirname, '/../dist/static/', NAMESPACE),

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: require('path').join('/static/', NAMESPACE) + '/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js',
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  config.devtool = false;


  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'ts-loader'},
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {loader: 'babel-loader', options: {'cacheDirectory': true}},
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.global\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}},
          ],
          use: [
            {loader: 'css-loader', options: {sourceMap: !isProd, context: '/'}},
            {loader: 'postcss-loader'},
            {loader: 'sass-loader'},
          ],
        }),
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}},
          ],
          use: [
            {loader: 'css-loader', options: {modules: true, sourceMap: !isProd, context: '/'}},
            {loader: 'postcss-loader'},
            {loader: 'sass-loader'},
          ],
        }),
        exclude: [/\.global\.scss/],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}},
          ],
          use: [
            {loader: 'css-loader',},
            {loader: 'postcss-loader'},
          ],
        }),
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}},
          ],
          use: [
            {loader: 'css-loader',},
          ],
        }),
        include: [/node_modules/],
      },
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        test: /\.(ico|woff|woff2|ttf|eot|otf)(\?.+)?$/,
        use: [
          {loader: 'file-loader'},
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
        use: [
          {loader: 'file-loader'},
        ],
      },
      {
        test: /\.yaml/,
        use: [
          {loader: 'json-loader'},
          {loader: 'yaml-loader'},
        ],
      },
      {
        test: /\.html/,
        use: [
          'html-loader',
        ],
      },
    ],
  };

  /**
   * Externals
   * Reference: https://webpack.github.io/docs/configuration.html#externals
   * Speed!
   */
  config.externals = {};

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [];

  config.plugins.push(
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      disable: !isProd,
    }),

    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
      favicon: './src/favicon.ico',
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({resource}) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    })
  );
  return config;
};
