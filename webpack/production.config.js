const webpack = require('webpack');

let commonConfig = require('./common.config.js')();

const {STATIC_PREFIX, UGLIFYJS} = require('./env');
// 静态资源前缀不加 /，因为原本就是绝对路径
const staticPrefix = STATIC_PREFIX ? STATIC_PREFIX : '';

// Absolute output directory
commonConfig.output.publicPath = staticPrefix + commonConfig.output.publicPath;

commonConfig.plugins.push(
  // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
  new webpack.DefinePlugin({
    'DEBUG': false,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.PASSPORT': JSON.stringify(process.env.PASSPORT ? process.env.PASSPORT : 'https://passport.sitandrelax.net'),
  }),

  new webpack.NoEmitOnErrorsPlugin(),

  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),

  new webpack.optimize.ModuleConcatenationPlugin(),
);

if (UGLIFYJS) {
  commonConfig.plugins.push(
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: true,
        warnings: false,
        dead_code: true,
        unused: true,
        //drop_console: true,
        global_defs: {
          DEBUG: false,
        },
      },
      comments: false,
      sourceMap: false,
    }),
  );
}

module.exports = commonConfig;
