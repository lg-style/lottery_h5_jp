<template>
  <div class="discover">
    <titleBar
      :title_name="tChanglong('长龙助手')"
      @toLeft="to"
      left_icon="arrow-left"
      @toRight="changlongExplainShow = true"
      right_icon="question-o"
      class="titleBar"
    />
    <van-tabs
      class="tabslist"
      color="#df303f"
      title-active-color="#df303f"
      line-height="2"
      @change="changeTab"
    >
      <van-tab :title="tChanglong('最新长龙')">
        <div class="tabslist_body">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="tChanglong('没有更多了')"
              loading-text=" "
              @load="onLoad"
            >
              <div
                class="list_item flex-justify-center flex-center"
                v-for="(item, index) in list"
                :key="index"
                v-show="item.lotteryPeriod"
              >
                <img
                  :src="require(`../../assets/首页/home/cp/168AZXY10.png`)"
                  alt=""
                  class="headImg"
                />
                <div class="listContent">
                  <div class="listContent_title">{{ item.lotteryName }}</div>
                  <div class="">
                    {{
                      item.lotteryPeriod
                        ? setPeriodId(item.lotteryPeriod.periodId)
                        : "000000000000"
                    }}{{ $t("homeChanglong['期']") }}
                    <span style="color: red">{{
                      timeUtil.formatTimesToHHmmSS(
                        LoseTime(item.lotteryPeriod) ||
                          OpenTime(item.lotteryPeriod)
                      )
                    }}</span>
                  </div>
                  <div class="flex-left flex-center btnBox">
                    <span class="btn">{{ item.itemType }}</span>
                    <span class="btn1">{{ item.itemObject }}</span>
                    <span class="btn2">
                      {{ item.longCount }}{{ $t("homeChanglong['期']") }}
                    </span>
                  </div>
                </div>
                <div
                  class="but_box flex-left flex-center"
                  v-if="LoseTime(item.lotteryPeriod) > 0"
                >
                  <div
                    class="_box"
                    :class="{
                      _box_current: itemOddsObj.itemDefId == k.itemDefId,
                    }"
                    v-for="(k, i) in item.lotteryItemOddsList"
                    :key="i"
                    @click="setItemOddsList(k, item)"
                  >
                    <div>{{ k.itemObject }}</div>
                    <div>{{ $t("homeChanglong['赔']") }}{{ k.odds }}</div>
                  </div>
                </div>
                <div class="but_box flex-left flex-center" v-else>
                  <div
                    class="_box"
                    v-for="(k, i) in item.lotteryItemOddsList"
                    :key="i"
                  >
                    <div>{{ $t("homeChanglong['封盘']") }}</div>
                    <div>-</div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab :title="tChanglong('我的投注')"> </van-tab>
    </van-tabs>
    <!--    -->
    <van-popup v-model="itemOddsObjOpen" :overlay="true" lock-scroll>
      <div class="itemOddsObjOpen_body">
        <div class="itemOddsObjOpen_body_title">
          {{ $t("homeChanglong['投注']") }}
        </div>
        <div class="itemOddsObjOpen_body_content">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="itemOddsObjOpen_body_but">
          <div class="_but">{{ $t("homeChanglong['取消']") }}</div>
          <div class="_but">{{ $t("homeChanglong['确认']") }}</div>
        </div>
      </div>
    </van-popup>
    <!-- 长龙底部下注 -->
    <div class="changlong_butBox">
      <div class="changlong_butBox_top flex-left flex-center">
        <div>{{ $t("homeChanglong['每注金额']") }}</div>
        <div class="number_input">
          <van-field v-model="number" type="number" />
        </div>
        <div class="text">{{ $t("homeChanglong['元']") }}</div>
        <div>{{ $t("homeChanglong['请输入要投注的金额']") }}</div>
      </div>
      <div class="changlong_butBox_bottom flex-left flex-center">
        <div class="clear_but" @click="setQK()">
          {{ $t("homeChanglong['清空']") }}
        </div>
        <div class="text_but">
          {{
            $t("homeChanglong.betSummary", {
              count: itemOddsObj.periodId ? 1 : 0,
              amount: number || 0,
            })
          }}
        </div>
        <div class="submit_but" @click="onSubmitOpen()">
          {{ $t("homeChanglong['马上投注']") }}
        </div>
      </div>
    </div>
    <!--    长龙说明-->
    <van-popup
      v-model="changlongExplainShow"
      :overlay="true"
      class="changlongExplainShow_body"
      lock-scroll
    >
      <titleBar
        :title_name="tChanglong('长龙说明')"
        @toLeft="changlongExplainShow = false"
        left_icon="arrow-left"
        class="titleBar"
      />
      <div class="content-long">
        <p>{{ $t("homeChanglong['段落一']") }}</p>
        <p>{{ $t("homeChanglong['段落二']") }}</p>
        <div class="long-ico">{{ $t("homeChanglong['什么是砍龙？']") }}</div>
        <p class="long-tab">{{ $t("homeChanglong['砍龙说明']") }}</p>
        <div class="long-ico">{{ $t("homeChanglong['什么是顺龙？']") }}</div>
        <p class="long-tab">{{ $t("homeChanglong['顺龙说明']") }}</p>
        <div class="long-ico">{{ $t("homeChanglong['什么是倍投？']") }}</div>
        <p class="long-tab">{{ $t("homeChanglong['倍投说明']") }}</p>
      </div>
    </van-popup>

    <!--    投注 弹窗-->
    <van-dialog
      v-model="touzhuShow"
      :title="tChanglong('投注确认')"
      :showConfirmButton="false"
      :showCancelButton="false"
      :closeOnClickOverlay="true"
      show-cancel-button
      class="touzhuShowClass"
    >
      <div class="touzhuShow_body">
        <div style="text-align: left; color: #000">
          {{ itemOddsObj.lotteryName }}：{{
            itemOddsObj.periodId
          }}{{ $t("homeChanglong['期']") }}<br />{{ $t("homeChanglong['投注金额']") }}：<span style="color: #dc3b40">{{ number }}{{ $t("homeChanglong['元']") }}</span
          ><br />{{ $t("homeChanglong['投注内容']") }}：[{{ itemOddsObj.itemType }}]
          {{ itemOddsObj.itemObject }}
        </div>
      </div>
      <div class="touzhuShow_btn flex-left flex-center">
        <div @click="touzhuShow = false">{{ $t("homeChanglong['取消']") }}</div>
        <div @click="onSubmit()">{{ $t("homeChanglong['确认']") }}</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import timeUtil from "../../util/timeUtil";

export default {
  data() {
    return {
      touzhuShow: false,
      itemOddsObjOpen: false,
      itemOddsObj: {},
      number: null,
      loading: false,
      finished: false,
      refreshing: false,
      changlongExplainShow: false,
      timeUtil: timeUtil,
      list: [],
      total: 0,
      form: {
        pageNo: 1,
        pageSize: 0,
      },
      serverDate: 0,
      OpenTimeOpen: false,
      setIntervalObj: null,
    };
  },
  computed: {},
  beforeDestroy() {
    clearInterval(this.setIntervalObj);
  },
  created() {
    this.setIntervalObj = setInterval(() => {
      this.getChanglong();
    }, 10000);
  },
  methods: {
    // 清空
    setQK() {
      this.itemOddsObj = {};
      this.number = null;
    },
    // 格式化期数
    setPeriodId(periodId) {
      let str = periodId || "";
      if (periodId && periodId.length > 10) {
        str = periodId.slice(4, periodId.length);
      }
      return str;
    },
    // 投注弹窗
    onSubmitOpen() {
      let data = this.itemOddsObj;
      if (!this.number) {
        this.$toast(this.$t("homeChanglong['请输入下注金额']"));
        return;
      }
      if (!data.itemDefId) {
        this.$toast(this.$t("homeChanglong['请选择投注项']"));
        return;
      }
      this.touzhuShow = true;
    },
    // 马上下注
    onSubmit() {
      this.touzhuShow = false;
      let data = this.itemOddsObj;
      this.$store.state.loading = true;
      this.$ajax
        .post(
          `/lottery/bet?rebate=${0}&period=${data.periodId}&lotteryId=${
            data.lotteryId
          }`,
          [
            {
              id: data.itemDefId,
              odds: data.odds,
              itemType: data.itemType,
              itemObject: data.itemObject,
              returnRate: 0,
              betAmount: this.number,
            },
          ]
        )
        .then((res) => {
          this.$store.commit(
            "SET_TISHI",
            this.$t("homeChanglong.betSuccessHtml")
          );
          this.setQK();
        })
        .catch((error) => {
          if (error.indexOf("undefined") == -1) {
            this.$toast(error);
          }
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    // 选择投注项
    setItemOddsList(k, item) {
      if (this.itemOddsObj.itemDefId === k.itemDefId) return;
      let lotteryPeriod = item.lotteryPeriod;
      k.periodId = lotteryPeriod.periodId;
      k.lotteryName = item.lotteryName;
      k.lotteryId = item.lotteryId;
      this.itemOddsObj = k;
    },
    // 计算当前时间
    getDate() {
      clearInterval(this.timeObj);
      this.timeObj = setInterval(() => {
        this.serverDate += 1;
      }, 1000);
    },
    // 封盘时间
    LoseTime(obj) {
      if (!obj || !obj.endTime) {
        return 0;
      }
      let time = Date.parse(new Date(obj.endTime.replace(/-/g, "/"))) / 1000;
      let num = time - this.serverDate;
      if (num <= 0) {
        num = 0;
      }
      return num;
    },
    // 开奖时间
    OpenTime(obj) {
      if (!obj || !obj.openTime) {
        return 0;
      }
      let time = Date.parse(new Date(obj.openTime.replace(/-/g, "/"))) / 1000;
      let num = time - this.serverDate;
      if (num == 0) {
        setTimeout(() => {
          if (this.OpenTimeOpen) return;
          this.OpenTimeOpen = true;
          this.getChanglong();
        }, 1000);
      }
      return num > 0 ? num : 0;
    },
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.form.pageSize = 0;
      this.onLoad();
    },
    onLoad() {
      console.log(1);
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.form.pageSize += 10;
      this.getChanglong();
    },
    //长龙列表
    getChanglong() {
      this.$ajax
        .post(
          `/lottery/changlong?pageNo=${this.form.pageNo}&pageSize=${this.form.pageSize}`
        )
        .then((res) => {
          if (res.data) {
            this.serverDate =
              Date.parse(
                new Date(res.data.records[0].serverDate.replace(/-/g, "/"))
              ) / 1000;
            this.getDate();
            this.total = res.data.total;
            this.list = res.data.records || [];
          } else {
            this.total = 0;
            this.list = [];
          }
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.list.length >= this.total || this.total === 0) {
            this.finished = true;
          }
        })
        .finally(() => {
          this.OpenTimeOpen = false;
        });
    },
    changeTab(val) {
      console.log(val);
      if (val == 1) {
        this.$router.push({
          path: "betRecord",
          query: {
            redirect: this.$route.path,
          },
        });
      }
    },
    to() {
      this.$router.push("/");
    },
    tChanglong(key) {
      return this.$t(`homeChanglong['${key}']`);
    },
  },
};
</script>

<style lang="scss" scoped>
.discover {
  .touzhuShowClass {
    width: 90%;
    max-width: 640px;
    border-radius: 5px;
    .van-dialog__header {
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 400;
      border-radius: 5px 5px 0 0;
      text-align: center;
      border-bottom: 1px solid #d8d8d887;
      color: #000;
    }
    .touzhuShow_body {
      padding: 10px 20px;
      text-align: left;
      word-break: break-all;
      line-height: 22px;
      font-size: 14px;
      color: #000;
    }
    .touzhuShow_btn {
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
  .changlong_butBox {
    width: 100vw;
    position: absolute;
    bottom: 1px;
    left: 0;
    .changlong_butBox_top {
      background: #f9f7e9;
      border-top: 1px solid #dfdfdf;
      height: 40.5px;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 15.2616px;
      color: #666;
      .number_input {
        width: 80px;
        margin: 0 6.5px;
        .van-cell {
          padding: 0;
          border: 1px solid #dfdfdf;
          border-radius: 3px;
          padding-left: 10px;
        }
      }
      .text {
        margin-right: 8px;
      }
    }
    .changlong_butBox_bottom {
      position: relative;
      background: #333;
      height: 54.5px;
      text-align: center;
      .clear_but {
        font-size: 21.5px;
        color: #ffaf36;
        width: 68px;
      }
      .text_but {
        font-size: 15px;
        color: #fff;
      }
      .submit_but {
        position: absolute;
        top: 0;
        right: 0;
        height: 54.5px;
        line-height: 54.5px;
        width: 90px;
        background-color: #dc3b40;
        border: 1px solid #dc3b40;
        box-sizing: border-box;
        font-size: 16px;
        color: #fff;
      }
    }
  }
  .changlongExplainShow_body {
    width: 100%;
    height: 100%;
    background-color: #efeef4;
    .content-long {
      font-size: 17.4071px;
      padding: 11.7188px 18.75px calc(54.3973px + 11.7188px);
      background-color: #fff;
      color: #000;
      p {
        margin: 0;
        font-size: 17.4071px;
      }
      p.long-tab {
        display: block;
        padding-left: 31.3328px;
      }
      div.long-ico {
        font-size: 17.4071px;
        position: relative;
        color: #cb4946;
        padding-left: 31.3328px;
        font-weight: 400;
        &:after {
          content: "";
          background: url("../../assets/首页/icon.png") 0 0 no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: 0.05em;
          width: 1.2em;
          height: 1.2em;
        }
      }
    }
  }
  .tabslist {
    background: #efeef4;
    height: calc(100vh - 60px);
    position: relative;
    >>> .van-tab {
      font-size: 15.2616px;
    }
    >>> .van-tabs__line {
      width: 50% !important;
    }
    .tabslist_body {
      .van-list {
        height: calc(100vh - 174px);
        overflow: auto;
      }
      .list_item {
        box-sizing: border-box;
        height: 82px;
        background: #fff;
        border-radius: 5px;
        margin: 10px 5px 0;
        .headImg {
          margin-right: 5px;
          width: 50px;
        }
        .listContent {
          width: 170px;
          span {
            border-radius: 2px;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;
            padding: 0 2px;
          }
          .btn {
            background-color: #c9c9c9;
            margin-right: 2px;
          }
          .btn1 {
            background-color: #6b73f5;
            margin-right: 2px;
          }
          .btn2 {
            background-color: #dc3b40;
            margin-right: 2px;
          }
        }
        .but_box {
          ._box {
            width: 60px;
            height: 54px;
            border: 1px solid #ccc;
            border-radius: 3px;
            text-align: center;
            box-sizing: border-box;
            padding: 9px 0;
            margin-left: 3px;
            div:first-child {
              font-size: 15.2px;
              color: #dc3b40;
              height: 20px;
              line-height: 20px;
            }
            div:last-child {
              font-size: 12px;
              color: rgb(152, 152, 152);
            }
          }
          ._box_current {
            background: #dc3b40 !important;
            border-color: #dc3b40 !important;
            div {
              color: #fff !important;
            }
          }
        }
      }
    }
  }
}
</style>
