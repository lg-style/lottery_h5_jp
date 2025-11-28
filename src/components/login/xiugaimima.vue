<template>
  <div class="xiugaimima">
    <titleBar
      :title_name="$t(`loginPage['修改登录密码']`)"
      class="titleBar"
    />
    <!--        登录密码-->
    <div class="inputBox">
      <van-cell-group>
        <!-- <van-field
          type="password"
          v-model="form.oldLoginPwd"
          label="原登录密码："
          placeholder="请输入原登录密码"
        /> -->
        <van-field
          type="password"
          v-model="form.loginPwd"
          :label="$t(`loginPage['新密码']`)"
          :placeholder="$t(`loginPage['请输入新登录密码']`)"
        />
        <van-field
          type="password"
          v-model="form.loginPwd2"
          :label="$t(`loginPage['确认密码']`)"
          :placeholder="$t(`loginPage['请输入确认登录密码']`)"
        />
      </van-cell-group>
      <div class="but" @click="updateLoginPwd()">
        {{ $t("loginPage['确认修改']") }}
      </div>
      <div class="but" @click="onQuit()">{{ $t("loginPage['取消']") }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'loginForm',
  ],
  data() {
    return {
      form: {
        'oldLoginPwd':'',
        'loginPwd':'',
        'loginPwd2':'',
      },
    };
  },
  created() {
    this.form.oldLoginPwd = this.loginForm.loginPwd;
  },
  methods: {
    //提交修改登录密码
    updateLoginPwd() {
      if (!this.form.oldLoginPwd || this.form.oldLoginPwd == "") {
        this.$toast(this.$t("loginPage['原登录密码不能为空']"));
        return;
      }
      if (!this.form.loginPwd || this.form.loginPwd == "") {
        this.$toast(this.$t("loginPage['新登录密码不能为空']"));
        return;
      }
      if (!this.form.loginPwd2 || this.form.loginPwd2 == "") {
        this.$toast(this.$t("loginPage['确认登录密码不能为空']"));
        return;
      }
      if (this.form.loginPwd != this.form.loginPwd2) {
        this.$toast(this.$t("loginPage['两次登录密码必须一致']"));
        return;
      }
      this.$ajax
        .post(
          `/user/center/updateLoginPwd?oldLoginPwd=${this.form.oldLoginPwd}&loginPwd=${this.form.loginPwd}`
        )
        .then((res) => {
          this.$emit('queding');
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onQuit() {
      this.$emit('onQuit');
    },
  },
};
</script>

<style lang="scss">
/*弹窗*/
  .xiugaimima {
    background-color: #efeef4;
    height: 100%;
    .inputBox {
      .but {
        height: 43.5104px;
        line-height: 43.5104px;
        font-size: 19.583px;
        background: -webkit-linear-gradient(bottom,#dc3b40 2%,#dc3b40 50%,#db3b40 51%,#d7363b);
        width: 337.5px;
        margin: 21.7589px auto 0;
        text-align: center;
        color: #fff;
        border-radius: 4.35178px;
      }
      .van-cell-group {
        margin-top: 15px;
        .van-cell {
          padding-left: 0;
          border-top: 1px solid #d0d0d0;
          background: none;
          .van-field__label {
            font-size: 17.4071px;
            padding: 0;
            width: 28% !important;
            text-indent: 8.70356px !important;
            text-align: left;
          }
          .van-field__control{
            font-size: 17.4px;
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
  }
</style>
