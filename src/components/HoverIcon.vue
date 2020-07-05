<template>
  <div class="ln-hover-icon" :class="{ 'is-show': isShow }" ref="hoverIcon">
    <div class="hover-icon-wrap" :class="{ dot: !isShow }" @click="showBtns">
      <van-button round type="info" icon="user-o" class="hover-icon"> </van-button>
    </div>

    <div class="hover-btns" :class="{ 'is-show': isShow }" :style="btnsStyle">
      <span class="hover-btn" @click="changeComponent('Login')">{{ isLogined ? '切换账号' : '登录' }}</span>
      <span class="hover-btn dot" @click="changeComponent('UserAccount')">账号</span>
    </div>
    <!-- <div class="hover-icon" :class="{ hot: isHot }" @click="showBtns"></div> -->
    <!-- <div class="hover-btns"></div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import draggable, { isMobile } from '@/draggable';
export default {
  name: 'ln-hover-icon',
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    ...mapState(['user', 'componentParams']),
    isLogined() {
      return this.user.account;
    },
    btnsStyle() {
      const width = !this.isShow ? 36 : this.isLogined ? 145 : 115;
      return { width: `${width}px` };
    },
    disabled() {
      return this.componentParams && this.componentParams.is_allow_online == 0;
    }
  },
  created() {},
  mounted() {
    this.setDrag();
  },
  methods: {
    setDrag() {
      const el = this.$refs.hoverIcon;
      const { clientWidth, clientHeight } = document.documentElement;
      if (isMobile) {
        // 移动端的拖动
        draggable(el, {
          drag: e => {
            const touch = e.changedTouches[0];
            // 定位到元素中间
            const EL_MIDDLE = el.clientHeight / 2;
            const top = touch.clientY - EL_MIDDLE;
            const minTop = 0;
            const maxTop = clientHeight - el.clientHeight;
            const resultTop = Math.min(Math.max(minTop, top), maxTop);
            el.style.top = `${resultTop}px`;
          }
        });
      } else {
        // PC端的拖动(有空需解决：1、拖动太快导致鼠标脱离el，需要绑定到document，但是iframe无法触发document的问题 2、移动后，需要禁止触发子按钮的点击事件)
        draggable(el, {
          drag: e => {
            const { clientX, clientY } = e;
            // 定位到元素中间
            const EL_MIDDLE = el.clientHeight / 2;
            const top = clientY - EL_MIDDLE;
            const minTop = 0;
            const maxTop = clientHeight - el.clientHeight;
            const resultTop = Math.min(Math.max(minTop, top), maxTop);

            const EL_MIDDLE_WIDTH = el.clientWidth / 2;
            const right = clientX - EL_MIDDLE_WIDTH;
            const minRight = 0;
            const maxRight = clientWidth - el.clientWidth;
            const resultRight = Math.min(Math.max(minRight, right), maxRight);

            el.style.right = 'initial';
            el.style.top = `${resultTop}px`;
            el.style.left = `${resultRight}px`;
          }
        });
      }
    },
    showBtns() {
      // 如果禁止不给点击
      // if (this.disabled) return;
      this.isShow = !this.isShow;
    },
    changeComponent(componentName) {
      this.$store.commit('SHOW', componentName);
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss">
/* @import ('url') */
.ln-hover-icon {
  position: fixed;
  z-index: 999999;
  right: 0;
  top: 60px;
  opacity: 0.6;
  transition: opacity 0.3s;
  &.is-show {
    opacity: 1;
  }

  .hover-icon-wrap {
    position: relative;
    z-index: 1;
    &.dot::after {
      top: 5px;
      right: 3px;
    }
    .hover-icon {
      padding: 0;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      line-height: 36px;
    }
  }

  .hover-btns {
    position: absolute;
    overflow: hidden;
    z-index: 0;
    height: 36px;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    background: #e4e7ed;
    border-radius: 18px;
    font-size: 13px;
    padding-left: 0;
    width: 36px;
    transition: width 0.3s;
    &.is-show {
      padding-left: 10px;
    }
    .hover-btn {
      white-space: nowrap;
      padding: 0 5px;
    }
  }
}
.dot {
  position: relative;
}
.dot::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  min-width: 0;
  height: 6px;
  background-color: #ee0a24;
  border-radius: 100%;
  border: 1px solid #fff;
}
// .hover-btns {
//   position: absolute;
//   background-color: #cececf;
//   height: 40px;
//   line-height: 40px;
//   border-radius: 19px;
//   padding: 0px 50px 0px 20px;
//   top: 0;
//   right: 2px;
//   z-index: 1;
// }
// .hover-icon {
//   position: absolute;
//   z-index: 2;
//   height: 100%;
//   width: 100%;
//   background-image: url('../assets/imgs/assistive_icon_bg.png');
// }
// .hover-icon.hot {
//   background-image: url('../assets/imgs/assistive_icon_bg_hot.png');
// }
</style>
