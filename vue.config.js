const { defineConfig } = require('@vue/cli-service')
console.info(process.env.NODE_ENV,"====");
console.info(process.env.VUE_APP_ENV_PATH,"====");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: process.env.NODE_ENV === 'development' ?{
    host: "localhost",
    port: `8089`,
    open: true,
    // 代理链接配置
    proxy: {
      [process.env.VUE_APP_ENV_PATH]: {
        target: process.env.VUE_APP_ENV_PATH,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_ENV_PATH]: process.env.VUE_APP_ENV_PATH
        },
        logLevel: 'debug',
        secure: true,
      }
    }
  } :{
    publicPath: './',
    host: "localhost",
    port: `8089`,
    open: true,
    // 代理链接配置
    proxy: {
      [process.env.VUE_APP_ENV_PATH]: {
        target: process.env.VUE_APP_ENV_PATH,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_ENV_PATH]: process.env.VUE_APP_ENV_PATH
        },
        logLevel: 'debug',
        secure: true,
      }
    }
  }
})
