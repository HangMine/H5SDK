<template>
  <div class="certification">
    <Form ref="form">
      <h4 class="cert-tip">
        {{ componentParams.isPay ? componentParams.payMsg : componentParams.cert_msg }}
      </h4>
      <Field
        v-model="realname"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请填写姓名' }]"
      >
      </Field>
      <Field
        v-model="idcard"
        label="身份证"
        placeholder="请输入身份证"
        :rules="[{ required: true, message: '请填写身份证' }]"
      >
      </Field>
      <div class="bottom">
        <Row class="login-row">
          <Button class="login-btn" block type="info" @click="certification">
            实名登记
          </Button>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { Form, Field, Button, Row, Dialog } from 'vant';
import server from '@/server';
import channelServer from '@/server/channelServer';
import mixServer from '@/server/mixServer';
import { commonMixin } from '@/mixin';
export default {
  name: 'certification',
  mixins: [commonMixin],
  components: { Form, Field, Button, Row },
  data() {
    return {
      realname: '',
      idcard: '',
      type: 0
    };
  },
  computed: {
    ...mapState(['componentParams', 'user']),
    ...mapGetters(['isForceCert'])
  },
  created() {},
  mounted() {},
  methods: {
    certification() {
      this.formCheck('form').then(() => {
        const params = {
          realname: this.realname,
          idcard: this.idcard,
          type: this.type
        };
        channelServer.certification(params).then(({ ret, msg, data }) => {
          // 实名登录成功后
          this.$store.commit('CLOSE');
          Dialog({ message: msg });
          const { isPay, payParams } = this.componentParams || {};
          if (isPay) {
            // 如果是支付跳转过来的，重新拉起支付
            mixServer.pay(payParams);
          } else {
            // 如果需要是强制退出游戏的，重新登录
            if (this.isForceCert) {
              server.autoLogin();
            }
          }
        });
      });
    },
    reloadGameFrame() {
      const gameFrame = document.querySelector('#gameFrame');
      gameFrame.src = `${gameFrame.src}?v=${new Date().getTime()}`;
    }
  }
};
</script>
<style lang="scss">
/* @import ('url') */
.cert-tip {
  margin: 16px;
  font-size: 14px;
}
</style>
