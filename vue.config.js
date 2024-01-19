const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
let configureWebpack = {
  resolve: {
    alias: {
      'src'       : path.resolve('./src'),
      'public'    : path.resolve('./public'),
      'util'      : path.resolve('./src/util'),
      'views'     : path.resolve('./src/views'),
      'config'    : path.resolve('./src/config'),
      'router'    : path.resolve('./src/router'),
      'assets'    : path.resolve('./src/assets'),
      'components': path.resolve('./src/components'),
    },
  },
  plugins: [
    // CompressionPlugin을 추가합니다.
    new CompressionPlugin(
        {
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }
    ),
  ],
};
if (process.env.VUE_APP_HOST !== 'F') {
  configureWebpack.devServer = {
    host: process.env.VUE_APP_HOST
  }
}

module.exports = defineConfig({
  devServer: {
    client: {
      overlay: false,
    },
  },
  transpileDependencies: true,
  configureWebpack,
  // chainWebpack: (config) => {
  //   config.resolve.alias
  //       .set("@", path.resolve("./src"))
  //       .set("@components", path.resolve("./src/components"))
  // },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: false
});





