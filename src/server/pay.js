// 支付页面调用
const pay = {
  isShow: null,
  init() {
    const payWrap = document.querySelector('#ln-pay');
    payWrap.addEventListener('transitionend', () => {
      this.handleTransitionEnd();
    });
    const closeBtn = document.querySelector('#pay-close');
    closeBtn.addEventListener('click', () => {
      this.close();
    });
  },
  handleTransitionEnd() {
    if (this.isShow === false) {
      // 当结束结束时才关闭链接
      const payFrame = document.querySelector('#payFrame');
      payFrame.src = '';
    }
  },
  show(url) {
    this.isShow = true;
    const payFrame = document.querySelector('#payFrame');
    payFrame.src = url;
    const payWrap = document.querySelector('#ln-pay');
    payWrap.classList.add('is-show');
  },
  close() {
    this.isShow = false;
    const payWrap = document.querySelector('#ln-pay');
    payWrap.classList.remove('is-show');
  },
  weixin(params) {
    if (!WeixinJSBridge) {
      console.error('没有WeixinJSBridge，但需要执行WeixinJSBridge.invoke');
    } else {
      const { url, ...invokeParams } = params;
      console.log('invokeParams');
      console.log(invokeParams);
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        invokeParams,
        // {
        //   appId: 'wx2421b1c4370ec43b', // 公众号名称，由商户传入
        //   timeStamp: '1395712654', // 时间戳，自1970年以来的秒数
        //   nonceStr: 'e61463f8efa94090b1f366cccfbbb444', // 随机串
        //   package: 'prepay_id=u802345jgfjsdfgsdg888',
        //   signType: 'MD5', // 微信签名方式：
        //   paySign: '70EA570631E4BB79628FBCA90534C63FF7FADD89' // 微信签名
        // },
        function(res) {
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            const payFrame = document.querySelector('#payFrame');
            payFrame.src = url;
          }
        }
      );
    }
  }
};

export default pay;
