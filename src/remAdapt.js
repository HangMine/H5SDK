// 浏览器默认fontsize为16（然后在postcss-pxtorem插件设置rootvalue:16即可实现自动转换成rem）
const DEFAULT_FONTSIZE = 16;

const dpr = devicePixelRatio || 0;

const scale = 1 / dpr;

const fontSize = DEFAULT_FONTSIZE * dpr;

const remAdapt = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  viewport.content = `width=device-width, user-scalable=no, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, viewport-fit=cover`;
  document.documentElement.style.fontSize = `${fontSize}px`;
};

module.exports = { DEFAULT_FONTSIZE, remAdapt };

// export default remAdapt;
