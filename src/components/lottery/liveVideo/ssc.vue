<template>
  <div class="live sscLive">
    <div class="cqsscAnimate">
      <div class="bodybg">
        <img src="../../../assets/video/images/ssc/bodybg.jpg" />
      </div>
      <div class="loading">
        <div class="loadtxt">LOADING...</div>
      </div>
      <div class="content">
        <div class="nameLogo nameLogo_jsssc">
          <img :src="curReslut.live_logo" alt />
        </div>
        <div class="coderbox">
          <div class="codeboxl">
            <div class="line tl">
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip bigbg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip smallbg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip bigbg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip smallbg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip bigbg"></span>
              </div>
            </div>
            <div class="line ml" id="numBig">
              <div class="box beforebg">
                <span class="num2"></span>
              </div>
              <div class="box beforebg">
                <span class="num1"></span>
              </div>
              <div class="box beforebg">
                <span class="num0"></span>
              </div>
              <div class="box beforebg">
                <span class="num9"></span>
              </div>
              <div class="box beforebg">
                <span class="num6"></span>
              </div>
            </div>
            <div class="line bl">
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip singlebg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip doublebg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip doublebg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip singlebg"></span>
              </div>
              <div class="box perspectiveView">
                <span class="flip afterbg out"></span>
                <span class="flip doublebg"></span>
              </div>
            </div>
          </div>
          <div class="codeboxr">
            <div class="heiban">
              <!-- <div class="line1" id="qishu">
                本期：
                <span class="redfont" id="preDrawIssue">2016054848</span>期
              </div> -->
              <!-- <div class="line1" id="nexttime">
                <span>下期开奖：</span>
                <span class="redfont" id="drawTime">18:30:47</span>
              </div> -->
              <div class="line1">
                <div class="oping">
                  <div class="cuttimetitle">正在开奖...</div>
                </div>
                <div class="djs">
                  <!-- <span class="cuttimetitle" id="cuttime">倒计时：</span> -->
                  <span class="bluefont"></span>
                </div>
              </div>
            </div>
            <div class="heibanb">
              <div class="bckj">
                <span id="sumNum">16</span>
                <span id="sumSingleDouble">双</span>
                <span id="sumBigSmall">小</span>
                <span id="dragonTiger">虎</span>
              </div>
              <div class="smallnum" id="litNum">
                <div class="box beforebg">
                  <span class="num2"></span>
                </div>
                <div class="box beforebg">
                  <span class="num1"></span>
                </div>
                <div class="box beforebg">
                  <span class="num0"></span>
                </div>
                <div class="box beforebg">
                  <span class="num9"></span>
                </div>
                <div class="box beforebg">
                  <span class="num6"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="menubox">
          <div class="tyrbtn"></div>
          <div id="soundbtn" class="soundbtn"></div>
        </div>
        <div class="disnone">
          <audio autoplay="autoplay" id="bgsound" src></audio>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import "../../../assets/video/css/animate.min.css";
import "../../../assets/video/css/main.css";
import "../../../assets/video/css/cpssc.scss";
import "../../../assets/video/js/jquery-1.11.2.min.js";
import { init, sscAnimateEnd, stopAll } from "../../../assets/video/js/ssc.js";

export default {
  name: "sscLive",
  props: ["suijiOpenResultShow", "OpenTime", "suijiOpenResultData", 'ZHLH'],
  data() {
    return {
      curReslut: {},
      openResultData: [],
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      init();
      $(".loading").hide();
      // let curCode = this.$route.params.code;
      // this.chengecurLotteryCode(curCode);
      // this.getLotteryExpect(curCode);
      console.log(this.suijiOpenResultData);
      this.insertDataWarp();
    });
  },
  destroyed() {
    stopAll();
  },
  methods: {
    insertDataWarp(isOPen) {
      var ticking = isOPen ? 0 : this.OpenTime-1; //0的时候进入加载状态
      sscAnimateEnd({
        preDrawCode: this.suijiOpenResultData, //结果数组
        id: "#numBig",
        counttime: ticking, //开奖倒计时
        preDrawIssue: 0, //期号
        drawTime: "0", //开奖时间
        sumNum: this.ZHLH[0], //总和
        sumSingleDouble: this.ZHLH[1], //总和单双
        sumBigSmall: this.ZHLH[2], //总和大小
        dragonTiger: this.ZHLH[3], //总和龙虎
      });
    },
  },

  computed: {},
  watch: {
    suijiOpenResultShow: {
      handler: function (n, o) {
        console.log("开奖状态", n, this.OpenTime);
        this.insertDataWarp(n);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.sscLive {
  width: 100%;
  position: relative;
}
</style>
