<template>
  <div class="homePage">
    <van-row
      type="flex"
      justify="space-between"
      align="center"
      class="top_title"
    >
      <div class="logo">
        <img src="../../assets/首页/home/logoImg.png" style="margin-left: 1rem;"/>
      </div>
      <div class="top_r flex-center flex-right">
        <div class="flex-center flex-left">
          <img src="../../assets/首页/home/gfhgff.png" />
          <div>{{ userInfoData.userNo }}</div>
        </div>
        <div class="flex-center flex-left" @click="toPath('extend')">
          <img src="../../assets/首页/home/ddfgfg.png" />
          <div>{{ $t("homeExtend['全民推广']") }}</div>
        </div>
      </div>
    </van-row>
    <van-row
      type="flex"
      justify="space-between"
      align="center"
      class="top_noticeBox"
    >
      <img class="infoImg" src="../../assets/首页/info.png" />
      <notice :notice2="notice2" />
    </van-row>
    <div class="functionality">
      <van-row type="flex" justify="space-between" align="center" class="box">
        <div class="box_0 box_1" @click="toPath('changlong')">
          <div class="img">
            <img src="../../assets/首页/home/cl2.png" />
          </div>
          <div class="text">{{ $t("homeIndex['长龙下注']") }}</div>
        </div>
        <div class="box_0 box_2" @click="toPath('withdrawDeposit')">
          <div class="img">
            <img src="../../assets/首页/home/zh2.png" />
          </div>
          <div class="text">{{ $t("homeIndex['便携提款']") }}</div>
        </div>
        <div class="box_0 box_3" @click="toPath('tradingRecord')">
          <div class="img">
            <img src="../../assets/首页/home/tx2.png" />
          </div>
          <div class="text">{{ $t("homeIndex['交易记录']") }}</div>
        </div>
        <div class="box_0 box_4" @click="xiazai">
          <div class="img">
            <img src="../../assets/首页/home/xz2.png" />
          </div>
          <div class="text">{{ $t("homeIndex['app下载']") }}</div>
        </div>
      </van-row>
    </div>
    <div class="functionality2 flex-left">
      <div
        :class="{ _div: zlType == 1 }"
        @click="
          active = 0;
          zlType = 1;
        "
      >
        {{ $t("homeIndex['传统彩']") }}
      </div>
      <div
        :class="{ _div: zlType == 2 }"
        @click="
          active = 0;
          zlType = 2;
        "
      >
        {{ $t("homeIndex['官方彩']") }}
      </div>
    </div>
    <van-tabs
      v-if="zlType == 1"
      v-model="active"
      class="lotteryTabs"
      background="#fff"
      title-active-color="#ee0a24"
      title-inactive-color="#404656"
      line-width="0px"
      swipeable
      animated
    >
      <van-tab
        v-for="(k, i) in typeList.filter((n, j) => j == 0)"
        :key="k.groupId"
      >
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == 0 }">
            {{ k.groupName }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in k.list"
            class="box"
            @click="togame(n, k.groupName)"
            :class="{ filter90: n.lotteryStatus == 0 }"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="require(`../../assets/首页/home/cp/${n.lotteryCode}.png`)"
            />
            <div class="cpName ofHidden">{{ n.lotteryName }}</div>
            <div class="weihu" v-show="n.lotteryStatus == 0">
              {{ $t("new2['暂未开放']") }}
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab>
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == 1 }">
            {{ $t("homeIndex['综合']") }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in gameList"
            class="box"
            @click="togameOpen(n)"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="
                require(`../../assets/gameImg/${n.categoryCode}_${n.gameCode}.png`)
              "
            />
            <div class="cpName ofHidden">{{ n.gameName }}</div>
          </div>
        </div>
      </van-tab>
      <van-tab
        v-for="(k, i) in typeList.filter((n, j) => j > 0)"
        :key="k.groupId"
      >
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == i + 2 }">
            {{ k.groupName }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in k.list"
            class="box"
            @click="togame(n, k.groupName)"
            :class="{ filter90: n.lotteryStatus == 0 }"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="require(`../../assets/首页/home/cp/${n.lotteryCode}.png`)"
            />
            <div class="cpName ofHidden">{{ n.lotteryName }}</div>
            <div class="weihu" v-show="n.lotteryStatus == 0">
              {{ $t("new2['暂未开放']") }}
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-tabs
      v-else
      v-model="active"
      class="lotteryTabs"
      background="#fff"
      title-active-color="#ee0a24"
      title-inactive-color="#404656"
      line-width="0px"
      swipeable
      animated
    >
      <van-tab
        v-for="(k, i) in typeList2.filter((n, j) => j == 0)"
        :key="k.groupId"
      >
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == 0 }">
            {{ k.groupName }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in k.list"
            class="box"
            @click="togame(n, k.groupName)"
            :class="{ filter90: n.lotteryStatus == 0 }"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="require(`../../assets/首页/home/cp/${n.lotteryCode}.png`)"
            />
            <div class="cpName ofHidden">{{ n.lotteryName }}</div>
            <div class="weihu" v-show="n.lotteryStatus == 0">
              {{ $t("new2['暂未开放']") }}
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab>
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == 1 }">
            {{ $t("homeIndex['综合']") }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in gameList"
            class="box"
            @click="togameOpen(n)"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="
                require(`../../assets/gameImg/${n.categoryCode}_${n.gameCode}.png`)
              "
            />
            <div class="cpName ofHidden">{{ n.gameName }}</div>
          </div>
        </div>
      </van-tab>
      <van-tab
        v-for="(k, i) in typeList2.filter((n, j) => j > 0)"
        :key="k.groupId"
      >
        <div slot="title">
          <div class="navTitle" :class="{ selected: active == i + 2 }">
            {{ k.groupName }}
          </div>
        </div>
        <div class="lotteryTabs_body">
          <div
            v-for="n in k.list"
            class="box"
            @click="togame(n, k.groupName)"
            :class="{ filter90: n.lotteryStatus == 0 }"
            :key="n.id"
          >
            <img
              class="cpImg"
              :src="require(`../../assets/首页/home/cp/${n.lotteryCode}.png`)"
            />
            <div class="cpName ofHidden">{{ n.lotteryName }}</div>
            <div class="weihu" v-show="n.lotteryStatus == 0">
              {{ $t("new2['暂未开放']") }}
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!--    公告-->
    <van-popup
      style="background: none;"
      v-model="$store.state.noticeShow"
      v-if="notice1.length > 0"
      :overlay="true"
      :style="{ width: '80%' }"
      lock-scroll
    >
      <div
        class="noticeOpen"
        v-for="(k, i) in notice1"
        :key="i"
        v-show="index == i"
      >
        <div class="notification_title">{{ k.noticeTitle }}</div>
        <div class="notification_content">
          <div v-html="k.noticeContent"></div>
        </div>
        <div class="notification_btn flex-between flex-center">
          <div class="_btn _btn1" v-if="index == 0">
            {{ $t("homeNotice['上一条']") }}
          </div>
          <div class="_btn _btn2" v-else @click="index--">
            {{ $t("homeNotice['上一条']") }}
          </div>
          <div class="_btn _btn3" @click="$store.state.noticeShow = false">
            {{ $t("homeNotice['关闭']") }}
          </div>
          <div class="_btn _btn1" v-if="index == notice1.length - 1">
            {{ $t("homeNotice['下一条']") }}
          </div>
          <div class="_btn _btn2" v-else @click="index++">
            {{ $t("homeNotice['下一条']") }}
          </div>
        </div>
      </div>
    </van-popup>

    <!--    快速转入三方 弹窗-->
    <van-popup
      v-model="kszrBodyShow"
      closeable
      :overlay="true"
      style="background: none"
      lock-scroll
    >
      <div class="kszrBody">
        <div class="kszrBody-title">
          {{ $t("homeIndex['快速转账']") }}({{ gameObj.gameName }})
        </div>
        <div class="kszrBody-box">
          <div class="kszrBody-form">
            <div class="form-row flex-center flex-left">
              <div>{{ $t("homeIndex['我的钱包']") }}</div>
              <div>{{ amount.accountMoney }}</div>
            </div>
            <div class="form-row flex-center flex-left">
              <div>{{ $t("homeIndex['转入游戏']") }}</div>
              <div class="flex-center flex-left">
                {{ sfgameAmount }}<span>（{{ gameObj.categoryName }}）</span>
                <img
                  @click="onSearchAmount()"
                  class="shaxin-gameAmount"
                  :class="{ turn: refreshLoad }"
                  src="../../assets/首页/sx.png"
                />
              </div>
            </div>
            <div class="form-row flex-center flex-left">
              <div>{{ $t("homeIndex['操作金额']") }}</div>
              <div>
                <van-field
                  v-model="gameAmount"
                  type="number"
                  :placeholder="$t('homeIndex[\'请输入金额\']')"
                />
              </div>
            </div>
          </div>
          <div class="numBox flex-center flex-between">
            <div v-for="(k, i) in numBoxList" :key="i" @click="setNum(k)">
              {{ k.labelKey ? $t(k.labelKey) : k.label }}
            </div>
          </div>
          <div class="butBox flex-center flex-between">
            <div
              v-for="(k, i) in butBoxList"
              :key="i"
              @click="onButClick(k)"
              :style="`background-color:${k.backgroundColor};border-color${k.borderColor}`"
            >
              {{ $t(k.labelKey) }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 客服 -->
    <div class="positionFixed" v-show="guanbiShow">
      <van-icon class="guanbi" name="clear" @click="guanbiShow = false" />
      <!-- <div @click="dazhuanpan"><img src="../../assets/首页/home/cp/draw.1eef21f.png"></div> -->
      <div @click="toTabsBg()">
        <img src="../../assets/首页/home/cp/tabbg.png" />
      </div>
      <div @click="toService()">
        <img src="../../assets/首页/home/cp/kf.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import notice from "./notice";
export default {
  components: { notice },
  data() {
    return {
      loading: false,
      index: 0,
      zlType: 1, //1 传统彩，2 官方彩
      butBoxList: [
        {
          key: "confirmIn",
          labelKey: "homeIndex['确认划入']",
          borderColor: "#419641",
          backgroundColor: "#5cb85c",
        },
        {
          key: "confirmOut",
          labelKey: "homeIndex['确认划出']",
          borderColor: "rgb(33, 150, 243)",
          backgroundColor: "rgb(33, 150, 243)",
        },
        {
          key: "toRecharge",
          labelKey: "homeIndex['去充值']",
          borderColor: "#2e6da4",
          backgroundColor: "#337ab7",
        },
        {
          key: "enterGame",
          labelKey: "homeIndex['进入游戏']",
          borderColor: "#f77a0b",
          backgroundColor: "#f7871d",
        },
      ],
      numBoxList: [
        { label: "100", val: 100 },
        { label: "500", val: 500 },
        { label: "1000", val: 1000 },
        { label: "5000", val: 5000 },
        { key: "allIn", labelKey: "homeIndex['全部转入']", val: 0 },
        { key: "allOut", labelKey: "homeIndex['全部转出']", val: 0 },
      ],
      kszrBodyShow: false,
      gameObj: {},
      gameAmount: null,
      sfgameAmount: 0,
      guanbiShow: true,
      current: 0,
      active: 0,
      notice1: [], //弹窗公告
      notice2: [], //走马灯公告
      show: false,
      gameList: [], //综合游戏列表
    };
  },
  computed: {
    ...mapState([
      "GroupList",
      "userInfo",
      "noticeShow",
      "amount",
      "refreshLoad",
      "device",
    ]),
    // 信用
    typeList() {
      let data = this.GroupList || [];
      let arr = data.filter((k) => {
        return k.groupStatus == 1 && k.list.length > 0 && k.groupType == 10;
      });
      return arr;
    },
    // 官方
    typeList2() {
      let data = this.GroupList || [];
      let arr = data.filter((k) => {
        return k.groupStatus == 1 && k.list.length > 0 && k.groupType == 20;
      });
      return arr;
    },
    userInfoData() {
      return this.userInfo;
    },
  },
  created() {
    this.getStatus();
    this.$store.state.refreshLoad = false;
    this.onrefreshLoad();
    this.getGroupList();
    this.getInfo();
    this.getNotice();
    this.getGameList();
  },
  methods: {
    ...mapActions(["getInfo", "onrefreshLoad"]),
    getStatus() {
      this.loading = false;
      this.$ajax
        .post("/cashout/status")
        .then((res) => {
          if(res.data){
            
          }else {
            this.loading = true;
          }
        })
        .catch((error) => {
          this.$toast(error);
        })
    },
    getGameList() {
      this.$ajax.post(`/list/game`).then((res) => {
        this.gameList = res.data || [];
      });
    },
    getNotice() {
      this.$ajax.post(`/index/notice`).then((res) => {
        this.notice1 = [];
        this.notice2 = [];
        if (res.data) {
          res.data.map((k) => {
            if (k.noticeType == 1) {
              this.notice1.push(k);
              this.notice2.push(k);
            } else if (k.noticeType == 2) {
              
            }
          });
        }
      });
    },
    onPrev() {
      this.$refs.noticeTab.prev();
    },
    onNext() {
      this.$refs.noticeTab.next();
    },
    onChange(val) {
      this.current = val;
    },
    //获取游戏分类
    getGroupList() {
      this.$ajax
        .post(`/lottery/groupList`)
        .then((res) => {
          for(let k of res.data){
            // k.list = k.list.filter(n=>n.lotteryCode !='LAMLHC')
            // k.list = k.list.filter(n=>n.lotteryCode !='LAMLHC' && n.lotteryCode !='XAMLHC')
          }
          this.$store.state.GroupList = res.data;
        })
        .finally(() => {
        });
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    // 三方游戏
    togameOpen(n) {
      if(!this.loading){
        this.$toast(this.$t("homeIndex['不是正常状态，不能进行游戏。']"));
        return;
      }
      this.gameObj = n;
      this.kszrBodyShow = true;
      this.gameAmount = null;
      this.onSearchAmount();
    },
    setNum(k) {
      if (k.key === "allIn") {
        this.gameAmount = this.amount.accountMoney;
        // this.amountTransferInto();
      } else if (k.key === "allOut") {
        this.gameAmount = this.sfgameAmount;
        // this.amountTransferOut();
      } else {
        this.gameAmount = k.val;
      }
    },
    onButClick(k) {
      if (k.key === "confirmIn") {
        this.amountTransferInto();
      } else if (k.key === "confirmOut") {
        this.amountTransferOut();
      } else if (k.key === "toRecharge") {
        this.toPath("recharge");
      } else if (k.key === "enterGame") {
        this.jinruGame();
      }
    },
    // 第三方余额(刷新)
    onSearchAmount() {
      this.$store.state.refreshLoad = true;
      let n = this.gameObj;
      this.$ajax
        .post(`/channel/searchAmount?platformId=${n.thirdPlatformId}`)
        .then((res) => {
          this.sfgameAmount = res.data || 0;
        })
        .finally(() => {
          this.$store.state.refreshLoad = false;
        });
    },
    // 登录三方游戏
    jinruGame() {
      let n = this.gameObj;
      this.$ajax
        .post(
          `/channel/login?platformId=${n.thirdPlatformId}&gameCode=${
            n.gameCode
          }&lang=${""}&machine${""}&returnUrl=${""}`
        )
        .then((res) => {
          this.kszrBodyShow = false;
          this.$store.state.loginUrl = res.data.loginUrl;
          this.$router.push("gameplayer");
        })
        .finally(() => {
        });
    },
    // 划出
    amountTransferOut() {
      if (!this.gameAmount) {
        this.$toast(this.$t("homeIndex['请填写金额']"));
        return;
      }
      if (this.gameAmount > this.sfgameAmount) {
        this.$toast(this.$t("homeIndex['游戏内余额不足']"));
        return;
      }
      this.$dialog
        .confirm({
          title: this.$t("homeIndex['确认划出']"),
          message: this.$t("homeIndex.transferOutMessage", {
            from: this.gameObj.gameName,
            amount: this.gameAmount,
            to: this.$t("homeIndex['我的钱包']"),
          }),
        })
        .then(() => {
          let n = this.gameObj;
          this.$ajax
            .post(
              `/channel/amountTransferOut?amount=${this.gameAmount}&platformId=${n.thirdPlatformId}`
            )
            .then((res) => {
              this.sfgameAmount -= this.gameAmount / 1;
              this.onrefreshLoad();
              this.$store.commit("SET_TISHI", this.$t("homeIndex['划出成功']"));
              this.gameAmount = null;
            })
            .finally(() => {
            });
        });
    },
    // 划入
    amountTransferInto() {
      if (!this.gameAmount) {
        this.$toast(this.$t("homeIndex['请填写金额']"));
        return;
      }
      if (this.gameAmount > this.amount.accountMoney) {
        this.$toast(this.$t("homeIndex['钱包余额不足']"));
        return;
      }
      this.$dialog
        .confirm({
          title: this.$t("homeIndex['确认划入']"),
          message: this.$t("homeIndex.transferInMessage", {
            from: this.$t("homeIndex['我的钱包']"),
            amount: this.gameAmount,
            to: this.gameObj.gameName,
          }),
        })
        .then(() => {
          let n = this.gameObj;
          this.$ajax
            .post(
              `/channel/amountTransferInto?amount=${this.gameAmount}&platformId=${n.thirdPlatformId}`
            )
            .then((res) => {
              this.sfgameAmount += this.gameAmount / 1;
              this.onrefreshLoad();
              this.$store.commit("SET_TISHI", this.$t("homeIndex['划入成功']"));
              this.gameAmount = null;
            })
            .finally(() => {
            });
        });
    },
    // 彩票游戏
    togame(n, groupName) {
      if (n.lotteryStatus == 0) {
        this.$toast(this.$t("new2['暂未开放']"));
        return;
      } else {
        if (groupName == "热门") {
          if (n.gameCategoryCode === "SSC") {
            n.groupName = "时时彩";
          }
          if (n.gameCategoryCode === "PK10") {
            n.groupName = "PK10";
          }
          if (n.gameCategoryCode === "KLC") {
            n.groupName = "快乐彩";
          }
          if (n.gameCategoryCode === "LHC") {
            n.groupName = "六合彩";
          }
          if (n.gameCategoryCode === "K3") {
            n.groupName = "快三";
          }
        } else {
          n.groupName = groupName;
        }
        this.$store.state.lotteryObj = n;
        this.$router.push({
          path: "/lottery",
          query: {
            redirect: this.$route.path,
          },
        });
      }
    },
    // 切换主题
    toTabsBg(){
      if(sessionStorage['tabsBgOpen'] === '1'){
        sessionStorage['tabsBgOpen'] = '0'
      }else{
        sessionStorage['tabsBgOpen'] = '1'
      }
      window.location.reload();
    },
    toService() {
      this.toPath("Service");
      return;
      this.$dialog
        .confirm({
          className: "kf",
          title: this.$t("homeIndex['请选择客服']"),
          confirmButtonText: this.$t("homeIndex['客服通道2']"),
          cancelButtonText: this.$t("homeIndex['客服通道1']"),
        })
        .then(() => {
          this.toPath("customerService");
        })
        .catch(() => {
          this.toPath("Service");
        });
    },
    xiazai() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        this.$store.state.isiosOpen = true;
      } else {
        this.$toast(this.$t("homeIndex['正在下载']"));
        if(this.$store.state.downloadUrl){
          window.open(this.$store.state.downloadUrl);
        }
      }
    },
  },
};
</script>
<style lang="scss">
.noticeOpen {
  border-radius: 4px;
  background-color: #fff;
  width: 281.5px;
  .notification_title {
    border-radius: 4px 4px 0 0;
    height: 45px;
    line-height: 45px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    color: #151515;
  }
  .notification_content {
    padding: 15px;
    max-height: 500px;
    min-height: 100px;
    overflow-y: auto;
    font-size: 14px;
    color: #151515;
  }
  .notification_btn {
    height: 45px;
    padding: 0 10px;
    border-top: 1px solid #ddd;
    ._btn {
      width: 83.6771px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      font-size: 14px;
    }
    ._btn1 {
      background: buttonface !important;
    }
    ._btn2 {
      background: #0097dd;
    }
    ._btn3 {
      background: #ff6363;
    }
  }
}
.homePage {
  .kszrBody {
    width: 345px;
    height: 260px;
    position: relative;
    background-color: #fff;
    // border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    // box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    background-clip: padding-box;
    box-sizing: border-box;
    .kszrBody-title {
      margin: 0;
      line-height: 43.5px;
      height: 43.5px;
      color: #4d4d4d;
      font-size: 16.8px;
      font-weight: 400;
      border-bottom: 1px solid #e5e5e5;
      padding-left: 13.5px;
    }
    .kszrBody-form {
      padding-left: 40px;
      padding-top: 8.4px;
      padding-bottom: 10px;
      .form-row {
        height: 31px;
        div:first-child {
          padding-right: 10px;
        }
        div:last-child {
          width: 200px;
          color: #e25257;
          .shaxin-gameAmount {
            width: 18px;
            margin-left: 15px;
          }
          span {
            color: #000;
          }
          .van-cell {
            padding: 0;
            padding-left: 10px;
            border-bottom: 1px solid #aaa;
            .van-field__control {
              font-size: 18px;
            }
          }
        }
      }
    }
    .numBox {
      margin: 0 auto;
      width: calc(100% - 25px);
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 8.4px;
      div {
        padding: 0 5px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 14px;
      }
    }
    .butBox {
      margin-top: 8.4px;
      padding: 0 15px;
      div {
        box-sizing: border-box;
        min-width: 70px;
        padding: 0 5px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #fff;
        border-radius: 3px;
        font-size: 15px;
      }
    }
  }
  .lotteryTabs {
    .van-tabs__wrap {
      height: 1rem;
      .van-tab {
        flex-basis: 0% !important;
        width: calc(100% / 6);
        flex: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.homePage {
  background-color: #fff;
  min-height: 100vh;
  .positionFixed {
    position: fixed;
    right: 10px;
    bottom: 100px;
    img {
      width: 60px;
    }
    .guanbi {
      position: absolute;
      top: -20px;
      right: 0px;
      font-size: 20px;
    }
  }
  .notice_body {
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 18.5px;
      padding: 10px 0;
      border-bottom: 2px solid #ddd;
      position: relative;
      .e-notice {
        height: 25px;
        position: absolute;
        left: calc(50% - 50px);
      }
    }
    .notice_body_box {
      padding: 15px 10px 40px 12px;
      .notice_body_box_time {
        font-size: 12px;
        color: #666;
      }
      .notice_body_box_title {
        font-weight: bold;
        line-height: 30px;
        font-size: 15.5px;
      }
      .notice_body_box_text {
        text-indent: 2em;
        color: #666;
      }
    }
    .but_box {
      text-align: center;
      padding: 0px 0 20px;
    }
  }

  .top_title {
    background: linear-gradient(#d83442, #c62c41, #b82541);
    padding: 2px 10px;
    position: sticky;
    top: 0;
    z-index: 1;
    .logo {
      line-height: 0;
      img {
        height: 40px;
      }
    }
    .top_r {
      font-size: 16px;
      color: #fff;
      text-decoration: underline;
      .flex-left {
        padding: 0 6px;
      }
      img {
        width: 18.75px;
        height: 18.75px;
        margin-right: 4.6875px;
      }
    }
  }
  .top_noticeBox {
    padding: 5px 10px;
    background-color: #fff;
    .infoImg {
      height: 15px;
      margin-right: 5px;
    }
  }
  .functionality {
    .box {
      height: 55px;
      border-bottom: 1px solid #ddd;
      /*border-top: 1px solid #ddd;*/
      .box_0 {
        /*border-right: 1px solid #ddd;*/
        width: 25%;
        height: 100%;
        text-align: center;
        line-height: 0;
        border: 1px solid #ddd;
        border-left: 0;
        .img {
          display: inline-block;
          margin-top: 5px;
          height: 25px;
          width: 25px;
          border-radius: 50%;
          img {
            height: 100%;
          }
        }
        .text {
          font-size: 15.5px;
          line-height: 25px;
          font-size: 14px;
        }
      }
      .box_0:last-child {
        border-right: none;
      }
      .box_1 .img {
        background-color: #4f82f4;
      }
      .box_2 .img {
        background-color: #ec808d;
      }
      .box_3 .img {
        background-color: #70b603;
      }
      .box_4 .img {
        background-color: #efa648;
      }
      .box_5 .img {
        background-color: #efa648;
      }
    }
  }
  .functionality2 {
    div {
      width: 50%;
      height: 35px;
      line-height: 30px;
      font-size: 16px;
      text-align: center;
      color: #333;
    }
    ._div {
      color: #f33;
    }
  }
  .lotteryTabs {
    [class*="van-hairline"]::after {
      border-top: 1px solid #999;
    }
    .van-tab {
      padding: 0;
      flex: 1;
    }
    .navTitle {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      width: 60.5px;
      box-sizing: border-box;
      text-align: center;
    }
    .selected {
      color: #f33;
      border-top: 3.5px solid #f33;
    }
    .lotteryTabs_body {
      border-top: 1px solid #ddd;
      font-size: 0;
      box-sizing: border-box;
      .filter90 {
        filter: grayscale(90%);
      }
      .box {
        display: inline-block;
        text-align: center;
        width: 25%;
        line-height: 0;
        border: 1px solid #ddd;
        border-left: 0px;
        border-top: 0px;
        /*margin:0 2px 5px;*/
        /*border-radius: 5px;*/
        background-color: #fff;
        position: relative;
        padding: 10px 0 0 0;
        box-sizing: border-box;
        &:nth-child(4n) {
          border-right: none;
        }
        .weihu {
          position: absolute;
          top: 35px;
          right: 0;
          width: calc(100% - 30px);
          margin: 0 15px;
          line-height: 23px;
          background-color: rgba(0, 0, 0, 0.5);
          color: #ddd;
          font-size: 12px;
          border-radius: 5px;
        }
        .cpImg {
          border-radius: 5px;
          max-width: 47px;
          height: 47px;
        }
        .cpImg:last-child {
        }
        .cpName {
          font-size: 13.5px;
          line-height: 28px;
        }
      }
      .box:nth-child(4n + 4) {
        border-right: 0;
      }
      .box:last-child {
        margin-bottom: 80px;
      }
    }
  }
}
</style>
