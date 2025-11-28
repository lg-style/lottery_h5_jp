<template>
  <div class="extendPage">
    <titleBar
      :title_name="tExtend('全民推广')"
      class="titleBar"
      left_icon="arrow-left"
      @toLeft="to"
    />
    <div class="imgTitle">
      <img src="../../assets/首页/home/imgText.png" />
    </div>
    <div class="gele_href">
      <div class="gele_href_text1">
        <span>{{ tExtend('复制您的专属网址，分享给好友') }}</span>
      </div>
      <div class="copy_href">
        <input type="text" :value="url" disabled="disabled" />
        <div class="copy_btn" @click="handleCopy(url, $event)">
          {{ tExtend('复制网址分享') }}
        </div>
      </div>
      <div class="saveText">
        <span>{{ tExtend('保存二维码图片，发送给好友扫描，并下载注册') }}</span>
      </div>
      <div class="save_code">
        <canvas width="80" height="80" id="canvas"></canvas>
        <div class="download-btn" @click="xiazaiQRCode()">
          {{ tExtend('下载图片') }}
        </div>
        <!---->
      </div>
      <div class="copy_href">
        <span class="tocenter">{{ tExtend('修改退水，请前往代理中心') }}</span>
        <span class="copy_btn" @click="toPath('agentPage')">
          {{ tExtend('前往代理中心') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import clip from "../../util/clipboard.js"; // use clipboard directly
import QRCode from "qrcode";
export default {
  components: {},
  data() {
    return {
      url: "dsfdsfdsfdsfsdf",
    };
  },
  computed: {},
  mounted() {
    this.getAgentPromotion();
  },
  methods: {
    xiazaiQRCode() {
      var canvas = document.getElementById("canvas");
      let base64 = canvas.toDataURL("image/png");
      this.downloadFileByBase64(base64, 'QRCode');
    },
    downloadFileByBase64(base64, name) {
      var myBlob = this.dataURLtoBlob(base64);
      var myUrl = URL.createObjectURL(myBlob); //创建图片的临时url
      this.downloadFile(myUrl, name);
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    downloadFile(url, name) {
      var a = document.createElement("a"); //新建一个a链接
      a.setAttribute("href", url); // a链接的url为图片的url
      a.setAttribute("download", name);
      a.setAttribute("target", "_blank");
      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      a.dispatchEvent(clickEvent);
    },
    handleCopy(text, event) {
      //复制
      this.$toast(this.tExtend('复制成功'));
      clip(text, event);
    },
    getAgentPromotion() {
      this.$ajax.post(`/agent/promotion`).then((res) => {
        this.url = res.data.spreadUrl;
        this.useqrcode(this.url);
      });
    },
    useqrcode(url) {
      var canvas = document.querySelector("#canvas");
      // 调用函数去生成二维码，参数依次为：二维码的容器、要生成的内容、回调函数
      QRCode.toCanvas(canvas, url, { margin: 0 }, function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log("success!");
        }
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
    to() {
      this.$router.go(-1);
    },
    tExtend(key) {
      return this.$t(`homeExtend['${key}']`);
    },
  },
};
</script>

<style lang="scss" scoped>
.extendPage {
  overflow: hidden;
  height: 100%;
  background: url("../../assets/首页/home/agency_all_bg.png") 0 50px no-repeat;
  background-size: 100% auto;
  .imgTitle {
    width: 97%;
    margin: 11.719px auto;
    text-align: center;
    img {
      width: 82.6667%;
      height: 21.8667%;
    }
  }
  .gele_href {
    background: url("../../assets/首页/home/bg2.png") 0 0 no-repeat;
    background-size: 100%;
    width: 100%;
    height: 76.5333%;
    margin-top: 40px;
    font-size: 14px;
    color: #333;
    .gele_href_text1 {
      padding-top: 10%;
      padding-left: 10.6667%;
      span {
        font-size: 14px;
      }
    }
    .copy_href {
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding: 4.6875px 0;
      border-bottom: 1px solid #eee;
      width: 72.2667%;
      margin-left: 50px;
      input {
        border: none;
        background: #f3f3f3;
        width: 66.9333%;
        height: 36px;
        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 6.25008px;
      }
      .copy_btn {
        width: 40%;
        line-height: 36px;
        text-align: center;
        background: url("../../assets/首页/home/cope_but.png") 0 0 no-repeat;
        background-size: 100% 100%;
        color: #fff;
        border-radius: 1.875px;
      }
      .tocenter {
        margin-top: 8px;
        width: 220px;
      }
    }
    .saveText {
      color: #333;
      padding-top: 3.12492px;
      padding-left: 40px;
    }
    .save_code {
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding: 4.6875px 0;
      border-bottom: 1px solid #eee;
      width: 70%;
      margin: 10px auto 4.6875px;
      #canvas {
        width: 80px !important;
        height: 80px !important;
      }
      .download-btn {
        width: 30%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: url("../../assets/首页/home/xiazai.png") 0 0 no-repeat;
        background-size: 100% 100%;
        color: #fff;
        margin-top: 40px;
      }
    }
  }
}
</style>
