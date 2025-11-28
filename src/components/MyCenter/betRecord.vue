<template>
  <div class="betRecord">
    <div class="betRecord_top">
      <title-bar @toLeft="to" left_icon="arrow-left" class="titleBar" />
      <div class="titleBar_tabs">
        <div :class="{'on':(active === 1)}" @click="active = 1">{{ $t("betRecord['投注']") }}</div>
        <div :class="{'on':(active === 2)}" @click="active = 2">{{ $t("betRecord['追号']") }}</div>
      </div>
      <div class="dateBox">
        <el-date-picker
          :clearable="false"
          @change="onRefresh()"
          v-model="form.startDate"
          type="date"
          format="MM-dd"
          value-format="yyyy-MM-dd"
          :placeholder="$t('betRecord[\'选择日期\']')"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="tabsBox flex-center flex-left">
      <div
        class="_tab"
        :class="{
          _tabShow: form.orderStatus
            ? form.orderStatus === k.id
            : form.win === k.id,
        }"
        @click="setType(k)"
        v-for="(k, i) in idList"
        :key="i"
      >
        {{ k.text }}
      </div>
    </div>
    <div class="totalmsg" v-if="active === 1">
      {{ $t("betRecord['有效投注']") }}:{{ (betAmountToday || 0).toFixed(2) }}&nbsp;&nbsp;{{ $t("betRecord['损益']") }}:<span>{{
        (totalWinToday || 0).toFixed(2)
      }}</span>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="active === 1">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="list.length > 0 ? $t('betRecord[\'已显示全部记录\']') : ''"
        loading-text=" "
        @load="onLoad"
      >
        <div class="betRecord_body" v-if="list.length > 0">
          <div
            class="_row"
            v-for="(k, i) in list"
            :key="i"
            @click="onDetail(k)"
          >
            <div style="width: 70%">
              <p>
                {{ k.lotteryName }}<span>￥{{ k.betAmount.toFixed(2) }}</span>
              </p>
              <p>
                <span>{{ k.itemType }} - @</span
                ><span style="color: red">{{ k.odds }}</span>
                <span>{{
                  k.lotteryOptions ? `(${k.lotteryOptions})` : k.itemObject
                }}</span>
              </p>
              <span>{{ k.betTime }}</span>
            </div>
            <div class="fr">
              <p class="fr" v-if="k.gameResult == 0">{{ $t("betRecord['未中奖']") }}</p>
              <p class="fr" v-else-if="k.gameResult == 1" style="color:red;text-align: right;">
                +{{ k.winAmount }}<br/>{{ $t("betRecord['已中奖']") }}
              </p>
              <p class="fr" v-else-if="k.gameResult == 2">{{ $t("betRecord['和']") }}</p>
              <p class="fr" v-else style="color:green;">{{ $t("betRecord['等待开奖']") }}</p>
            </div>
          </div>
        </div>
        <empty v-else-if="!loading" />
      </van-list>
    </van-pull-refresh>
    <empty v-else/>
    <!-- 投注记录详情 -->
    <van-popup
      duration="0"
      class="detailOpenClass"
      v-model="detailOpen"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <titleBar
        :title_name="$t('betRecord[\'注单详情\']')"
        @toLeft="detailOpen = false"
        left_icon="arrow-left"
      />
      <div class="main_detail">
        <div class="tzHead">
          <div :class="`L_${formData.gameCategoryCode}`" class="fl iconfont"></div>
          <h1>{{ formData.lotteryName }}</h1>
          <span class="fr" v-if="formData.gameResult==0">{{ $t("betRecord['未中奖']") }}</span>
          <span class="fr" v-else-if="formData.gameResult==1" style="color:red">{{ $t("betRecord['已中奖']") }}</span>
          <span class="fr" v-else-if="formData.gameResult==2">{{ $t("betRecord['和']") }}</span>
          <span class="fr" v-else style="color:green;">{{ $t("betRecord['等待开奖']") }}</span>
          <p>{{ $t("betRecord['第']") }}{{ formData.periodId }}{{ $t("betRecord['期']") }}</p>
        </div>
        <table class="table_detail">
          <tbody>
            <tr>
              <td>{{ $t("betRecord['投注时间']") }}</td>
              <td>{{ formData.betTime }}</td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['投注单号']") }}</td>
              <td>{{ formData.betOrderNo }}</td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['投注金额']") }}</td>
              <td>¥{{ formData.betAmount }}元</td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['派送奖金']") }}</td>
              <td>
                ¥{{ formData.sendAmount }}元<span
                  v-if="formData.gameResult == 2"
                  >（{{ $t("betRecord['退款']") }}）</span
                >
              </td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['返点金额']") }}</td>
              <td>¥{{ formData.returnAmount }}元</td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['盈亏金额']") }}</td>
              <td>¥{{ formData.winAmount }}元</td>
            </tr>
            <tr>
              <td>{{ $t("betRecord['开奖号码']") }}</td>
              <td>{{ formData.openResult }}</td>
            </tr>
          </tbody>
        </table>
        <section class="section_detail">
          <header>{{ $t("betRecord['我的投注']") }}</header>
          <ul>
            <li></li>
            <li>
              <div
                style="
                  overflow-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                "
              >
                {{ formData.itemType }}
              </div>
              <span
                >{{
                  formData.lotteryOptions ? `(${formData.lotteryOptions})` : formData.itemObject
                }}@</span
              ><span style="color: red">{{ formData.odds }}</span>
              <!---->
              <p class="hr1px"></p>
            </li>
            <li></li>
          </ul>
        </section>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import titleBar from "../shared/titleBar.vue";
export default {
  components: { titleBar },
  data() {
    return {
      active: 1,
      detailOpen: false,
      titleNameOpen: false,

      loading: false,
      finished: false,
      refreshing: false,

      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      dateList: [],
      dateShow: false,
      formData: {},
      form: {
        startDate: "",
        endDate: "",
        lotteryId: 0,
        pageNo: 1,
        pageSize: 20,
        win: "",
        orderStatus: null,
        categoryCode: "",
        gameClassName: "",
        categoryId: "",
      },
      total: 0,
      list: [],
      betAmountToday: 0,
      totalWinToday: 0,
      gameList: [],
    };
  },
  computed: {
    ...mapState(["GroupList"]),
    lotteryId() {
      return this.$route.query.lotteryId;
    },
    typeList() {
      let arr = [];
      this.GroupList.map((k) => {
        arr = [...arr, ...k.list];
      });
      return arr;
    },
    idList() {
      return [
        { id: "", text: this.$t("betRecord['全部']") },
        { id: 1, text: this.$t("betRecord['已中奖']") },
        { id: 2, text: this.$t("betRecord['未中奖']") },
        // { id: 3, text: this.$t("betRecord['和']") },
        { id: 10, text: this.$t("betRecord['等待开奖']") },
      ];
    },
  },
  created() {
    let date = new Date();
    let getMonth = date.getMonth() + 1;
    let getDate = date.getDate();
    this.form.endDate = this.form.startDate = `${date.getFullYear()}-${
      getMonth > 9 ? getMonth : "0" + getMonth
    }-${getDate > 9 ? getDate : "0" + getDate}`;
    this.getGameCategory();
  },
  methods: {
    // 查看详情
    onDetail(row) {
      this.formData = Object.assign({}, row);
      this.detailOpen = true;
    },
    gameCategoryList() {
      let json =
        this.gameList.filter(
          (item) => item.gameClassCode == this.form.gameClassCode
        )[0] || {};
      return json.list || [];
    },
    onConfirm1(value, index) {
      this.form.categoryId = "";
      this.form.gameClassName = value.gameClassName;
      this.form.gameClassCode = value.gameClassCode;
      this.titleNameOpen = false;
      this.onRefresh();
    },
    getGameCategory() {
      this.$ajax.post(`/list/gameCategory`).then((res) => {
        let arr = [];
        for (let k of res.data) {
          let idx = arr
            .map((item) => item.gameClassName)
            .indexOf(k.gameClassName);
          if (idx > -1) {
            arr[idx].list.push(k);
          } else {
            arr.push({
              gameClassName: k.gameClassName,
              gameClassCode: k.gameClassCode,
              list: [k],
            });
          }
        }
        this.form.gameClassName = arr[0].gameClassName;
        this.form.gameClassCode = arr[0].gameClassCode;
        this.gameList = arr;
        this.onRefresh();
      });
    },
    onselect(date) {
      if (date.length == 3) {
        this.dateList = [new Date(date[2])];
        this.$refs.myCalendar.reset();
      }
    },
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.form.pageSize = 20;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.onbetRecord();
    },
    setType(k) {
      if (k.id == 10) {
        this.form.win = "";
        this.form.orderStatus = 10;
      } else {
        this.form.orderStatus = null;
        this.form.win = k.id;
      }
      this.onRefresh();
    },
    //投注记录列表
    onbetRecord() {
      if (!this.form.gameClassCode) return;
      let url = "";
      let data = {};
      if (this.form.gameClassCode == "LOTTERY") {
        url = "/lottery/betRecord";
        data = {
          startDate: this.form.startDate + " 00:00:00",
          endDate: this.form.startDate + " 23:59:59",
          lotteryId: this.form.lotteryId,
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          win: this.form.win,
          orderStatus: this.form.orderStatus,
        };
      } else {
        url = "/channel/searchGameRecord";
        data = {
          categoryCode: this.form.categoryCode || null,
          startDate: this.form.startDate + " 00:00:00",
          endDate: this.form.endDate + " 23:59:59",
          gameClassCode: this.form.gameClassCode,
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
        };
      }
      this.$ajax.post(url, data).then((res) => {
        if (res.data) {
          this.betAmountToday =
            res.data.betAmountToday || res.data.totalBetAmount;
          this.totalWinToday = res.data.totalWinToday;
          this.total = res.data.page.total;
          this.list = res.data.page.records || [];

          this.form.pageSize += 10;
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.list.length >= this.total) {
            this.finished = true;
          }
        } else {
          this.betAmountToday = 0;
          this.totalWinToday = 0;
          this.total = 0;
          this.list = [];
        }
      });
    },
    onformatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      if (date.length == 2) {
        let list = [];
        for (let index = 0; index < date.length; index++) {
          let element = date[index];
          list.push(new Date(element).getTime());
        }
        date = list.sort();
        this.form.startDate = this.onformatDate(new Date(date[0]));
        this.form.endDate = this.onformatDate(new Date(date[1]));
        this.dateList = [new Date(date[0]), new Date(date[1])];
      } else {
        this.form.startDate = this.onformatDate(date[0]);
        this.form.endDate = this.onformatDate(date[0]);
        this.dateList = [date[0]];
      }
      this.dateShow = false;
      this.onRefresh();
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
.betRecord {
  min-height: 100vh;
  background-color: #fff;
  .betRecord_top {
    position: sticky;
    top: 0;
    z-index: 1;
    .titleBar_tabs {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 140.625px;
      border-radius: 3.9166px;
      border: 1px solid #fff;
      margin: 8px auto;
      box-sizing: border-box;
      div {
        float: left;
        height: 33.2812px;
        line-height: 33.2812px;
        text-align: center;
        color: #fff;
        width: 50%;
        font-size: 15.6664px;
      }
      .on {
        color: #dc2e2e;
        background: #fff;
      }
    }
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
  .totalmsg {
    height: 38.2917px;
    text-align: center;
    font-size: 17.4071px;
    padding: 6.96285px 0;
    color: #4c4c4c;
    background-color: #efeef4;
    box-sizing: border-box;
  }
  .betRecord_body {
    padding: 10px 0;
    ._row {
      padding: 4px 0;
      color: #000;
      font-size: 15.2312px;
      box-sizing: border-box;
      border-bottom: 1px solid #584e4e29;
      margin: 0 5%;
      div {
        line-height: 27.1986px;
        display: inline-block;
        p {
          margin: 0;
          span {
            font-size: 12.185px;
            margin-left: 4.87399px;
            color: #989898;
          }
        }
        span {
          color: #989898;
        }
      }
      .fr {
        float: right;
      }
    }
  }
  .detailOpenClass {
    .main_detail {
      padding-top: 13px;
      .tzHead {
        height: 65.2708px;
        margin-bottom: 10.8795px;
        .fl {
          float: left;
        }
        .iconfont {
          font-size: 54.3973px;
          margin: 0 21.7589px 0 23.4375px;
          width: 54.3958px;
          height: 54.3958px;
        }
        span {
          font-size: 19.583px;
          display: inline;
          float: right;
          position: relative;
          right: 30px;
          top: -32.7036px;
        }
        h1 {
          font-size: 19.583px;
          line-height: 32.7036px;
          font-weight: 400;
          margin: 0;
        }
        p {
          font-size: 15.2312px;
          line-height: 30.4625px;
          color: #bbb;
          margin: 0;
        }
      }
      .table_detail {
        tr {
          height: 43.5178px;
          font-size: 17.4071px;
        }
      }
      tr:before {
        right: 0;
        left: auto;
        content: "";
        position: absolute;
        background: #d0d0d0;
        width: 360.938px;
        height: 1px;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      td:first-of-type {
        width: 113.01px;
        text-align: center;
      }
      .section_detail {
        margin-top: 21.7589px;
        .hr1px {
          margin: 3.48142px auto 0;
          height: 1px;
          background-image: -webkit-linear-gradient(
            90deg,
            #d0d0d0,
            #d0d0d0 50%,
            transparent 0
          );
        }
        header {
          height: 30px;
          line-height: 30px;
          padding: 0 17.4071px;
          font-size: 17.4071px;
        }
        li {
          padding: 0 26.1107px;
          color: #bbb;
          background-image: url("../../assets/MyCenter/dfgdfa.png");
          background-repeat: no-repeat;
          background-size: 100% 300%;
          background-position: 0 80%;
          height: auto;
          font-size: 17.4071px;
          span {
            font-size: 13.9257px;
          }
        }
        li:first-of-type {
          background-position: 0 0;
          height: 34.8125px;
          background-size: 100% auto;
        }
        li:last-of-type {
          background-position: 0 130%;
          height: 43.5104px;
          background-size: 100% 150%;
        }
      }
    }
  }
}
</style>
