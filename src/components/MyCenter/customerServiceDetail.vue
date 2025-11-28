<template>
  <div class="course">
    <div v-show="open">
      <titleBar :title_name="`${chatData.nickname}(${chatData.isOnline ? $t('myCenter[\'在线\']') : $t('myCenter[\'离线\']')})`" @toLeft="open=false" left_icon="arrow-left" class="titleBar"/>
      <div id="im-record" ref="im-record" class="record-list">
        <div
          v-for="(item,index) in msgdataList" :key="index"
          :class="item.sendUsername==userInfo.userNo ? '_right' : '_left'">
          <van-image class="avatar"
            :src="item.sendUsername==userInfo.userNo ?require(`../../assets/MyCenter/face/${userInfo.faceId||0}.jpg`):require('../../assets/首页/home/kf.png')"
          />
          <div class="message-bg">
            <div class="arrow"></div>
            <span class="userNo" v-if="!item.userNo">{{ item.sendUsername==userInfo.userNo?userInfo.userNo:chatData.nickname }}：</span>
            <span class="content" v-html="item.msg.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"></span>
            <div class="time"><span>{{ item.createTime }}</span></div>
          </div>
        </div>
      </div>
      <div class="sendBox">
        <div class="input-in">
        <textarea :placeholder="$t('myCenter[\'请输入\']')" v-model="inputEmoji"
          @keyup.enter="sendMessage(1, inputEmoji)"/>
          <emoji-picker @emoji="append" :search="searchEmoji">
            <div class="emoji-invoker"
              slot="emoji-invoker"
              slot-scope="{ events: { click: clickEvent } }"
              @click.stop="clickEvent">
              <van-icon name="smile-o" class="smile-icon" />
            </div>
            <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
              <div class="emoji-picker" style="bottom: 1.5rem">
                <div class="emoji-picker__search">
                  <input type="text" v-model="searchEmoji" />
                </div>
                <div>
                  <div v-for="(emojiGroup, category) in emojis" :key="category">
                    <!-- <h5>{{ category }}</h5> -->
                    <div class="emojis">
                    <span
                      v-for="(emoji, emojiName) in emojiGroup"
                      :key="emojiName"
                      @click="insert(emoji)"
                      :title="emojiName"
                    >{{ emoji }}</span
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </emoji-picker>
        </div>
        <div class="chat-send">
          <van-button type="primary" @click="sendMessage(1, inputEmoji)" :disabled="loading">{{ $t("myCenter['发送']") }}</van-button>
        </div>
      </div>
    </div>
    <div v-show="!open">
      <titleBar :title_name="$t('myCenter[\'在线客服\']')" @toLeft="to()" left_icon="arrow-left" class="titleBar"/>
      <div class="service_box" :class="{'Online':!k.isOnline}" v-for="(k,i) in serviceList" :key="i" @click="tabService(k)">
        <img src="../../assets/首页/home/kf.png">
        <div class="name">{{ k.nickname }}({{ k.isOnline ? $t("myCenter['在线']") : $t("myCenter['离线']") }})</div>
        <span class="badge">{{ k.num }}</span>
      </div>
    </div>
    <van-loading class="loadingClass" size="24px" vertical v-if="loading">{{ $t("myCenter['连接中']") }}</van-loading>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      open:false,
      serviceList:[],

      loading:false,
      chatData:{},//房间对象
      userList:[],

      //聊天表情
      inputEmoji: "",
      searchEmoji: "",
      //websocket
      msgdataList:[],
      msgdata:
        "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif' align='middle'>你个傻叉#色;",
      ws: null, //建立的连接
      lockReconnect: false, //是否真正建立连接
      timeout: 5 * 1000, //5秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
      count: 1,
    };
  },
  computed: {
    ...mapState(['userInfo','WS_URL']),
  },
  watch: {
    "chatData":{
      handler:function(n,o) {
        let obj = this.serviceList.filter(k=>{return n.chatId==k.chatId})[0]||{}
        this.msgdataList=obj.msgdataList||[]
      },
      deep:true,
    },
    "serviceList":{
      handler:function(n,o) {
        let obj = n.filter(k=>{return this.chatData.chatId==k.chatId})[0]||{}
        this.msgdataList=obj.msgdataList||[]
      },
      deep:true,
    },
  },
  created() {
    this.initWebpack();
  },
  methods: {
    ...mapActions(["getInfo"]),
    //每次滚动到底部
    scrollBottom() {
      this.$nextTick(() => {
        var div = document.getElementById("im-record");
        if(div){
          div.scrollTop = div.scrollHeight;
        }
      });
    },
    //聊天表情
    append(emoji) {
      this.inputEmoji += emoji;
    },
    initWebpack() {
      this.loading=true
      this.ws = new WebSocket(this.WS_URL);
      this.ws.onopen = this.onopen;
      this.ws.onmessage = this.onmessage;
      this.ws.onclose = this.onclose;
      this.ws.onerror = this.onerror;
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      console.log('开启心跳')
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      console.log(self.timeout)
      self.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.ws.readyState == 1) {
          //如果连接正常
          self.ws.send(
            JSON.stringify({
              "protocol":"0002",
            })
          );
        }
      }, self.timeout);
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebpack();
        that.lockReconnect = false;
      }, 5000);
    },
    onopen() {
      this.loading=false
      console.log("连接服务器成功");
      //开启心跳
      this.start();
      //登录
      this.getChatId()
    },
    wsSend(json){
      this.ws.send(
        JSON.stringify(json)
      );
    },
    tabService(k){
      k.num=0
      this.chatData=k
      this.open=true
      this.wsSend({
        "protocol":"0008",
        "username":this.chatData.username
      })
      setTimeout(()=>{
        this.scrollBottom();
      },100)
    },
    getChatId(k){
      let json={
        "protocol":"0001",
        "username":this.userInfo.userNo,
        "role":"user",
        "nickname": this.userInfo.userNo
      }
      console.log('用户登录')
      this.wsSend(json)
      setTimeout(()=>{
        this.wsSend({
          "protocol":"0006",
        })
      },200)
    },
    onmessage(e) {
      let msg = JSON.parse(e.data);
      console.log(msg);
      //匹配客服
      if(msg.protocol=="0007"){
        let list=[]
        for (let i in msg.data){
          let msgdataList=[]
          let num = 0
          msg.data[i].map(k=>{
            msgdataList.push(JSON.parse(k))
            if(this.userInfo.userNo==JSON.parse(k).receiveUsername&&JSON.parse(k).read==0){
              num++
            }
          })
          msgdataList.push({
            date: '',
            id: '',
            msg: "您好！请问有什么可以帮到您？",
            receiveUsername: this.userInfo.userNo,
            sendUsername: i,
          })
          list.push({
            "num":num,
            "username": i,
            "nickname": "",
            "chatId": "",
            "msgdataList":msgdataList,
            "isOnline":0
          })
        }
        this.serviceList=list
        this.wsSend({
          "protocol":"0002",
        })
      }else if (msg.protocol=="0005") {
        msg.list.map(k=>{
          let bool=true
          this.serviceList.map(n=>{
            if(k.username==n.username){
              n.nickname=k.nickname
              n.isOnline=k.isOnline
              n.chatId=k.chatId
              bool=false
            }
          })
          if(bool){
            this.serviceList.push({
              isOnline:k.isOnline,
              chatId: k.chatId,
              username: k.username,
              msgdataList:[],
              num:0,
              nickname:k.nickname,
            })
          }
        })
      } else if (msg.protocol=='0004') {
        let data = msg.data
        this.serviceList.map(k=>{
          if(k.username==data.sendUsername){
            if(!this.open){
              k.num++
            }
            k.msgdataList.push(data);
          }
        })
        console.log('========userList========',this.serviceList)
        this.scrollBottom();
      }else if(msg.protocol=='0008'){

      }else if(msg.protocol.indexOf('ERROR')>-1){
        this.$toast(msg.msg)
      }
    },
    onclose(e) {
      console.log("连接关闭");
      console.log(
        "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
      );
      this.loading=true
      window.location.reload()
      // this.$ajax.post('/user/center/info').then(res => {
      //  console.log(res)
      //   if(res&&res.code==200){
      //     //重连
      //     this.reconnect();
      //   }
      // })
    },
    onerror(e) {
      console.log("连接出现错误");
    },
    toPath(){
      // this.$toast('与客服断开链接')
      this.$router.push({
        path: this.$route.query.redirect,
        query:{
          redirect:this.$route.path
        }})
    },
    to(){
      //退出，断开
      this.ws.close()
      this.toPath()
    },
    //发送消息
    sendMessage(msgType, msgContent) {
      msgContent = msgContent.replace(/[\r\n]/g, "");
      if (msgContent == "") {
        this.$toast(this.$t("myCenter['请输入内容']"));
        return;
      }
      this.ws.send(
        JSON.stringify({
          "protocol":"0003",
          "msg":msgContent,
          "chatId":this.chatData.chatId,
          "username": this.chatData.username
        })
      );
      let msgobj={
        date: '',
        id: '',
        msg: msgContent,
        receiveUsername: this.chatData.username,
        sendUsername: this.userInfo.userNo,
      };
      // msgobj.createTime=new Date(new Date().getTime()+8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ');

      this.serviceList.map(k=>{
        if(k.username==this.chatData.username){
          k.msgdataList.push(msgobj);
        }
      })
      this.scrollBottom();
      this.inputEmoji = "";
    },
    //表情
    emotion(res) {
      let word = res.replace(/\#|\;/gi, "");
      const list = [
        "微笑",
        "撇嘴",
        "色",
        "发呆",
        "得意",
        "流泪",
        "害羞",
        "闭嘴",
        "睡",
        "大哭",
        "尴尬",
        "发怒",
        "调皮",
        "呲牙",
        "惊讶",
        "难过",
        "酷",
        "冷汗",
        "抓狂",
        "吐",
        "偷笑",
        "可爱",
        "白眼",
        "傲慢",
        "饥饿",
        "困",
        "惊恐",
        "流汗",
        "憨笑",
        "大兵",
        "奋斗",
        "咒骂",
        "疑问",
        "嘘",
        "晕",
        "折磨",
        "衰",
        "骷髅",
        "敲打",
        "再见",
        "擦汗",
        "抠鼻",
        "鼓掌",
        "糗大了",
        "坏笑",
        "左哼哼",
        "右哼哼",
        "哈欠",
        "鄙视",
        "委屈",
        "快哭了",
        "阴险",
        "亲亲",
        "吓",
        "可怜",
        "菜刀",
        "西瓜",
        "啤酒",
        "篮球",
        "乒乓",
        "咖啡",
        "饭",
        "猪头",
        "玫瑰",
        "凋谢",
        "示爱",
        "爱心",
        "心碎",
        "蛋糕",
        "闪电",
        "炸弹",
        "刀",
        "足球",
        "瓢虫",
        "便便",
        "月亮",
        "太阳",
        "礼物",
        "拥抱",
        "强",
        "弱",
        "握手",
        "胜利",
        "抱拳",
        "勾引",
        "拳头",
        "差劲",
        "爱你",
        "NO",
        "OK",
        "爱情",
        "飞吻",
        "跳跳",
        "发抖",
        "怄火",
        "转圈",
        "磕头",
        "回头",
        "跳绳",
        "挥手",
        "激动",
        "街舞",
        "献吻",
        "左太极",
        "右太极",
      ];
      let index = list.indexOf(word);
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`;
    },
  },
};
</script>

<style scoped lang="scss">
  .Online{
    -webkit-filter: grayscale(85%);
  }
  .loadingClass{
    position: absolute;
    display: inline-block;
    width: 100vw;
    top: 50%;
    left: 0;
    text-align: center;
    z-index: 999;
  }
  .service_box{
    float: left;
    width: calc(33% - 13px);
    margin: 10px 5px;
    text-align: center;
    border: 1px solid #eee;
    border-radius: 5px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    img{
      padding: 10px 0;
      width: 50%;
    }
    .name{
      background-color: #d83442;
      color: #fff;
      width: calc(100% + 2px);
      position: relative;
      left: -1px;
      line-height: 30px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      font-size: 11px;
    }
    .badge{
      position: absolute;
      display: inline-block;
      background-color: #d83442;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      font-size: 11px;
      color: #fff;
      top: -5px;
      right: -5px;
    }
  }
  .openBody{
    .openBody_username{
      text-align: center;
      line-height: 35px;
    }
    .current{
      background-color: #eee;
    }
  }
.list-item {
  width: 375px;
  height: 60px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #d8d8d8;
  padding-left: 15px;
  padding-right: 15px !important;
  .headImg {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .right-button {
    width: 70px;
    height: 30px;
    font-size: 12px;
    color: #999999;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    border: 1px solid #999999;
    margin-left: auto;
  }
}
.mt-44{
  margin-top: 44px !important;
}
.sendBox {
  position: absolute;
  bottom: 0;
}
.input-in {
  position: relative;
  display: inline-block;
  .emoji-invoker {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    transition: all 0.2s;
    .smile-icon{
      font-size: 30px;
    }
  }

  .emoji-picker {
    position: absolute;
    z-index: 1;
    font-family: Montserrat;
    border: 1px solid #ccc;
    width: 100vw;
    height: 5rem;
    overflow: scroll;
    padding: 1rem;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 1px 1px 8px #c7dbe6;
  }
  .emoji-picker__search {
    // display: flex;
    display: none;
  }
  .emoji-picker__search > input {
    flex: 1;
    border-radius: 10rem;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    outline: none;
  }
  .emoji-picker h5 {
    margin-bottom: 0;
    color: #b1b1b1;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: default;
  }
  .emoji-picker .emojis {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .emoji-picker .emojis:after {
    content: "";
    flex: auto;
  }
  .emoji-picker .emojis span {
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 20px;
  }
  .emoji-picker .emojis span:hover {
    background: #ececec;
    cursor: pointer;
  }
  textarea {
    resize: none;
    // border: none;
    border: 1px solid #F0F0F0;
    background-color: #F0F0F0;
    border-radius: 20px;
    width: 255px;
    height: 32px;
    padding-left: 15px;
    margin: 0 9px;
    padding-right: 15px;
    padding-top: 10px;
    outline: none;
    font-size: 16px;
  }
}
.chat-send {
  display: inline-block;

  float: right;
  padding-bottom: 20px;
  .ant-btn {
    float: right;
    margin-right: 60px;
  }
  &:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
.massagelist{
  min-height: 80vh;
}
.toptips{
  text-align: center;
  color:#666;

}
.record-list{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding:  20px;
            max-height: 80vh;
            overflow-y: scroll !important;
            overflow: hidden;

  .userNo{
    position: relative;
    top: 5px;
    padding: 0px 10px;
  }
            ._left{
                margin-top:15px ;
                width: 100%;
                height: auto;
                display: flex;
                flex-wrap: wrap;
                .username{
                    display: inline-block;
                    text-align: left;
                    padding-left: 50px;
                    color: #4FAD2D;
                    margin-top: 30px;
                }
                .avatar{
                    order: 0;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                }
                .message-bg{
                    min-width: 20%;
                    max-width: 70%;
                    background: #fff;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin:0 7px;
                    .content{
                        display: inline-block;
                        padding: 10px;
                        word-break: break-all;
                        width: 5rem;
                        img{
                           width: 100% !important;
                        }
                    }

                    .arrow {
                        position: absolute;//相对定位
                        background: #fff;//背景色与外部的圆角矩形背景色一致
                        width: 10px;//定义合适的宽高
                        height: 10px;
                        left: -6px;//调整出舒适的对接位置
                        top:14px;
                        font-size: 0;
                        border-bottom: #ccc solid 1px;//因为三角形的border只需要展示出两条边
                        border-left: #ccc solid 1px;
                        box-sizing: border-box;//将盒子设置为border-box这样不会因为加了border而变宽
                        transform:rotate(45deg);//将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform:rotate(45deg);    /* IE 9 */
                        -moz-transform:rotate(45deg);   /* Firefox */
                        -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
                        -o-transform:rotate(45deg);     /* Opera */
                    }
                    .time{
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #BFBFBF;
                    }
                }

            }
            ._right{
                width: 100%;
                margin-top:15px ;

                height: auto;
                display: flex;
                justify-content: flex-end;
                flex-wrap: wrap;
                .username{
                    display: inline-block;
                    text-align: right;
                    padding-right: 50px;
                    color: #fff;
                    margin-top: 30px;
                }
                .avatar{
                    order: 1;
                    width: 40px;
                    height: 40px;
                }
                .message-bg{
                    min-width: 20%;
                    max-width: 70%;
                    background: #EFFDDE;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin:0 7px;
                    .content{
                        width: 5rem;
                        display: inline-block;
                        padding: 10px;
                        word-break: break-all;
                        img{
                           width: 100% !important;
                        }
                    }

                    .arrow {
                        position: absolute;//相对定位
                        background: #EFFDDE;//背景色与外部的圆角矩形背景色一致
                        width: 10px;//定义合适的宽高
                        height: 10px;
                        right: -6px;//调整出舒适的对接位置
                        top:14px;
                        font-size: 0;
                        border-top: #ccc solid 1px;//因为三角形的border只需要展示出两条边
                        border-right: #ccc solid 1px;
                        box-sizing: border-box;//将盒子设置为border-box这样不会因为加了border而变宽
                        transform:rotate(45deg);//将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform:rotate(45deg);    /* IE 9 */
                        -moz-transform:rotate(45deg);   /* Firefox */
                        -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
                        -o-transform:rotate(45deg);     /* Opera */
                    }
                    .time{
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #BFBFBF;
                    }
                }
            }
            .redpack_left{
                width: 100%;
                height: auto;
                display: flex;
                color: #fff;
                .avatar{
                    order: 0;
                }
                .message-bg {
                    min-width: 240px;
                    max-width: 70%;
                    background: #F99D3A;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin: 0 7px;

                    .redpack-name{
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        .redpack-text{
                            margin-left: 10px;
                            .content {
                                display: block;
                                padding: 10px;
                                width: 100%;
                            }
                            .type{
                                color: #dedede;
                            }
                        }
                        .redpack-img{
                            width: 50px;
                            height: 62px;
                            margin: 10px;
                        }
                    }
                    .arrow {
                        position: absolute; //相对定位
                        background: #F99D3A; //背景色与外部的圆角矩形背景色一致
                        width: 10px; //定义合适的宽高
                        height: 10px;
                        right: -6px; //调整出舒适的对接位置
                        top: 14px;
                        font-size: 0;
                        border-bottom: #ccc solid 1px; //因为三角形的border只需要展示出两条边
                        border-left: #ccc solid 1px;
                        box-sizing: border-box; //将盒子设置为border-box这样不会因为加了border而变宽
                        transform: rotate(45deg); //将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform: rotate(45deg); /* IE 9 */
                        -moz-transform: rotate(45deg); /* Firefox */
                        -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
                        -o-transform: rotate(45deg); /* Opera */
                    }

                    .time {
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #dedede;
                    }
                }
            }
            .redpack_right{
                width: 100%;
                height: auto;
                display: flex;
                justify-content: flex-end;
                color: #fff;
                .avatar{
                    order: 1;
                }
                .message-bg {
                    min-width: 240px;
                    max-width: 70%;
                    background: #F99D3A;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin: 0 7px;


                    .redpack-name{
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        .redpack-text{
                            margin-left: 10px;
                            .content {
                                display: block;
                                padding: 10px;
                                width: 100%;
                            }
                            .type{
                                color: #dedede;
                            }
                        }
                        .redpack-img{
                            width: 50px;
                            height: 62px;
                            margin: 10px;
                        }
                    }
                    .arrow {
                        position: absolute; //相对定位
                        background: #F99D3A; //背景色与外部的圆角矩形背景色一致
                        width: 10px; //定义合适的宽高
                        height: 10px;
                        right: -6px; //调整出舒适的对接位置
                        top: 14px;
                        font-size: 0;
                        border-top: #ccc solid 1px; //因为三角形的border只需要展示出两条边
                        border-right: #ccc solid 1px;
                        box-sizing: border-box; //将盒子设置为border-box这样不会因为加了border而变宽
                        transform: rotate(45deg); //将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform: rotate(45deg); /* IE 9 */
                        -moz-transform: rotate(45deg); /* Firefox */
                        -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
                        -o-transform: rotate(45deg); /* Opera */
                    }

                    .time {
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #dedede;
                    }
                }
            }
            .image_left{
                width: 100%;
                height: auto;
                display: flex;
                margin: 10px;
                .avatar{
                    order: 0;
                    cursor: pointer;
                }
                .message-bg{
                    min-width: 10%;
                    max-width: 70%;
                    background: #fff;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin:0 7px;
                    .content{
                        display: inline-block;
                        padding: 10px;
                        word-break: break-all;
                    }
                    .arrow {
                        position: absolute;//相对定位
                        background: #fff;//背景色与外部的圆角矩形背景色一致
                        width: 10px;//定义合适的宽高
                        height: 10px;
                        left: -6px;//调整出舒适的对接位置
                        top:14px;
                        font-size: 0;
                        border-bottom: #ccc solid 1px;//因为三角形的border只需要展示出两条边
                        border-left: #ccc solid 1px;
                        box-sizing: border-box;//将盒子设置为border-box这样不会因为加了border而变宽
                        transform:rotate(45deg);//将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform:rotate(45deg);    /* IE 9 */
                        -moz-transform:rotate(45deg);   /* Firefox */
                        -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
                        -o-transform:rotate(45deg);     /* Opera */
                    }
                    .time{
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #BFBFBF;
                    }
                }
            }
            .image_right{
                width: 100%;
                height: auto;
                display: flex;
                margin: 10px;
                justify-content: flex-end;
                .avatar{
                    order: 1;
                }
                .message-bg{
                    min-width: 10%;
                    max-width: 70%;
                    background: #EFFDDE;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    position: relative;
                    margin:0 7px;
                    .content{
                        display: inline-block;
                        padding: 10px;
                        word-break: break-all;
                    }
                    .arrow {
                        position: absolute;//相对定位
                        background: #EFFDDE;//背景色与外部的圆角矩形背景色一致
                        width: 10px;//定义合适的宽高
                        height: 10px;
                        right: -6px;//调整出舒适的对接位置
                        top:14px;
                        font-size: 0;
                        border-top: #ccc solid 1px;//因为三角形的border只需要展示出两条边
                        border-right: #ccc solid 1px;
                        box-sizing: border-box;//将盒子设置为border-box这样不会因为加了border而变宽
                        transform:rotate(45deg);//将小矩形旋转个45度从而做出三角形的突出角
                        -ms-transform:rotate(45deg);    /* IE 9 */
                        -moz-transform:rotate(45deg);   /* Firefox */
                        -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
                        -o-transform:rotate(45deg);     /* Opera */
                    }
                    .time{
                        text-align: right;
                        padding-right: 10px;
                        padding-left: 10px;

                        color: #BFBFBF;
                    }
                }
            }

        }
</style>
