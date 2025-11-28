<template>
  <div class="vipPage">
    <div class="title">{{ $t("myCenter['等级机制']") }}</div>
    <van-row type="flex" class="vip_title" align="center">
      <van-col span="8">{{ $t("myCenter['等级']") }}</van-col>
      <van-col span="8">{{ $t("myCenter['头衔']") }}</van-col>
      <van-col span="8">{{ $t("myCenter['成长积分']") }}</van-col>
    </van-row>
    <div class="vip_body">
      <van-row type="flex" class="vip_body_row" align="center" v-for="(k,i) in vipData" :key="i">
        <van-col span="8">{{ k.vipLevel }}</van-col>
        <van-col span="8">{{ k.vipTitle }}</van-col>
        <van-col span="8">{{ k.growthIntegral }}</van-col>
      </van-row>
    </div>
  </div>
</template>
<script>

  export default {
    props:['VipList'],
    data() {
      return {

      };
    },
    computed:{
      vipData(){
        return this.VipList
      },
    },
    mounted() {

    },
    methods: {

    }
  };
</script>

<style lang="scss">
  .vipPage{
    width: calc(100% - 20px);
    height: calc(100% - 20px);;
    /*background: url("../../assets/MyCenter/bg1.png");*/
    /*background-size: 100% 100%;*/
    text-align: center;
    line-height: 35px;
    padding: 0 10px 20px;
    .title{
      line-height: 50px;
      font-size: 15px;
      font-weight: bold;
    }
    .vip_title{
      border: 1px solid #ddd;
      border-bottom: none;
    }
    .vip_body{
      height: calc(100% - 85px);
      overflow-y: auto;
      .vip_body_row{
        border: 1px solid #ddd;
        border-bottom: none;
      }
      .vip_body_row:last-child{
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>
