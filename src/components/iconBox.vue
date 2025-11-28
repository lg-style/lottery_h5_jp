<template>
  <div ref="floatButton" class="float_button">
    <div
      ref="point"
      @touchstart.prevent="
        (e) => {
          dragStart(e);
        }
      "
      @touchend.prevent="
        (e) => {
          dragEnd(e);
        }
      "
      @touchmove.prevent="(e) => dragMove(e)"
      @touchcancel.prevent="(e) => dragCancel(e)"
      class="float_info"
      :style="{
        'line-height': divHeight + 'px',
        width: divWidth + 'px',
        height: divHeight + 'px',
        left: moveLeft + 'px',
        top: moveTop + 'px',
      }"
    >
      <van-icon name="arrow-left" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showService: false,
      isMoved: false,
      border_distance: 20, //可拖拽元素距离屏幕边界最小距离
      divWidth: 40, //可拖拽元素宽度
      divHeight: 40, //可拖拽元素高度
      moveLeft: 0, //可拖拽元素距离屏幕左边界
      moveTop: 0, //可拖拽元素距离屏幕上边界
      clientWidth: 0, //屏幕宽度
      clientHeight: 0, //屏幕高度
    };
  },
  props: {
    // text: {                 // 按钮文本内容
    //     type: String,
    //     default: "首页1111"
    // },
    itemWidth: {
      // 悬浮按钮宽度
      type: Number,
      default: 60,
    },
    itemHeight: {
      // 悬浮按钮高度
      type: Number,
      default: 60,
    },
    gapWidth: {
      // 距离左右两边距离
      type: Number,
      default: 0,
    },
    coefficientHeight: {
      // 从上到下距离比例
      type: Number,
      default: 0.65,
    },
  },
  watch: {
    moveLeft(newValue, oldValue) {
      // console.log('val=============', newValue, oldValue);
      if (newValue === oldValue) {
        this.isMoved = false;
      }
      let sum = newValue - oldValue;
      if (sum > -1.6 && sum < 1.6) {
        this.isMoved = false;
      }
    },
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.moveLeft = this.clientWidth - 60;
    this.moveTop = 500;
  },
  methods: {
    onBtnClicked() {
      this.showService = true;
    },
    handleScrollStart() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleScrollEnd();
      }, 300);
      this.currentTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (this.left > this.clientWidth / 2) {
        console.log("大于-----------------1111111111111");
        this.left = this.clientWidth - this.itemWidth / 2;
      } else {
        this.left = -this.itemWidth / 2;
        console.log("小于-----------------1111111111111");
      }
    },
    handleScrollEnd() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth;
          console.log("大于-----------------222222222222222");
        } else {
          this.left = this.gapWidth;
          console.log("小于-----------------222222222222222");
        }
        clearTimeout(this.timer);
      }
    },
    dragStart(e) {
      this.$refs.point.style.transition = "none";
      console.log(
        "1111-------",
        this.moveLeft,
        "1111---aaaa----",
        this.moveTop
      );
    },
    dragEnd(e) {
      this.$refs.point.style.transition = "all 0.3s";
      if (this.moveLeft > this.clientWidth / 2) {
        //若移动位于屏幕的左边或右边，则自动贴合左边或右边（此根据业务具体需求表现而定）
        this.moveLeft = this.clientWidth - this.divWidth - this.border_distance;
        console.log(
          "2222-------",
          this.moveLeft,
          "qqqqq---aaaa----",
          this.moveTop
        );
      } else {
        this.moveLeft = this.border_distance;
        console.log(
          "2222-------",
          this.moveLeft,
          "qqqqqq---bbbbb----",
          this.moveTop
        );
      }
      if (this.moveLeft < 0) {
        this.moveLeft = 30;
      }
      if (this.moveTop < 0) {
        this.moveTop = 30;
      }
      if (this.moveTop >= this.clientHeight - 70) {
        this.moveTop = this.clientHeight - 70;
      }
      // 判断手指是否移动过屏幕
      if (this.isMoved) {
        this.isMoved = false;
      } else {
        this.onBtnClicked();
      }
    },
    dragMove(e) {
      if (e.touches.length) {
        let touch = e.touches[0];
        this.moveLeft = touch.clientX - this.divWidth / 2; //因拖动的中间点为Dom节点的中心点，所以left需减去Dom节点一半的宽度
        this.moveTop = touch.clientY - this.divHeight / 2; //top原理同上
      }
      this.isMoved = true;
    },
    dragCancel() {
      this.isMoved = false;
    },
  },
  mounted() {},
  beforeDestroy() {
    // // 添加监听页面滚动
    // window.removeEventListener('scroll', this.handleScrollStart)
  },
  destroyed() {},
};
</script>
<style lang="scss">
.float_button {
  position: absolute;
  .float_info {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    background: #00000090;
    color: #fff;
    transition: all 0.3s;
    font-size: 22px;
    position: fixed;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    z-index: 999;
    border-radius: 50%;
    cursor: pointer;
    .text {
      font-size: 24px;
      color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>