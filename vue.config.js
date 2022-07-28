const { defineConfig } = require("@vue/cli-service");
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
};
if (process.env.VUE_APP_HOST !== 'F') {
  configureWebpack.devServer = {
    host: process.env.VUE_APP_HOST
  }
}

module.exports = defineConfig({
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





