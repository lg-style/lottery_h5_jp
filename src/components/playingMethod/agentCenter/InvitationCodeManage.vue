<template>
  <div class="InvitationCodeManage">
    <div class="titleBar_top">
      <titleBar @toLeft="to" left_icon="arrow-left" class="titleBar" />
        <div class="titleBar_tabs">
          <div @click="toPath('createInvitationCode')">{{ $t('agentCenter[\'生成邀请码\']') }}</div>
          <div class="on" @click="toPath('InvitationCodeManage')">{{ $t('agentCenter[\'邀请码列表\']') }}</div>
        </div>
    </div>
    <div style="background-color: #efeef4; padding: 0.40613rem 0">
      <van-row type="flex" align="center" class="info">
        <div>{{ $t('agentCenter[\'开户类型\']') }}</div>
        <van-radio-group
          v-model="form.userType"
          direction="horizontal"
          @change="onRefresh"
        >
          <!-- <van-radio :name="-1" checked-color="#dc3b40">全部</van-radio> -->
          <van-radio :name="1" checked-color="#fff">{{ $t('agentCenter[\'代理类型\']') }}</van-radio>
          <van-radio :name="0" checked-color="#fff">{{ $t('agentCenter[\'玩家类型\']') }}</van-radio>
        </van-radio-group>
      </van-row>
    </div>
    <div class="InvitationCodeManage_body">
      <div class="InvitationCodeManage_body_box">
        <div>
          <van-row type="flex" align="center" class="row_box row_box1">
            <van-col span="7"> {{ $t('agentCenter[\'邀请码\']') }} </van-col>
            <van-col span="10"> {{ $t('agentCenter[\'生成时间\']') }} </van-col>
            <van-col span="7"> {{ $t('agentCenter[\'状态\']') }} </van-col>
          </van-row>
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="list.length > 0 ? $t('agentCenter[\'已显示全部数据\']') : ''"
              loading-text=" "
              @load="onLoad"
            >
              <div v-if="list.length > 0">
                <van-row
                  type="flex"
                  align="center"
                  class="row_box"
                  v-for="(k, i) in list"
                  :key="i"
                >
                  <van-col span="7" @click="onShow(k)">
                    <span style="color: rgb(51, 136, 255)">{{ k.id }}</span>
                  </van-col>
                  <van-col span="10">
                    <span>{{ k.createTime }}</span>
                  </van-col>
                  <van-col span="7">
                    <span>{{ $t('agentCenter[\'注册\']') }}({{ k.spreadCount }})</span>
                  </van-col>
                </van-row>
              </div>
              <empty v-else-if="!loading" />
            </van-list>
          </van-pull-refresh>
          
          <!-- <div class="loadingMsg">已显示全部内容</div> -->
        </div>
      </div>
    </div>

    <!--    注册会员列表-->
    <van-popup
      v-model="open"
      :overlay="true"
      position="right"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <titleBar
        :title_name="$t('agentCenter[\'注册会员列表\']')"
        @toLeft="open = false"
        left_icon="arrow-left"
      />
      <div class="InvitationCodeManage_body">
        <div class="InvitationCodeManage_body_box">
          <van-row type="flex" align="center" class="row_box row_box1">
            <van-col span="7"> {{ $t('agentCenter[\'会员账号\']') }} </van-col>
            <van-col span="10"> {{ $t('agentCenter[\'注册时间\']') }} </van-col>
            <van-col span="7"> {{ $t('agentCenter[\'可用余额\']') }} </van-col>
          </van-row>
          <empty v-if="memberList.length == 0" />
          <div v-else>
            <van-row
              type="flex"
              align="center"
              class="row_box"
              v-for="(k, i) in memberList"
              :key="i"
            >
              <van-col span="7" @click="onInfoshow(k)">
                <b style="color: #4f82f4">{{ k.userNo }}</b>
              </van-col>
              <van-col span="10">
                <div>{{ k.registerDate }}</div>
              </van-col>
              <van-col span="7">
                <b>{{ k.accountMoney }}</b>
              </van-col>
            </van-row>
          </div>
          <van-pagination
            @change="onOpen(openObj)"
            v-if="total > 0"
            v-model="openForm.pageNo"
            :total-items="total"
            :items-per-page="openForm.pageSize"
            :show-page-size="3"
            force-ellipses
          />
        </div>
      </div>
    </van-popup>

    <van-dialog v-model="infoshow" :title="$t('agentCenter[\'会员信息\']')" :show-cancel-button="false">
      <div class="infoshow">
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'会员账号\']') }}</div>
          <div>{{ InfoData.userNo }}</div>
        </van-row>
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'账号类型\']') }}</div>
          <div>{{ InfoData.userType ? $t('agentCenter[\'代理\']') : $t('agentCenter[\'会员\']') }}</div>
        </van-row>
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'VIP等级\']') }}</div>
          <div>{{ InfoData.vipLevel }}</div>
        </van-row>
        <!-- <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">占成</div>
          <div>{{ InfoData.divideRate }}%</div>
        </van-row> -->
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'可用余额\']') }}</div>
          <div>{{ InfoData.accountMoney }}</div>
        </van-row>
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'新增时间\']') }}</div>
          <div>{{ InfoData.registerDate }}</div>
        </van-row>
        <van-row type="flex" justify="space-between" align="center">
          <div class="left_text">{{ $t('agentCenter[\'最后登录时间\']') }}</div>
          <div>{{ InfoData.lastLoginTime }}</div>
        </van-row>
      </div>
    </van-dialog>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      :cancel-text="$t('agentCenter[\'取消\']')"
      close-on-click-action
      @select="onSelect"
      :round="false"
    />
  </div>
</template>
<script>
import clip from "../../../util/clipboard";
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      
      remarkData: {},
      remarkShow: false,
      openObj: {},
      infoshow: false,
      open: false,
      radio: 1,
      show: false,
      actions: [],
      form: {
        inviteCode: 0,
        pageNo: 0,
        pageSize: 40,
        userNo: "",
        userType: 1,
      },
      data: {},
      list: [],
      total: 0,
      memberList: [],
      openForm: {
        pageNo: 1,
        pageSize: 200,
        userInviteInfoId: 0,
        userNo: "",
      },
      InfoData: {},
    };
  },
  watch: {
    inviteCodeTotal: {
      handler: function (n, o) {
        if(n && n>this.total){
          this.total = n || 0;
          this.list = this.inviteCodeList || [];
        }
      },
      deep: true,
    },
  },
  computed:{
    ...mapState(["inviteCodeTotal", "inviteCodeList"]),
  },
  created() {
    // 预加载数据
    this.list = this.inviteCodeList || [];
    this.total = this.inviteCodeTotal || 0;
    if(this.total>0&&this.total<=40){
      this.loading = false;
      this.finished = true;
    }
    this.actions = [
      { name: this.$t("agentCenter['修改返点']") },
      { name: this.$t("agentCenter['删除邀请码']") }
    ];
  },
  methods: {
    onInfoshow(row) {
      this.InfoData = Object.assign({}, row);
      this.infoshow = true;
    },
    setRemark() {
      this.$ajax
        .post(
          `/agent/inviteCode/setRemark?userInviteInfoId=${this.remarkData.id}&remark=${this.remarkData.remark}`
        )
        .then((res) => {
          this.$store.commit("SET_TISHI", this.$t("agentCenter['设置成功']"));
          this.getList();
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onRemarkShow(row) {
      row.remark = row.remark || "";
      this.remarkData = Object.assign({}, row);
      this.remarkShow = true;
    },
    //查看邀请码注册用户列表
    onOpen(k) {
      this.openObj = k;
      this.open = true;
      this.$ajax
        .post(`/agent/inviteCode/memberList`, {
          pageNo: this.openForm.pageNo,
          pageSize: this.openForm.pageSize,
          userInviteInfoId: k.id,
          userNo: "",
        })
        .then((res) => {
          if (res.data) {
            this.memberList = res.data.records || [];
            this.total = res.data.total;
          } else {
            this.memberList = [];
            this.total = 0;
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //删除邀请码
    deleteCode() {
      this.$ajax
        .post(`/agent/inviteCode/delete?userInviteInfoId=${this.data.id}`)
        .then((res) => {
          this.onRefresh();
          this.$store.commit("SET_TISHI", this.$t("agentCenter['删除成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    handleCopy(text, event) {
      //复制
      this.$toast(this.$t("agentCenter['复制成功！']"));
      clip(text, event);
    },
    onShow(row) {
      this.data = Object.assign({}, row);
      this.show = true;
    },
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
      console.log(this.refreshing);
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.form.pageNo += 1;
      this.getList();
    },
    getList() {
      this.$ajax
        .post(`/agent/inviteCode/list`, this.form)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            if(this.form.pageNo == 1){
              this.list = res.data.records || [];
            }else{
              this.list = [...this.list, ...res.data.records || []];
            }
          } else {
            this.list = [];
            this.total = 0;
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
    onSelect(Action) {
      if (Action.name == this.$t("agentCenter['删除邀请码']")) {
        this.$dialog
          .confirm({
            title: this.$t("agentCenter['删除邀请码']"),
            message: `${this.$t("agentCenter['确认删除邀请码：']")}${this.data.id}?`,
          })
          .then(() => {
            this.deleteCode();
          });
      } else if (Action.name == this.$t("agentCenter['修改返点']")) {
        this.$router.push({
          path: "/kaihu",
          query: {
            redirect: this.$route.path,
            data: JSON.stringify(this.data),
          },
        });
      }
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    to() {
      this.$router.push({ path: "/agentPage" });
    },
  },
};
</script>

<style lang="scss">
.InvitationCodeManage {
  // min-height: 100vh;
  .titleBar_top {
    position: sticky;
    top: 0;
    z-index: 1;
    .titleBar_tabs {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 210.938px;
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
  .info {
    height: 42.64px;
    padding: 0 12.18px 0px;
    background-color: #fff;
    font-size: 15.2312px;
    color: #000;
    .van-radio-group {
      padding-left: 30px;
    }
    .van-radio__label {
      margin-left: 5px;
      padding-right: 20px;
    }
    .van-radio__icon {
      height: 18px;
      width: 18px;
    }
    .van-icon {
      height: 18px;
      width: 18px;
      font-size: 20px;
      border-color: #dc3b4000;
    }
    .van-icon-success::before {
      position: relative;
      bottom: 6.5px;
      left: 0;
      font-family: iconfont;
      content: "\E63F";
      color: #dc3b40;
    }
    .van-radio__icon--checked .van-icon-success::before {
      content: "\E640";
    }
  }
  .InvitationCodeManage_body {
    .InvitationCodeManage_body_box {
      background-color: #fff;
      border-radius: 5px;
      font-size: 12px;
      border-bottom: none;
      text-align: center;
      .van-list {
        height: calc(100vh - 220px);
        overflow: auto;
      }
      .row_box {
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        height: 45.6937px;
        font-size: 15.2312px;
        .van-col {
          padding: 5px 0;
        }
      }
      .row_box1 {
        height: 45.25px;
        color: #666;
        background: #f3f3f3;
        font-size: 17.4px;
      }
    }
  }
  .infoshow {
    padding: 10px 20px;
    font-size: 13px;
    line-height: 22px;
  }
  .inputBox {
    position: relative;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #eee;
    .van-cell-group {
      background: none;
      .van-cell {
        background: none;
        .van-field__label {
          width: 85px;
          padding: 0;
        }
      }
    }
  }
}
</style>
