<template>
  <div class="subordinateStatement">
    <titleBar
      :title_name="$t('agentCenter[\'下级报表\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
      :right_name="actionsObj.name"
      @toRight="dateShow = true"
      right_icon="arrow-down"
    />
    <div class="subordinateStatement_body">
      <div class="subordinateStatement_body_box">
        <van-row type="flex" align="center" class="row_box row_box1">
          <van-col span="6"> {{ $t('agentCenter[\'账号\']') }} </van-col>
          <van-col span="6"> {{ $t('agentCenter[\'投注金额\']') }} </van-col>
          <van-col span="7"> {{ $t('agentCenter[\'下级人数\']') }} </van-col>
          <van-col span="5"> {{ $t('agentCenter[\'盈利\']') }} </van-col>
        </van-row>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="listData.length > 0 ? $t('agentCenter[\'已显示全部数据\']') : ''"
            loading-text=" "
            @load="onLoad"
          >
            <div v-if="listData.length > 0">
              <van-row
                type="flex"
                align="center"
                class="row_box"
                v-for="(k, i) in listData"
                :key="i"
                @click="onShow(k)"
              >
                <van-col span="6">
                  <span style="color: rgb(51, 136, 255)">{{ k.userNo }}</span>
                </van-col>
                <van-col span="6">
                  <div>{{ k.lotteryBetAmount }}</div>
                </van-col>
                <van-col span="7">
                  <span>{{ k.teamCount || 0 }}</span>
                </van-col>
                <van-col span="5">
                  <div v-if="k.profile > 0" style="color: red">
                    {{ k.profile }}
                  </div>
                  <div v-else>{{ k.profile }}</div>
                </van-col>
              </van-row>
            </div>
            <empty v-else-if="!loading" />
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- <div class="loadingMsg">已显示全部数据</div> -->
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      :cancel-text="$t('agentCenter[\'取消\']')"
      close-on-click-action
      @select="onSelect"
      :round="false"
    />
    <van-action-sheet
      v-model="dateShow"
      :actions="actions2"
      :cancel-text="$t('agentCenter[\'取消\']')"
      close-on-click-action
      @select="handleClick"
      :round="false"
    />
  </div>
</template>
<script>
import timeUtil from "../../../util/timeUtil2";
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      timeUtil: timeUtil,
      show: false,
      actions2: [],
      actionsObj: {
        name: "",
        type: 1,
      },
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      dateShow: false,
      dateList: [],
      startTime: "",
      endTime: "",
      queryParams: {
        pageNo: 0,
        pageSize: 40,
      },
      total: 0,
      list: [],
      userNoData: [],
      form: {},
    };
  },
  watch: {
    subLevelReportTotal: {
      handler: function (n, o) {
        if(this.actionsObj.type == 1 && n && n>this.total){
          this.total = n || 0;
          this.list = this.subLevelReportList || [];
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["subLevelReportTotal", "subLevelReportList"]),
    listData() {
      return this.list.filter((k) => {
        return k.lotteryBetAmount;
      });
    },
    actions() {
      let list = [
        { name: this.$t("agentCenter['查看投注记录']") },
        { name: this.$t("agentCenter['查看报表']") }
      ];
      if (this.form.teamCount > 0) {
        list.push({ name: this.$t("agentCenter['查看下级']") });
      }
      if (this.userNoData.length > 0) {
        list.push({ name: this.$t("agentCenter['返回上级']") });
      }
      return list;
    },
  },
  created() {
    // 初始化 actions2
    this.actions2 = [
      { name: this.$t("agentCenter['今天']"), type: 1 },
      { name: this.$t("agentCenter['昨天']"), type: 2 },
      { name: this.$t("agentCenter['前天']"), type: 3 },
      { name: this.$t("agentCenter['本周']"), type: 4 },
      { name: this.$t("agentCenter['上周']"), type: 5 },
      { name: this.$t("agentCenter['本月']"), type: 6 },
      { name: this.$t("agentCenter['上月']"), type: 7 },
    ];
    this.actionsObj.name = this.$t("agentCenter['今天']");
    
    // 预加载数据
    this.list = this.subLevelReportList || [];
    this.total = this.subLevelReportTotal || 0;
    if(this.total>0&&this.total<=40){
      this.loading = false;
      this.finished = true;
    }
    // 时间
    let dateList = this.timeUtil.today();
    this.startTime = dateList[0];
    this.endTime = dateList[1];
  },
  methods: {
    handleClick(item) {
      this.actionsObj = item;
      let type = item.type;
      let dateList = [];
      if (type === 1) {
        dateList = this.timeUtil.today();
      } else if (type === 2) {
        dateList = this.timeUtil.yesterday();
      } else if (type === 3) {
        dateList = this.timeUtil.getThisWeek();
      } else if (type === 4) {
        dateList = this.timeUtil.getThisWeek2();
      } else if (type === 5) {
        dateList = this.timeUtil.getMonth(0);
      } else if (type === 6) {
        dateList = this.timeUtil.getMonth(-1);
      }
      this.startTime = dateList[0];
      this.endTime = dateList[1];
      this.oninitialize();
    },
    onShow(row) {
      this.form = Object.assign({}, row);
      this.show = true;
    },
    onSelect(Action) {
      if (Action.name == this.$t("agentCenter['查看投注记录']")) {
        this.$router.push({
          path: "/agentBetRecord",
          query: {
            redirect: this.$route.path,
            userNo: this.form.userNo,
            data: JSON.stringify(this.form),
            dateList: JSON.stringify([this.startTime, this.endTime]),
          },
        });
      } else if (Action.name == this.$t("agentCenter['查看报表']")) {
        this.$router.push({
          path: "/agentStatement",
          query: {
            redirect: this.$route.path,
            data: JSON.stringify(this.form),
            actionsObj: JSON.stringify(this.actionsObj),
          },
        });
      } else if (Action.name == this.$t("agentCenter['查看下级']")) {
        this.onSearch(this.form);
      } else if (Action.name == this.$t("agentCenter['返回上级']")) {
        this.onFanhuiBut();
      }
    },
    onFanhuiBut() {
      this.userNoData.pop();
      this.oninitialize();
    },
    onSearch(k) {
      this.userNoData.push(k.userNo);
      this.oninitialize();
    },
    to() {
      this.$router.push({ path: "agentPage" });
    },
    oninitialize() {
      this.queryParams.pageNo = 1;
      this.onRefresh();
    },
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.queryParams.pageNo = 0;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.queryParams.pageNo += 1;
      this.getList();
    },
    getList() {
      this.$ajax
        .post(
          `/report/subLevelReport?dateType=${this.actionsObj.type}&userNo=${
            this.userNoData[this.userNoData.length - 1] || ""
          }&pageNo=${this.queryParams.pageNo}&pageSize=${
            this.queryParams.pageSize
          }`
        )
        .then((res) => {
          if (res.data) {
            // 测试数据
            // for (let index = 0; index < 50; index++) {
            //   res.data.records.push({userNo:'dsfds', lotteryBetAmount:100, teamCount:9, profile:200});
            // }
            // res.data.tota = 50;
            this.total = res.data.total;
            if(this.queryParams.pageNo == 1){
              this.list = res.data.records || [];
            }else{
              this.list = [...this.list, ...res.data.records || []];
            }
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
  },
};
</script>

<style lang="scss">
.subordinateStatement {
  // min-height: 100vh;
  position: relative;
  background-color: #fff;
  .titleBar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .fanhuiBut {
    position: absolute;
    left: 40px;
    top: 0;
    font-size: 13.5px;
    z-index: 2;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
  .subordinateStatement_body {
    .subordinateStatement_body_box {
      background-color: #fff;
      font-size: 16.4px;
      border: 1px solid #ddd;
      border-bottom: none;
      text-align: center;
      .van-pull-refresh {
        height: calc(100vh - 150px);
        overflow: auto;
      }
      .row_box {
        border-bottom: 1px solid #ddd;
        padding: 5px 0;
        box-sizing: border-box;
        height: 45.25px;
        font-size: 15.2312px;
      }
      .row_box1 {
        height: 45.25px;
        color: #666;
        background: #f3f3f3;
        font-size: 17.4px;
      }
    }
  }
  .van-list__finished-text {
    height: 45.6937px;
    line-height: 45.6937px;
    font-size: 15.2312px;
    color: #333;
    border-bottom: 1px solid #d0d0d0;
    text-align: center;
  }
}
</style>
