<template>
  <div class="resultLHC">
    <van-tabs
      v-model="active"
      class="lotteryTabs"
      background="#e1d9bc"
      title-active-color="#ee0a24"
      title-inactive-color="#404656"
      @click="onClick"
      animated
    >
      <van-tab :title="$t('result[\'开奖记录\']')" name="1">
        <div class="vanTable flex-left">
          <div class="vanTable-l">
            <div class="title">{{ $t('result[\'期号\']') }}</div>
            <div class="vanTableBody">
              <div
                v-for="(k, i) in todayOpenRecord"
                :key="i"
                class="row flex-justify-center flex-center"
              >
                {{ k.periodId }}
              </div>
            </div>
          </div>
          <div class="vanTable-r">
            <div class="r-body flex-left">
              <div
                class="r-body-box"
                v-for="(k, i) in titleList"
                :key="i"
                :class="k.class"
              >
                <div class="title">{{ k.text }}</div>
                <div class="vanTableBody">
                  <div
                    v-for="(n, j) in todayOpenRecord"
                    :key="j"
                    class="row flex-justify-center flex-center"
                  >
                    <!-- 开奖号码 -->
                    <div v-if="k.originalText == '开奖'">
                      <van-row type="flex" align="center" class="kjBox">
                        <div
                          v-for="(m, l) in n.openResult.split(' ')"
                          :key="l"
                          class="flex-center flex-left"
                        >
                          <div v-show="l == 6">+</div>
                          <div
                            :class="{
                              'lhc-red': [
                                1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34,
                                35, 40, 45, 46,
                              ].includes(m / 1),
                              'lhc-blue': [
                                3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41,
                                42, 47, 48,
                              ].includes(m / 1),
                              'lhc-green': [
                                5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38,
                                39, 43, 44, 49,
                              ].includes(m / 1),
                            }"
                            class="box"
                          >
                            {{ setName(m) }}
                          </div>
                        </div>
                      </van-row>
                    </div>
                    <!-- 正码生肖 -->
                    <div v-else-if="k.originalText == '正码生肖'">
                      <van-row type="flex" align="center" class="zmsxBox">
                        <div
                          v-for="(m, l) in n.openResult.split(' ')"
                          :key="l"
                          class="flex-center flex-left"
                        >
                          <div class="box" v-show="l != 6">
                            {{
                              Object.values(shengxiaoData).filter((a) =>
                                a.num.includes(setName(m))
                              )[0]
                                ? Object.values(shengxiaoData).filter((a) =>
                                    a.num.includes(setName(m))
                                  )[0].name
                                : ""
                            }}
                          </div>
                        </div>
                      </van-row>
                    </div>
                    <!-- 生肖 -->
                    <div v-else-if="k.originalText == '生肖'">
                      <van-row type="flex" align="center" class="sxBox">
                        <div
                          v-for="(m, l) in n.openResult.split(' ')"
                          :key="l"
                          class="flex-center flex-left"
                        >
                          <div class="box" v-show="l == 6">
                            <span>
                              {{
                                Object.values(shengxiaoData).filter((a) =>
                                  a.num.includes(setName(m))
                                )[0]
                                  ? Object.values(shengxiaoData).filter((a) =>
                                      a.num.includes(setName(m))
                                    )[0].name
                                  : ""
                              }}
                            </span>
                            <span class="span lhc-red" v-if="m % 2 == 0"
                              >{{ $t('result[\'双\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'单\']') }}</span>
                            <span class="span lhc-red" v-if="m <= 24">{{ $t('result[\'小\']') }}</span>
                            <span class="span lhc-green" v-else>{{ $t('result[\'大\']') }}</span>
                          </div>
                        </div>
                      </van-row>
                    </div>
                    <!-- 生肖尾数 -->
                    <div v-else-if="k.originalText == '生肖尾数'">
                      <van-row type="flex" align="center" class="sxwsBox">
                        <div
                          v-for="(m, l) in n.openResult.split(' ')"
                          :key="l"
                          class="flex-center flex-left"
                        >
                          <div class="box" v-show="l == 6">
                            <span v-if="m == 49" class="lhc-blue span">{{ $t('result[\'和\']') }}</span>
                            <span
                              v-else-if="
                                m.split('')[m.split('').length - 1] <= 4
                              "
                              class="lhc-red span"
                              >{{ $t('result[\'小\']') }}</span
                            >
                            <span v-else class="lhc-green span">{{ $t('result[\'大\']') }}</span>
                          </div>
                        </div>
                      </van-row>
                    </div>
                    <!-- 摊子 -->
                    <div v-else-if="k.originalText == '摊子'">
                      <van-row type="flex" align="center" class="tzBox">
                        <div
                          v-for="(m, l) in n.openResult.split(' ')"
                          :key="l"
                          class="flex-center flex-left"
                        >
                          <div class="box" v-show="l == 6" v-if="m != 49">
                            <span>{{ m % 4 || 4 }}</span>
                            <span
                              v-if="
                                m.split('').reduce((p, c) => p / 1 + c / 1) %
                                  2 ==
                                0
                              "
                              class="lhc-red span"
                              >{{ $t('result[\'双\']') }}</span
                            >
                            <span v-else class="lhc-green span">{{ $t('result[\'单\']') }}</span>
                          </div>
                          <div class="box" v-show="l == 6" v-else>
                            <span>{{ $t('result[\'和\']') }}</span>
                            <span class="lhc-blue span">{{ $t('result[\'和\']') }}</span>
                          </div>
                        </div>
                      </van-row>
                    </div>
                    <!-- 总和 -->
                    <div v-else-if="k.originalText == '总和'">
                      <van-row type="flex" align="center" class="zhBox">
                        <div class="flex-center flex-left">
                          <div class="box">
                            <span>{{
                              n.openResult
                                .split(" ")
                                .reduce((p, c) => p / 1 + c / 1)
                            }}</span>
                            <span
                              class="span lhc-red"
                              v-if="
                                n.openResult
                                  .split(' ')
                                  .reduce((p, c) => p / 1 + c / 1) %
                                  2 ==
                                0
                              "
                              >{{ $t('result[\'双\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'单\']') }}</span>
                            <span
                              class="span lhc-red"
                              v-if="
                                n.openResult
                                  .split(' ')
                                  .reduce((p, c) => p / 1 + c / 1) <= 174
                              "
                              >{{ $t('result[\'小\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'大\']') }}</span>
                          </div>
                        </div>
                      </van-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('result[\'开奖号码\']')" name="2">
        <div class="tabs flex-left flex-center">
          <div
            v-for="i in 7"
            :key="i"
            class="tab"
            :class="{ 'tab-a': tabA == i }"
            @click="tabA = i"
          >
            <span v-if="i == 7">{{ $t('result[\'特码\']') }}</span>
            <span v-if="i == 1">{{ $t('result[\'正码一\']') }}</span>
            <span v-if="i == 2">{{ $t('result[\'正码二\']') }}</span>
            <span v-if="i == 3">{{ $t('result[\'正码三\']') }}</span>
            <span v-if="i == 4">{{ $t('result[\'正码四\']') }}</span>
            <span v-if="i == 5">{{ $t('result[\'正码五\']') }}</span>
            <span v-if="i == 6">{{ $t('result[\'正码六\']') }}</span>
          </div>
        </div>
        <div class="vanTable flex-left">
          <div class="vanTable-l">
            <div class="title">{{ $t('result[\'期号\']') }}</div>
            <div class="vanTableBody">
              <div
                v-for="(k, i) in todayOpenRecord"
                :key="i"
                class="row flex-justify-center flex-center"
              >
                {{ k.periodId }}
              </div>
            </div>
          </div>
          <div class="vanTable-r">
            <div class="r-body r-body2 flex-left">
              <div
                class="r-body-box"
                v-for="(k, i) in titleList2"
                :key="i"
                :class="k.class"
              >
                <div class="title">{{ k.text }}</div>
                <div class="vanTableBody">
                  <div
                    v-for="(n, j) in todayOpenRecord"
                    :key="j"
                    class="row flex-justify-center flex-center"
                  >
                    <div>
                      <van-row type="flex" align="center" class="sxBox">
                        <div class="flex-center flex-left">
                          <!-- 号码 -->
                          <div class="box" v-if="k.originalText == '号码'">
                            <span
                              class="span"
                              :class="{
                                'lhc-red': [
                                  1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30,
                                  34, 35, 40, 45, 46,
                                ].includes(
                                  n.openResult.split(' ')[tabA - 1] / 1
                                ),
                                'lhc-blue': [
                                  3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37,
                                  41, 42, 47, 48,
                                ].includes(
                                  n.openResult.split(' ')[tabA - 1] / 1
                                ),
                                'lhc-green': [
                                  5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38,
                                  39, 43, 44, 49,
                                ].includes(
                                  n.openResult.split(' ')[tabA - 1] / 1
                                ),
                              }"
                              >{{ n.openResult.split(" ")[tabA - 1] }}</span
                            >
                            <span>
                              {{
                                Object.values(shengxiaoData).filter((a) =>
                                  a.num.includes(
                                    setName(n.openResult.split(" ")[tabA - 1])
                                  )
                                )[0]
                                  ? Object.values(shengxiaoData).filter((a) =>
                                      a.num.includes(
                                        setName(
                                          n.openResult.split(" ")[tabA - 1]
                                        )
                                      )
                                    )[0].name
                                  : ""
                              }}
                            </span>
                          </div>
                          <!-- 单双 -->
                          <div class="box" v-if="k.originalText == '单双'">
                            <span
                              class="span lhc-red"
                              v-if="n.openResult.split(' ')[tabA - 1] % 2 == 0"
                              >{{ $t('result[\'双\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'单\']') }}</span>
                          </div>
                          <!-- 大小 -->
                          <div class="box" v-if="k.originalText == '大小'">
                            <span
                              class="span lhc-blue"
                              v-if="n.openResult.split(' ')[tabA - 1]==49"
                              >{{ $t('result[\'和\']') }}</span
                            >
                            <span
                              class="span lhc-red"
                              v-else-if="n.openResult.split(' ')[tabA - 1]<=24"
                              >{{ $t('result[\'小\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'大\']') }}</span>
                          </div>
                          <!-- 合单双 -->
                          <div class="box" v-if="k.originalText == '合单双'">
                            <span
                              class="span lhc-blue"
                              v-if="n.openResult.split(' ')[tabA - 1]==49"
                              >{{ $t('result[\'和\']') }}</span
                            >
                            <span
                              class="span lhc-red"
                              v-else-if="((n.openResult.split(' ')[tabA - 1]).split('')).reduce((p, c) => p / 1 + c / 1) % 2 == 0"
                              >{{ $t('result[\'双\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'单\']') }}</span>
                          </div>
                          <!-- 合大小 -->
                          <div class="box" v-if="k.originalText == '合大小'">
                            <span
                              class="span lhc-blue"
                              v-if="n.openResult.split(' ')[tabA - 1]==49"
                              >{{ $t('result[\'和\']') }}</span
                            >
                            <span
                              class="span lhc-red"
                              v-else-if="((n.openResult.split(' ')[tabA - 1]).split('')).reduce((p, c) => p / 1 + c / 1)<=6"
                              >{{ $t('result[\'小\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'大\']') }}</span>
                          </div>
                          <!-- 尾大小 -->
                          <div class="box" v-if="k.originalText == '尾大小'">
                            <span
                              class="span lhc-blue"
                              v-if="n.openResult.split(' ')[tabA - 1]==49"
                              >{{ $t('result[\'和\']') }}</span
                            >
                            <span
                              class="span lhc-red"
                              v-else-if="((n.openResult.split(' ')[tabA - 1]).split(''))[((n.openResult.split(' ')[tabA - 1]).split('')).length-1]<=4"
                              >{{ $t('result[\'小\']') }}</span
                            >
                            <span class="span lhc-green" v-else>{{ $t('result[\'大\']') }}</span>
                          </div>
                        </div>
                      </van-row>
                    </div>
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
      tabA: 7,
      util: util,
      qiuhaoId: 1,
      typeId: 1,
      typeList: [
        { type: 1, text: "球号" },
        { type: 2, text: "大小" },
        { type: 3, text: "单双" },
        // {type:4,text:'总和/龙虎'},
        // {type:5,text:'大小/单双'},
      ],
      active: "",
    };
  },
  computed: {
    ...mapState(["todayOpenRecord", "shengxiaoData"]),
    titleList() {
      return [
        { id: 1, text: this.$t("result['开奖']"), class: "kj", originalText: "开奖" },
        { id: 2, text: this.$t("result['正码生肖']"), class: "zmsx", originalText: "正码生肖" },
        { id: 3, text: this.$t("result['生肖']"), class: "sx", originalText: "生肖" },
        { id: 4, text: this.$t("result['生肖尾数']"), class: "sxws", originalText: "生肖尾数" },
        { id: 5, text: this.$t("result['摊子']"), class: "tz", originalText: "摊子" },
        { id: 6, text: this.$t("result['总和']"), class: "zh", originalText: "总和" },
      ];
    },
    titleList2() {
      return [
        { id: 1, text: this.$t("result['号码']"), class: "hm", originalText: "号码" },
        { id: 2, text: this.$t("result['单双']"), class: "ds", originalText: "单双" },
        { id: 3, text: this.$t("result['大小']"), class: "dx", originalText: "大小" },
        { id: 4, text: this.$t("result['合单双']"), class: "hds", originalText: "合单双" },
        { id: 5, text: this.$t("result['合大小']"), class: "hdx", originalText: "合大小" },
        { id: 6, text: this.$t("result['尾大小']"), class: "wdx", originalText: "尾大小" },
      ];
    },
  },
  watch: {
    "$store.state.todayOpenRecord": {
      handler: function (a, b) {
        console.log(a.length, b.length);
        this.onClick();
      },
    },
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
    onClick() {
      if (this.active == 2) {
        this.$nextTick(() => {});
      }
    },
  },
};
</script>

<style lang="scss">
.resultLHC {
  .lotteryTabs{
    .van-tabs__wrap {
      height: 45px;
      line-height: 45px;
      .van-tabs__nav {
        background-color: #e1d9bc !important;
        .van-tabs__line {
          width: calc(100% / 2) !important;
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
  .tabs {
    height: 35px;
    background: #e1d9bc;
    color: #333;
    box-sizing: border-box;
    border-top: 1px solid #b4ac8c;
    border-bottom: 1px solid #b4ac8c;
    .tab {
      height: 28px;
      line-height: 28px;
      width: calc(100% / 7);
      text-align: center;
      font-size: 12px;
    }
    .tab-a {
      background: #df303f;
      color: #fff;
      border-radius: 5px;
    }
  }
  .vanTable {
    font-size: 12px;
    text-align: center;
    color: #666;
    .vanTable-l {
      width: 94px;
      border-right: 1px solid #b4ac8c;
      box-sizing: border-box;
    }
    .vanTable-r {
      width: calc(100vw - 94px);
      overflow-x: auto;
      .r-body {
        width: 696px;
        color: #df303f;
        .r-body-box {
          border-right: 1px solid #b4ac8c;
          box-sizing: border-box;
        }
        .kj {
          width: 180px;
        }
        .zmsx {
          width: 180px;
        }
        .sx {
          width: 90px;
        }
        .sxws {
          width: 78px;
        }
        .tz {
          width: 78px;
        }
        .zh {
          width: 90px;
        }

        .hm {
          width: 58px;
        }
        .ds {
          width: 56px;
        }
        .dx {
          width: 55px;
        }
        .hds {
          width: 58px;
        }
        .hdx {
          width: 58px;
        }
        .wdx {
          width: 58px;
        }
      }
      .r-body2 {
        width: 344px;
      }
    }
    .title {
      height: 30.5px;
      line-height: 30.5px;
      background: #e1d9bc;
      font-size: 14px;
    }
    .vanTableBody {
      background: #ebe8d6;
      .row {
        height: 30.5px;
        &:nth-child(even) {
          background: #e1d9bc;
        }
        .kjBox {
          .box {
            width: 19px;
            height: 19px;
            line-height: 19px;
            border-radius: 50%;
            color: #fff;
            margin: 0 2px;
          }
        }
        .zmsxBox {
          .box {
            width: 19px;
            height: 19px;
            line-height: 19px;
            margin: 0 2px;
            font-size: 14px;
          }
        }
        .span {
          width: 19px;
          height: 19px;
          line-height: 19px;
          display: inline-block;
          color: #fff;
          border-radius: 50%;
        }
        .lhc-red {
          background: #df303f;
        }
        .lhc-green {
          background: #00ab99;
        }
        .lhc-blue {
          background: #00a3ee;
        }
      }
    }
  }
}
</style>
