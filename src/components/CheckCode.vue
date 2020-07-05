<template>
  <div class="ln-check-code">
    <Row class="check-code-row" gutter="10">
      <Col span="16">
        <Field v-model="code" :placeholder="placeholder" :rules="[{ required: true, message: '请填写验证码' }]">
          <i slot="left-icon" class="iconfont iconlock"></i>
        </Field>
      </Col>
      <Col span="8">
        <Button
          class="login-btn"
          block
          type="info"
          size="small"
          native-type="button"
          :disabled="disabledTime !== 0"
          @click="sendCode"
        >
          {{ disabledTime || '发送验证码' }}
        </Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import { Field, Button, Row, Col, Dialog } from 'vant';
import { sendCode } from '@/api/channelServer';
export default {
  name: 'ln-check-code',
  components: { Field, Button, Row, Col },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入验证码'
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      code: '',
      disabledTime: 0,
      disabledTimer: null
    };
  },
  watch: {
    value: {
      handler(val) {
        this.code = val;
      },
      immediate: true
    },
    code(val) {
      this.$emit('input', val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    sendCode() {
      if (!this.params.mobile) {
        Dialog({ message: '请输入手机号码' });
        return;
      }

      sendCode(this.params).then(({ ret }) => {
        if (ret == 0) {
          this.disabledTime = 60;
          const setTime = () => {
            if (this.disabledTime !== 0) {
              this.disabledTimer = setTimeout(() => {
                this.disabledTime--;
                setTime();
              }, 1000);
            } else {
              clearTimeout(this.disabledTimer);
            }
          };
          setTime();
        }
      });
    }
  }
};
</script>
<style lang="scss">
/* @import ('url') */
.check-code-row {
  display: flex;
  align-items: center;
  padding-right: 16px;
}
</style>
