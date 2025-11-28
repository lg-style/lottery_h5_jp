<template>
  <div class="MyCenter">
    <div class="MytitleBar">
      <titleBar
        :title_name="$t('myCenter[\'我的账户\']')"
        @toRight="toService()"
        :right_name="$t('myCenter[\'客服\']')"
      />
      <div class="iconfont" v-if="tabsBgOpen === '1'" @click="toPath('/')"></div>
    </div>
    <div class="myTop">
      <van-row type="flex" align="center" class="userinfo">
        <img
          :src="
            require(`../../assets/MyCenter/face/${
              userInfoData.faceId || 0
            }.jpg`)
          "
          @click="toUserinfoPage()"
          class="faceImg"
        />
        <div class="box" @click="onrefreshLoad">
          <div class="zhanghao">
            {{ $t("myCenter['账号']") }}：<span>{{ userInfoData.userNo }}</span>
          </div>
          <div class="yu_e flex-left flex-center">
            <span
              >{{ $t("myCenter['余额']") }}：{{ amount.accountMoney }}{{ $t("myCenter['元']") }}
            </span>
            <img
                class="shaxin"
                :class="{ turn: refreshLoad }"
                src="../../assets/MyCenter/up.png"
              />
          </div>
          <div class="yu_e">
            <!-- 冻结余额：<b style="color: #666">{{ amount.lockMoney }}</b> -->
          </div>
          <!--          <div class="touxian">头衔：<b>{{ userInfoData.vipTitle }}</b></div>-->
        </div>
        <!-- <van-icon name="arrow"/> -->
      </van-row>
      <!--      <div class="VIP" @click="vipShow=true">-->
      <!--&lt;!&ndash;        <van-row type="flex" justify="space-between" align="center" class="VIPTop">&ndash;&gt;-->
      <!--&lt;!&ndash;          <div class="text">VIP{{ userInfoData.vipLevel }}</div>&ndash;&gt;-->
      <!--&lt;!&ndash;          <div class="text2" @click="vipShow=true">等级机制</div>&ndash;&gt;-->
      <!--&lt;!&ndash;        </van-row>&ndash;&gt;-->
      <!--        <van-row type="flex" justify="space-between" align="center" class="VIPBody">-->
      <!--          <div>vip {{ userInfoData.vipLevel }}</div>-->
      <!--          <div class="rateBox">-->
      <!--            <div class="rate a"></div>-->
      <!--            <div class="rate b" :style="`width: ${percent}%;`"></div>-->
      <!--            <div class="rate c">{{ percent }}%</div>-->
      <!--          </div>-->
      <!--          <div v-if="vipData.vipLevel">vip {{ vipData.vipLevel }}</div>-->
      <!--          <div v-else>-</div>-->
      <!--        </van-row>-->
      <!--        <div class="VIPbottom">-->
      <!--          距离下一等级需要{{ vipData.growthIntegral-percent/100*vipData.growthIntegral }}分，每充值或投注1元加1分-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="myBody">
      <van-row type="flex" justify="space-between">
        <div class="box" @click="toPath('recharge')">
          <img src="../../assets/首页/home/wycz.png" />
          {{ $t("myCenter['我要充值']") }}
        </div>
        <div class="box" @click="toPath('withdrawDeposit')">
          <img src="../../assets/首页/home/wytx.png" />
          {{ $t("myCenter['我要提现']") }}
        </div>
        <div class="box" @click="toPath('tradingRecord')">
          <img src="../../assets/首页/home/jyjl.png" />
          {{ $t("myCenter['交易记录']") }}
        </div>
        <div class="box" @click="toPath('betRecord')">
          <img src="../../assets/首页/home/tzjl.png" />
          {{ $t("myCenter['投注记录']") }}
        </div>
      </van-row>
    </div>
    <div class="myBottom">
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('agentPage')"
        v-if="userInfo.userType == 1"
      >
        <img src="../../assets/首页/home/dlzx.png" />
        <div class="text">{{ $t("myCenter['代理中心']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('statement')"
      >
        <img src="../../assets/首页/home/grbb.png" />
        <div class="text">{{ $t("myCenter['个人报表']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('edhz')"
      >
        <img src="../../assets/首页/home/edhz.png" />
        <div class="text">{{ $t("myCenter['额度划转']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
         v-if="userInfo.agentUserNo"
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('huazhuan2')"
      >
        <img src="../../assets/首页/home/edhz.png" />
        <div class="text">{{ $t("myCenter['给上级转账']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
         v-if="userInfo.enableTransferAmount&&userInfo.userType==1"
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('huazhuan')"
      >
        <img src="../../assets/首页/home/edhz.png" />
        <div class="text">{{ $t("myCenter['给下级转账']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toUserinfoPage()"
      >
        <img src="../../assets/首页/home/grxx.png" />
        <div class="text">{{ $t("myCenter['个人信息']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('Security')"
      >
        <img src="../../assets/首页/home/aqzx.png" />
        <div class="text">{{ $t("myCenter['安全中心']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('newNotice')"
      >
        <img src="../../assets/首页/home/wdxx.png" />
        <div class="text">{{ $t("myCenter['最新公告']") }}</div>
        <van-icon name="arrow" />
      </van-row>

      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('MyMessage')"
      >
        <img src="../../assets/首页/home/wdxx.png" />
        <div class="text">{{ $t("myCenter['我的消息']") }}</div>
        <van-icon name="arrow" :badge="unReadCount" v-if="unReadCount" />
        <van-icon name="arrow" v-else />
      </van-row>

      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('linkUrl')"
      >
        <img src="../../assets/首页/home/xlxz.png" />
        <div class="text">{{ $t("myCenter['线路选择']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('kjw')"
      >
        <img src="../../assets/首页/home/kjw.png" />
        <div class="text">{{ $t("myCenter['开奖网']") }}</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="onOut"
      >
        <img src="../../assets/首页/home/tcdl.png" />
        <div class="text">{{ $t("myCenter['退出登录']") }}</div>
        <van-icon name="arrow" />
      </van-row>
    </div>
    <!--    等级机制弹窗-->
    <van-popup
      v-model="vipShow"
      :round="true"
      :closeable="true"
      :overlay="true"
      :style="{ width: '90%', height: '65%' }"
      lock-scroll
    >
      <vipPage :VipList="VipList" />
    </van-popup>
    <!--    个人信息-->
    <van-popup
      v-model="userShow"
      v-if="userShow"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <userinfoPage
        @closeUserShow="userShow = false"
        :userInfoData="userInfoData"
      />
    </van-popup>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      :cancel-text="$t('myCenter[\'取消\']')"
      close-on-click-action
      @select="onSelect"
      :round="false"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import vipPage from "../MyCenter/vip";
import userinfoPage from "../MyCenter/userinfoPage";
import timeUtil from "../../util/timeUtil2";
export default {
  components: { vipPage, userinfoPage },
  data() {
    return {
      timeUtil: timeUtil,
      start: "",
      end: "",
      userShow: false,
      vipShow: false,
      show: false,
      actions: [],
      VipList: [],
      unReadCount: 0,
    };
  },
  computed: {
    ...mapState(["userInfo", "amount", "refreshLoad"]),
    tabsBgOpen() {
      return sessionStorage["tabsBgOpen"] || "0";
    },
    actions() {
      return [{ name: this.$t("myCenter['在线客服']") }];
    },
    percent() {
      let num = 0;
      if (this.vipData.vipLevel) {
        num = (this.userInfo.integral / this.vipData.growthIntegral) * 100;
      }
      return num > 100 ? 100 : num.toFixed(2);
    },
    vipData() {
      let obj =
        this.VipList.filter((k) => {
          return k.vipLevel - 1 == this.userInfo.vipLevel;
        })[0] || {};
      console.log(obj);
      return obj;
    },
    userInfoData() {
      return this.userInfo;
    },
  },
  created() {
    // 预加载个人报表
    let dateList = this.timeUtil.today();
    this.start = dateList[0];
    this.end = dateList[1];
    this.chushihua();
  },
  mounted() {
    this.getInfo();
    this.getSiteMessageUnReadCount();
    this.onrefreshLoad();
  },
  methods: {
    ...mapActions(["getInfo", "onrefreshLoad"]),
    // 预加载个人报表
    chushihua() {
      this.getAgentReport();
    },
    // 个人报表 总数据
    getAgentReport() {
      this.$store.state.personData = null;
      this.$ajax
        .post(
          `/report/personReport?dateType=1`
        )
        .then((res) => {
          if (res.data) {
            this.$store.state.personData = res.data;
          }
        })
    },
    // 获取未读信息数量
    getSiteMessageUnReadCount() {
      this.$ajax.post(`/user/center/siteMessageUnReadCount`).then((res) => {
        this.unReadCount = res.data || 0;
      });
    },
    getVipList() {
      this.$ajax.post(`/list/vip`).then((res) => {
        if (res.data) {
          this.VipList = res.data;
        } else {
          this.VipList = [];
        }
      });
    },
    onOut() {
      this.$ajax
        .post("/user/logout")
        .then((res) => {
          sessionStorage.removeItem("sessionId");
          sessionStorage.removeItem("state");
          window.location.reload();
        })
    },
    onSelect(data) {
      if (data.name == this.$t("myCenter['在线客服']")) {
        this.toPath("Service");
      }
    },
    toUserinfoPage() {
      this.userShow = true;
    },
    toService() {
      this.toPath("Service");
      return;
      this.$dialog
        .confirm({
          className: "kf",
          title: "请选择客服",
          confirmButtonText: "客服通道2",
          cancelButtonText: "客服通道1",
        })
        .then(() => {
          this.toPath("customerService");
        })
        .catch(() => {
          this.toPath("Service");
        });
    },
    toPath(path) {
      if (path == "kjw") {
        window.open("https://kai-badeng.cc/");
      } else {
        this.$router.push({
          path: path,
          query: {
            redirect: this.$route.path,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.MyCenter {
  // height: 100vh;
  background-color: #fff;
  .MytitleBar {
    position: sticky;
    top: 0;
    z-index: 2;
    .iconfont{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      font-size: 19.583px;
      color: #fff;
      width: 48.9479px;
      text-align: center;
    }
  }
  .myTop {
    .userinfo {
      padding: 17.18px 18px;
      .shaxin {
        height: 16px;
        margin-left: 5px;
      }
      .faceImg {
        height: 70px;
        // border: 2px solid #ddd;
        border-radius: 5px;
        margin-right: 10px;
      }
      .box {
        font-size: 17.18px;
        line-height: 22px;
        width: 65%;
        color: #000;
        .zhanghao {
          padding-top: 10px;
        }
        .yu_e {
          padding-top: 8px;
          b {
            color: #d83442;
          }
        }
        .touxian {
          color: #666;
        }
      }
      .van-icon-arrow {
        font-size: 20px;
      }
    }
    .VIP {
      border-top: 1px solid #efeef4;
      padding: 5px 0 10px;
      .VIPTop {
        padding: 2px 20px 0;
        .text {
          font-size: 25px;
          color: red;
          font-weight: bold;
          font-style: oblique;
        }
        .text2 {
          font-size: 13px;
          color: #555;
        }
      }
      .VIPBody {
        padding: 5px 20px;
        font-weight: bold;
        .rateBox {
          width: 75%;
          height: 20px;
          position: relative;
          top: 2px;
          .rate {
            text-align: center;
            position: absolute;
            height: 16px;
            line-height: 16px;
            border-radius: 20px;
            color: #000;
          }
          .b {
            background: linear-gradient(to right, #f6edda, #e3a826);
            border: 1px solid #efeef4;
          }
          .a {
            width: 100%;
            border: 1px solid #efeef4;
            background-color: #eee;
          }
          .c {
            width: 100%;
            border: 1px solid #efeef4;
          }
        }
      }
      .VIPbottom {
        text-align: center;
        font-size: 12px;
        color: #666;
        transform: scale(0.9);
      }
    }
  }
  .myBody {
    // border-top: 1px solid #efeef4;
    border-bottom: 13px solid #efeef4;
    padding: 8px 10px;
    .box {
      width: 25%;
      font-size: 15px;
      text-align: center;
      img {
        height: 21px;
        display: block;
        margin: 0 auto;
        padding-bottom: 3px;
      }
    }
  }
  .myBottom {
    padding: 0 18px 50px;
    /*height: calc(100vh - 350px);*/
    /*overflow: auto;*/
    .box {
      border-bottom: 1px solid #efeef4;
      padding: 12px 0;
      .min {
        border: 1px solid #efeef4;
        height: 45px;
        width: 45px;
        text-align: center;
      }
      img {
        height: 27px;
        // margin: 6px 0;
        border-radius: 2px;
      }
      .text {
        width: 76%;
        font-size: 17.4px;
      }
      .van-icon-arrow {
        font-size: 17.2px;
        color: rgb(204, 204, 204);
        margin-right: 8.5px;
      }
    }
    .box:last-child {
      /*padding-bottom: 80px;*/
    }
  }
}
</style>
