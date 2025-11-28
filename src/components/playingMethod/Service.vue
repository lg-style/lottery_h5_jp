<template>
  <div class="Service">
    <!-- <titleBar title_name="客服中心" @toLeft="to" left_icon="arrow-left" class="titleBar"/> -->
    <iframe id="mainiframe" width="100%" height="100%" :src="url" frameborder="0" scrolling="auto"></iframe>
    <!-- <div class="Service_loading" style="color: #0094ff"><van-loading color="#0094ff" />加载中...</div> -->
    <img id="load" style="position: fixed;top:50%;left:50%;margin: -50px 0 0 -50px;" src="../../assets/首页/rolling.svg">
<!--    <van-empty description="暂无在线客服" />-->
  </div>
</template>
<script>

  export default {
    data() {
      return {
        url:'./static/chatlink.html'
      };
    },
    mounted() {

    },
    methods: {
      to(){
        this.$router.push({
          path: this.$route.query.redirect,
          query:{
            redirect:this.$route.path
          }})
      },
    }
  };
</script>

<style lang="scss">
  .Service{
    width: 100%;
    height: 100%;
    #mainiframe{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .Service_loading{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
