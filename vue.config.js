const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');

const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');

module.exports = {
  publicPath: '/',
  outputDir: 'h5sdk',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '名酱三国'
    },
    client: {
      entry: 'src/client/Main.js',
      template: 'public/client.html',
      filename: 'client.html',
      title: '游戏端'
    }
  },
  devServer: {
    proxy: {
      '/mixServer': {
        target: 'http://api.sdk2.leniugame.com',
        pathRewrite: {
          '^/mixServer': ''
        },
        changeOrigin: true,
        secure: false
        // logLevel: 'debug'
      },
      '/channelServer': {
        target: 'http://api.sdk.leniugame.com',
        pathRewrite: {
          '^/channelServer': ''
        },
        changeOrigin: true,
        secure: false
        // logLevel: 'debug'
      }
    }
  },

  // 此插件需要css分离
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  configureWebpack: config => {
    config.plugins.push(
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.join(__dirname, './src/entry-skeleton.js') // 这里为上面的entry-skeleton.js
          }
        },
        minimize: true,
        quiet: true,
        router: {
          mode: 'history',
          routes: [
            {
              path: '/', // 和router.js中的路径一样就行
              skeletonId: 'skeleton1' // 之前的id
            },
            {
              path: '/test',
              skeletonId: 'skeleton2'
            }
          ]
        }
      })
    );

    // if (process.env.NODE_ENV === 'production') {
    //   // 生产环境去除日志
    //   config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
    //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    //   config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
    //   config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
    //   config.plugins.push(
    //     new PrerenderSPAPlugin({
    //       // 生成文件的路径，也可以与webpakc打包的一致。
    //       // 下面这句话非常重要！！！
    //       // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
    //       staticDir: path.join(__dirname, 'h5sdk'),
    //       // outputDir: path.join(__dirname, './'),
    //       // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
    //       routes: ['/', '/test'],
    //       // 这个很重要，如果没有配置这段，也不会进行预编译
    //       renderer: new Renderer({
    //         inject: {
    //           foo: 'bar'
    //         },
    //         headless: false,
    //         // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
    //         renderAfterDocumentEvent: 'render-event'
    //       })
    //     })
    //   );
    // }

    //  配置productionGzip-高级的方式
    // 配置参数详解
    // asset： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
    // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
    // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
    // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
    // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
    // config.plugins.push(
    //   new CompressionWebpackPlugin({
    //     filename: '[path].gz[query]',
    //     algorithm: 'gzip',
    //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    //     threshold: 10240,
    //     minRatio: 0.8
    //   })
    // );
  }
};
