<!--
 * @Author: Hang
 * @Date: 2020-04-27 11:02:13
 * @LastEditors: Hang
 * @LastEditTime: 2020-07-02 23:28:19
 * @FilePath: /ln-project/Users/zhengmukang/Desktop/h5sdk/src/views/Index.vue
 * @Description: 暂无描述
-->

<template>
  <div class="index">
    <Modal></Modal>
    <!-- 飘浮图标 -->
    <hover-icon></hover-icon>
    <!-- 跳转页面确认框 -->
    <open-confirm></open-confirm>
    <!-- 加载中 -->
    <Loading v-if="loading" class="ln-loading" size="50" type="spinner" vertical>加载中...</Loading>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal';
import HoverIcon from '@/components/HoverIcon';
import OpenConfirm from '@/components/OpenConfirm';
import { Loading } from 'vant';
import { withTryCatch } from '../utils';
export default {
  name: 'Index',
  components: { Modal, HoverIcon, OpenConfirm, Loading },
  data() {
    return {};
  },
  computed: {
    ...mapState(['loading'])
  },
  created() {},
  mounted() {
    withTryCatch(this.test, 2);
  },
  methods: {
    test(a = 0) {
      console.log(b);
      console.log(a);
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
// 加载中
.ln-loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
