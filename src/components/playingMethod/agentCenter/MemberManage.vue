<template>
  <div class="MemberManage">
    <titleBar
      :title_name="$t('agentCenter[\'会员管理\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar titleBar_top"
    />
    <div class="MemberManageTop">
      <van-row type="flex" align="center" class="info" justify="center">
        <van-cell-group>
          <van-field v-model="data.userNo" :placeholder="$t('agentCenter[\'下级代理查询\']')" />
        </van-cell-group>
        <div class="info_but" @click="onRefresh">
          <van-icon name="arrow" />
        </div>
      </van-row>
    </div>

    <div class="MemberManage_body">
      <div class="MemberManage_body_box">
        <van-row type="flex" align="center" class="row_box row_box1">
          <van-col span="6"> {{ $t('agentCenter[\'会员账号\']') }} </van-col>
          <van-col span="6"> {{ $t('agentCenter[\'昵称\']') }} </van-col>
          <van-col span="7"> {{ $t('agentCenter[\'登录时间\']') }} </van-col>
          <van-col span="5"> {{ $t('agentCenter[\'下级人数\']') }} </van-col>
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
                @click="onShow(k)"
              >
                <van-col span="6">
                  <span style="color: rgb(51, 136, 255)">{{ k.userNo }}</span>
                </van-col>
                <van-col span="6">
                  <div>{{ k.nickName == "" ? "-" : k.nickName }}</div>
                </van-col>
                <van-col span="7">
                  {{ k.lastLoginTime }}
                </van-col>
                <van-col span="5">
                  <span style="color: red" v-if="k.teamCount > 1">
                    {{ k.teamCount - 1 }}
                  </span>
                  <span v-else style="color: red">
                    {{ k.teamCount - 1 }}
                  </span>
                </van-col>
              </van-row>
            </div>
            <empty v-else-if="!loading" />
          </van-list>
        </van-pull-refresh>
        <!-- <div class="loadingMsg">已显示全部数据</div> -->
      </div>
    </div>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      :cancel-text="$t('agentCenter[\'取消\']')"
      close-on-click-action
      @select="onSelect"
      :round="false"
    />

    <!--  弹窗-->
    <van-popup
      v-model="open"
      position="right"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <div class="openBody">
        <titleBar
          :title_name="$t('agentCenter[\'修改昵称\']')"
          class="titleBar"
          @toLeft="open = false"
          left_icon="arrow-left"
        />
        <div class="inputBox">
          <van-cell-group>
            <van-field
              label-align="right"
              v-model="form.userNo"
              :label="$t('agentCenter[\'会员账号：\']')"
            />
            <van-field
              label-align="right"
              v-model="form.nickName"
              :label="$t('agentCenter[\'昵称：\']')"
              :placeholder="$t('agentCenter[\'请输入昵称\']')"
            />
          </van-cell-group>
          <div class="but" @click="editNickName()">{{ $t('agentCenter[\'确认\']') }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      form: {},
      open: false,
      value: "",
      show: false,
      data: {
        // "agentId": 0,
        // "isGeneralAgent": 1,
        // "order": '',
        // "orderBy": 0,
        // "pageNo": 1,
        // "pageSize": 5,
        // "searchBy": 0,
        // "searchMode": 0,
        // "searchText": "",
        // "status": -1
        userType: -1,
        pageNo: 0,
        pageSize: 40,
        userNo: "",
        agentId: 0,
      },
      total: 0,
      list: [],
      subordinateData: [],
    };
  },
  watch: {
    memberTotal: {
      handler: function (n, o) {
        if(n && n>this.total){
          this.total = n || 0;
          this.list = this.memberList || [];
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["memberTotal", "memberList"]),
    actions() {
      let list = [{ name: this.$t("agentCenter['修改返点']") }, { name: this.$t("agentCenter['修改昵称']") }];
      if (this.form.teamCount > 1) {
        list.push({ name: this.$t("agentCenter['查看下级']") });
      }
      if (this.subordinateData.length > 0) {
        list.push({ name: this.$t("agentCenter['返回上级']") });
      }
      return list;
    },
  },
  created() {
    // 预加载数据
    this.list = this.memberList || [];
    this.total = this.memberTotal || 0;
    if(this.total>0&&this.total<=40){
      this.loading = false;
      this.finished = true;
    }
  },
  methods: {
    /** 返回上级 */
    delSubordinate() {
      this.subordinateData.pop();
      if (this.subordinateData.length > 0) {
        this.data.isGeneralAgent = 0;
      } else {
        this.data.isGeneralAgent = 1;
      }
      this.data.agentId = this.subordinateData[this.subordinateData.length - 1];
      this.onRefresh();
    },
    /** 查询下级信息 */
    getSubordinate(row) {
      this.subordinateData.push(row.userId);
      this.data.agentId = row.userId;
      this.data.isGeneralAgent = 0;
      this.onRefresh();
    },
    editNickName() {
      if (!this.form.nickName || this.form.nickName == "") {
        this.$toast(this.$t("agentCenter['请输入昵称']"));
        return;
      }
      this.$ajax
        .post(
          `/agent/member/editNickName?userId=${this.form.userId}&nickName=${this.form.nickName}`
        )
        .then((res) => {
          this.open = false;
          this.$store.commit("SET_TISHI", this.$t("agentCenter['修改完成']"));
          this.initialize();
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.data.pageNo = 0;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.data.pageNo += 1;
      this.getList();
    },
    getList() {
      let data = Object.assign({}, this.data);
      if (data.userNo && data.userNo != "") {
        data.agentId = 0;
        data.isGeneralAgent = 0;
      }
      this.$ajax
        .post(`/agent/member/list`, data)
        .then((res) => {
          if (res.data) {
            this.total = res.data.total;
            if(this.data.pageNo == 1){
              this.list = res.data.records || [];
            }else{
              this.list = [...this.list, ...res.data.records || []];
            }
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
    onShow(row) {
      console.log(row);
      this.form = Object.assign({}, row);
      this.show = true;
    },
    onSelect(Action) {
      if (Action.name == this.$t("agentCenter['修改昵称']")) {
        this.open = true;
      } else if (Action.name == this.$t("agentCenter['修改返点']")) {
        this.$router.push({
          path: "/kaihu",
          query: {
            redirect: this.$route.path,
            data: JSON.stringify(this.form),
          },
        });
      } else if (Action.name == this.$t("agentCenter['查看下级']")) {
        this.getSubordinate(this.form);
      } else if (Action.name == this.$t("agentCenter['返回上级']")) {
        this.delSubordinate();
      }
    },
    to() {
      this.$router.push({
        path: "/agentPage",
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.MemberManage {
  background-color: #fff;
  .titleBar_top {
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
  .MemberManageTop {
    background-color: #efeef4;
    padding: 13px;
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
  .MemberManage_body {
    .MemberManage_body_box {
      border-radius: 5px;
      font-size: 16.4px;
      border: 1px solid #ddd;
      border-bottom: none;
      text-align: center;
      .van-list {
        height: calc(100vh - 210px);
        overflow: auto;
      }
      .row_box {
        border-bottom: 1px solid #ddd;
        height: 45.25px;
        box-sizing: border-box;
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
  .inputBox {
    background-color: #fff;
    .but {
      padding: 10px 30px;
      font-size: 15px;
      background-color: #d5ba9e;
      width: 100px;
      margin: 20px auto;
      text-align: center;
      color: white;
      border-radius: 5px;
    }
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
    .inputBox_text {
      padding: 10px 30px;
      text-align: center;
      color: #999;
      font-size: 12px;
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
