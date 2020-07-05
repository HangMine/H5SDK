<template>
  <div class="test">
    <router-link to="/test2">Go to test2</router-link>
    <router-link to="/">Go to home</router-link>
  </div>
</template>

<script>
export default {
  name: 'test',
  metaInfo: {
    title: '我是test标题' // set a title
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
/* @import ('url') */
</style>
