module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 如果用了UI框架，需要跟UI框架的设计稿保持一致的比例（比如vant的设计稿是375.我们的设计稿也要是375,否则得手动换算）
      rootValue: 16, // 不缩放时的根fontsize值（浏览器默认为16px）
      propList: ['*']
    }
  }
};
