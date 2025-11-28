<template>
  <div class="resultXY28">
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
            <div>
              <div
                class="ul"
                :class="n.className"
                v-for="(n, j) in qiuhaoList"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">
                    {{ k.openResult }}
                  </div>
                  <div
                    v-if="n.className === 'hz'"
                    :class="`xy28_${k.openResult
                      .split(' ')
                      .reduce((p, c) => p / 1 + c / 1)}`"
                  >
                    {{
                      k.openResult.split(" ").reduce((p, c) => p / 1 + c / 1)
                    }}
                  </div>
                  <div
                    v-if="n.className === 'dxds'"
                    v-for="it in [
                      k.openResult.split(' ').reduce((p, c) => p / 1 + c / 1),
                    ]"
                    :key="it"
                  >
                    <div v-if="it >= 14" style="display: inline-block">
                      <span v-if="it % 2 == 0">{{ $t('result[\'大双\']') }}</span>
                      <span v-else>{{ $t('result[\'大单\']') }}</span>
                    </div>
                    <div v-else style="display: inline-block">
                      <span v-if="it % 2 == 0">{{ $t('result[\'小双\']') }}</span>
                      <span v-else>{{ $t('result[\'小单\']') }}</span>
                    </div>
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
            <div style="width: 12.37333rem">
              <div
                class="ul"
                style="width: 1.52rem"
                :class="n.className"
                v-for="(n, j) in qiuhaoList2"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">
                    {{ k.openResult }}
                  </div>
                  <div
                    v-if="n.className === 'hz'"
                    :class="`xy28_${k.openResult
                      .split(' ')
                      .reduce((p, c) => p / 1 + c / 1)}`"
                  >
                    {{
                      k.openResult.split(" ").reduce((p, c) => p / 1 + c / 1)
                    }}
                  </div>
                </div>
              </div>
              <!-- 号码 -->
              <div class="ul" style="width: auto">
                <div>
                  <div v-for="(m, x) in 10" :key="x" class="haoma">
                    <div class="li table_title">{{ x }}</div>
                  </div>
                </div>

                <div class="haoma" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div class="li _val" v-for="(m, x) in 10" :key="x">
                    <span
                      v-if="
                        k.openResult.split(' ').filter((a) => a == x).length > 0
                      "
                      >{{ x
                      }}<i
                        class="chonghao"
                        v-if="
                          k.openResult.split(' ').filter((a) => a == x).length >
                          1
                        "
                        >{{
                          k.openResult.split(" ").filter((a) => a == x).length
                        }}</i
                      ></span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('result[\'和值走势\']')" name="3">
        <div class="table_body">
          <div class="ul">
            <div class="li table_title">{{ $t('result[\'期号\']') }}</div>
            <div class="li" v-for="(k, i) in todayOpenRecord" :key="i">
              {{ k.periodId }}
            </div>
          </div>
          <div class="table_body-r">
            <div style="width: 30.4rem">
              <div
                class="ul"
                :style="
                  n.text === 'kj' ? 'width: 1.52rem;' : 'width: 2.13333rem;'
                "
                :class="n.className"
                v-for="(n, j) in qiuhaoList3"
                :key="j"
              >
                <div class="li table_title">{{ n.text }}</div>
                <div class="li _val" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div v-if="n.className === 'kj'">
                    {{ k.openResult }}
                  </div>
                  <div
                    v-if="n.className === 'dxds'"
                    v-for="it in [
                      k.openResult.split(' ').reduce((p, c) => p / 1 + c / 1),
                    ]"
                    :key="it"
                  >
                    <div v-if="it >= 14" style="display: inline-block">
                      <span v-if="it % 2 == 0">{{ $t('result[\'大双\']') }}</span>
                      <span v-else>{{ $t('result[\'大单\']') }}</span>
                    </div>
                    <div v-else style="display: inline-block">
                      <span v-if="it % 2 == 0">{{ $t('result[\'小双\']') }}</span>
                      <span v-else>{{ $t('result[\'小单\']') }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 号码 -->
              <div class="ul" style="width: auto" id="vanTable">
                <div>
                  <div v-for="(m, x) in 28" :key="x" class="haoma">
                    <div class="li table_title">{{ x }}</div>
                  </div>
                </div>

                <div class="haoma" v-for="(k, i) in todayOpenRecord" :key="i">
                  <div class="li _val" v-for="(m, x) in 28" :key="x">
                    <span
                      v-if="
                        k.openResult
                          .split(' ')
                          .reduce((p, c) => p / 1 + c / 1) == x
                      "
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
      qiuhaoList: [],
      qiuhaoList2: [],
      qiuhaoList3: [],
      active: "",
    };
  },
  computed: {
    ...mapState(["todayOpenRecord"]),
    offsetWidth() {
      return document.body.offsetWidth;
    },
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
      { className: "hz", text: this.$t("result['和值']") },
      { className: "dxds", text: this.$t("result['大小单双']") },
    ];
    
    // 初始化 qiuhaoList2
    this.qiuhaoList2 = [
      { className: "kj", text: this.$t("result['开奖']") },
      { className: "hz", text: this.$t("result['和值']") },
    ];
    
    // 初始化 qiuhaoList3
    this.qiuhaoList3 = [
      { className: "kj", text: this.$t("result['开奖']") },
      { className: "dxds", text: this.$t("result['大小单双']") },
    ];
  },
  mounted() {},
  methods: {
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
      if (this.active != 3) {
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
.resultXY28 {
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
      }
      .kj {
        width: 77.875px;
        ._val {
          color: #df303f;
        }
      }
      .hz {
        width: 77.875px;
      }
      // 绿色
      .xy28_1,
      .xy28_4,
      .xy28_10,
      .xy28_19,
      .xy28_22,
      .xy28_25,
      .xy28_7,
      .xy28_16 {
        color: #00ab99;
      }
      // 蓝色
      .xy28_2,
      .xy28_17,
      .xy28_8,
      .xy28_5,
      .xy28_20,
      .xy28_23,
      .xy28_26,
      .xy28_11 {
        color: #00a3ee;
      }
      // 红
      .xy28_3,
      .xy28_18,
      .xy28_21,
      .xy28_9,
      .xy28_15,
      .xy28_12,
      .xy28_24,
      .xy28_6 {
        color: #df303f;
      }
      // 白
      .xy28_0,.xy28_13, .xy28_14, .xy28_27 {
        color: #fff;
      }
      .dxds {
        width: 106px;
        span {
          width: 100%;
          color: #df303f;
        }
      }
      .haoma {
        .li {
          float: left;
          width: 35px;
        }
        ._val {
          span {
            background: #df303f;
            position: relative;
          }
          .chonghao {
            font-size: 6.85405px;
            position: absolute;
            background: #f0a126;
            display: inline-block;
            border-radius: 50%;
            width: 8.21875px;
            height: 8.21875px;
            margin-left: 6.16865px;
            margin-top: -4.79784px;
            line-height: 8.21875px;
            text-align: center;
            position: absolute;
            top: 9px;
            right: 4px;
            color: #df303f;
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
