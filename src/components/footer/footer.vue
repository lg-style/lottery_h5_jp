<template>
  <div class="homeFooter">
    <van-tabbar
      v-model="active"
      :fixed="true"
      safe-area-inset-bottom
      route
      active-color="rgb(255, 51, 51)"
      inactive-color="rgba(38, 34, 34, 0.73)"
    >
      <van-tabbar-item @click="toLottery()" v-if="tabsBgOpen === '1'">
        <span :class="{ hongse: $route.name === '首页' }">{{ $t("home['游戏']") }}</span>
        <i
          :class="{ hongse: $route.name === '首页' }"
          slot="icon"
          class="iconfont"
          ></i
        >
      </van-tabbar-item>
      <van-tabbar-item to="/" v-else>
        <span>{{ $t("home['首页']") }}</span>
        <i slot="icon" class="iconfont home"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/discounts">
        <span>{{ $t("home['优惠活动']") }}</span>
        <!-- <img
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require('../../assets/首页/sy_fuli2.png')
              : require('../../assets/首页/sy_fuli1.png')
          "
        /> -->
        <i slot="icon" class="iconfont activity"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/recharge">
        <span>{{ $t("home['充值']") }}</span>
        <!-- <img
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require('../../assets/首页/sy_tuiguang2.png')
              : require('../../assets/首页/sy_tuiguang1.png')
          "
        /> -->
        <i slot="icon" class="iconfont money-in"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/discover">
        <span>{{ $t("home['发现']") }}</span>
        <!-- <img
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require('../../assets/首页/icon_tab_service_sel.png')
              : require('../../assets/首页/icon_tab_service_normal.png')
          "
        /> -->
        <i slot="icon" class="iconfont find"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/MyCenter">
        <span>{{ $t("home['我的']") }}</span>
        <!-- <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('../../assets/首页/sy_wode2.png') : require('../../assets/首页/sy_wode1.png')"
        > -->
        <img slot="icon" :src="require('../../assets/首页/wode.png')" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      active: 0,
      HDstatus: false,
    };
  },
  computed: {
    ...mapState(["GroupList"]),
    tabsBgOpen() {
      return sessionStorage["tabsBgOpen"] || "0";
    },
    // 信用
    typeList() {
      let data = this.GroupList || [];
      let arr = data.filter((k) => {
        return k.groupStatus == 1 && k.list.length > 0 && k.groupType == 10;
      });
      return arr;
    },
  },
  mounted() {},
  methods: {
    toLottery() {
      let obj = this.typeList[0] || {};
      let list = obj.list;
      if (list && list.length > 0) {
        this.togame(list[0], obj.groupName);
      }
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
  },
};
</script>

<style lang="scss" scoped>
.homeFooter {
  .van-tabbar {
    //  border-top-left-radius:20px;
    //  border-top-right-radius:20px;
    // box-shadow: 0 0 10px 0 rgba(153, 153, 153, 0.52);
    border-top: 0.8px solid #d9dcdf;
    height: 53px;
  }
}
</style>
<style lang="scss">
.homeFooter {
  .van-tabbar-item {
    overflow: hidden;
    .van-tabbar-item__icon {
      font-size: 23.4375px;
      margin-bottom: 0.05rem;
      img {
        height: 24px;
        animation-iteration-count: infinite;
        animation-duration: 3s;
        animation-name: bounce;
        animation-fill-mode: both;
      }
      @keyframes bounce {
        0%,
        20%,
        53%,
        80%,
        100% {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: translateZ(0) scaleY(0.98);
        }
        40%,
        43% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -0.375rem, 0) scaleY(1);
        }
        70% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -0.25rem, 0) scaleY(1);
        }
        90% {
          transform: translate3d(0, -0.125rem, 0) scaleY(1);
        }
      }
    }
  }
  .van-tabbar-item__text {
    font-size: 14px;
    text-align: center;
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: none;
  }
  .hongse {
    color: rgb(255, 51, 51);
  }
}
</style>

