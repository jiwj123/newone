const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const ip = require('./src/api/baseUrl')
// 代理地址
const apiUrl = `http://${ip.app.url}:${ip.app.port}` // 普通服务的地址
const dicUrl = `http://${ip.ws_dic.url}:${ip.ws_dic.port.dic}` // dic服务的地址
const nkServiceUrl = `http://${ip.nkServiceUrl}:8080` // 牛坤接口地址

// 代理
let proxy = {
  '/api': { // 设置拦截器  拦截器格式   斜杠+拦截器名字，名字(api)可以自己定，保持一致即可
    target: apiUrl, // 代理的目标地址
    changeOrigin: true, // 是否设置同源，输入是的
    pathRewrite: { // 路径重写
      '^/api': '/' // 选择忽略拦截器里面的单词
    }
  },
  '/dic': { // 设置拦截器  拦截器格式   斜杠+拦截器名字，名字(api)可以自己定，保持一致即可
    target: dicUrl, // 代理的目标地址
    changeOrigin: true, // 是否设置同源，输入是的
    pathRewrite: { // 路径重写
      '^/dic': '/' // 选择忽略拦截器里面的单词
    }
  },
  '/nkServiceUrl': { // 设置拦截器  拦截器格式   斜杠+拦截器名字，名字(api)可以自己定，保持一致即可
    target: nkServiceUrl, // 代理的目标地址
    changeOrigin: true, // 是否设置同源，输入是的
    pathRewrite: { // 路径重写
      '^/nkServiceUrl': '/' // 选择忽略拦截器里面的单词
    }
  }
}
module.exports = {
  publicPath: '/luckybag/',
  outputDir: 'dist',
  assetsDir: 'static',
  pages: {
    index: {
      entry: 'src/main.js',
      title: '福袋'
    }
  },
  runtimeCompiler: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 代理配置
  devServer: {
    // 配置单个代理
    proxy: proxy,
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
  },
  configureWebpack: {
    plugins: [
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
    ]
  },
  css: {
    loaderOptions: {
      // 依次导入的公用的scss变量，公用的scss混入，共用的默认样式
      sass: {
        prependData: `
          @import "~@/assets/scss/style.scss";
        `
      }
    }
  }
}
