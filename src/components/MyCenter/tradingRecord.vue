<template>
  <div class="tradingRecord">
    <div class="tradingRecord_top">
      <titleBar
        :title_name="$t('myCenter[\'交易记录\']')"
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
          :placeholder="$t('myCenter[\'选择日期\']')"
        >
        </el-date-picker>
      </div>
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
        :finished-text="list.length > 0 ? $t('myCenter[\'已显示全部记录\']') : ''"
        loading-text=" "
        @load="onLoad"
      >
        <div class="tradingRecord_body" v-if="list.length > 0">
          <div class="row_box flex-between" v-for="(k, i) in list" :key="i" @click="onLookBut(k)">
            <div>
              <p>
                <!-- 这里可能回出现客服入款 -->
                {{
                  translateFundName(
                    k.fundChangeTypeName || k.cashinTypeName || k.cashoutWayName
                  )
                }}
                <span class="_lookBut" v-if="active == 2 || active == 3">{{ translateFundName('二维码凭证') }}</span>
              </p>
              <span>{{ k.createTime || k.operateTime || k.requestTime }}</span>
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
                <span v-if="k.fundChangeWayName === '余额划入'">{{ $t("myCenter['出款者']") }}：{{ k.remark.split('=>')[0]?k.remark.split('=>')[0]:'-'}}</span>
                <span v-else-if="k.fundChangeWayName === '余额划出'">{{ $t("myCenter['入款者']") }}：{{ k.remark.split('=>')[1]?k.remark.split('=>')[1]:'-' }}</span>
                <span v-else>{{ translateFundName(k.fundChangeWayName || k.cashinWayName || k.cashoutWayName) }}</span>
              </div>
              <div class="fr" v-else-if="active == 2">
                {{
                  k.orderStatus == 0
                    ? $t("myCenter['待审核']")
                    : k.orderStatus == 1
                    ? $t("myCenter['充值成功']")
                    : $t("myCenter['已取消']")
                }}
              </div>
              <div class="fr" v-else-if="active == 3">
                {{
                  k.orderStatus == 0
                    ? $t("myCenter['待审核']")
                    : k.orderStatus == 1
                    ? $t("myCenter['提现成功']")
                    : $t("myCenter['已取消']")
                }}
              </div>
              <div class="fr" v-else>-</div>
            </div>
          </div>
        </div>
        <empty v-else-if="!loading" />
      </van-list>
    </van-pull-refresh>
    <!-- 二维码凭证 -->
    <van-popup v-model="urlImgShow" class="urlImgShowPopup" closeable>
      <van-loading color="#0094ff" size="24px" vertical v-if="urlImgArr.length == 0">{{ $t("myCenter['加载中']") }}</van-loading>
      <img :src="k" v-for="(k,i) in urlImgArr" :key="i" class="_img"/>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      urlImgShow: false,
      urlImgArr: [],
      loading: false,
      finished: false,
      refreshing: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      startTime: "",
      endTime: "",
      active: 1,
      typeList: [
        { text: "所有类型", type: 1 },
        { text: "提现", type: 3 },
        { text: "充值", type: 2 },
        { text: "返点", type: 4 },
      ],
      form: {
        pageNo: 1,
        pageSize: 5,
        searchDate: "",
        wayCode: "",
      },
      total: 0,
      list: [],
    };
  },
  created() {
    // 初始化 typeList 数组的多语言
    this.typeList = [
      { text: this.$t("myCenter['所有类型']"), type: 1 },
      { text: this.$t("myCenter['提现']"), type: 3 },
      { text: this.$t("myCenter['充值']"), type: 2 },
      { text: this.$t("myCenter['返点']"), type: 4 },
    ];
    let date = new Date();
    let getMonth = date.getMonth() + 1;
    let getDate = date.getDate();
    this.form.searchDate = `${date.getFullYear()}-${
      getMonth > 9 ? getMonth : "0" + getMonth
    }-${getDate > 9 ? getDate : "0" + getDate}`;
  },
  methods: {
    translateFundName(name = '') {
      if (!name) return '';
      const path = `fundChange.${name}`;
      return this.$te(path) ? this.$t(path) : name;
    },
    // 查看二维码凭证
    onLookBut(k) {
      this.urlImgArr = [];
      if(this.active == 2){//充值
      this.urlImgShow = true;
      this.$ajax
        .post(`/cashin/getPayment?id=${k.id}`)
        .then((res) => {
          if(res.data){
            this.urlImgArr = res.data.split("aaa===aaa===aaa");
          }else {
            this.urlImgShow = false;
            this.$toast(this.$t("common['没有二维码凭证']"));
          }
        })
      }else if(this.active == 3){//提现
        this.urlImgShow = true;
        this.$ajax
          .post(`/cashout/getPayment?id=${k.id}`)
          .then((res) => {
            if(res.data){
              this.urlImgArr = res.data.split("aaa===aaa===aaa");
            }else {
              this.urlImgShow = false;
              this.$toast(this.$t("common['没有二维码凭证']"));
            }
          })
      } else {
        return;
      }
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
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.form.pageSize += 10;
      this.initialize();
    },
    onTab() {
      this.list = [];
      this.form.pageNo = 1;
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
        .post(`/report/rebateRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = res.data.records;
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
        });
    },
    cashoutRecord() {
      this.$ajax
        .post(`/report/cashoutRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = res.data.records;
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
        });
    },
    cashinRecord() {
      this.$ajax
        .post(`/report/cashinRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = res.data.records;
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
        });
    },
    fundChangeRecord() {
      this.$ajax
        .post(`/report/fundChangeRecord`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            this.list = res.data.records;
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
  min-height: 100vh;
  background-color: #fff;
  .tradingRecord_top {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .van-pull-refresh {
    min-height: calc(100vh - 90px);
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
    padding: 3px 0 10px;
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
      ._lookBut {
        text-decoration: underline;
        color: blue;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }
  .urlImgShowPopup {
    background-color: #00000000;
    width: 100%;
    height: 100%;
    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .van-loading__text {
        color: #0094ff;
      }
    }
    ._img {
      width: 50%;
      display: block;
      margin: 20px auto 0;
    }
  }
}
</style>
