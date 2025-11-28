<template>
  <div id="app" :class="{ tabsBgOpenClass: tabsBgOpen === '1' }">
    <router-view />
    <!-- <van-overlay :show="$store.state.loading" class-name="jiazai">
      <div style="color: #0094ff"><van-loading color="#0094ff" />加载中...</div>
    </van-overlay> -->

    <!-- 登录过期 弹窗 -->
    <van-popup
      v-model="$store.state.loginOpen"
      :overlay-style="{ zIndex: 2100 }"
      duration="0"
      class="loginOpen"
      lock-scroll
    >
      <div>
        <div class="loginOpen_title">温馨提示</div>
        <div class="loginOpen_content">
          由于您长时间未操作,已自动退出,需要重新登录
        </div>
        <div class="loginOpen_btn" @click="toLogin()">确认</div>
      </div>
    </van-popup>
    <!-- 公共提示 弹窗 -->
    <van-popup
      lock-scroll
      v-model="$store.state.tishiOpen"
      :overlay-style="{ zIndex: 2100 }"
      duration="0"
      class="loginOpen"
    >
      <div>
        <div class="loginOpen_title">温馨提示</div>
        <div class="loginOpen_content" v-html="$store.state.tishiText"></div>
        <div
          class="betShow_btn flex-left flex-center"
          v-if="$store.state.tishiText.indexOf('投注成功') > -1"
        >
          <div
            @click="
              $store.state.tishiOpen = false;
              toPath('betRecord');
            "
          >
            查看注单
          </div>
          <div @click="$store.state.tishiOpen = false">继续投注</div>
        </div>
        <div
          class="loginOpen_btn"
          @click="$store.state.tishiOpen = false"
          v-else
        >
          确定
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="$store.state.isiosOpen"
      closeable
      class="isiOSOpen"
      position="bottom"
      :overlay="false"
      lock-scroll
    >
      <div class="tit">1、使用Safari浏览器</div>
      <img class="_bg" src="./assets/首页/photo_2023-09-21_00-30-16.jpg" />
      <div class="tit">2、点击添加到主屏幕</div>
      <img class="_bg" src="./assets/首页/photo_2023-09-18_20-09-27.jpg" />
      <div class="tit">3、点击添加</div>
      <img class="_bg" src="./assets/首页/dkls.jpg" />
      <div class="zd1"></div>
      <div class="zd2"></div>
      <div class="zd3"></div>
      <img class="hand" src="./assets/首页/hand-o-up.png" />
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      document.querySelector("html").scrollTop = 0; // 设置滚动条位置;
      if (to.path != "/lottery") {
        clearTimeout(this.$store.state.oddsTimeObj);
      }
    },
  },
  computed: {
    ...mapState(["isiosOpen","mixCurrencyList"]),
    tabsBgOpen(){
      return sessionStorage['tabsBgOpen'] || '0';
    },
  },
  created() {
    this.getDownloadUrl();
    this.$store.state.loading = false;
    if (sessionStorage["sessionId"]) {
      this.getGroupList();
    }
  },
  mounted() {
    // 监听浏览器息屏和唤醒
    // let time1 = 0;
    // let time2 = 0;
    // document.addEventListener('visibilitychange', () => {
    //   if (document.hidden) {
    //     time1 = new Date().getTime();
    //   } else {
    //     time2 = new Date().getTime();
    //     if (time2 - time1 >= 60000) {
    //       location.reload();
    //     }
    //   }
    // });

    this.$store.commit("getDate");
    window.addEventListener("unload", this.saveState);
  },
  methods: {
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    // 退出登录
    toLogin() {
      this.$router.push({ path: "login" });
      this.$store.state.loginOpen = false;
    },
    //获取下载地址
    getDownloadUrl() {
      this.$ajax.post(`/index/getDownloadUrl`).then((res) => {
        if (res.code == "200") {
          this.$store.state.downloadUrl = res.data.apkDownloadUrl;
        }
      }).catch((error) => {
        // 捕获错误，避免未处理的 Promise rejection
        console.error('获取下载地址失败:', error);
        // 不显示错误提示，因为下载地址不是必须的
      });
    },
    //获取游戏分类
    getGroupList() {
      this.$ajax.post(`/lottery/groupList`).then((res) => {
        if (res.code == "200") {
          for(let k of res.data){
            // k.list = k.list.filter(n=>n.lotteryCode !='LAMLHC')
            // k.list = k.list.filter(n=>n.lotteryCode !='LAMLHC' && n.lotteryCode !='XAMLHC')
          }
          this.$store.state.GroupList = res.data;
        }
      });
    },
    saveState() {
      // 重置参数
      this.$store.state.loginOpen = false;
      this.$store.state.isiosOpen = false;
      this.$store.commit("SET_TISHI", "");
      this.$store.commit("SET_optionObj");
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    },
  },
};
</script>

<style lang="scss">
html {
  height: 100%;
}
body {
  height: 100%;
}
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  font-size: 14px;
}
.van-cell__title {
  width: 2.7rem !important;
}
.ofHidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.van-field__control:disabled {
  /*opacity: 0.5;*/
  color: #000 !important;
}
.dateBox {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
  .dateBox_but {
    color: #fff;
    border-radius: 5px;
    padding: 5px 5px;
    border: 1px solid #fff;
    box-sizing: border-box;
    background-color: #fff;
    color: #606266;
    div {
      font-size: 14px;
      padding: 7px 5px;
    }
    i {
      font-size: 16.4px;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100px;
  }
}
.dateBox_time {
  text-align: center;
  padding-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
}
.jiazai {
  background-color: rgba(0, 0, 0, 0.1) !important;
  text-align: center;
  padding-top: 50vh;
  z-index: 999999 !important;
}
.loginOpen {
  width: 90%;
  max-width: 640px;
  text-align: center;
  z-index: 2101 !important;
  border-radius: 5px;
  .loginOpen_title {
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 5px 5px 0 0;
    border-bottom: 1px solid #d8d8d887;
  }
  .loginOpen_content {
    padding: 10px 20px;
    line-height: 22px;
    font-size: 14px;
  }
  .loginOpen_btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 0;
    border-top: 1px solid #d0d0d0;
    background-color: #f2f2f2;
    color: #40affe;
    font-size: 14px;
    font-family: Helvetica, arial, sans-serif;
  }
  .betShow_btn {
    border-top: 1px solid #d0d0d0;
    background-color: #f2f2f2;
    text-align: center;
    font-size: 14px;
    box-sizing: border-box;
    div {
      width: 50%;
      box-sizing: border-box;
      height: 50.67px;
      line-height: 50.67px;
    }
    div:first-child {
      border-right: 1px solid #d0d0d0;
    }
    div:last-child {
      color: #40affe;
    }
  }
}
.isiOSOpen {
  width: 100vw;
  z-index: 9999 !important;
  background: #00000080;
  padding-bottom: 20px;
  .tit {
    padding: 10px 30px;
    font-size: 15.5px;
    color: #fff;
  }
  ._bg {
    display: block;
    margin: 0 auto;
    width: 230px;
    border-radius: 5px;
  }
  .zd1 {
    position: absolute;
    // bottom: 472px;
    bottom: 448px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid red;
    border-radius: 5px;
    height: 25px;
    width: 30px;
  }
  .zd2 {
    position: absolute;
    // bottom: 260px;
    bottom: 235px;
    left: 75px;
    border: 2px solid red;
    border-radius: 5px;
    height: 25px;
    width: 220px;
  }
  .zd3 {
    position: absolute;
    // bottom: 128px;
    bottom: 125px;
    right: 70px;
    border: 2px solid red;
    border-radius: 5px;
    height: 25px;
    width: 50px;
  }
  .hand {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    animation-name: beat;
    /*动画名称*/
    animation-duration: 0.5s;
    /*设置秒数*/
    animation-timing-function: linear;
    /*速度曲线*/
    animation-iteration-count: infinite;
    /*播放次数*/
    animation-direction: alternate;
    /*逆向播放*/
    animation-play-state: running;
    /*正在运行*/
  }
  @keyframes beat {
        0% {
            bottom: 0;
        }

        100% {
            bottom: 20px;
        }
    }
}
</style>
