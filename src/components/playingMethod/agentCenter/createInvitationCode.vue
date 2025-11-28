<template>
  <div class="createInvitationCode">
    <div class="titleBar_top">
      <titleBar
        v-if="title && (title.indexOf(this.$t('agentCenter[\'立即开户\']')) > -1 || title.indexOf(this.$t('agentCenter[\'返点信息\']')) > -1 || title.indexOf(this.$t('agentCenter[\'修改\']')) > -1)"
        :title_name="title"
        @toLeft="to"
        left_icon="arrow-left"
        class="titleBar"
      />
      <div v-else>
        <titleBar @toLeft="to" left_icon="arrow-left" class="titleBar" />
        <div class="titleBar_tabs">
          <div class="on" @click="toPath('createInvitationCode')">{{ $t('agentCenter[\'生成邀请码\']') }}</div>
          <div @click="toPath('InvitationCodeManage')">{{ $t('agentCenter[\'邀请码列表\']') }}</div>
        </div>
      </div>
    </div>
    <!-- <van-field label-align="right" v-show="!show ||(routeData&&redirect=='/InvitationCodeManage')" v-model="data.spreadUrl" label="推广地址：" placeholder="请输入推广地址"/> -->
    <div class="inputBox">
      <div style="background-color: #efeef4; padding: 0.40613rem 0" v-if="redirect!='/InvitationCodeManage'">
        <van-row type="flex" align="center" class="info" v-if="!routeData">
          <div class="info-title">{{ $t('agentCenter[\'开户类型\']') }}</div>
          <van-radio-group v-model="registerUserType" direction="horizontal">
            <van-radio :name="1" checked-color="#fff">{{ $t('agentCenter[\'代理类型\']') }}</van-radio>
            <van-radio :name="0" checked-color="#fff">{{ $t('agentCenter[\'玩家类型\']') }}</van-radio>
          </van-radio-group>
        </van-row>
        <van-row type="flex" align="center" class="inputBox_text">
          <div>{{ $t('agentCenter[\'请先为下级设置返点，\']') }}</div>
          <div style="color: rgb(220, 59, 64)" @click="plbOpen = true">
            {{ $t('agentCenter[\'点击查看返点赔率表\']') }}
          </div>
        </van-row>
      </div>
      <div class="table_box">
        <van-cell-group v-show="show" v-if="!routeData" class="yonghuBox">
          <van-field
            v-model="data.userNo"
            :label="$t('agentCenter[\'账号\']')"
            :placeholder="$t('agentCenter[\'请输入您要注册的账号\']')"
          />
          <van-field
            v-model="data.loginPwd"
            :label="$t('agentCenter[\'密码\']')"
            :type="loginPwdBool ? 'text' : 'password'"
            @click-right-icon="loginPwdBool = !loginPwdBool;"
            :right-icon="
              require(loginPwdBool
                ? '../../../assets/login/dl_ky.png'
                : '../../../assets/login/denglu_mm2.png')
        "
            :placeholder="$t('agentCenter[\'请输入您的登录密码\']')"
          />
        </van-cell-group>
        <van-collapse v-model="activeNames">
          <van-collapse-item :name="i" v-for="(k, i) in typeList" :key="i">
            <template slot="title">
              <van-row type="flex" align="center">
                <i class="iconfont unfold" v-if="activeNames.includes(i)"></i>
                <i class="iconfont right" v-else></i>
                <div class="name">{{ k.name }}</div>
              </van-row>
              <van-row type="flex" align="center" class="table_box_input">
                <van-field v-model="k.rebate" type="number" />
                <div class="but" @click="onInput(k)">{{ $t('agentCenter[\'快选\']') }}</div>
              </van-row>
              <span class="_text" style="color: red;font-size: 8px;padding-left: 10px;">{{ $t('agentCenter[\'(注:超过上级返点部分不替换)\']') }}</span>
            </template>
            <div class="table_box_body">
              <div
                class="row"
                v-for="(n, j) in k.list"
                :key="j"
                :class="{
                  _row:
                    (k.list.length % 2 == 0 &&
                      (j == k.list.length - 1 || j == k.list.length - 2)) ||
                    (k.list.length % 2 == 1 && j == k.list.length - 1),
                }"
              >
                <van-row type="flex" align="center">
                  <div class="text">{{ n.categoryName }}</div>
                  <div>
                    <van-field
                      type="number"
                      @input="inputOneRebate(n)"
                      @focus="onFocus(n)"
                      v-model="n.rebate"
                      :placeholder="`${$t('agentCenter[\'最高\']')}${n.myRebate || 0}`"
                    >
                      <!-- <template #button>
                          <span>0~{{ n.myRebate||0 }}</span>
                        </template> -->
                    </van-field>
                  </div>
                </van-row>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <div class="bottomBox">
      <van-button
        type="primary"
        size="large"
        @click="submit()"
        :loading="butLoading"
        >{{ betText }}</van-button
      >
    </div>

    <!-- 赔率表 -->
    <van-popup
      duration="0"
      v-model="plbOpen"
      :overlay="true"
      :style="{ width: '100%', height: '100%', backgroundColor: '#efeef4' }"
      lock-scroll
    >
      <plbOpenPage @onClose="plbOpen = false" />
    </van-popup>
  </div>
</template>
<script>
import plbOpenPage from "./plbOpenPage.vue";
export default {
  components: { plbOpenPage },
  data() {
    return {
      plbOpen: false,
      betText: "提 交",
      title: "",
      butLoading: false,
      value: "",
      activeNames: [0],
      registerUserType: 1,
      data: {},
      loginPwdBool: false,
      typeList: [
        {
          classCode: "LOTTERY",
          name: "",
          list: [],
          show: true,
          rebate: null,
        },
        { classCode: "QP", name: "", list: [], show: true, rebate: null },
        { classCode: "DZ", name: "", list: [], show: true, rebate: null },
        { classCode: "BY", name: "", list: [], show: true, rebate: null },
        { classCode: "SX", name: "", list: [], show: true, rebate: null },
        { classCode: "TY", name: "", list: [], show: true, rebate: null },
        // { classCode: "DJ", name: "电竞", list: [], show: true, rebate: null },
        // {classCode:"lottery",name:'彩票',list:[],show:true,rebate:null},
        // {classCode:"SPORT",name:'体育',list:[],show:true,rebate:null},
        // {classCode:"VIDEO",name:'视讯',list:[],show:true,rebate:null},
        // {classCode:"ELEC",name:'电子',list:[],show:true,rebate:null},
        // {classCode:"DUIZHAN",name:'对战',list:[],show:true,rebate:null},
      ],
    };
  },
  computed: {
    redirect() {
      return this.$route.query.redirect;
    },
    show() {
      return this.$route.path == "/kaihu";
    },
    routeData() {
      return this.$route.query.data ? JSON.parse(this.$route.query.data) : null;
    },
  },
  created() {
    // 初始化 typeList 的名称
    this.typeList[0].name = this.$t("agentCenter['彩票']");
    this.typeList[1].name = this.$t("agentCenter['棋牌']");
    this.typeList[2].name = this.$t("agentCenter['电子']");
    this.typeList[3].name = this.$t("agentCenter['捕鱼']");
    this.typeList[4].name = this.$t("agentCenter['视讯']");
    this.typeList[5].name = this.$t("agentCenter['体育']");
    
    if (this.show) {
      if (this.routeData) {
        if (this.redirect == "/InvitationCodeManage") {
          this.title = `${this.$t("agentCenter['修改']")}${this.routeData.id}${this.$t("agentCenter['返点']")}`;
          this.data.spreadUrl = this.routeData.spreadUrl;
          this.getCodeInfo();
        } else {
          this.title = this.$t("agentCenter['返点信息']");
          this.getRebate();
        }
      } else {
        this.title = this.$t("agentCenter['立即开户']");
        this.searchAgentRebate();
        this.betText = this.$t("agentCenter['立即开户']");
      }
    } else {
      this.title = this.$t("agentCenter['生成邀请码']");
      this.searchAgentRebate();
      this.betText = this.$t("agentCenter['生成邀请码']");
    }
    if (!this.betText) {
      this.betText = this.$t("agentCenter['提交']");
    }
  },
  methods: {
    getCodeInfo() {
      this.$ajax
        .post(`/agent/inviteCode/info?userInviteInfoId=${this.routeData.id}`)
        .then((res) => {
          if (res.data) {
            this.setTypeList(res);
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //立即开户
    createUser() {
      if (!this.data.userNo || this.data.userNo == "") {
        this.$toast(this.$t("agentCenter['会员账号不能为空']"));
        return;
      }
      if (this.data.userNo.length < 4 || this.data.userNo.length > 12) {
        this.$toast(this.$t("agentCenter['会员账号长度为4~12个字符']"));
        return;
      }
      if (!this.data.loginPwd || this.data.loginPwd == "") {
        this.$toast(this.$t("agentCenter['登录密码不能为空']"));
        return;
      }
      let obj = {
        userNo: this.data.userNo,
        loginPwd: this.data.loginPwd,
        rebates: [],
        userType: this.registerUserType,
      };
      this.typeList.map((k) => {
        k.list.map((n) => {
          n.rebate = n.rebate || 0;
          obj.rebates.push(n);
        });
      });
      this.butLoading = true;
      this.$ajax
        .post(`/agent/createUser`, obj)
        .then((res) => {
          this.$store.commit("SET_TISHI", this.$t("agentCenter['开户成功']"));
          this.$router.push({
            path: "/MemberManage",
            query: {
              redirect: this.$route.path,
            },
          });
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.butLoading = false;
          }, 1000);
        });
    },
    //生成新的邀请码
    create() {
      if (!this.data.spreadUrl || this.data.spreadUrl == "") {
        this.$toast("请输入推广地址");
        return;
      }
      let obj = {
        items: [],
        registerUserType: this.registerUserType,
        spreadUrl: this.data.spreadUrl,
      };
      this.typeList.map((k) => {
        k.list.map((n) => {
          n.rebate = n.rebate || 0;
          obj.items.push(n);
        });
      });
      this.butLoading = true;
      this.$ajax
        .post(`/agent/inviteCode/create`, obj)
        .then((res) => {
          this.$store.commit("SET_TISHI", this.$t("agentCenter['已生成新的邀请码']"));
          setTimeout(() => {
            this.$router.push({ path: "/InvitationCodeManage" });
          }, 500);
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.butLoading = false;
          }, 1000);
        });
    },
    //生成邀请码，获取返点信息
    searchAgentRebate() {
      this.$ajax
        .post(`/agent/inviteCode/searchAgentRebate`)
        .then((res) => {
          if (res.data && res.data.rebates) {
            if (this.title === "生成邀请码") {
              this.data.spreadUrl = res.data.url;
            }
            this.setTypeList({ data: res.data.rebates },1);
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onFocus(n) {
      if (n.rebate == 0) {
        n.rebate = null;
      }
    },
    inputOneRebate(row) {
      if (row.rebateMaxLimit) {
        if (
          row.rebateMinLimit <= row.rebate &&
          row.rebateMaxLimit >= row.rebate
        ) {
          row.rebate = row.rebate;
        } else if (row.rebateMinLimit > row.rebate) {
          row.rebate = row.rebateMinLimit;
        } else if (row.rebateMaxLimit < row.rebate) {
          row.rebate = row.rebateMaxLimit;
        }
      } else {
        if (0 <= row.rebate && row.myRebate >= row.rebate) {
          row.rebate = row.rebate;
        } else if (0 > row.rebate) {
          row.rebate = 0;
        } else if (row.myRebate < row.rebate) {
          row.rebate = row.myRebate;
        }
      }
    },
    onInput(val) {
      val.list.map((item) => {
        if (item.rebateMaxLimit) {
          if (
            item.rebateMinLimit <= val.rebate &&
            item.rebateMaxLimit >= val.rebate
          ) {
            item.rebate = val.rebate;
          } else if (item.rebateMinLimit > val.rebate) {
            item.rebate = item.rebateMinLimit;
          } else if (item.rebateMaxLimit < val.rebate) {
            item.rebate = item.rebateMaxLimit;
          }
        } else {
          if (0 <= val.rebate && item.myRebate >= val.rebate) {
            item.rebate = val.rebate;
          } else if (0 > val.rebate) {
            item.rebate = 0;
          } else if (item.myRebate < val.rebate) {
            item.rebate = item.myRebate;
          }
        }
      });
    },
    //限制输入范围
    onBlur(n) {
      console.log(n);
      if (parseFloat(n.rebate) >= n.myRebate) {
        n.rebate = n.myRebate;
      } else if (parseFloat(n.rebate) <= 0) {
        n.rebate = 0;
      }
    },
    //快选按钮
    allRebate(obj) {
      if (obj.rebate && obj.rebate != "") {
        obj.list.map((k) => {
          k.rebate = obj.rebate;
        });
      }
    },
    editRebate() {
      let obj = {
        items: [],
        userId: this.routeData.userId,
      };
      this.typeList.map((k) => {
        k.list.map((n) => {
          n.rebate = n.rebate || 0;
          obj.items.push(n);
        });
      });
      this.butLoading = true;
      this.$ajax
        .post(`/agent/member/editRebate`, obj)
        .then((res) => {
          this.$store.commit("SET_TISHI", this.$t("agentCenter['修改成功']"));
          this.to();
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.butLoading = false;
          }, 1000);
        });
    },
    //查询下级的返点信息
    getRebate() {
      this.$ajax
        .post(`/agent/member/rebate?userId=${this.routeData.userId}`)
        .then((res) => {
          if (res.data) {
            this.setTypeList(res);
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    setTypeList(res,type) {
      this.typeList.map((k) => {
        k.list = [];
        res.data.map((n) => {
          if (k.classCode == n.classCode) {
            if(type==1){
              n.rebate = n.rebateMaxLimit || 0;
            }
            n.myRebate = n.myRebate || n.rebateMaxLimit;
            k.list.push(n);
          }
        });
      });
      console.log(this.typeList);
    },
    inviteCodeEdit() {
      if (!this.data.spreadUrl || this.data.spreadUrl == "") {
        this.$toast(this.$t("agentCenter['请输入推广地址']"));
        return;
      }
      let obj = {
        items: [],
        userInviteInfoId: this.routeData.id,
        spreadUrl: this.data.spreadUrl,
      };
      this.typeList.map((k) => {
        k.list.map((n) => {
          n.rebate = n.rebate || 0;
          obj.items.push(n);
        });
      });
      this.butLoading = true;
      this.$ajax
        .post(`/agent/inviteCode/edit`, obj)
        .then((res) => {
          this.$store.commit("SET_TISHI", this.$t("agentCenter['修改成功']"));
          this.to();
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.butLoading = false;
          }, 1000);
        });
    },
    submit() {
      if (this.show) {
        if (this.routeData) {
          if (this.redirect == "/InvitationCodeManage") {
            this.inviteCodeEdit();
          } else {
            this.editRebate();
          }
        } else {
          this.createUser();
        }
      } else {
        this.create();
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
.createInvitationCode {
  min-height: 100vh;
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
  .inputBox {
    background-color: #fff;
    border: 1px solid #eee;
    .yonghuBox {
      background-color: #fff !important;
      .van-cell {
        border-top: 1px solid #d0d0d0;
        padding-left: 12.185px;
        font-size: 15.23px;
      }
    }
    .inputBox_text {
      padding: 12.185px 9px;
      font-size: 15.23px;
      color: #000;
      background-color: #fff;
      border-top: 1px solid #d0d0d0;
    }
    .table_box {
      /*max-height: calc(100vh - 250px);*/
      /*overflow: auto;*/
      position: relative;
      .van-collapse-item--border::after {
        border-top: none;
      }
      .van-collapse-item__content {
        padding: 0;
      }
      .table_box_body {
        padding: 0 11.141px;
        .row {
          width: 48%;
          display: inline-block;
          margin-left: 5px;
          margin-top: 5px;
          padding-bottom: 5px;
          border-bottom: 1px solid #b4acac;
          .text {
            color: #000;
            font-size: 14px;
            min-width: 69.625px;
          }
          .van-cell {
            padding: 0px;
            .van-field__control {
              width: 80px;
              border: 1px solid rgb(118, 118, 118);
              border-radius: 3px;
              height: 22px;
            }
            .van-field__control {
              font-size: 14px;
              padding-left: 5px;
            }
            .van-field__button {
              background-color: #dddddd;
              border-left: 1px solid #999;
              padding: 0 3px;
              border-radius: 5px;
            }
          }
        }
        ._row {
          border-bottom: none;
        }
      }
      .van-collapse-item__title {
        background-color: #d89799;
        padding: 5px 0;
        border-bottom: 2px solid #fff;
        box-sizing: border-box;
        height: 42.16px;
        .van-row{
          float: left;
          ._text{
            display: inline-block;
          }
        }
        .table_box_input {
          // position: absolute;
          // top: 0;
          // left: 50%;
          // transform: translateX(-50%);
          .text {
            color: #000;
            font-size: 12px;
          }
          .but {
            padding: 0px 6px;
            background-color: #df303f;
            border: 1px solid #fff;
            color: #fff;
            border-radius: 5px;
            height: 28px;
            line-height: 28px;
            font-size: 17.4px;
          }
          .van-cell {
            margin: 0 10px 0 0;
            border: 1px solid rgb(118, 118, 118);
            background-color: #fff;
            width: 80px;
            height: 24px;
            border-radius: 2px;
            padding-bottom: 0;
            padding-top: 0;
          }
        }
        .name {
          color: #fff;
          font-size: 17.4px;
          padding-top: 4px;
          width: 80px;
        }
        .unfold,
        .right {
          margin-left: 20px;
          margin-right: 5px;
          color: #fff;
          font-size: 17.4071px;
        }
        .van-cell__right-icon {
          display: none;
        }
      }
    }
  }
  .bottomBox {
    background-color: #fff;
    padding: 17.4px 0;
    text-align: center;
    .van-button {
      border-radius: 3.5px;
      color: rgb(255, 255, 255);
      /*background: linear-gradient(to left, #D4B89B, #e3d5c8);*/
      background-color: #dc3b40;
      border: 0px;
      font-weight: bold;
      height: 45.25px;
      width: 90%;
    }
  }
}
</style>
