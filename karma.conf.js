const webpack = require('webpack');
module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    colors: true,
    client: {
      clearContext: false,
    },
    failOnEmptyTestSuite: false,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    // coverageReporter: {
    //   reporters: [
    //     {type: 'text'},
    //     {type: 'html', subdir: 'html'}
    //   ],
    // },
    // save interim raw coverage report in memory
    coverageReporter: {
      reporters: [
        {
          type: 'json-summary',
          subdir: (browser) => {
            return browser.toLowerCase().split(' ')[0];
          }, file: './coverage.json',
        },
        {type: 'in-memory'},
      ],
    },

    // define where to save final remaped coverage reports
    remapCoverageReporter: {
      // 'text-summary': null,
      'text': null,
      // 'text-lcov': null,
      html: './coverage/reporter/html',
      // json: './coverage/coverage.json',
      // cobertura: './coverage/cobertura.xml'
    },
    frameworks: [
      'jasmine',
    ],
    files: [
      {pattern: './src/test.spec.ts', watched: false},
    ],
    preprocessors: {
      './src/test.spec.ts': ['webpack', 'sourcemap'],
    },
    reporters: ['progress', 'coverage', 'kjhtml', 'remap-coverage'],
    webpack: {
      cache: false,
      devtool: 'inline-source-map',
      resolve: {
        modules: ['node_modules', __dirname],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
      module: {
        rules: [
          {
            enforce: 'post',
            test: /\.tsx?$/,
            include: /src/,
            exclude: [/node_modules/, /\.spec\.tsx?$/],
            use: [
              {loader: 'istanbul-instrumenter-loader', query: {esModules: true}},
            ],
          },
          {
            test: /\.tsx?$/,
            include: /src/,
            exclude: /node_modules/,
            use: [{loader: 'ts-loader'}],
          },
          {
            test: /\.scss/,
            use: ['null-loader'],
          },
          {
            test: /\.css$/,
            use: ['null-loader'],
          },
          {
            test: /\.yaml/,
            use: [
              {loader: 'json-loader'},
              {loader: 'yaml-loader'},
            ],
          },
        ],
      },
      plugins: [
        // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
        new webpack.DefinePlugin({
          'DEBUG': false,
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.PASSPORT': JSON.stringify(process.env.PASSPORT ? process.env.PASSPORT : 'https://passport.sitandrelax.net'),
        }),
      ],
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-sourcemap-loader',
      'karma-remap-coverage',
      'karma-webpack',
    ],
  });
};
