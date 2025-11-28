<template>
  <div class="agentStatement">
    <div v-if="subPersonListOpen">
      <titleBar
        :title_name="`${title}${$t('agentCenter[\'列表\']')}`"
        @toLeft="subPersonListOpen = false"
        left_icon="arrow-left"
        class="titleBar"
        :right_name="actionsObj.name"
        @toRight="dateShow = true"
        right_icon="arrow-down"
      />
      <div class="list_title flex-left flex-center">
        <div>{{ $t('agentCenter[\'账号\']') }}</div>
        <div>{{ $t('agentCenter[\'昵称\']') }}</div>
        <div>{{ $t('agentCenter[\'注册时间\']') }}</div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="personList.length > 0 ? $t('agentCenter[\'已显示全部记录\']') : ''"
          loading-text=" "
          @load="onLoad"
        >
          <div class="contents" v-if="personList.length > 0">
            <div
              class="list_row flex-left flex-center"
              v-for="(k, i) in personList"
              :key="i"
            >
              <div>{{ k.userNo }}</div>
              <div>{{ k.nickName || '-' }}</div>
              <div v-if="k.registerDate">
                {{ k.registerDate.slice(5, k.registerDate.length) }}
              </div>
              <div v-else>-</div>
            </div>
          </div>
          <empty v-else-if="!loading" />
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-else-if="subPersonCategoryOpen">
      <titleBar
        :title_name="$t('agentCenter[\'分类报表\']')"
        @toLeft="subPersonCategoryOpen = false"
        left_icon="arrow-left"
        class="titleBar"
        :right_name="actionsObj.name"
        @toRight="dateShow = true"
        right_icon="arrow-down"
      />
      <div class="agentStatementTop">
        <van-row type="flex" align="center" class="info" justify="center">
          <van-cell-group>
            <van-field v-model="userNo" :placeholder="$t('agentCenter[\'下级报表查询\']')" />
          </van-cell-group>
          <div class="info_but" @click="chushihua()">
            <van-icon name="arrow" />
          </div>
        </van-row>
      </div>
      <div class="agentStatementBody">
        <!-- 彩票详情报表 -->
        <div
          class="agentStatementBody_box"
          v-for="(k, j) in subPersonCategoryList"
          :key="j"
        >
          <div class="title">
            <div>{{ k.lotteryName }}</div>
          </div>
          <div class="box" @click="toPath(k)">
            <div>
              <span>{{ k.betAmount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'投注金额\']') }}</div>
          </div>
          <div class="box">
            <div>{{ k.winAmount || 0 }}</div>
            <div>{{ $t('agentCenter[\'实际盈亏\']') }}</div>
          </div>
          <div class="box">
            <div>
              {{ k.selfReturnAmount || 0 }}/{{ k.teamReturnAmount || 0 }}
            </div>
            <div>{{ $t('agentCenter[\'本级/团队返点\']') }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 代理报表首页 -->
    <div v-else>
      <titleBar
        :title_name="$t('agentCenter[\'代理报表\']')"
        @toLeft="to"
        left_icon="arrow-left"
        class="titleBar"
        :right_name="actionsObj.name"
        @toRight="dateShow = true"
        right_icon="arrow-down"
      />
      <div class="agentStatementTop">
        <van-row type="flex" align="center" class="info" justify="center">
          <van-cell-group>
            <van-field v-model="userNo" :placeholder="$t('agentCenter[\'下级报表查询\']')" />
          </van-cell-group>
          <div class="info_but" @click="chushihua()">
            <van-icon name="arrow" />
          </div>
        </van-row>
      </div>
      <div class="agentStatementBody">
        <div class="agentStatementBody_box">
          <!-- <div class="title"><div>彩票</div></div> -->
          <div></div>
          <div class="box" @click="toAgentBetRecord()">
            <div>
              <span>{{ data.lotteryBetAmount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'投注金额\']') }}</div>
          </div>
          <div class="box">
            <div>
              <!-- {{ data.teamProfile || 0 }} -->
              {{ ((agentReportLotteryData.profileThird || 0)+(dataObj[10002].profileThird || 0)+(dataObj[10039].profileThird || 0)).toFixed(2)/1 }}
            </div>
            <div>{{ $t('agentCenter[\'团队盈利\']') }}</div>
          </div>
          <div class="box">
            <div>
              {{ data.selfReturnAmount || 0 }}/{{ data.teamReturnAmount || 0 }}
            </div>
            <div>{{ $t('agentCenter[\'本级/团队返点\']') }}</div>
          </div>
          <div class="box">
            <div>{{ 0 }}</div>
            <div>{{ $t('agentCenter[\'活动礼金\']') }}</div>
          </div>
          <!-- <div class="box">
            <div>{{ data.sendAmount || 0 }}</div>
            <div>中奖金额</div>
          </div> -->
          <div class="box">
            <div>{{ data.cashinAmount || 0 }}</div>
            <div>{{ $t('agentCenter[\'充值金额\']') }}</div>
          </div>
          <div class="box">
            <div>{{ data.cashoutAmount || 0 }}</div>
            <div>{{ $t('agentCenter[\'提现金额\']') }}</div>
          </div>
          <div class="box" @click="subPersonList(1)">
            <div>
              <span>{{ data.lotteryBetCount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'投注人数\']') }}</div>
          </div>
          <div class="box" @click="subPersonList(2)">
            <div>
              <span>{{ data.firstCashinCount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'首充人数\']') }}</div>
          </div>
          <div class="box" @click="subPersonList(3)">
            <div>
              <span>{{ data.registerCount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'注册人数\']') }}</div>
          </div>
          <div class="box">
            <div>{{ data.teamCount || 0 }}</div>
            <div>{{ $t('agentCenter[\'下级人数\']') }}</div>
          </div>
          <div class="box">
            <div>{{ data.selfMoney || 0 }}</div>
            <div>{{ $t('agentCenter[\'本级余额\']') }}</div>
          </div>
          <div class="box">
            <div>{{ data.teamMoney || 0 }}</div>
            <div>{{ $t('agentCenter[\'团队余额\']') }}</div>
          </div>

          <!--        总代才显示-->
          <!-- <div class="box" v-if="data.isOrNotShow == 0">
            <div>{{ data.divideRate || 0 }}%</div>
            <div>盈亏占成比例</div>
          </div>
          <div class="box" v-if="data.isOrNotShow == 0">
            <div>{{ data.percentageAmount || 0 }}</div>
            <div>分成总额</div>
          </div> -->
        </div>
        <div class="agentStatementBody_box">
          <div class="title"><div>{{ $t('agentCenter[\'彩票\']') }}</div></div>
          <div class="box" @click="getsubPersonCategoryList()">
            <div>
              <span>{{ agentReportLotteryData.betAmount || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'投注金额\']') }}</div>
          </div>
          <div class="box" @click="getsubPersonCategoryList()">
            <div>
              <span>{{ agentReportLotteryData.profileThird || 0 }}</span>
            </div>
            <div>{{ $t('agentCenter[\'实际盈亏\']') }}</div>
          </div>
          <div class="box" @click="getsubPersonCategoryList()">
            <div>
              <span
                >{{ agentReportLotteryData.selfReturnAmount || 0 }}/{{
                  agentReportLotteryData.teamReturnAmount || 0
                }}</span
              >
            </div>
            <div>{{ $t('agentCenter[\'本级/团队返点\']') }}</div>
          </div>
        </div>
        <!-- 三方平台 -->
        <div
          class="agentStatementBody_box"
          v-for="(k, j) in thirdGameIdList"
          :key="j"
        >
          <div class="title">
            <div>{{ k.name }}</div>
          </div>
          <div class="box">
            <div>{{ dataObj[k.thirdGameId].betAmount || 0 }}</div>
            <div>{{ $t('agentCenter[\'投注金额\']') }}</div>
          </div>
          <div class="box">
            <div>{{ dataObj[k.thirdGameId].profileThird || 0 }}</div>
            <div>{{ $t('agentCenter[\'实际盈亏\']') }}</div>
          </div>
          <div class="box">
            <div>
              {{ dataObj[k.thirdGameId].selfReturnAmount || 0 }}/{{
                dataObj[k.thirdGameId].teamReturnAmount || 0
              }}
            </div>
            <div>{{ $t('agentCenter[\'本级/团队返点\']') }}</div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet
      :round="false"
      v-model="dateShow"
      :actions="actions"
      :cancel-text="$t('agentCenter[\'取消\']')"
      close-on-click-action
      @select="handleClick"
    />
  </div>
</template>
<script>
import timeUtil from "../../../util/timeUtil2";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      subPersonCategoryOpen: false,
      subPersonCategoryList: [],

      loading: false,
      finished: false,
      refreshing: false,

      total: 0,
      pageNo: 0,
      type: null,
      personList: [],
      subPersonListOpen: false,
      title: "",
      timeUtil: timeUtil,
      thirdGameIdList: [
        { thirdGameId: "10002", name: "AG平台" },
        { thirdGameId: "10039", name: "VG平台" },
        // { thirdGameId: "10022", name: "开心电竞" },
      ],
      dataObj: {
        10002: {},
        10039: {},
      },
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      userNo: "",
      dateShow: false,
      agentReportLotteryData: {},
      data: {
        agentReturnAmount: 0,
        cashinAmount: 0,
        cashoutAmount: 0,
        firstCashinCount: 0,
        lotteryBetAmount: 0,
        lotteryBetCount: 0,
        registerCount: 0,
        teamCount: 0,
        teamMoney: 0,
        teamProfile: 0,
        teamReturn: 0,
        winAmount: 0,
      },
      money: 9999.99,
      actions: [],
      actionsObj: {
        name: "",
        type: 1,
      },
    };
  },
  watch: {
    agentData: {
      handler: function (n, o) {
        if (this.actionsObj.type == 1) {
          this.data = n || {};
        }
      },
      deep: true,
    },
    agentLotteryData: {
      handler: function (n, o) {
        if (this.actionsObj.type == 1) {
          this.agentReportLotteryData = n || {};
        }
      },
      deep: true,
    },
    agentDataObj: {
      handler: function (n, o) {
        if (this.actionsObj.type == 1) {
          this.dataObj = n;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["userInfo", "agentData", "agentLotteryData", "agentDataObj"]),
    routeData() {
      return this.$route.query.data ? JSON.parse(this.$route.query.data) : null;
    },
  },
  created() {
    // 初始化 actions
    this.actions = [
      { name: this.$t("agentCenter['今天']"), type: 1 },
      { name: this.$t("agentCenter['昨天']"), type: 2 },
      { name: this.$t("agentCenter['前天']"), type: 3 },
      { name: this.$t("agentCenter['本周']"), type: 4 },
      { name: this.$t("agentCenter['上周']"), type: 5 },
      { name: this.$t("agentCenter['本月']"), type: 6 },
      { name: this.$t("agentCenter['上月']"), type: 7 },
    ];
    this.actionsObj.name = this.$t("agentCenter['今天']");
    
    if (this.routeData) {
      this.userNo = this.routeData.userNo;
      if (this.$route.query.actionsObj) {
        this.handleClick(JSON.parse(this.$route.query.actionsObj));
      } else {
        this.handleClick(this.actionsObj);
      }
    } else {
      this.handleClick(this.actionsObj, 'true');
    }
  },
  methods: {
    onRefresh() {
      // 清空列表数据
      this.personList = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.pageNo = 0;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.personList = [];
        this.refreshing = false;
      }
      this.pageNo += 1;
      this.subPersonList();
    },
    subPersonList(type) {
      if (type) {
        this.type = type;
        this.onRefresh();
        this.subPersonListOpen = true;
        return;
      }
      
      let url = "";
      if (this.type === 1) {
        //投注人数
        url = "/report/subPersonBetList";
        this.title = this.$t("agentCenter['投注人数']");
      } else if (this.type === 2) {
        //首充人数
        url = "/report/subPersonFirstChangeList";
        this.title = this.$t("agentCenter['首充人数']");
      } else if (this.type === 3) {
        //注册人数
        url = "/report/subPersonRegisterList";
        this.title = this.$t("agentCenter['注册人数']");
      }
      this.$ajax
        .post(
          `${url}?dateType=${this.actionsObj.type}&pageNo=${this.pageNo}&pageSize=40&userNo=${this.userNo || this.userInfo.userNo}`
        )
        .then((res) => {
          if (res.data) {
            this.personList = [...this.personList, ...res.data.records || []];
            this.total = res.data.total;

            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.personList.length >= this.total) {
              this.finished = true;
            }
          }
        });
    },
    getsubPersonCategoryList() {
      this.subPersonCategoryOpen = true;
      this.$ajax
        .post(
          `/report/subPersonCategoryList?&dateType=${this.actionsObj.type}&userNo=${
            this.userNo || this.userInfo.userNo
          }`
        )
        .then((res) => {
          if (res.data) {
            this.subPersonCategoryList = res.data;
          }
        });
    },
    handleClick(item, firstOpen) {
      this.actionsObj = item;
      this.chushihua(firstOpen);
    },
    chushihua(firstOpen) {
      if (this.subPersonListOpen) {
        this.subPersonList();
      } else if (this.subPersonCategoryOpen) {
        this.getsubPersonCategoryList();
      } else {
        // firstOpen 首次进入页面(从代理中心进入)
        if (firstOpen == 'true') {
          this.data = this.agentData || {};
          this.agentReportLotteryData = this.agentLotteryData || {};
          this.dataObj = this.agentDataObj;
        }
      }
      this.getAgentReport();
    },
    // 总数据
    getAgentReport() {
      this.$ajax
        .post(
          `/report/agentReport?dateType=${this.actionsObj.type}&userNo=${this.userNo}`
        )
        .then((res) => {
          if (res.data) {
            this.data = res.data;
            res.data.reportItems.map((k) => {
              if (k.phaltformId == 0) {
                this.agentReportLotteryData = k;
              } else if (this.dataObj[k.phaltformId]) {
                this.dataObj[k.phaltformId] = k;
              }
            });
          }
        });
    },
    toPath(row) {
      this.$router.push({
        path: "agentBetRecord",
        query: {
          userNo: this.userNo,
          lotteryId: row.lotteryId,
          redirect: this.$route.path,
        },
      });
    },
    toAgentBetRecord() {
      this.$router.push({
        path: "agentBetRecord",
        query: {
          redirect: this.$route.path,
        },
      });
    },
    to() {
      this.$router.push({ path: "agentPage" });
    },
  },
};
</script>

<style lang="scss">
.agentStatement {
  // min-height: 100vh;
  .titleBar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .list_title {
    height: 45.25px;
    font-size: 17.4071px;
    color: #000;
    background-color: #f3f3f3;
    box-sizing: border-box;
    border-bottom: 1px solid #d0d0d0;
    div {
      width: calc(100% / 3);
      text-align: center;
    }
  }
  .contents {
    padding-top: 10px;
    .list_row {
      height: 45.6875px;
      font-size: 15.2312px;
      box-sizing: border-box;
      border-bottom: 1px solid #d0d0d0;
      div {
        width: calc(100% / 3);
        text-align: center;
        &:first-child {
          color: rgb(51, 136, 255);
        }
      }
    }
  }
  .agentStatementTop {
    background-color: #efeef4;
    padding: 13px;
    .money {
      text-align: center;
      font-size: 30px;
      line-height: 50px;
      font-weight: bold;
    }
    .info {
      background-color: #fff;
      border-radius: 4.35px;
      .van-cell-group {
        border-radius: 4.35px;
        width: calc(100% - 24.36px - 4.5px);
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
  .agentStatementBody {
    background-color: #fff;
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
        background-color: #fff;
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
