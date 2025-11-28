<template>
  <header class="pub_head">
    <div :class="['head_con']">
      <div class="left"
           @click="router">
        <span v-if="!noLeft"
             class="icon" />
      </div>
      <div class="title"
           @click="toclickTitle">
        <i>{{ title }}</i>
      </div>
      <div class="switch"
           @click="toclickCategory">
        <slot name="right">
          <i v-show="typeof clickCategory === 'function'" />
        </slot>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'AppHeader',
  props: [
    'clickRouter',
    'clickTitle',
    'clickCategory',
    'title',
    'noLeft',
  ],

  data() {
    return {};
  },
  mounted() {},
  methods: {
    router() {
      if (this.clickRouter) {
        this.clickRouter();
        return;
      }
      this.$router.go(-1);
    },
    toclickTitle() {
      if (this.clickTitle) this.clickTitle();
    },
    toclickCategory() {
      if (this.clickCategory) this.clickCategory();
    },
  },
};
</script>
<style lang="scss" scoped>
    .pub_head{
        height: 44px;
        background-color: #FFFFFF;
        .head_con{
            display: flex;
            height: 100%;
            justify-content: space-between;
            align-items: center;
        }
        .left{
            display: flex;
            width: 50px;
            justify-content: center;
            align-items: center;
            .icon{
                display: inline-block;
                width: 9px;
                height: 16.5px;
                position: relative;
                &::after{
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    display: inline-block;
                    width: 9px;
                    height: 9px;
                    color: #524C3D;
                    border: transparent;
                    border-left: 2px solid gray;
                    border-bottom:2px solid gray;
                    transform: rotate(45deg);
                }
            }
        }
        .title{
            font-size: 17px;
            color: #000;
            font-weight: bold;
            i{
                font-style: normal;
                font-family: PingFang SC;
            }
        }
    }
</style>