<template>
  <div class="resultSSC">
    <van-tabs
      v-model="active"
      class="lotteryTabs"
      background="#F5F6FA"
      title-active-color="#df303f"
      title-inactive-color="#333"
      @click="onClick"
    >
      <van-tab :title="$t('result[\'开奖记录\']')" name="1">
        <div class="table_body">
          <div class="ul">
            <div class="li table_title">{{ $t('result[\'期号\']') }}</div>
            <div class="li" v-for="(k, i) in todayOpenRecord" :key="i">
              {{ k.periodId }}
            </div>
          </div>
          <div class="table_body-r">
            <div style="width: 15.2rem">
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">{{ k.openResult }}</div>
                  <div v-if="n.className === 'zhlh'">
                    {{ util.zonghelonghu(k.openResult.split(" "))[0] }} |
                    {{ util.zonghelonghu(k.openResult.split(" "))[3] }}
                  </div>
                  <div v-if="n.className === 'hdx'">
                    <span
                      :class="`${
                        util.zonghelonghu(k.openResult.split(' '))[0] / 1 > 22
                          ? '_da'
                          : '_xiao'
                      }`"
                      >{{ util.zonghelonghu(k.openResult.split(" "))[1] }}</span
                    >
                  </div>
                  <div v-if="n.className === 'hds'">
                    <span
                      :class="`${
                        (util.zonghelonghu(k.openResult.split(' '))[0] / 1) %
                          2 ==
                        1
                          ? '_dan'
                          : '_shuang'
                      }`"
                      >{{ util.zonghelonghu(k.openResult.split(" "))[2] }}</span
                    >
                  </div>
                  <div
                    v-if="n.className === 'wei' && x === j - 4"
                    v-for="(m, x) in k.openResult.split(' ')"
                    :key="x"
                  >
                    <span :class="`${m > 4 ? '_da' : '_xiao'}`">{{
                      util.daxiao(m > 4)
                    }}</span>
                    <span :class="`${m % 2 == 1 ? '_dan' : '_shuang'}`">{{
                      util.danshuang(m % 2 == 1)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('result[\'号码走势\']')" name="2">
        <div class="zoushi_tabs flex-left flex-center">
          <div>
            <span :class="{ on: tabsOn === 0 }" @click="tabsOn = 0;zhexian();"
              >{{ $t('result[\'万位走势\']') }}</span
            >
          </div>
          <div>
            <span :class="{ on: tabsOn === 1 }" @click="tabsOn = 1;zhexian();"
              >{{ $t('result[\'千位走势\']') }}</span
            >
          </div>
          <div>
            <span :class="{ on: tabsOn === 2 }" @click="tabsOn = 2;zhexian();"
              >{{ $t('result[\'百位走势\']') }}</span
            >
          </div>
          <div>
            <span :class="{ on: tabsOn === 3 }" @click="tabsOn = 3;zhexian();"
              >{{ $t('result[\'十位走势\']') }}</span
            >
          </div>
          <div>
            <span :class="{ on: tabsOn === 4 }" @click="tabsOn = 4;zhexian();"
              >{{ $t('result[\'个位走势\']') }}</span
            >
          </div>
        </div>
        <div class="table_body">
          <div class="ul">
            <div class="li table_title">{{ $t('result[\'期号\']') }}</div>
            <div class="li" v-for="(k, i) in todayOpenRecord" :key="i">
              {{ k.periodId }}
            </div>
          </div>
          <div class="table_body-r">
            <div style="width: 14rem">
              <!-- 大小、单双、质合 -->
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList2"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'dx'">
                    <span
                      :class="`${
                        k.openResult.split(' ')[tabsOn] / 1 > 4 ? '_he' : '_zhi'
                      }`"
                    >
                      {{
                        util.daxiao(k.openResult.split(" ")[tabsOn] / 1 > 4)
                      }}</span
                    >
                  </div>
                  <div v-if="n.className === 'ds'">
                    <span
                      :class="`${
                        (k.openResult.split(' ')[tabsOn] / 1) % 2 == 1
                          ? '_zhi'
                          : '_he'
                      }`"
                      >{{
                        util.danshuang(
                          (k.openResult.split(" ")[tabsOn] / 1) % 2 == 1
                        )
                      }}</span
                    >
                  </div>
                  <div v-if="n.className === 'zh'">
                    <span
                      :class="
                        [1, 2, 3, 5].includes(
                          k.openResult.split(' ')[tabsOn] / 1
                        )
                          ? '_zhi'
                          : '_he'
                      "
                      >{{
                        [1, 2, 3, 5].includes(
                          k.openResult.split(" ")[tabsOn] / 1
                        )
                      ? $t('result[\'质\']')
                      : $t('result[\'合\']')
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- 号码 -->
              <div class="ul" style="width: auto" id="vanTable">
                <div>
                  <div v-for="(m, x) in 10" :key="x" class="haoma">
                    <div class="li table_title">{{ x }}</div>
                  </div>
                </div>

                <div class="haoma" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div class="li _val" v-for="(m, x) in 10" :key="x">
                    <span
                      v-if="k.openResult.split(' ')[tabsOn] == x"
                      class="isactive"
                      >{{ x }}</span
                    >
                  </div>
                </div>
                <canvas
                  id="mc"
                  width="500"
                  height="1000"
                  v-if="canvasShow"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('result[\'龙虎斗\']')" name="3">
        <div class="table_body">
          <div class="ul">
            <div class="li table_title">{{ $t('result[\'期号\']') }}</div>
            <div class="li" v-for="(k, i) in todayOpenRecord" :key="i">
              {{ k.periodId }}
            </div>
          </div>
          <div class="table_body-r">
            <div style="width: 15.46667rem;">
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList3"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-for="(m,x) in [k.openResult.split(' ')]" :key="x">
                    <span :class="m[0]/1>m[1]/1?'_long':m[0]/1==m[1]/1?'_he':'_hu'" v-if="j==0">{{ m[0]/1>m[1]/1?$t('result[\'龙\']'):m[0]/1==m[1]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[0]/1>m[2]/1?'_long':m[0]/1==m[2]/1?'_he':'_hu'" v-if="j==1">{{ m[0]/1>m[2]/1?$t('result[\'龙\']'):m[0]/1==m[2]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[0]/1>m[3]/1?'_long':m[0]/1==m[3]/1?'_he':'_hu'" v-if="j==2">{{ m[0]/1>m[3]/1?$t('result[\'龙\']'):m[0]/1==m[3]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[0]/1>m[4]/1?'_long':m[0]/1==m[4]/1?'_he':'_hu'" v-if="j==3">{{ m[0]/1>m[4]/1?$t('result[\'龙\']'):m[0]/1==m[4]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>

                    <span :class="m[1]/1>m[2]/1?'_long':m[1]/1==m[2]/1?'_he':'_hu'" v-if="j==4">{{ m[1]/1>m[2]/1?$t('result[\'龙\']'):m[1]/1==m[2]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[1]/1>m[3]/1?'_long':m[1]/1==m[3]/1?'_he':'_hu'" v-if="j==5">{{ m[1]/1>m[3]/1?$t('result[\'龙\']'):m[1]/1==m[3]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[1]/1>m[4]/1?'_long':m[1]/1==m[4]/1?'_he':'_hu'" v-if="j==6">{{ m[1]/1>m[4]/1?$t('result[\'龙\']'):m[1]/1==m[4]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>

                    <span :class="m[2]/1>m[3]/1?'_long':m[2]/1==m[3]/1?'_he':'_hu'" v-if="j==7">{{ m[2]/1>m[3]/1?$t('result[\'龙\']'):m[2]/1==m[3]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                    <span :class="m[2]/1>m[4]/1?'_long':m[2]/1==m[4]/1?'_he':'_hu'" v-if="j==8">{{ m[2]/1>m[4]/1?$t('result[\'龙\']'):m[2]/1==m[4]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>

                    <span :class="m[3]/1>m[4]/1?'_long':m[3]/1==m[4]/1?'_he':'_hu'" v-if="j==9">{{ m[3]/1>m[4]/1?$t('result[\'龙\']'):m[3]/1==m[4]/1?$t('result[\'和\']'):$t('result[\'虎\']') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import util from "../../../util/jisuanLH";
import { mapState } from "vuex";
export default {
  data() {
    return {
      util: util,
      canvasShow: false,
      qiuhaoId: 1,
      qiuhaoList: [],
      tabsOn: 0,
      qiuhaoList2: [],
      qiuhaoList3: [],
      active: "",
    };
  },
  computed: {
    ...mapState(["todayOpenRecord"]),
  },
  watch: {
    "$store.state.todayOpenRecord": {
      handler: function (a, b) {
        this.onClick();
      },
    },
  },
  created() {
    // 初始化 qiuhaoList
    this.qiuhaoList = [
      { className: "kj", text: this.$t("result['开奖']") },
      { className: "zhlh", text: this.$t("result['总和龙虎']") },
      { className: "hdx", text: this.$t("result['和大小']") },
      { className: "hds", text: this.$t("result['和单双']") },
      { className: "wei", text: this.$t("result['万位']") },
      { className: "wei", text: this.$t("result['千位']") },
      { className: "wei", text: this.$t("result['百位']") },
      { className: "wei", text: this.$t("result['十位']") },
      { className: "wei", text: this.$t("result['个位']") },
    ];
    
    // 初始化 qiuhaoList2
    this.qiuhaoList2 = [
      { className: "dx", text: this.$t("result['大小']") },
      { className: "ds", text: this.$t("result['单双']") },
      { className: "zh", text: this.$t("result['质合']") },
    ];
    
    // 初始化 qiuhaoList3
    this.qiuhaoList3 = [
      { className: "lhd", text: this.$t("result['万千']") },
      { className: "lhd", text: this.$t("result['万百']") },
      { className: "lhd", text: this.$t("result['万十']") },
      { className: "lhd", text: this.$t("result['万个']") },
      { className: "lhd", text: this.$t("result['千百']") },
      { className: "lhd", text: this.$t("result['千十']") },
      { className: "lhd", text: this.$t("result['千个']") },
      { className: "lhd", text: this.$t("result['百十']") },
      { className: "lhd", text: this.$t("result['百个']") },
      { className: "lhd", text: this.$t("result['十个']") },
    ];
  },
  mounted() {},
  methods: {
    onClick() {
      this.$nextTick(() => {
        this.zhexian();
      });
    },
    zhexian(k) {
      if (this.active != 2) {
        return;
      }
      this.canvasShow = false;
      setTimeout(() => {
        this.canvasShow = true;
      }, 50);
      setTimeout(() => {
        //画折线
        var canvas = document.getElementById("mc");
        var vanTable = document.getElementById("vanTable");
        canvas.height = vanTable.offsetHeight;
        canvas.width = vanTable.offsetWidth;
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "rgba(216,52,66,0.8)";
        let list = $(".isactive");
        for (let i in list) {
          if (list[i].className === "isactive") {
            ctx.lineTo(list[i].offsetLeft + 9, list[i].offsetTop + 8);
          }
        }
        ctx.stroke();
      }, 100);
    },
  },
};
</script>

<style lang="scss">
.resultSSC {
  background: #ebe8d6;
  overflow: hidden;
  .lotteryTabs {
    .van-tabs__wrap {
      height: 45px;
      line-height: 45px;
      .van-tabs__nav {
        background-color: #e1d9bc !important;
        .van-tabs__line {
          width: calc(100% / 3) !important;
          bottom: 0;
          height: 2px;
        }
        .van-tab {
          font-size: 15.2616px;
        }
      }
      .van-tabs__nav--line {
        padding-bottom: 0;
      }
    }
  }
  .zoushi_tabs {
    height: 34.8125px;
    background-color: #e1d9bc;
    border-top: 1px solid #b4ac8c;
    div {
      width: calc(100% / 5);
      text-align: center;
      span {
        display: inline-block;
        height: 27.8438px;
        line-height: 27.8438px;
        color: #333;
        width: 66.8333px;
        border-radius: 2.78514px;
        font-size: 13.9257px;
      }
      .on {
        color: #fff;
        background: #df303f;
      }
    }
  }
  .table_body {
    text-align: center;
    margin: 1.5px 0 0;
    border-right: none;
    border-bottom: none;
    border-top: 1px solid #b4ac8c;
    box-sizing: border-box;
    #vanTable {
      position: relative;
    }
    .ul {
      font-size: 15.2312px;
      color: #666;
      float: left;
      width: 112.594px;
      background: #ebe8d6;
      .table_title {
      }
      .li {
        height: 30.4583px;
        line-height: 30.4583px;
        box-sizing: border-box;
        border-right: 1px solid #b4ac8c;
      }
      .li:nth-child(2n - 1) {
        background-color: #e1d9bc;
      }
    }
    .table_body-r {
      width: calc(100% - 112.594px);
      float: left;
      overflow: auto;
      span {
        display: inline-block;
        width: 21.3229px;
        height: 21.3229px;
        line-height: 21.3229px;
        color: #fff;
        border-radius: 50%;
        &._da {
          background: #df303f;
        }
        &._xiao {
          background: #6175bf;
        }
        &._dan {
          background: #00ab99;
        }
        &._shuang {
          background: #00a3ee;
        }
        &._zhi {
          background: #00ab99;
        }
        &._he {
          background: #df303f;
        }
      }
      // 开奖记录
      .lhd{
        width: 58px;
        ._val{
          ._long{
            background: #df303f;
          }
          ._he{
            background: #00a3ee;
          }
          ._hu{
            background: #00ab99;
          }
        }
      }
      .kj {
        width: 90px;
        ._val {
          color: #df303f;
        }
      }
      .zhlh {
        width: 70px;
        ._val {
          color: #df303f;
        }
      }
      .hdx {
        width: 60px;
      }
      .hds {
        width: 60px;
      }
      .wei {
        width: 58px;
      }
      // 号码走势
      .dx {
        width: 58px;
      }
      .ds {
        width: 58px;
      }
      .zh {
        width: 58px;
      }
      .haoma {
        .li {
          float: left;
          width: 35px;
        }
        ._val {
          span {
            background: #df303f;
          }
        }
      }
      .haoma:nth-child(2n - 1) {
        .li {
          background-color: #e1d9bc;
        }
      }
      .haoma:nth-child(2n) {
        .li {
          background-color: #ebe8d6;
        }
        .table_title {
          background-color: #e1d9bc;
        }
      }
    }
  }
  #mc {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
