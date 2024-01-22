// Modules
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test' || ENV === 'test-watch';
const isProd = ENV === 'build' || ENV === 'heroku-postbuild';

module.exports = (function () {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  const config = {};
  config.stats = {
    entrypoints: false,
    children: false
  };

  config.mode = isTest ? 'testing' : isProd ? 'production' : 'development';

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? 0 : {
    app: './src/app/app.js',
    vendor: [
      'angular',
      'angular-animate',
      'angular-material',
      'angular-messages',
      'codemirror',
      'csshake',
      'lodash',
      'moment',
      'restangular',
      'angular-highlightjs',
    ],
  };

  // config.target = 'node-webkit';

  /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
  config.output = isTest ? {} : {
    // Absolute output directory
    path: `${__dirname}/dist`,

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '' : 'http://localhost:8080/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js',
  };


  /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

  // Initialize module
  config.module = {
    rules: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ]
        }
      },
      exclude: /node_modules/,
    }, {
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development.
      test: /\.(scss|css)$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|mp4|swf)$/,
      use: 'file-loader',
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      use: 'raw-loader',
    }],
  };
  config.devtool = 'source-map';

  // ISTANBUL LOADER
  // https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
  // Skips node_modules and files that end with .spec.js
  // if (isTest) {
  //   config.module.rules.push({
  //     enforce: 'pre',
  //     test: /\.js$/,
  //     exclude: [
  //       /node_modules/,
  //       /\.spec\.js$/,
  //     ],
  //     use: 'istanbul-instrumenter-loader',
  //     query: {
  //       esModules: true,
  //     },
  //   });
  // }

  config.plugins = [];

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
      }),

      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
    );
  }
  if (!isProd) {
    config.plugins.push(new CopyWebpackPlugin({
      patterns: [
      { from: 'node_modules/font-awesome/fonts/**', to: '.' },
      { from: 'src/img/favicon.ico', to: './src' },
    ]}));
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([
        { from: 'src/img', to: './img' },
      ]));
  }

  config.resolve = {
    extensions: ['.js'],
  };

  /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
  config.devServer = {
    static: {
      directory: './src',
    },
    // stats: 'minimal',
    // historyApiFallback: true,
  };

  return config;
}());
