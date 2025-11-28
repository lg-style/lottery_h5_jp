<template>
  <div class="login">
    <!--登录-->
    <div class="logo">
      <img v-if="imgShow" src="http://mail.qq.com/zh_CN/htmledition/images/logo/qqmail/qqmail_logo_default_200h.png" />
      <!-- <img src="../../assets/login/loginIcon.png"/> -->
    </div>
    <div class="locale-switch">
      <van-dropdown-menu active-color="#146fdf">
        <van-dropdown-item
          v-model="currentLocale"
          :options="localeOptions"
          @change="handleLocaleChange"
        />
      </van-dropdown-menu>
    </div>
    <div class="loginMaxBox">
      <van-row class="loginBox">
        <van-col span="20" class="loginBox_1">
          <van-form>
            <van-field
              v-model.trim="loginForm.userNo"
              :right-icon="require('../../assets/login/denglu_yhm2.png')"
              @click-right-icon="clickIcon_1"
              :placeholder="$t('login[\'用户名\']')"
              maxlength="12"
            />
            <van-field
              @keyup.enter="loginSubmit()"
              v-model.trim="loginForm.loginPwd"
              :type="loginPwdBool ? 'text' : 'password'"
              :right-icon="
                require(loginPwdBool
                  ? '../../assets/login/dl_ky.png'
                  : '../../assets/login/denglu_mm2.png')
              "
              @click-right-icon="clickIcon_2"
              :placeholder="$t('login[\'密码\']')"
              maxlength="32"
            />
            <van-field
              @keyup.enter="loginSubmit()"
              v-model.trim="loginForm.code"
              name="验证码"
              :placeholder="$t('login[\'输入验证码\']')"
              class="yzmInput"
            >
              <template #button>
                <validCode
                  ref="validCode"
                  @update="validCode2"
                  v-if="!registerBool"
                />
              </template>
            </van-field>
          </van-form>
        </van-col>
      </van-row>
      <div class="bottom-text">
        <van-checkbox v-model="checkedPwd" checked-color="#146fdf">
          {{ $t("login['记住密码']") }}
        </van-checkbox>
      </div>
      <div class="bottom-butBox">
        <div @click="loginSubmit()">{{ $t("login['登录']") }}</div>
        <div @click="registerBool = true">{{ $t("login['注册新账号']") }}</div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <van-popup
      v-model="registerBool"
      duration="0"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      class="zhuceOpenClass"
      lock-scroll
    >
      <titleBar
        :title_name="tLogin('注册')"
        class="titleBar"
        left_icon="arrow-left"
        @toLeft="registerBool = false"
      />
      <van-field
        :disabled="CodeShow"
        v-model.trim="registerForm.invitationCode"
        :label="tLoginPage('邀请码')"
        :placeholder="tLoginPage('请填写邀请码')"
        maxlength="12"
      />
      <van-field
        v-model.trim="registerForm.userNo"
        :label="tLoginPage('账号')"
        :placeholder="tLoginPage('请输入您要注册的账号')"
        maxlength="12"
      />
      <van-field
        v-model.trim="registerForm.loginPwd"
        :label="tLoginPage('登录密码')"
        :placeholder="tLoginPage('请输入您的登录密码')"
        :type="loginPwdBool ? 'text' : 'password'"
        :right-icon="
          require(loginPwdBool
            ? '../../assets/login/dl_ky.png'
            : '../../assets/login/denglu_mm2.png')
        "
        @click-right-icon="clickIcon_2"
        maxlength="32"
      />
      <!-- <van-field
          v-model.trim="registerForm.confirmLoginPwd"
          type="password"
          label="确认密码"
          placeholder="请再次输入您的登录密码"
          maxlength="32"
        /> -->
      <van-field
        class="yzmInput"
        v-model.trim="registerForm.code"
        :label="$t('login[\'验证码\']')"
        :placeholder="$t('login[\'输入验证码\']')"
      >
        <template #button>
          <validCode ref="validCode" @update="validCode" />
        </template>
      </van-field>
      <div class="tologin" @click="registerBool = false">
        {{ tLoginPage('已有账号提示') }}
      </div>
      <div class="zhuceOpenClass_butBox">
        <div @click="registerSubmit()" class="_ljzc">
          {{ tLoginPage('立即注册') }}
        </div>
        <div @click="registerBool = false" class="_dlyx">
          {{ tLoginPage('登录游戏') }}
        </div>
        <div @click="xiazai()" class="_appxz">
          <i class="iconfont"></i>{{ tLoginPage('请注册完成后再下载APP') }}
        </div>
      </div>
    </van-popup>

    <!--用户协议-->
    <van-popup
      style="background-color: #3c6bd5"
      v-model="userAgreement"
      duration="0"
      :style="{ height: '100%', width: '100%' }"
      lock-scroll
    >
      <div class="userAgreementBody">
        <div class="title flex-center flex-justify-center">
          <img src="../../assets/login/yhxy.png" />{{ tLoginPage('用户协议') }}
        </div>
        <div class="but flex-center flex-justify-center">
          <span
            @click="userAgreement = false"
            class="flex-center flex-justify-center"
            ><img src="../../assets/login/gb.png" />{{ tLoginPage('不同意') }}</span
          >
          <span @click="onConsent" class="flex-center flex-justify-center"
            ><img src="../../assets/login/ty.png" />{{ tLoginPage('同意') }}</span
          >
        </div>
        <div class="info" v-html="agreementHtml"></div>
      </div>
    </van-popup>
    <!-- 客服悬浮按钮 -->
    <div class="positionFixed" v-show="guanbiShow">
      <van-icon
        class="guanbi"
        name="clear"
        @click="
          guanbiShow = false;
          xiugaimimaOpen = false;
        "
      />
      <div @click="toService()">
        <img src="../../assets/首页/home/cp/kf.png" />
      </div>
    </div>

    <!--  修改密码-->
    <van-popup
      v-model="xiugaimimaOpen"
      duration="0"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <xiugaimima
        @onQuit="xiugaimimaOpen = false"
        @queding="userAgreement = true"
        :loginForm="loginForm"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import md5 from "js-md5";
import validCode from "./Vcode";
import xiugaimima from "./xiugaimima.vue";
import { availableLocales, setLocale } from '@/lang';
export default {
  components: { validCode, xiugaimima },
  data() {
    return {
      currentLocale: this.$i18n.locale,
      localeOptions: availableLocales.map(item => ({
        text: item.label,
        value: item.value,
      })),
      xiugaimimaOpen: false,
      guanbiShow: true,
      tokenData: {},
      userAgreement: false,
      contactTheWay: "",
      registerBool: false,
      loginLoading: false,
      checkedPwd: false,
      loginPwdBool: false,
      show: true,
      hotVersion: sessionStorage.getItem("hotVersion") || "1.011",
      loginForm: {
        userNo: "",
        loginPwd: "",
        code: "",
        uuid: "",
      },
      imgCode: "",
      loginImgCode: "",
      registerForm: {
        userNo: "",
        loginPwd: "",
        confirmLoginPwd: "",
        code: "",
        invitationCode: "",
        uuid: "",
      },
      CodeShow: false,
      accountPact: "",
      imgShow: false,
    };
  },
  computed: {
    agreementHtml() {
      return this.accountPact || this.tLoginPage('用户协议内容');
    },
  },
  watch: {
    '$i18n.locale'(val) {
      this.currentLocale = val;
    }
  },
  created() {
    this.$store.state.loading = false;
    //初始化数据
    this.initialize();
  },
  mounted() {
    // this.getAccountPact();
  },
  methods: {
    tLogin(key) {
      return this.$t(`login['${key}']`);
    },
    tLoginPage(key) {
      return this.$t(`loginPage['${key}']`);
    },
    toService() {
      this.toPath("Service");
      return;
      this.$dialog
        .confirm({
          className: "kf",
          title: this.tLoginPage('请选择客服'),
          confirmButtonText: this.tLoginPage('客服通道2'),
          cancelButtonText: this.tLoginPage('客服通道1'),
        })
        .then(() => {
          this.toPath("customerService");
        })
        .catch(() => {
          this.toPath("Service");
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
    //获取用户协议
    getAccountPact() {
      this.$ajax.get("/accountPact/").then((res) => {
        if (res.data) {
          this.accountPact = JSON.parse(res.data).str;
        }
      });
    },
    initialize() {
      //H5获取URL推广码
      function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
      }
      let c = getUrlParam("c");
      if (c) {
        this.CodeShow = true;
        this.registerForm.invitationCode = c;
        this.show = false;
      } else {
        this.CodeShow = false;
      }
      //是否记住密码
      if (localStorage["checkedPwd"] == "true") {
        this.checkedPwd = true;
        this.loginForm = {
          userNo: localStorage.getItem("userNo"),
          loginPwd: localStorage.getItem("loginPwd"),
        };
      } else {
        localStorage["userNo"] = "";
        localStorage["loginPwd"] = "";
      }
    },
    //接受图片验证码
    validCode(data, uuid) {
      this.imgCode = data;
      this.registerForm.uuid = uuid || "";
    },
    //接受图片验证码
    validCode2(data, uuid) {
      this.imgShow = true;
      this.loginImgCode = data || "";
      this.loginForm.uuid = uuid || "";
    },
    clickIcon_1() {
      this.loginForm.userNo = "";
      this.loginForm.loginPwd = "";
    },
    clickIcon_2() {
      this.loginPwdBool = !this.loginPwdBool;
    },

    registerSubmit() {
      let data = this.registerForm;
      if (data.userNo == "") {
        this.$toast(this.tLoginPage('用户名不能为空'));
        return;
      }
      // 匹配字符串中的大写字母
      var reg = /[A-Z]/g; // 匹配大写字母
      var result = data.userNo.match(reg);
      if (result) {
        this.$toast(this.tLoginPage('会员账号只能使用小写字母'));
        return;
      }
      if (data.userNo.length < 4 || data.userNo.length > 12) {
        this.$toast(this.tLoginPage('会员账号长度为4~12个字符'));
        return;
      }
      if (data.loginPwd == "") {
        this.$toast(this.tLoginPage('登录密码不能为空'));
        return;
      }
      data.confirmLoginPwd = data.loginPwd;
      if (data.confirmLoginPwd == "") {
        this.$toast(this.tLoginPage('确认密码不能为空'));
        return;
      }
      if (data.loginPwd != data.confirmLoginPwd) {
        this.$toast(this.tLoginPage('登录密码和确认密码必须一致'));
        return;
      }
      if (data.invitationCode == "") {
        this.$toast(this.tLoginPage('请填写邀请码'));
        return;
      }
      this.$store.state.loading = true;
      this.$ajax
        .post("/user/register/submit", data)
        .then((res) => {
          this.loginForm.userNo = data.userNo;
          this.loginForm.loginPwd = data.loginPwd;
          this.loginForm.code = data.code;
          this.loginForm.uuid = data.uuid;
          setTimeout(() => {
            this.loginSubmit();
          }, 500);
        })
        .catch((error) => {
          this.$refs.validCode.refreshCode();
          this.$toast(error);
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    loginSubmit() {
      let data = this.loginForm;
      if (data.userNo == "") {
        this.$toast(this.tLoginPage('用户名不能为空'));
        return;
      }
      if (data.loginPwd == "") {
        this.$toast(this.tLoginPage('登录密码不能为空'));
        return;
      }
      this.$store.state.loading = true;
      this.$ajax
        .post("/user/login", data)
        .then((res) => {
          if (this.checkedPwd) {
            localStorage["checkedPwd"] = "true";
            localStorage["userNo"] = data.userNo;
            localStorage["loginPwd"] = data.loginPwd;
          } else {
            localStorage["checkedPwd"] = "false";
          }
          this.$store.state.noticeShow = true;
          this.tokenData = res.data;
          sessionStorage["sessionId"] = this.tokenData.token;
          if (res.data.tokenUser.initPwd == 1) {
            this.xiugaimimaOpen = true;
          } else {
            this.userAgreement = true;
          }
        })
        .catch((error) => {
          if (error.indexOf("undefined") > -1) {
            return;
          }
          this.$refs.validCode.refreshCode();
          this.$toast(error);
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    onConsent() {
      // this.$toast("登录成功");
      this.$router.push({ path: "/" });
    },
    xiazai() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        this.$store.state.isiosOpen = true;
      } else {
        this.$toast(this.tLoginPage('正在下载'));
        if(this.$store.state.downloadUrl){
          window.open(this.$store.state.downloadUrl);
        }
      }
    },
    handleLocaleChange(value) {
      setLocale(value);
      this.currentLocale = value;
    },
  },
};
</script>
<style lang="scss">
.login {
  .bet {
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    height: 100vh;
    width: 100%;
    #mainiframe {
      width: 100%;
      height: 88%;
    }
  }
  .van-field__control {
    color: #000;
  }
  .van-cell:not(:last-child)::after {
    border: none;
  }
  .registerBox_2 {
    .van-field__control::placeholder {
      color: white;
      font-family: "Microsoft JhengHei";
    }
    .van-cell__title {
      color: #fff;
    }
  }
  .sjyzm {
    .van-field__left-icon {
      margin-top: 6px;
    }
  }
  .registerBox_height {
    height: 420px !important;
  }
}
</style>
<style lang="scss" scoped>
.login {
  position: relative;
  // text-align: center;
  min-height: 100%;
  background-color: #efeef4;
  .loginMaxBox {
    .bottom-text {
      width: 290px;
      margin: 0 auto;
    }
    .bottom-butBox {
      div {
        height: 44px;
        width: 290px;
        line-height: 44px;
        text-align: center;
        border-radius: 4px;
        margin: 15px auto 0;
        font-size: 16px;
      }
      div:first-child {
        background-color: #146fdf;
        color: #fff;
      }
      div:last-child {
        border: 1px solid #9abbe3;
        line-height: 42px;
        background-color: #e7e7e7;
        color: #146fdf;
      }
    }
  }
  .logo {
    height: 100px;
    width: 244px;
    margin: 0 auto 20px;
    padding-top: 54px;
    img {
      height: 100%;
    }
  }
  .locale-switch {
    width: 290px;
    margin: 0 auto 10px;
    >>> .van-dropdown-menu__bar {
      background-color: transparent;
      box-shadow: none;
      border: 1px solid #dcdcdc;
      border-radius: 6px;
    }
    >>> .van-dropdown-menu__title {
      color: #146fdf;
    }
  }
  .goTo {
    padding: 15px;
    font-size: 12px;
    color: #fff;
  }
  .loginBox {
    margin: 0px auto;
    width: 290px;
    color: #000;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
    .van-cell {
      background: none;
      padding: 0;
      box-sizing: border-box;
      >>> .van-field__right-icon {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
      }
      >>> input {
        padding: 8px 16px;
        box-sizing: border-box;
        border: 2.5px solid #fff;
        border-radius: 5px;
        font-size: 18px;
      }
      >>> input:focus-visible {
        border: 2.5px solid #4fafff;
      }
    }
    .loginBox_1 {
      text-align: center;
      width: 100%;
      .van-form {
        .van-cell {
          border-radius: 2px;
        }
      }
    }
    .loginBox_2 {
      text-align: center;
      width: 100%;
      .van-form {
        .van-cell {
          border-radius: 2px;
          background-color: #fff;
        }
      }
    }
  }
  .registerBox {
    margin: 0px auto;
    width: calc(100% - 60px);
    height: 370px;
    color: #000;
    border-radius: 10px;
    background-color: #fff;
    .registerBox_2 {
      position: relative;
      text-align: center;
      padding: 5px 15px;
      height: 100%;
      .registerBox_1_title {
        font-family: pf-Heavy;
        font-size: 20px;
        margin: 0 0 10px 0;
      }
      .pawButton {
        font-family: pf-Medium;
        .pawButton_1 {
          .van-button--default {
            color: white;
            border: none;
            background: none;
            background-image: url("../../assets/login/denglu_sjhzc2.png");
            background-size: 100% 100%;
            height: 38px;
            line-height: 38px;
            margin-bottom: 10px;
          }
        }
        .pawButton_2 {
          .van-button--default {
            color: white;
            border: none;
            background: none;
            background-image: url("../../assets/login/denglu_sjhzc1.png");
            background-size: 100% 100%;
            height: 38px;
            line-height: 38px;
            margin-bottom: 10px;
          }
        }
      }
      .van-form {
        .registerButton1 {
          border: none;
          background: none;
          background-color: rgba(242, 222, 197, 0.5);
          color: white;
        }
        .van-cell {
          border-radius: 50px;
          margin-bottom: 10px;
          background-color: rgba(253, 255, 253, 0.42);
        }
        .sjyzm {
          padding-top: 5px;
          padding-bottom: 5px;
          padding-right: 5px;
          .van-field__button {
            .van-button--primary {
              border: none;
              background: none;
              background-image: url("../../assets/login/denglu_sjhzc1.png");
              background-size: 100% 100%;
              border-radius: 50px;
              width: 110px;

              height: 36px;
              line-height: 36px;
            }
          }
        }
        .imgyzm {
          position: absolute;
          bottom: 81.5px;
          right: 40px;
        }
      }
    }
  }
}
video {
  position: fixed;
  right: 0px;
  top: 0px;
  min-height: 100vh;
  /*min-width: 100%;*/
  /*height: auto;*/
  width: auto;
  /*加滤镜*/
  /*filter: blur(15px); //背景模糊设置 */
  /*-webkit-filter: grayscale(100%);*/
  /*filter:grayscale(100%); //背景灰度设置*/
  z-index: -11;
}
source {
  /*min-width: 100%;*/
  /*min-height: 100%;*/
  /*height: auto;*/
  /*width: auto;*/
}
</style>
<style lang="scss">
.login {
  .yzmInput {
    border-bottom: 1px solid #d0d0d0;
    .van-field__button {
      padding-left: 0;
    }
    input{
      // width: 160px;
    }
  }
  .zhuceOpenClass {
    background: #fafafa;
    .titleBar {
      margin-bottom: 12px;
    }
    .van-cell {
      background-color: #fff;
      border-top: 1px solid #d0d0d0;
      overflow: visible;
      padding: 0;
      height: 43.5104px;
      line-height: 43.5104px;
      font-size: 17.4071px;
      color: #000;
      box-sizing: border-box;
      .van-cell__title {
        text-indent: 8.70356px;
      }
      .van-field__label {
        width: 94px !important;
      }
      .van-field__right-icon {
        padding-right: 0;
        margin-right: 17.4071px;
      }
      .van-field__control {
        // width: calc(100% - 94px);
      }
    }
    .tologin {
      font-size: 15.2312px;
      color: #dc2e2e;
      margin: 15.2312px 23.4375px;
      float: right;
    }
    .zhuceOpenClass_butBox {
      text-align: center;
      font-size: 21.7589px;
      color: #fff;
      ._ljzc,
      ._dlyx,
      ._appxz {
        width: 337.5px;
        height: 43.5104px;
        margin: 0 auto;
        line-height: 43.5104px;
        clear: both;
        border-radius: 4.35178px;
        background: -webkit-linear-gradient(
          bottom,
          #dc3b40 2%,
          #dc3b40 50%,
          #db3b40 51%,
          #d7363b
        );
      }
      ._ljzc,
      ._dlyx {
        margin-top: 30px;
      }
      ._appxz {
        margin-top: 5px;
      }
    }
  }
  .positionFixed {
    position: fixed;
    right: 10px;
    bottom: 100px;
    img {
      width: 60px;
    }
    .guanbi {
      position: absolute;
      top: -20px;
      right: 0px;
      font-size: 20px;
    }
  }
  .van-field__control:disabled {
    // color: #fff !important;
  }
}
.remember_pawButton {
  margin-top: 20px;
  font-family: pf-Medium;
  font-size: 13px;
  .van-checkbox {
    .van-checkbox__label {
      color: #000;
      margin: 0px;
    }
  }
}
.userAgreementBody {
  .title {
    height: 64.6667px;
    font-size: 18.75px;
    color: #fff;
    letter-spacing: 3px;
    img {
      height: 25px;
      margin: 0 13px;
    }
  }
  .but {
    padding: 15px 0;
    span {
      color: #fff;
      font-size: 21.7589px;
      height: 44.6667px;
      width: 110px;
      margin: 0 6px;
      border-radius: 3px;
      img {
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
    }
    span:first-child {
      background-color: #4fafff;
    }
    span:last-child {
      background-color: #ffb323;
    }
  }
  .textBox {
  }
  .info {
    text-align: left;
    padding: 15px;
    margin: 0 10px;
    position: relative;
    background: #fff;
    color: #333;
    font-size: 0.6rem;
    border-radius: 3px;
    font-size: 14.0625px;
    ul {
      li {
        padding-bottom: 10px;
        margin: 5px 0 10px 15px;
        list-style-type: decimal;
        line-height: 20px;
        &:not(:last-of-type) {
          border-bottom: 1px solid #c7c7c7;
        }
      }
      .text_color {
        color: #ff0b0b;
        &:last-of-type {
          margin-bottom: 30px;
        }
      }
    }
    p {
      padding: 5px 0;
      text-align: center;
      color: red;
      font-size: 16.4062px;
      margin: 0;
    }
  }
}
</style>
