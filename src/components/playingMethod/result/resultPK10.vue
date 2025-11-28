<template>
  <div class="resultPK10">
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
            <div style="width: 22.953rem">
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">
                    <span
                      :class="`car${setName(m)}`"
                      v-for="(m, x) in k.openResult.split(' ')"
                      :key="x"
                      >{{ setName(m) }}</span
                    >
                  </div>
                  <div
                    v-if="n.className === 'gyh'"
                    v-for="(m, x) in [k.openResult.split(' ')]"
                    :key="x"
                  >
                    <span style="color: #df303f">{{
                      m[0] / 1 + m[1] / 1
                    }}</span>
                    <span
                      :class="m[0] / 1 + m[1] / 1 >= 12 ? '_da' : '_xiao'"
                      >{{ m[0] / 1 + m[1] / 1 >= 12 ? $t('result[\'大\']') : $t('result[\'小\']') }}</span
                    >
                    <span
                      :class="
                        (m[0] / 1 + m[1] / 1) % 2 == 1 ? '_dan' : '_shuang'
                      "
                      >{{ (m[0] / 1 + m[1] / 1) % 2 == 1 ? $t('result[\'单\']') : $t('result[\'双\']') }}</span
                    >
                  </div>
                  <div
                    v-if="n.className === 'mingci'"
                    v-for="(m, x) in [k.openResult.split(' ')]"
                    :key="x"
                  >
                    <span :class="m[n.index] / 1 > 5 ? '_da' : '_xiao'">{{
                      m[n.index] / 1 > 5 ? $t('result[\'大\']') : $t('result[\'小\']')
                    }}</span>
                    <span
                      :class="(m[n.index] / 1) % 2 == 1 ? '_dan' : '_shuang'"
                      >{{ (m[n.index] / 1) % 2 == 1 ? $t('result[\'单\']') : $t('result[\'双\']') }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('result[\'号码走势\']')" name="2">
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
                v-for="(n, j) in qiuhaoList2"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">
                    <span
                      :class="`car${setName(m)}`"
                      v-for="(m, x) in k.openResult.split(' ')"
                      :key="x"
                      >{{ setName(m) }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- 号码 -->
              <div class="ul" style="width: auto" id="vanTable">
                <div>
                  <div v-for="(m, x) in 10" :key="x" class="haoma">
                    <div class="li table_title">{{ setName(m) }}</div>
                  </div>
                </div>

                <div class="haoma" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div class="li _val" v-for="(m, x) in 10" :key="x">
                    <span
                      v-if="k.openResult.split(' ')[0] == m"
                      class="isactive"
                      :class="`car${setName(m)}`"
                      >{{ setName(m) }}</span
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
            <div style="width: 7.00611rem">
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList3"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-for="(m, x) in [k.openResult.split(' ')]" :key="x">
                    <span
                      v-if="n.id === '冠军'"
                      :class="m[0] / 1 > m[9] / 1 ? '_long' : '_hu'"
                      >{{ m[0] / 1 > m[9] / 1 ? $t('result[\'龙\']') : $t('result[\'虎\']') }}</span
                    >
                    <span
                      v-if="n.id === '亚军'"
                      :class="m[1] / 1 > m[8] / 1 ? '_long' : '_hu'"
                      >{{ m[1] / 1 > m[8] / 1 ? $t('result[\'龙\']') : $t('result[\'虎\']') }}</span
                    >
                    <span
                      v-if="n.id === '三名'"
                      :class="m[2] / 1 > m[7] / 1 ? '_long' : '_hu'"
                      >{{ m[2] / 1 > m[7] / 1 ? $t('result[\'龙\']') : $t('result[\'虎\']') }}</span
                    >
                    <span
                      v-if="n.id === '四名'"
                      :class="m[3] / 1 > m[6] / 1 ? '_long' : '_hu'"
                      >{{ m[3] / 1 > m[6] / 1 ? $t('result[\'龙\']') : $t('result[\'虎\']') }}</span
                    >
                    <span
                      v-if="n.id === '五名'"
                      :class="m[4] / 1 > m[5] / 1 ? '_long' : '_hu'"
                      >{{ m[4] / 1 > m[5] / 1 ? $t('result[\'龙\']') : $t('result[\'虎\']') }}</span
                    >
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
      { className: "gyh", text: this.$t("result['冠亚和']") },
      { className: "mingci", text: this.$t("result['冠军']"), index: 0 },
      { className: "mingci", text: this.$t("result['亚军']"), index: 1 },
      { className: "mingci", text: this.$t("result['三名']"), index: 2 },
      { className: "mingci", text: this.$t("result['四名']"), index: 3 },
      { className: "mingci", text: this.$t("result['五名']"), index: 4 },
      { className: "mingci", text: this.$t("result['六名']"), index: 5 },
      { className: "mingci", text: this.$t("result['七名']"), index: 6 },
      { className: "mingci", text: this.$t("result['八名']"), index: 7 },
      { className: "mingci", text: this.$t("result['九名']"), index: 8 },
      { className: "mingci", text: this.$t("result['十名']"), index: 9 },
    ];
    
    // 初始化 qiuhaoList2
    this.qiuhaoList2 = [{ className: "kj", text: this.$t("result['开奖']") }];
    
    // 初始化 qiuhaoList3
    this.qiuhaoList3 = [
      { className: "lhd", text: this.$t("result['冠军']"), id: "冠军" },
      { className: "lhd", text: this.$t("result['亚军']"), id: "亚军" },
      { className: "lhd", text: this.$t("result['三名']"), id: "三名" },
      { className: "lhd", text: this.$t("result['四名']"), id: "四名" },
      { className: "lhd", text: this.$t("result['五名']"), id: "五名" },
    ];
  },
  mounted() {},
  methods: {
    // 设置name
    setName(itemObject) {
      if (!isNaN(itemObject) && itemObject > 0) {
        let num = itemObject >= 10 ? itemObject : `0${itemObject}`;
        return num;
      }
      return itemObject;
    },
    // 格式化期数
    setPeriodId(periodId) {
      let str = periodId || "";
      if (periodId && periodId.length > 10) {
        str = periodId.slice(4, periodId.length);
      }
      return str;
    },
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
          if (list[i].className && list[i].className.indexOf("isactive") > -1) {
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
.resultPK10 {
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
      }
      // 开奖记录
      // 开奖记录
      .lhd {
        width: 58px;
        ._val {
          ._long {
            background: #df303f;
          }
          ._he {
            background: #00a3ee;
          }
          ._hu {
            background: #00ab99;
          }
        }
      }
      .kj {
        width: 220px;
        span {
          font-size: 11.7188px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 4px;
          margin-right: -1px;
        }
        span + span {
          margin-left: 2.34375px;
        }
      }
      .gyh {
        width: 90px;
      }
      .mingci {
        width: 55px;
      }
      .haoma {
        .li {
          float: left;
          width: 35px;
        }
        ._val {
          span {
            width: 20px;
            height: 20px;
            border-radius: 4px;
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
      .lhd {
        width: 52.5417px;
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
