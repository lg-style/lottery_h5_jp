<template>
  <div class="statement">
    <titleBar
      :title_name="$t('myCenter[\'个人报表\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
      :right_name="actionsObj.name"
      @toRight="dateShow = true"
      right_icon="arrow-down"
    />
    <div class="agentStatementTop">
      <div class="agentStatementTop_min1">
        <van-row type="flex" justify="end" class="agentStatementTop_title">
          <van-col span="6"></van-col>
          <van-col span="12" class="text">{{ $t("myCenter['盈利总额']") }}</van-col>
          <van-col span="6" class="time"></van-col>
        </van-row>
        <div class="money">
          {{
            (
              (data.vgWinAmount +
              data.agWinAmount +
              data.lotteryWinAmount) || 0
            ).toFixed(2)
          }}
        </div>
      </div>
      <div class="agentStatementTop_min2">
        <van-row type="flex" align="center">
          <van-icon name="warning-o" />
          <div class="text">{{ $t("myCenter['公式']") }}</div>
        </van-row>
      </div>
    </div>
    <div class="agentStatementBody">
      <div>
        <!-- 总计 -->
        <div class="agentStatementBody_box">
          <div class="box" @click="toBetRecord()">
            <div><span>{{ data.betAmount || 0 }}</span></div>
            <div>{{ $t("myCenter['投注金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.sendAmount || 0 }}</div>
            <div>{{ $t("myCenter['彩票中奖金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ 0 }}</div>
            <div>{{ $t("myCenter['活动礼金']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.returnAmount || 0 }}</div>
            <div>{{ $t("myCenter['返点金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.cashinAmount || 0 }}</div>
            <div>{{ $t("myCenter['充值金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.cashoutAmount || 0 }}</div>
            <div>{{ $t("myCenter['提现金额']") }}</div>
          </div>
        </div>
        <!-- 彩票 -->
        <div class="agentStatementBody_box">
          <div class="title"><div>{{ $t("myCenter['彩票']") }}</div></div>
          <div class="box">
            <div>{{ data.lotteryBet || 0 }}</div>
            <div>{{ $t("myCenter['投注金额']") }}</div>
          </div>
          <div class="box">
            <div>
              {{ data.lotteryWinAmount || 0 }}
            </div>
            <div>{{ $t("myCenter['实际盈亏']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.lotteryReturnAmount || 0 }}</div>
            <div>{{ $t("myCenter['返点金额']") }}</div>
          </div>
        </div>
        <!-- 三方平台 -->
        <div
          class="agentStatementBody_box"
        >
          <div class="title"><div>{{ $t("myCenter['AG平台']") }}</div></div>
          <div class="box">
            <div>{{ data.agBet || 0 }}</div>
            <div>{{ $t("myCenter['投注金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.agWinAmount || 0 }}</div>
            <div>{{ $t("myCenter['实际盈亏']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.agReturnAmount || 0 }}</div>
            <div>{{ $t("myCenter['返点金额']") }}</div>
          </div>
        </div>
        <div
          class="agentStatementBody_box"
        >
          <div class="title"><div>{{ $t("myCenter['VG平台']") }}</div></div>
          <div class="box">
            <div>{{ data.vgBet || 0 }}</div>
            <div>{{ $t("myCenter['投注金额']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.vgWinAmount || 0 }}</div>
            <div>{{ $t("myCenter['实际盈亏']") }}</div>
          </div>
          <div class="box">
            <div>{{ data.vgReturnAmount || 0 }}</div>
            <div>{{ $t("myCenter['返点金额']") }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet
      :round="false"
      v-model="dateShow"
      :actions="actions"
      :cancel-text="$t('myCenter[\'取消\']')"
      close-on-click-action
      @select="handleClick"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import timeUtil from "../../util/timeUtil2";
export default {
  data() {
    return {
      timeUtil: timeUtil,
      dateShow: false,
      data: {},
      show: false,
      actions: [],
      actionsObj: {
        name: "",
        type: 1,
      },
    };
  },
  watch: {
    personData: {
      handler: function (n, o) {
        if(this.actionsObj.type == 1){
          this.data = n || [];
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["personData"]),
  },
  created() {
    // 预加载数据
    this.data = this.personData || {};
    // 初始化 actions 数组的多语言
    this.actions = [
      { name: this.$t("myCenter['今天']"), type: 1 },
      { name: this.$t("myCenter['昨天']"), type: 2 },
      { name: this.$t("myCenter['前天']"), type: 3 },
      { name: this.$t("myCenter['本周']"), type: 4 },
      { name: this.$t("myCenter['上周']"), type: 5 },
      { name: this.$t("myCenter['本月']"), type: 6 },
      { name: this.$t("myCenter['上月']"), type: 7 },
    ];
    this.actionsObj = {
      name: this.$t("myCenter['今天']"),
      type: 1,
    };
    this.handleClick(this.actionsObj)
  },
  methods: {
    handleClick(item) {
      this.actionsObj = item;
      this.getAgentReport();
    },
    // 总数据
    getAgentReport() {
      this.$ajax
        .post(
          `/report/personReport?dateType=${this.actionsObj.type}`
        )
        .then((res) => {
          if (res.data) {
            this.data = res.data;
          }
        })
    },
    to() {
      this.$router.push({
        path: 'MyCenter',
        query: {
          redirect: this.$route.path,
        },
      });
    },
    toBetRecord() {
      this.$router.push({
        path: 'betRecord',
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.statement {
  background-color: #efeef4;
  min-height: 100vh;
  .titleBar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .agentStatementTop {
    background-color: #efeef4 !important;
    padding: 0 !important;
    .agentStatementTop_min1{
      background: -webkit-linear-gradient(top,#6a202d,#3b052c);
      color: #fced08;
      font-size: 15.23px;
      text-align: center;
      height: 81px;
      padding: 7.6px 0;
      .agentStatementTop_title{
        .text{
          
        }
      }
    }
    .agentStatementTop_min2{
      background: #440a2c;
      color: #fae2e2;
      font-size: 14px;
      padding: 9.13874px;
      padding-right: 0;
    }
    .money {
      text-align: center;
      font-size: 30px;
      line-height: 61px;
      font-weight: bold;
    }
  }
  .agentStatementBody {
    .agentStatementBody_box {
      font-size: 0;
      .title {
        color: red;
        font-size: 16.4px;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        background-color: rgba(195, 197, 194, 0.33);
        height: 50px;
        line-height: 50px;
        padding: 10px 0;
        div {
          box-sizing: border-box;
          width: calc(100% / 3);
          text-align: center;
        }
      }
      .box {
        padding: 5px;
        height: 50px;
        display: inline-block;
        box-sizing: border-box;
        width: calc(100% / 3);
        text-align: center;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        span {
          text-decoration: underline;
        }
        div:first-child {
          color: #ff6818;
        }
        div:last-child {
          color: #000;
        }
        div {
          font-size: 16.4px;
        }
      }
      .box:nth-child(3n + 1) {
        border-right: none;
      }
    }
  }
}
</style>
