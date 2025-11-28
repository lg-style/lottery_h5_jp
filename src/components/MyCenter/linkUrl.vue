<template>
  <div class="linkUrl">
    <van-row type="flex" align="center" class="top_title">
      <div class="logo">
        <img src="../../assets/首页/home/logoImg.png" />
      </div>
    </van-row>

    <div class="linkUrlBody">
      <div>
        <van-row type="flex" align="center" class="row">
          <img src="../../assets/首页/home/t1.png" class="icon" />
          <div class="text">{{ $t("myCenter['常用线路']") }}</div>
          <img src="../../assets/MyCenter/c3.png" class="c3" @click="toService()"/>
        </van-row>
      </div>
      <div>
        <van-row type="flex" align="center" class="row">
          <img src="../../assets/首页/home/t4.png" class="icon" />
          <div class="text">{{ $t("myCenter['VIP线路']") }}</div>
        </van-row>
        <ul class="listul">
          <li class="w1">
            <a href="http://www.baidu.com/" target="_blank">百 度</a>
          </li>
          <li class="w2">
            <a href="http://www.qq.com/" target="_blank">腾讯</a>
          </li>
          <li class="s6">
            <a href="http://news.ifeng.com/" target="_blank">凤凰</a>
          </li>
          <li class="s2">
            <a href="http://news.sohu.com/" target="_blank">搜狐</a>
          </li>
          <li class="w5">
            <a href="http://www.163.com/" target="_blank">网 易 </a>
          </li>
          <li class="w6">
            <a href="http://www.taobao.com/" target="_blank">淘 宝 </a>
          </li>
          <li class="w7">
            <a href="http://www.youku.com/" target="_blank">优 酷</a>
          </li>
          <li class="s1">
            <a href="http://news.sina.com.cn/" target="_blank">新浪</a>
          </li>
          <li class="w11">
            <a href="http://www.4399.com/" target="_blank">4399小游戏</a>
          </li>
          <li class="s3">
            <a href="http://news.cntv.cn/" target="_blank">CCTV新闻</a>
          </li>
          <li class="w12">
            <a href="http://www.58.com/" target="_blank">58同城</a>
          </li>
          <li class="w9">
            <a href="http://www.12306.cn/" target="_blank">12306</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      linkUrlArr: [],
    };
  },
  computed: {
    ...mapState(["device"]),
  },
  mounted() {
    // this.getlinkUrlArr()
  },
  methods: {
    getlinkUrlArr() {
      this.$ajax
        .get(
          `https://hotupdate2021.oss-cn-hongkong.aliyuncs.com/linkUrlArr.json?time=${Math.round(
            Math.random() * 10000
          )}`
        )
        .then((res) => {
          this.linkUrlArr = res.h5Arr;
          this.getUrlTime();
        });
    },
    getUrlTime() {
      this.linkUrlArr.map((k) => {
        k.time = new Date().getTime();
        this.$ajax
          .post(
            `${k.linkUrl}/api/sys/getVersion?time=${Math.round(
              Math.random() * 10000
            )}`
          )
          .then((res) => {
            k.totalTime = new Date().getTime() - k.time;
            this.$forceUpdate();
          });
      });
    },
    toUrl(k) {
      if (this.device == "1") {
        axios.defaults.baseURL = k.linkUrl + "/api";
        this.$store.commit("SET_TISHI", this.$t("myCenter['已为您切换线路']"));
      } else {
        window.location = `${k.linkUrl}?token=${sessionStorage.getItem(
          "sessionId"
        )}`;
      }
    },
    toService() {
      this.toPath("Service");
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    to() {
      this.$router.push({
        path: this.$route.query.redirect,
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.linkUrl {
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
  }
  .linkUrlBody {
    padding: 0 10px;
    .row {
      padding: 10px 0;
      border-bottom: 1px solid silver;
      position: relative;
      .icon {
        height: 20px;
        margin-right: 6px;
      }
      .text {
        font-size: 16px;
        color: #004b9c;
        font-weight: bolder;
      }
      .c3 {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50% + 5);
        margin-right: 6px;
        width: 35px;
        height: 35px;
      }
    }
    .row2 {
      padding: 0 5px;
      .time1 {
        font-weight: bolder;
        color: #70b603;
      }
      .time2 {
        font-weight: bolder;
        color: orange;
      }
      .time3 {
        font-weight: bolder;
        color: red;
      }
    }
    .listul {
      overflow: hidden;
      padding: 8px 0;
      li {
        display: block;
        width: 24%;
        height: 38px;
        background: #fff;
        float: left;
        border: 1px solid #b3aeaa;
        margin: 1px;
        line-height: 38px;
        text-align: center;
        position: relative;
        a {
          color: #302315;
          padding-left: 22px;
          font-size: 13.9999px;
          position: relative;
          top: 3px;
        }
      }
      .w1 a {
        background: url("../../assets/首页/home/bd.png") 0 0 no-repeat;
      }
      .w2 a {
        background: url("../../assets/首页/home/tengxun.png") 0 0 no-repeat;
      }
      .s6 a {
        background: url("../../assets/首页/home/fenghuang.png") 0 0 no-repeat;
      }
      .s2 a {
        background: url("../../assets/首页/home/souhu.png") 0 0 no-repeat;
      }
      .w5 a {
        background: url("../../assets/首页/home/wangyi.png") 0 0 no-repeat;
      }
      .w6 a {
        background: url("../../assets/首页/home/tb.png") 0 0 no-repeat;
      }
      .w7 a {
        background: url("../../assets/首页/home/youke.png") 0 0 no-repeat;
      }
      .s1 a {
        background: url("../../assets/首页/home/xinlang.png") 0 0 no-repeat;
      }
      .w11 a {
        background: url("../../assets/首页/home/4399.png") 0 0 no-repeat;
      }
      .s3 a {
        background: url("../../assets/首页/home/cctv.png") 0 0 no-repeat;
      }
      .w12 a {
        background: url("../../assets/首页/home/58.png") 0 0 no-repeat;
      }
      .w9 a {
        background: url("../../assets/首页/home/12306.png") 0 0 no-repeat;
      }
    }
  }
}
</style>
