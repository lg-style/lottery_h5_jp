<template>
  <div class="titleBar">
    <van-row type="flex" justify="space-between" align="center" class="titleBar_title">
      <van-row  type="flex" justify="space-between" align="center" class="left" @click="toLeft">
        <van-icon :name="left_icon" />
      </van-row >
      <div class="name">{{ title_name }}</div>
      <div class="_right flex-right flex-center" @click="toRight">
        {{ right_name }}
        <van-icon :name="right_icon"/>
      </div>
    </van-row>
  </div>
</template>
<script>

  export default {
    props: ["title_name",'right_name','left_icon','right_icon'],
    data() {
      return {

      };
    },
    mounted() {

    },
    methods: {
      toLeft(){
        this.$emit("toLeft");
      },
      toRight(){
        this.$emit("toRight");
      },
    }
  };
</script>

<style lang="scss">
  .titleBar{
    background: -webkit-linear-gradient(bottom,#d83442 2%,#d83442 50%,#d83442 51%,#d83442);
    .titleBar_title{
      color: #fff;
      padding: 0px 8.7px;
      height: 50px;
      .left{
        width: 22%;
        .van-icon{
          font-size: 22px;
        }
      }
      .name{
        font-size: 19.33px;
      }
      ._right{
        text-align: right;
        width: 22%;
        font-size: 17.4px;
        line-height: 1;
        .van-icon{
          font-size: 22px;
        }
      }
    }
  }
</style>
