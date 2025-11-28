<template>
  <div class="login">
    <!--背景-->
    <div class="bj">
      <img class="bjImg" :src="require('../../assets/login/denglu_bj.png')" width="100%" height="100%"/>
      <div class="hotVersion">
        V{{ hotVersion }}
      </div>
    </div>

    <!--<video autoplay loop muted>-->
    <!--<source :src="require('../../assets/login/login.mp4')" type="video/mp4"  />-->
    <!--</video>-->
    <div class="locale">
    </div>
    <!--登录-->
    <div class="logo">
      <!-- <img :src="require('../../assets/login/logoImg.png')"/> -->
    </div>
    <div class="loginMaxBox" >
      <van-row class="loginBox">
        <van-col v-if="show" span="20" class="loginBox_1">
          <van-row type="flex" justify="space-between">
            <div class="loginBox_1_title"  @click="show=true" :class="{'loginBox_1_title_show':show}">{{ $t("login['登录']") }}</div>
            <div class="loginBox_1_title"  @click="show=false" :class="{'loginBox_1_title_show':!show}">{{ $t("login['注册']") }}</div>
          </van-row>
          <van-form style="margin-top: 0.6rem">
            <van-field
              v-model.trim="loginForm.userNo"
              name="用户名"
              :left-icon="require('../../assets/login/denglu_yhm1.png')"
              :right-icon="require('../../assets/login/denglu_yhm2.png')"
              @click-right-icon="clickIcon_1"
              :placeholder="$t('login[\'用户名\']')"
              maxlength="12"
            />
            <van-field
              v-model.trim="loginForm.loginPwd"
              :type="loginPwdBool?'text':'password'"
              name="密码"
              :left-icon="require('../../assets/login/denglu_mm1.png')"
              :right-icon="require(loginPwdBool?'../../assets/login/dl_ky.png':'../../assets/login/denglu_mm2.png')"
              @click-right-icon="clickIcon_2"
              :placeholder="$t('login[\'密码\']')"
              maxlength="32"
            />
            <van-field
              v-model.trim="loginForm.code"
              :left-icon="require('../../assets/login/denglu_yzm.png')"
              name="验证码"
              :placeholder="tLogin('输入验证码')"
            >
              <template #button>
                <validCode ref="validCode" @update="validCode2" v-if="show"/>
              </template>
            </van-field>
            <div style="margin-top: 0.8rem;padding: 0 20px">
              <van-button round block @click="loginSubmit" class="loginButton1"
                          :loading="loginLoading">{{ $t("login['登录']") }}</van-button>
              <van-row class="remember_pawButton">
                <van-col span="12" style="text-align: left">
                  <van-checkbox v-model="checkedPwd" checked-color="#D83441" @change="checkedPwdF">
                    {{ $t("login['记住密码']") }}
                  </van-checkbox>
                </van-col>
                <van-col span="12" @click="toService()" style="color: #D83441;text-align: right">{{ $t("login['忘记密码']") }} ?</van-col>
              </van-row>
            </div>
          </van-form>
          <van-divider @click="toService()" :style="{borderColor:'#c2c2c2'}"
                       style="font-size: 0.35rem;color: #c2c2c2;margin-top: 1.5rem;">
            <img src="../../assets/login/asd.png" style="width: 0.45rem;"/>
            <div style="margin-left: 0.1rem;color: #999">{{ $t("new2['联系我们']") }}</div>
          </van-divider>
        </van-col>
        <van-col v-if="!show" span="20" class="loginBox_2">
          <van-row type="flex" justify="space-between">
            <div class="loginBox_1_title"  @click="show=true" :class="{'loginBox_1_title_show':show}">{{ $t("login['登录']") }}</div>
            <div class="loginBox_1_title"  @click="show=false" :class="{'loginBox_1_title_show':!show}">{{ $t("login['注册']") }}</div>
          </van-row>
          <van-form v-show="!registerBool">
            <van-field
              :disabled="CodeShow"
              v-model.trim="registerForm.invitationCode"
            :label="tLoginPage('邀请码')"
              name="邀请码"
            :placeholder="tLoginPage('请填写邀请码')"
              maxlength="12"
            />
            <van-field
              v-model.trim="registerForm.userNo"
              :left-icon="require('../../assets/login/denglu_yhm1.png')"
              name="用户名"
              :placeholder="$t('login[\'用户名\']')"
              maxlength="12"
            />
            <van-field
              v-model.trim="registerForm.loginPwd"
              :left-icon="require('../../assets/login/denglu_mm1.png')"
              type="password"
              name="密码"
              :placeholder="$t('login[\'密码\']')"
              maxlength="32"
            />
            <van-field
              v-model.trim="registerForm.confirmLoginPwd"
              :left-icon="require('../../assets/login/denglu_mm1.png')"
              type="password"
              name="确认密码"
              :placeholder="$t('login[\'确认密码\']')"
              maxlength="32"
            />
            <van-field
              v-model.trim="registerForm.code"
              :left-icon="require('../../assets/login/denglu_yzm.png')"
              name="验证码"
            :placeholder="tLogin('输入验证码')"
            >
              <template #button>
                <validCode ref="validCode" @update="validCode"/>
              </template>
            </van-field>
            <div>
              <div id="submit">
                <van-button round block :loading="loginLoading" @click="registerSubmit"
                            :loading-text="$t('login[\'注册\']')+'...'"
                            class="loginButton1">
                  {{ $t('login[\'注册\']') }}
                </van-button>
              </div>
            </div>
          </van-form>
        </van-col>
      </van-row>
    </div>

    <!--用户协议-->
    <van-popup
      v-model="userAgreement"
      position="bottom"
      duration="0.2"
      :style="{ height: '100%',width:'100%'}"
    >
      <div class="userAgreementBody">
        <div class="title">{{ tLoginPage('用户协议') }}</div>
        <div class="but">
          <span @click="userAgreement=false">{{ tLoginPage('不同意') }}</span>
          <span @click="onConsent">{{ tLoginPage('同意') }}</span>
        </div>
        <div class="textBox" v-html="agreementHtml"></div>
      </div>
    </van-popup>


  </div>
</template>

<script>
  import {mapState,mapActions} from "vuex";
  import md5 from 'js-md5';
  import validCode from "./Vcode"
  export default {
    components: { validCode },
    data() {
      return {
        tokenData:{},
        userAgreement:false,
        contactTheWay:'',
        registerBool:false,
        loginLoading:false,
        checkedPwd:false,
        loginPwdBool:false,
        show:true,
        hotVersion:sessionStorage.getItem('hotVersion')|| '1.011',
        loginForm:{
          userNo: '',
          loginPwd: '',
          code:'',
          uuid:'',
        },
        imgCode:'',
        loginImgCode:'',
        registerForm:{
          userNo: '',
          loginPwd: '',
          confirmLoginPwd: '',
          code:'',
          invitationCode:'',
          uuid:'',
        },
        CodeShow:false,
        accountPact:'',
      };
    },
  computed: {
    agreementHtml() {
      return this.accountPact || this.tLoginPage('用户协议内容');
    },
  },
    created(){
      this.$store.state.loading=false
      //初始化数据
      this.initialize()
    },
    mounted() {
      this.getAccountPact()
    },
    methods: {
    tLogin(key) {
      return this.$t(`login['${key}']`);
    },
    tLoginPage(key) {
      return this.$t(`loginPage['${key}']`);
    },
      toService(){
        this.toPath('Service')
        return;
        this.$dialog.confirm({
          className:'kf',
          title:this.tLoginPage('请选择客服'),
          confirmButtonText:this.tLoginPage('客服通道2'),
          cancelButtonText:this.tLoginPage('客服通道1'),
        }).then(() => {
          this.toPath('customerService')
        }).catch(() => {
          this.toPath('Service')
        });
      },
      toPath(path){
        this.$router.push(
          {
            path: path,
            query:{
              redirect:this.$route.path
            }})
      },
      //获取用户协议
      getAccountPact(){
        this.$ajax.get('/accountPact/'
        ).then(res => {
          if(res.data){
            this.accountPact = JSON.parse(res.data).str
          }
        })
      },
      initialize(){
        //H5获取URL推广码
        function getUrlParam(name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
          var r = window.location.search.substr(1).match(reg);  //匹配目标参数
          if (r != null) return unescape(r[2]); return null; //返回参数值
        }
        let c = getUrlParam('c')
        if(c){
          this.CodeShow=true
          this.registerForm.invitationCode=c
          this.show=false
        }else {
          this.CodeShow=false
        }
        //是否记住密码
        if(localStorage.getItem('checkedPwd')=='true'){
          this.loginForm={
            userNo: localStorage.getItem('userNo'),
            loginPwd: localStorage.getItem('loginPwd'),
          }
        }else {
          localStorage['userNo']=''
          localStorage['loginPwd']=''
        }
      },
      checkedPwdF(val){
        localStorage.setItem('checkedPwd', val);
      },
      //接受图片验证码
      validCode(data,uuid){
        this.imgCode=data
        this.registerForm.uuid = uuid || '';
      },
      //接受图片验证码
      validCode2(data,uuid){
        this.loginImgCode = data || '';
        this.loginForm.uuid = uuid || '';
      },
      clickIcon_1(){
        this.loginForm.userNo=''
        this.loginForm.loginPwd=''
      },
      clickIcon_2(){
        this.loginPwdBool = !this.loginPwdBool
      },

      registerSubmit(){
        let data = this.registerForm
        if(data.userNo==''){
          this.$toast(this.tLoginPage('用户名不能为空'))
          return;
        }
        if(data.userNo.length<4||data.userNo.length>12){
          this.$toast(this.tLoginPage('会员账号长度为4~12个字符'))
          return;
        }
        if(data.loginPwd==''){
          this.$toast(this.tLoginPage('登录密码不能为空'))
          return;
        }
        if(data.confirmLoginPwd==''){
          this.$toast(this.tLoginPage('确认密码不能为空'))
          return;
        }
        if(data.loginPwd!=data.confirmLoginPwd){
          this.$toast(this.tLoginPage('登录密码和确认密码必须一致'))
          return;
        }
        if(data.invitationCode==''){
          this.$toast(this.tLoginPage('请填写邀请码'))
          return;
        }
        this.$store.state.loading=true
        this.$ajax.post('/user/register/submit',
          data
        ).then(res => {
          this.loginForm.userNo = data.userNo
          this.loginForm.loginPwd = data.loginPwd
          this.loginForm.code = data.code
          this.loginForm.uuid = data.uuid
          setTimeout(()=>{
            this.loginSubmit()
          },500)
        }).catch(error => {
          this.$refs.validCode.refreshCode();
          this.$toast(error);
        }).finally(()=>{
          this.$store.state.loading=false
        })
      },
      loginSubmit(){
        let data=this.loginForm
        if(data.userNo==''){
          this.$toast(this.tLoginPage('用户名不能为空'))
          return;
        }
        if(data.loginPwd==''){
          this.$toast(this.tLoginPage('登录密码不能为空'))
          return;
        }
        this.$store.state.loading=true
        this.$ajax.post('/user/login',
          data
        ).then(res => {
          this.$store.state.noticeShow=true
          localStorage['userNo']=data.userNo
          localStorage['loginPwd']=data.loginPwd
          this.tokenData=res.data
          this.userAgreement=true
        }).catch(error => {
          if(error.indexOf('undefined')>-1){
            return
          }
          this.$refs.validCode.refreshCode();
          this.$toast(error);
        }).finally(()=>{
          this.$store.state.loading=false
        })
      },
      onConsent(){
        sessionStorage['sessionId']=this.tokenData.token
        this.toHome()
      },
      toHome(){
        this.$router.push({path: '/'})
      },
    },
  };
</script>
<style lang="scss">
  .login{
    .bet{
      -webkit-overflow-scrolling: touch;
      overflow-y: scroll;
      height: 100vh;
      width: 100%;
      #mainiframe{
        width: 100%;
        height: 88%;
      }
    }
    .locale{
      padding-top: 40px;
      .van-dropdown-menu__bar{
        background-color: rgba(255, 255, 255, 0.17);
      }
      .van-dropdown-menu__title{
        color: white;
      }
    }
    .van-field__control{
      color: #000;
    }
    .van-cell:not(:last-child)::after{
      border: none;
    }
    .registerBox_2 {
      .van-field__control::placeholder {
        color: white;
        font-family: "Microsoft JhengHei";
      }
      .van-cell__title{
        color: #fff;
      }
    }
    .sjyzm {
      .van-field__left-icon {
        margin-top: 6px;
      }
    }
    .registerBox_height{
      height: 420px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .login{
    position: relative;
    text-align: center;
    .logo{
      height: 65px;
      margin: 30px auto 35px;
      img{
        height: 100%;
      }
    }
    .goTo{
      padding: 15px;
      font-size: 12px;
      color: #fff;
    }
    .loginBox{
      margin: 0px auto;
      width: calc(100% - 60px);
      color: #000;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 1px 1px 15px rgba(153, 153, 153, 0.5);
      .loginBox_1{
        text-align: center;
        padding: 5px 20px;
        width: 100%;
        height: 425px;
        .loginBox_1_title{
          width: 45%;
          display: inline-block;
          font-size: 15px;
          margin: 10px 0 15px;
          font-family: pf-Heavy;
          background-color: #F5F5F5;
          padding: 13px 0;
          color: #999;
          border-radius: 5px;
        }
        .loginBox_1_title_show{
          color: #fff;
          background-color: #D83441;
        }
        .van-form{
          .loginButton1{
            border: none;
            background-color: #D83441;
            color: white;
            box-shadow: 1px 1px 10px rgba(153, 153, 153, 0.87);
          }
          .van-cell{
            border-radius: 2px;
            margin-bottom: 25px;
            background-color: #fff;
            border: 1px solid #ddd;
          }
          .login_bottom_text{
            font-family: pf-Medium;
            margin-top: 15px;
            font-size: 12.5px;
          }
        }
      }
      .loginBox_2{
        text-align: center;
        padding: 5px 20px;
        width: 100%;
        height: 450px;
        .loginBox_1_title{
          width: 45%;
          display: inline-block;
          font-size: 15px;
          margin: 10px 0 30px;
          font-family: pf-Heavy;
          background-color: #F5F5F5;
          padding: 13px 0;
          color: #999;
          border-radius: 5px;
        }
        .loginBox_1_title_show{
          color: #fff;
          background-color: #D83441;
        }
        .van-form{
          .loginButton1{
            margin-top: 20px;
            border: none;
            background-color: #D83441;
            color: white;
            box-shadow: 1px 1px 10px rgba(153, 153, 153, 0.87);
          }
          .van-cell{
            border-radius: 2px;
            margin-bottom: 10px;
            background-color: #fff;
            border: 1px solid #ddd;
          }
          .login_bottom_text{
            font-family: pf-Medium;
            margin-top: 15px;
            font-size: 12.5px;
          }
        }
      }
    }
    .registerBox{
      margin: 0px auto;
      width: calc(100% - 60px);
      height: 370px;
      color: #000;
      border-radius: 10px;
      background-color: #fff;
      .registerBox_2{
        position: relative;
        text-align: center;
        padding: 5px 15px;
        height: 100%;
        .registerBox_1_title{
          font-family: pf-Heavy;
          font-size: 20px;
          margin: 0 0 10px 0;
        }
        .pawButton{
          font-family: pf-Medium;
          .pawButton_1{
            .van-button--default{
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
          .pawButton_2{
            .van-button--default{
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
        .van-form{
          .registerButton1{
            border: none;
            background:none;
            background-color: rgba(242, 222, 197, 0.5);
            color: white;
          }
          .van-cell{
            border-radius: 50px;
            margin-bottom: 10px;
            background-color: rgba(253, 255, 253, 0.42);
          }
          .sjyzm{
            padding-top: 5px;
            padding-bottom: 5px;
            padding-right: 5px;
            .van-field__button{
              .van-button--primary{
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
          .imgyzm{
            position: absolute;
            bottom: 81.5px;
            right: 40px;
          }
        }
      }
    }
  }
  .bj{
    position: fixed;
    right: 0px;
    bottom: 0px;
    height: 100%;
    width: 100%;
    z-index:-11;
    .hotVersion{
      font-size: 13px;
      position: absolute;
      bottom: 10px;
      width: 97%;
      text-align: right;
      color: #000;
      margin-right: 3%;
    }
  }
  video{
    position: fixed;
    right:0px;
    top: 0px;
    min-height: 100vh;
    /*min-width: 100%;*/
    /*height: auto;*/
    width: auto;
    /*加滤镜*/
    /*filter: blur(15px); //背景模糊设置 */
    /*-webkit-filter: grayscale(100%);*/
    /*filter:grayscale(100%); //背景灰度设置*/
    z-index:-11
  }
  source{
    /*min-width: 100%;*/
    /*min-height: 100%;*/
    /*height: auto;*/
    /*width: auto;*/
  }
</style>
<style lang="scss">
  .login{
    .van-field__control:disabled{
      color: #fff !important;
    }
  }
  .remember_pawButton{
    margin-top: 20px;
    font-family: pf-Medium;
    font-size: 13px;
    .van-checkbox{
      .van-checkbox__label{
        color: #000;
        margin: 0px;
      }
    }
  }
  .userAgreementBody{
    background-color: #3C6BD5;
    padding: 10px;
    .title{
      line-height: 50px;
      font-size: 20px;
      color: #fff;
    }
    .but{
      padding: 10px;
      span{
        color: #fff;
        font-size: 22px;
        display: inline-block;
        line-height: 40px;
        width: 100px;
        margin: 0 5px;
        border-radius: 5px;
      }
      span:first-child{
        background-color: #4FAFFF;
      }
      span:last-child{
        background-color: #FFB323;
      }
    }
    .textBox{
      background-color: #fff;
      height: calc(100vh - 130px);
      overflow: auto;
      text-align: left;
      padding: 0 15px;
      .row{
        padding: 10px 0px;
        border-bottom: 1px solid #DDD;
      }
      .row1{
        padding: 10px 0px;
      }
      .row2{
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      .rowBool{
        color: red;
      }
    }
  }
</style>
