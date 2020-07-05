<template>
  <Dialog
    v-model="show"
    title="提示"
    message="即将跳转到充值页面?"
    show-cancel-button
    :overlayStyle="{ 'background-color': 'rgba(0, 0, 0, 0.4)' }"
    @confirm="confirm"
    @cancel="cancel"
  >
  </Dialog>
</template>

<script>
import { Dialog } from 'vant';
import { mapState } from 'vuex';
export default {
  name: 'open-confirm',
  components: { Dialog: Dialog.Component },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState(['openConfirmShow', 'openUrl'])
  },
  watch: {
    openConfirmShow(val) {
      this.show = val;
    }
  },
  created() {},
  methods: {
    confirm() {
      window.open(this.openUrl);
      this.$store.commit('CLOSE_OPENCONFIRM');
    },
    cancel() {
      this.$store.commit('CLOSE_OPENCONFIRM');
    }
  }
};
</script>
<style lang="scss">
/* @import ('url') */
</style>
