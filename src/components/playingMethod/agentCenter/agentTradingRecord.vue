<template>
  <div class="tradingRecord">
    <div class="tradingRecord_top">
      <titleBar
        :title_name="$t('agentCenter[\'交易明细\']')"
        @toLeft="to"
        left_icon="arrow-left"
        class="titleBar"
      />
      <div class="dateBox">
        <el-date-picker
          :clearable="false"
          @change="onRefresh()"
          v-model="form.searchDate"
          type="date"
          format="MM-dd"
          value-format="yyyy-MM-dd"
          :placeholder="$t('agentCenter[\'选择日期\']')"
        >
        </el-date-picker>
      </div>
    </div>

    <div class="tradingRecord_body">
      <div class="tradingRecord_bodyTop">
        <van-row type="flex" align="center" class="info" justify="center">
          <van-cell-group>
            <van-field v-model="form.userNo" :placeholder="$t('agentCenter[\'下级代理查询\']')" />
          </van-cell-group>
          <div
            class="info_but"
            @click="
              onRefresh();
            "
          >
            <van-icon name="arrow" />
          </div>
        </van-row>
      </div>
      <div class="tabsBox flex-center flex-left">
        <div
          @click="
            active = k.type;
            onTab();
          "
          class="_tab"
          :class="{ _tabShow: active == k.type }"
          v-for="k in typeList"
          :key="k.type"
        >
          {{ k.text }}
        </div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="list.length > 0 ? $t('agentCenter[\'已显示全部记录\']') : ''"
          loading-text=" "
          @load="onLoad"
        >
          <div class="tradingRecord_body" v-if="list.length > 0">
            <div class="row_box flex-between" v-for="(k, i) in list" :key="i">
              <div>
                <p>
                  {{
                    k.fundChangeTypeName ||
                    k.cashinTypeName ||
                    k.cashoutWayName
                  }}[{{ k.userNo }}]
                </p>
                <span>{{
                  k.createTime || k.operateTime || k.requestTime
                }}</span>
              </div>
              <div class="fr">
                <div class="OutMoney" v-if="active == 3">
                  -{{ k.changeAmount || k.finalAmount || k.orderAmount || 0 }}
                </div>
                <div
                  class="InMoney"
                  v-else-if="
                    (k.changeAmount || k.finalAmount || k.orderAmount || 0) > 0
                  "
                >
                  +{{ k.changeAmount || k.finalAmount || k.orderAmount || 0 }}
                </div>
                <div class="OutMoney" v-else>
                  {{ k.changeAmount || k.finalAmount || k.orderAmount || 0 }}
                </div>
                <div class="fr" v-if="active == 1 || active == 4">
                  {{
                    k.fundChangeWayName || k.cashinWayName || k.cashoutWayName
                  }}
                </div>
                <div class="fr" v-else-if="active == 2">
                  {{
                    k.orderStatus == 0
                      ? $t('agentCenter[\'待审核\']')
                      : k.orderStatus == 1
                      ? $t('agentCenter[\'充值成功\']')
                      : $t('agentCenter[\'已取消\']')
                  }}
                </div>
                <div class="fr" v-else-if="active == 3">
                  {{
                    k.orderStatus == 0
                      ? $t('agentCenter[\'待审核\']')
                      : k.orderStatus == 1
                      ? $t('agentCenter[\'提现成功\']')
                      : $t('agentCenter[\'已取消\']')
                  }}
                </div>
                <div class="fr" v-else>-</div>
              </div>
            </div>
          </div>
          <empty v-else-if="!loading" />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      dateShow: false,
      startTime: "",
      endTime: "",
      active: 1,
      typeList: [],
      form: {
        pageNo: 0,
        pageSize: 20,
        searchDate: "",
        wayCode: "",
        userNo: "",
      },
      total: 0,
      list: [],
    };
  },
  created() {
    // 初始化 typeList
    this.typeList = [
      { text: this.$t("agentCenter['账户明细']"), type: 1 },
      { text: this.$t("agentCenter['提现']"), type: 3 },
      { text: this.$t("agentCenter['充值']"), type: 2 },
      { text: this.$t("agentCenter['返点']"), type: 4 },
    ];
    
    let date = new Date();
    let getMonth = date.getMonth() + 1;
    let getDate = date.getDate();
    this.form.searchDate = `${date.getFullYear()}-${
      getMonth > 9 ? getMonth : "0" + getMonth
    }-${getDate > 9 ? getDate : "0" + getDate}`;
    // this.initialize();
  },
  methods: {
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.form.pageNo = 0;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.form.pageNo += 1;
      this.initialize();
    },
    onTab() {
      this.onRefresh();
    },
    initialize() {
      if (this.active == 1) {
        this.fundChangeRecord();
      } else if (this.active == 2) {
        this.cashinRecord();
      } else if (this.active == 3) {
        this.cashoutRecord();
      } else if (this.active == 4) {
        this.rebateRecord();
      }
    },
    rebateRecord() {
      this.$ajax
        .post(`/report/child/rebateRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = [...this.list, ...res.data.records];
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
        .catch((error) => {
          this.$toast(error);
          this.form.userNo = "";
        });
    },
    cashoutRecord() {
      this.$ajax
        .post(`/report/child/cashoutRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = [...this.list, ...res.data.records];
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
        .catch((error) => {
          this.$toast(error);
          this.form.userNo = "";
        });
    },
    cashinRecord() {
      this.$ajax
        .post(`/report/child/cashinRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = [...this.list, ...res.data.records];
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
        .catch((error) => {
          this.$toast(error);
          this.form.userNo = "";
        });
    },
    fundChangeRecord() {
      this.$ajax
        .post(`/report/child/fundChangeRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = [...this.list, ...res.data.records];
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
        .catch((error) => {
          this.$toast(error);
          this.form.userNo = "";
        });
    },
    to() {
      this.$router.push({
        path: this.$route.query.redirect,
        query: {
          redirect: this.$route.query.redirect2 || this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.tradingRecord {
  background-color: #fff;
  .tradingRecord_top {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .tabsBox {
    background: #f3f3f3;
    font-size: 17.4071px;
    ._tab {
      height: 47.25px;
      line-height: 47.25px;
      box-sizing: border-box;
      width: calc(100% / 4);
      text-align: center;
    }
    ._tabShow {
      color: #dc3b40;
      border-bottom: 2.5px solid #dc3b40;
    }
  }
  .tradingRecord_body {
    .van-list {
      height: calc(100vh - 210px);
      overflow: auto;
    }
    .row_box {
      padding: 4px 0;
      color: #000;
      border-bottom: 1px solid #584e4e29;
      margin: 0 5%;
      div {
        line-height: 27.1986px;
        font-size: 15.2312px;
        p {
          margin: 0;
        }
        span {
          clear: both;
          color: #989898;
        }
        .InMoney {
          color: red !important;
        }
        .OutMoney {
          color: green;
        }
      }
      .fr {
        color: #989898;
        text-align: right;
      }
    }
  }
  .tradingRecord_body {
    .tradingRecord_bodyTop {
      background-color: #efeef4;
      padding: 13px;
      .info {
        background-color: #fff;
        border-radius: 4.35px;
        .van-cell-group {
          border-radius: 4.35px;
          width: 100%;
          height: 24.36px;
          padding: 4.5px 0;
        }
        .info_but {
          height: 24.36px;
          line-height: 24.36px;
          width: 24.36px;
          background-color: #dc3b40;
          border-radius: 3px;
          color: white;
          margin-right: 4.5px;
          font-size: 18.2px;
          position: relative;
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .van-icon-warning {
          color: #d83442;
        }
        .text {
          margin-left: 5px;
          color: #999;
          font-size: 12px;
        }
        .van-cell {
          padding-top: 0;
          padding-bottom: 0;
        }
      }
    }
  }
}
</style>
