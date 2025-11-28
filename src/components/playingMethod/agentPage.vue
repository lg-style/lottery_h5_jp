<template>
  <div class="agentPage">
    <titleBar title_name="代理中心" @toLeft="to" left_icon="arrow-left" />

    <div class="myBottom">
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('agentExplain')"
      >
        <!-- <img src="../../assets/MyCenter/bz.png"/> -->
        <div class="text">代理说明</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('agentStatement')"
      >
        <!-- <img src="../../assets/MyCenter/jryk.png"/> -->
        <div class="text">代理报表</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('subordinateStatement')"
      >
        <!-- <img src="../../assets/MyCenter/rw.png"/> -->
        <div class="text">下级报表</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('createInvitationCode')"
      >
        <div class="text">生成邀请码</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('InvitationCodeManage')"
      >
        <div class="text">邀请码管理</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('kaihu')"
      >
        <div class="text">立即开户</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('MemberManage')"
      >
        <div class="text">会员管理</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('agentBetRecord')"
      >
        <div class="text">投注明细</div>
        <van-icon name="arrow" />
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPath('agentTradingRecord')"
      >
        <div class="text">交易明细</div>
        <van-icon name="arrow" />
      </van-row>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import timeUtil from "../../util/timeUtil2";
export default {
  data() {
    return {
      timeUtil: timeUtil,
      start: "",
      end: "",
    };
  },
  created() {
    // 预加载代理报表
    let dateList = this.timeUtil.today();
    this.start = dateList[0];
    this.end = dateList[1];
    this.chushihua();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    // 预加载代理报表
    chushihua() {
      // this.getAgentReport();
      // this.getSubLevelReport();
      this.getMemberList();
      this.getInviteCodeList();
    },
    // 总数据
    getAgentReport() {
      this.$store.state.agentData = null;
      this.$ajax
        .post(
          `/report/agentReport?dateType=1&userNo=`
        )
        .then((res) => {
          if (res.data) {
            this.$store.state.agentData = res.data;
            res.data.reportItems.map((k) => {
              if (k.phaltformId == 0) {
                this.$store.state.agentLotteryData = k;
              } else if (this.$store.state.agentDataObj[k.phaltformId]) {
                this.$store.state.agentDataObj[k.phaltformId] = k;
              }
            });
          }
        });
    },
    // 下级报表
    getSubLevelReport() {
      this.$store.state.subLevelReportTotal = 0;
      this.$store.state.subLevelReportList = null;
      this.$ajax
        .post(
          `/report/subLevelReport?dateType=1&userNo=&pageNo=1&pageSize=40`
        )
        .then((res) => {
          if (res.data) {
            this.$store.state.subLevelReportTotal = res.data.total || 0;
            this.$store.state.subLevelReportList = res.data.records || null;
          }
        });
    },
    // 会员管理
    getMemberList() {
      this.$store.state.memberTotal = 0;
      this.$store.state.memberList = null;
      this.$ajax
        .post(`/agent/member/list`, {
          userType: -1,
          pageNo: 1,
          pageSize: 40,
          userNo: "",
          agentId: 0,
        })
        .then((res) => {
          if (res.data) {
            this.$store.state.memberTotal = res.data.total || 0;
            this.$store.state.memberList = res.data.records || null;
          }
        })
    },
    // 邀请码管理
    getInviteCodeList() {
      this.$store.state.inviteCodeList = null;
      this.$store.state.inviteCodeTotal = 0;
      this.$ajax
        .post(`/agent/inviteCode/list`, {
          "inviteCode": 0,
          "pageNo": 1,
          "pageSize": 40,
          "userNo": "",
          "userType": 1
        })
        .then((res) => {
          if (res.data) {
            this.$store.state.inviteCodeList = res.data.records || null;
            this.$store.state.inviteCodeTotal = res.data.total || 0;
          }
        })
    },
    to() {
      this.$router.push({
        path: "/MyCenter",
        query: {
          redirect: this.$route.path,
        },
      });
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.agentPage {
  .myBottom {
    margin-top: 13px;
    padding: 0 15px;
    background-color: #fff;
    border-top: 1px solid #d0d0d0;
    border-bottom: 1px solid #d0d0d0;
    .box {
      border-bottom: 1px solid #d0d0d0;
      box-sizing: border-box;
      height: 52px;
      &:last-child {
        border: none;
      }
      img {
        height: 30px;
        margin: 6px 0;
      }
      .text {
        width: 80%;
        font-size: 17.4px;
        color: #333;
      }
      .van-icon-arrow {
        font-size: 17.4px;
        color: #ccc;
      }
    }
  }
}
</style>
