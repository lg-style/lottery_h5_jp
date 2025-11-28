<template>
  <div class="huazhuan">
    <titleBar
      :title_name="$t('agentCenter[\'给上级转账\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
    />
    <div class="inputBox">
      <!-- <van-radio-group v-model="type" direction="horizontal">
        <van-radio name="0">余额划出</van-radio>
        <van-radio name="1">余额回收</van-radio>
      </van-radio-group> -->
      <van-cell-group v-show="type == 0">
        <van-field
          v-model="amount.accountMoney"
          :label="$t('agentCenter[\'我的钱包\']')"
          readonly
          class="text_1"
        >
        </van-field>
        <van-field
          v-model="form.userNo"
          @blur="fundInfo()"
          :label="$t('agentCenter[\'上级账号\']')"
          readonly
          :placeholder="$t('agentCenter[\'请输入上级账号\']')"
        />
        <van-field
          v-model="form.transferAmount"
          :label="$t('agentCenter[\'转账金额\']')"
          type="digit"
          :placeholder="$t('agentCenter[\'请输入金额\']')"
        />
        <van-field
          v-model="form.googleKey"
          :label="$t('agentCenter[\'安全密码\']')"
          type="password"
          :placeholder="$t('agentCenter[\'请输入安全密码\']')"
        />
      </van-cell-group>
      <van-cell-group v-show="type == 1">
        <van-field v-model="userInfo.userNo" :label="$t('agentCenter[\'收款账号\']')" readonly />
        <van-field
          v-model="form.userNo"
          @blur="fundInfo()"
          :label="$t('agentCenter[\'下级账号\']')"
          :placeholder="$t('agentCenter[\'请输入下级账号\']')"
        >
          <template #button>
            <div>{{ $t('agentCenter[\'可用余额\']') }}：{{ form.accountMoney || "-" }}</div>
          </template>
        </van-field>
        <van-field
          v-model="form.transferAmount"
          :label="$t('agentCenter[\'转账金额\']')"
          type="digit"
          :placeholder="$t('agentCenter[\'请输入转账金额\']')"
        />
        <van-field
          v-model="form.googleKey"
          :label="$t('agentCenter[\'安全密码\']')"
          type="password"
          :placeholder="$t('agentCenter[\'请输入安全密码\']')"
        />
      </van-cell-group>
    </div>
    <div class="but" v-if="type == 0 && loading" v-show="!butloading" @click="submit">{{ $t('agentCenter[\'确认划出\']') }}</div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      loading: false,
      butloading: false,
      type: "0",
      form: {
        "userNo":'',
      },
    };
  },
  computed: {
    ...mapState(["amount", "userInfo"]),
  },
  created() {
    this.getStatus();
    this.onrefreshLoad();
  },
  mounted() {
    if (!this.userInfo.hasFundPwd) {
      this.$toast(this.$t("agentCenter['您还未设置安全密码，请先设置安全密码']"));
      setTimeout(() => {
        this.$router.push({ path: "/Security" });
      }, 500);
      return;
    }
    this.form.userNo = this.userInfo.agentUserNo;
  },
  methods: {
    ...mapActions(["onrefreshLoad"]),
    getStatus() {
      this.loading = false;
      this.$ajax
        .post("/cashout/status")
        .then((res) => {
          if(res.data){
            this.$toast(this.$t("agentCenter['不是正常状态，不能划转。']"));
            this.$router.push({ path: "/MyCenter" });
          }else {
            this.loading = true;
          }
        })
        .catch((error) => {
          this.$toast(error);
        })
    },
    //提交
    submit() {
      if (!this.form.userNo || this.form.userNo == "") {
        this.$toast(this.$t("agentCenter['请输入入款账号']"));
        return;
      }
      if (this.form.userNo.trim() == this.userInfo.userNo.trim()) {
        this.$toast(this.$t("agentCenter['输入的账号有误']"));
        return;
      }
      if (
        !this.form.transferAmount ||
        this.form.transferAmount == "" ||
        this.form.transferAmount == 0
      ) {
        this.$toast(this.$t("agentCenter['请输入转账余额']"));
        return;
      }
      if (!this.form.googleKey || this.form.googleKey == "") {
        this.$toast(this.$t("agentCenter['请输入安全密码']"));
        return;
      }
      this.$dialog
        .confirm({
          title: this.$t("agentCenter['确认划出']"),
          message: `${this.$t("agentCenter['是否将余额划出至']")} ${this.form.userNo}`,
        })
        .then(() => {
          this.butloading = true;
          this.$ajax
            .post(`/account/fundTransfer/submit`, {
              toUserNo: this.form.userNo.trim(),
              googleKey: this.form.googleKey.trim(),
              transferAmount: this.form.transferAmount,
            })
            .then((res) => {
              this.$store.commit("SET_TISHI", this.$t("agentCenter['划出成功']"));
              this.form = {};
              this.onrefreshLoad();
            }).finally(() => {
                setTimeout(() => {
                  this.butloading = false;
                }, 1000);
              });
        });
    },
    //入款账号验证
    fundInfo() {
      if (!this.form.userNo || this.form.userNo == "") {
        return;
      }
      this.$ajax
        .post(
          `/account/fundTransfer/fundInfo?userNo=${this.form.userNo.trim()}`
        )
        .then((res) => {
          if (res.data) {
            this.form.accountMoney = res.data.accountMoney;
          } else {
            this.form.accountMoney = 0;
          }
          this.$forceUpdate();
        })
        .catch((error) => {
          this.form = {};
          this.$toast(error);
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
.huazhuan {
  .inputBox {
    background-color: #fff;
    .van-radio-group {
      padding: 10px 10px;
    }
    .van-cell-group {
      background: none;
      margin-top: 15px;
      border-bottom: 1px solid #d0d0d0;
      .van-cell {
        box-sizing: border-box;
        border-top: 1px solid #d0d0d0;
        background: none;
        padding: 0;
        height: 43.5178px;
        line-height: 43.5178px;
        font-size: 17.4071px;
        .van-field__label {
          width: 105.083px;
          padding: 0;
          text-indent: 8.70356px;
        }
      }
      .text_1 {
        .van-field__control {
          color: #f46e00;
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
  .but {
    width: 337.5px;
    height: 43.5178px;
    margin: 21.7589px auto 0;
    line-height: 43.5178px;
    text-align: center;
    clear: both;
    background: -webkit-linear-gradient(bottom,#dc3b40 2%,#dc3b40 50%,#db3b40 51%,#d7363b);
    border-radius: 4.35178px;
    color: #fff;
    font-size: 19.583px;
  }
}
</style>
