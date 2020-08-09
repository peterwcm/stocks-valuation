/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000',
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/abstracts/_index.scss')],
    },
    express: {
      shouldServeApp: true,
      serverDir: './srv',
    },
  },
};
