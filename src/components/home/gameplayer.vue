<template>
  <div class="gameplaybox">
    <div @click="show=true">
      <div class="bottom_xian">
        <div></div>
      </div>
      <!-- <iconBox/> -->
    </div>
    <iframe
      width="100%"
      height="100%"
      class="myIframe"
      :src="loginUrl"
      frameborder="0"
      scrolling="auto"
    ></iframe>
    <van-popup v-model="show" style="border-radius: 12px;" lock-scroll>
      <div class="wxts">
        <div class="wxts-title">{{ $t('温馨提示') }}</div>
        <div class="wxts-text">
          {{ $t('为了您的金额及时同步，请确保游戏结束在返回大厅哦') }}
        </div>
        <div class="wxts-betBox">
          <div class="but1" @click="clickLeft">{{ $t('返回大厅') }}</div>
          <div class="but2" @click="show=false">{{ $t('继续游戏') }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import iconBox from '@/components/iconBox';
export default {
  components: {
    iconBox
  },
  data() {
    return {
      show: false,
    };
  },
  computed:{
    ...mapState(["loginUrl"]),
  },
  created() {
  },
  destroyed() {
  },
  methods: {
    clickLeft() {
      this.$store.state.loginUrl = '';
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
.gameplaybox {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  .wxts {
    width: 316PX;
    // height: 248px;
    background: #fff;
    border-radius: 12PX;
    padding: 21PX 13PX;
    .wxts-title {
      text-align: center;
      font-family: m;
      font-size: 17PX;
      line-height: 24PX;
      height: 24PX;
      color: #000;
      margin-bottom: 38PX;
    }
    .wxts-text {
      font-size: 15PX;
      line-height: 26PX;
      text-align: center;
      color: #000;
    }
    .wxts-betBox {
      padding-top: 43PX;
      div {
        border: 0.5px solid #000;
        border-radius: 6PX;
        height: 40PX;
        line-height: 40PX;
        text-align: center;
        width: 134PX;
        display: inline-block;
        font-size: 15PX;
        font-family: m;
      }
      .but1 {
        background: #fff;
        margin-right: 18PX;
        color: #000;
      }
      .but2 {
        background: rgb(247, 135, 29);
        color: #fff;
      }
    }
  }
  .myIframe {
    width: 100%;
    height: 100%;
  }
  .bottom_xian{
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%);
    padding: 10PX 15px;
    div{
      background-color: #fff;
      height: 5PX;
      width: 160px;
    }
  }
}
</style>
