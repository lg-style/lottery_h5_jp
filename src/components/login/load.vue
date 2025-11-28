<template>
  <div class="load">
    <div class="bj">
      <div style="text-align: center">
      </div>
      <div class="updateBody">
        <div class="title">
          {{ $t("loginPage['版本号']") }}：v{{ $store.state.VersionData.appVersion }}
        </div>
        <div class="body" v-html="$store.state.VersionData.updateBody"></div>
      </div>
      <div class="progressBar">
        <div>
          <van-loading color="#c2c2c2" size="24px" vertical v-if="hotType<=10">
            {{ $t("loginPage['检查更新进度']", { percent: hotType }) }}
          </van-loading>
          <van-loading color="#c2c2c2" size="24px" vertical v-else-if="hotType<=90">
            {{ $t("loginPage['正在下载进度']", { percent: hotType }) }}
          </van-loading>
          <van-loading color="#c2c2c2" size="24px" vertical v-else-if="hotType<=95">
            {{ $t("loginPage['安装进度']", { percent: hotType }) }}
          </van-loading>
          <van-loading color="#c2c2c2" size="24px" vertical v-else-if="hotType<=100">
            {{ $t("loginPage['完成进度']", { percent: hotType }) }}
          </van-loading>
          <!--<van-loading color="#fff" size="24px" vertical v-else-if="hotType==4">获取版本号失败，请重启APP!</van-loading>-->
          <div class="progress_bar">
            <van-progress
              :percentage="hotType"
              stroke-width="8"
              color="linear-gradient(to right, #c2c2c2, #737EA9)"
            />
          </div>
        </div>
      </div>
    </div>
    <span style="position: absolute;top: 10px;right: 10px;opacity: 0.1">{{ num }}</span>
  </div>
</template>

<script>
  import hotUpdate from '../../util/hotUpdate'
  import axios from "axios";
  export default {
    name: 'load',
    data () {
      return {
        num:1,
        hotType:0,
      }
    },
    created () {
      this.getlinkUrlArr()
    },
    watch: {
      //热更状态该表是
      "$store.state.hotType": function(n,o) {
        this.hotType = n;
        if(this.hotType>=100){
          this.onLoad()
        }
      },
    },
    methods: {
      getlinkUrlArr(){
        this.$ajax.get(`https://hotupdate2021.oss-cn-hongkong.aliyuncs.com/linkUrlArr.json?time=${Math.round(Math.random()*10000)}`
        ).then(res => {
          this.$store.state.linkUrlArr=res.h5Arr
          let num =parseInt(res.h5Arr.length*Math.random())
          axios.defaults.baseURL=res.h5Arr[num].linkUrl+'/api'
          this.$store.state.baseURL=axios.defaults.baseURL
          this.getHotUpdate()
        }).catch(()=>{
          setTimeout(()=>{
            this.num++
            this.getlinkUrlArr()
          },3000)
        })
      },
      //获取热更信息
      getHotUpdate(){
        this.$ajax.post('/sys/getVersion'
        ).then(res => {
          if(res.data){
            if(res.data.updateBody){
              res.data.updateBody=res.data.updateBody.replace(/\n/g,"<br>")
            }
            this.$store.state.VersionData=res.data
            console.log('热更=====')
            hotUpdate.get()
          }
        }).catch(error => {
          this.$toast(error);
        })
      },
      onLoad(){
        sessionStorage.setItem('load', true);
        this.onSkip()
      },
      onSkip(){
        setTimeout(()=>{
          this.$router.push({path: '/'})
        },300)
      }
    }
  }
</script>
<style>
  .van-progress__pivot{
    background: url("../../assets/new/touzi/6.png") !important;
    background-size: 100% 100% !important;
    width: 23px !important;
    height: 23px !important;
    border-radius: 50% !important;
    padding: 0px !important;
    min-width: 20px !important;
    color: rgba(255, 255, 255, 0) !important;
    top: 3px !important;
    /*animation:turn 0.5s linear infinite;*/
  }

  @keyframes turn{
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);}
  }
</style>
<style scoped lang="scss">
  .load{
    .progress_bar{
      width: 80%;
      margin: 10px auto;
    }
    .bj{
      position: fixed;
      right: 0px;
      bottom: 0px;
      height: 100%;
      width: 100%;
      z-index:-11;
      background-size: 100% 100% !important;
      background-color: #000000 !important;
      background: url("../../assets/login/denglu_bj.png");
      .bjImg{
        height: 65px;
        margin: 80px auto 35px;
      }
      .updateBody{
        border-radius: 5px;
        margin: 30px auto;
        width: 75%;
        line-height: 25px;
        background-color: #fff;
        box-shadow: 1px 1px 15px rgba(153, 153, 153, 0.5);
        color: #000;
        padding: 10px;
        .title{
          padding: 0 10px;
          line-height: 30px;
        }
        .body{
          height: 250px;
          overflow: auto;
        }
      }
      .progressBar{
        position: absolute;
        bottom: 0px;
        width: 100%;
      }
      .van-loading__text{
        color: #000;
      }
      .progress{
        width: 100%;
        height: 30px;
        font-size: 11px;
        position: absolute;
        top: 0px;
        color: white;
        .time{
          text-align: center;
          float: right;
          background-color: rgba(168, 168, 168, 0.62);
          width: 55px;
          height: 20px;
          line-height: 22px;
          border-radius: 5px;
          margin: 10px 10px;
        }
        .skip{
          text-align: center;
          height: 20px;
          line-height: 22px;
          border-radius: 10px;
          width: 55px;
          float: right;
          background-color: rgba(168, 168, 168, 0.62);
          margin: 10px 10px;
        }
      }
    }
  }
  @media screen and (max-aspect-ratio: 8/16) {
    .bjImg{
      margin-top: 50px;
    }
    .progressBar{
      bottom: 1.5rem;
    }
  }
</style>
