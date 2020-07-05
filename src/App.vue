<template>
  <div id="app">
    <!-- <Index></Index> -->
    <router-view />
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import Index from '@/views/Index';
export default {
  name: 'app'
  // components: { Index }
};
</script>

<style lang="scss">
.img {
  width: 30px;
  height: 30px;
  background-image: url('~@/assets/imgs/assistive_icon_bg_hot.png');
}
</style>
