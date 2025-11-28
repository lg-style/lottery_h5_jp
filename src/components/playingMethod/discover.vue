<template>
  <div class="discover">
    <div class="discoverTop flex-center flex-justify-center">
      <div class="icon flex-center flex-justify-center" @click="to">
        <van-icon name="arrow-left" />
      </div>
      <div class="discoverTop_min flex-center flex-justify-center">
        <div
          :class="{ _tab: active == 1 }"
          @click="
            active = 1;
            onTab();
          "
        >
          中奖信息
        </div>
        <div
          :class="{ _tab: active == 2 }"
          @click="
            active = 2;
            onTab();
          "
        >
          昨日盈利榜
        </div>
      </div>
      <div class="icon"></div>
    </div>
    <div class="tabslist">
      <div v-show="active == 1">
        <div v-if="msglist.length" ref="msglist">
          <van-cell
            class="list-item"
            @click="onOpenPlayer(item)"
            center
            is-link
            v-for="(item, index) in msglist"
            :key="index"
          >
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <img
                :src="
                  require(`../../assets/MyCenter/face/${item.faceId || 0}.jpg`)
                "
                alt=""
                class="headImg"
              />
              <div class="listContent">
                <div class="">
                  <span style="color: #0079ff">{{ item.userNo }}</span> 在{{
                    item.lotteryName
                  }}
                </div>
                <div class="">
                  喜中<span style="color: red">￥{{ item.winAmount }}</span>
                </div>
              </div>
            </template>
          </van-cell>
        </div>
      </div>
      <div v-show="active == 2">
        <div v-if="msglist1.length">
          <van-cell
            class="list-item"
            @click="onOpenPlayer(item)"
            center
            v-for="(item, index) in msglist1"
            :key="index"
          >
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <img
                :src="
                  require(`../../assets/MyCenter/face/${item.faceId || 0}.jpg`)
                "
                alt=""
                class="headImg"
              />
              <div class="listContent">
                <div class="">
                  账号昵称：<span style="color: #0079ff">{{
                    item.userNo
                  }}</span>
                </div>
                <div class="">
                  昨日盈利：<span style="color: red">￥{{ item.profit }}</span>
                </div>
              </div>
              <div class="r_num" :class="`r_num_${index + 1}`">
                {{ index + 1 }}
              </div>
            </template>
          </van-cell>
        </div>
      </div>
    </div>
    <!--  弹窗-->
    <van-popup
      v-model="playerPopupStatus"
      @close="closePopup"
      position="right"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <div class="openBody">
        <titleBar
          :title_name="'玩家信息'"
          class="titleBar"
          @toLeft="closePopup()"
          left_icon="arrow-left"
        />
        <div class="faceTitle">
          <img
            :src="
              require(`../../assets/MyCenter/face/${
                userInfoData.faceId || 0
              }.jpg`)
            "
            class="faceImg"
          />
        </div>
        <div>{{ userInfoData.nickName }}</div>
        <div class="userName">账号:{{ userInfoData.userNo }}</div>
        <div class="ins">VIP9</div>
        <div class="box">
          <span class="yu_e">
            性别{{
              userInfoData.gender == 0
                ? "男"
                : userInfoData.gender == 1
                ? "女"
                : "保密"
            }}
          </span>
          <div class="touxian">
            <span>头衔：帝王</span>
            <span style="margin-left: 22.8469px"
              >累计中奖：{{ userInfoData.totalWinAmount }}</span
            >
          </div>
        </div>
        <div class="likeLotteryType">TA喜欢的彩票</div>
        <ul class="cardIconList fix">
          <li>
            <a
              ><i
                class="iconfont L_PK10"
                :class="
                  userInfoData.userLike.indexOf('PK10') > -1 ? 'L_PK10_1' : ''
                "
              ></i
            ></a>
          </li>
          <li>
            <a
              ><i
                class="iconfont L_SSC"
                :class="
                  userInfoData.userLike.indexOf('SSC') > -1 ? 'L_SSC_1' : ''
                "
              ></i
            ></a>
          </li>
          <li>
            <a
              ><i
                class="iconfont L_LHC"
                :class="
                  userInfoData.userLike.indexOf('LHC') > -1 ? 'L_LHC_1' : ''
                "
              ></i
            ></a>
          </li>
          <li>
            <a><i class="iconfont L_K3 noActive"></i></a>
          </li>
          <li>
            <a><i class="iconfont L_X115 noActive"></i></a>
          </li>
          <li>
            <a><i class="iconfont L_DPC noActive"></i></a>
          </li>
          <li>
            <a
              ><i
                class="iconfont L_KL8 noActive"
                :class="
                  userInfoData.userLike.indexOf('KLC') > -1 ? 'L_KL8_1' : ''
                "
              ></i
            ></a>
          </li>
          <li>
            <a><i class="iconfont L_KL10 noActive"></i></a>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 1,
      No: 1,
      WinInfoList: [],
      msglist: [],
      msglist1: [],
      imageServerUrl: "",
      playerPopupStatus: false,
      userInfoData: {
        userLike: "",
      },
      timeObj: null,
    };
  },
  created() {
    this.onTab();
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timeObj);
  },
  methods: {
    onTab() {
      clearInterval(this.timeObj);
      this.No = 1;
      this.msglist = [];
      this.msglist1 = [];
      this.WinInfoList = [];
      if (this.active == 1) {
        this.getWinInfo();
      } else {
        this.getProfitRanking();
      }
      this.timeObj = setInterval(() => {
        this.addchild();
      }, 2500);
    },
    getProfitRanking() {
      this.$ajax
        .post(`/lottery/find/getProfitRanking`, {
          endDate: "",
          pageNo: 1,
          pageSize: 100,
          startDate: "",
        })
        .then((res) => {
          if (res.data) {
            this.WinInfoList = res.data.records;
            this.msglist1 = res.data.records.slice(
              (1 - 1) * 20,
              (1 - 1) * 20 + 20
            );
          } else {
            this.WinInfoList = [];
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    getWinInfo() {
      this.$ajax
        .post(`/lottery/find/getWinInfo`, {
          endDate: "",
          pageNo: 1,
          pageSize: 20,
          startDate: "",
        })
        .then((res) => {
          if (res.data) {
            this.WinInfoList = res.data;
            this.msglist = res.data.slice(
              (1 - 1) * 20,
              (1 - 1) * 20 + 20
            );
          } else {
            this.WinInfoList = [];
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onOpenPlayer(item) {
      this.playerPopupStatus = true;
      this.userInfoData = item;
    },
    closePopup() {
      this.playerPopupStatus = false;
    },
    addchild() {
      if (this.WinInfoList.length > 10) {
        this.msglist.unshift(
          this.WinInfoList[this.WinInfoList.length - this.No] || {}
        );
        // console.log(this.$refs.msglist.children);
        let classval = this.$refs.msglist.children[0].getAttribute("class");
        // if(!classval.includes('list-active')){
        //   classval=classval+' list-active';
        // }
        // classval=classval+' list-active';
        this.$refs.msglist.children[0].setAttribute("class", classval);
        if (this.WinInfoList.length > this.No) {
          this.No++;
        } else {
          this.No = 1;
        }
      }
    },
    to() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.discover {
  .discoverTop {
    position: sticky;
    top: 0;
    z-index: 1;
    background: -webkit-linear-gradient(
      bottom,
      #d83442 2%,
      #d83442 50%,
      #d83442 51%,
      #d83442
    );
    height: 50px;
    .icon {
      width: 48.9479px;
      height: 100%;
      .van-icon {
        font-size: 19.583px;
        color: #fff;
      }
    }
    .discoverTop_min {
      border-radius: 3.9166px;
      border: 1px solid #fff;
      width: 210px;
      box-sizing: border-box;
      margin: 0 auto;
      div {
        width: 50%;
        height: 33.28px;
        line-height: 33.28px;
        text-align: center;
        box-sizing: border-box;
        color: #fff;
        &:first-child {
          border-radius: 3px 0 0 3px;
        }
        &:last-child {
          border-radius: 0 3px 3px 0;
        }
      }
      ._tab {
        background: #fff;
        color: #dc2e2e;
      }
    }
  }
  .tabslist {
    margin-bottom: 80px;
    .list-item {
      height: 60px;
      margin: auto;
      font-weight: 500;
      display: flex;
      align-items: center;
      font-size: 15px;
      background: #ffffff;
      border-bottom: 1px solid #d8d8d8;
      padding-left: 15px;
      padding-right: 15px;
      position: relative;
      .headImg {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 25px;
        margin-right: 10px;
      }
      .listContent {
        display: inline-block;
        vertical-align: middle;
      }
      .r_num {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 27.5px;
        height: 27.5px;
        line-height: 27.5px;
        border-radius: 50%;
        font-size: 15.2312px;
        text-align: center;
      }
      .r_num_1 {
        color: #fff;
        background: radial-gradient(circle at 25px 25px, #c12f33, #ca9293);
      }
      .r_num_2 {
        color: #fff;
        background: radial-gradient(circle at 25px 25px, #2b82cc, #53b0fe);
      }
      .r_num_3 {
        color: #fff;
        background: radial-gradient(circle at 25px 25px, #c57532, #f8a968);
      }
      .van-icon {
        font-size: 16.7544px;
        color: #ccc;
      }
    }
    .list-active {
      transition: all 2s;
      transform: translateY(60px);
    }
  }
  .openBody {
    text-align: center;
    .titleBar {
      position: fixed;
      width: 100%;
      z-index: 100;
    }
    .faceTitle {
      padding-top: 25px;
      background: url("../../assets/MyCenter/facebg.jpg") no-repeat;
      background-size: 100%;
      height: 130px;
      position: relative;
      margin-bottom: 56px;
    }
    .faceImg {
      width: 100px;
      height: 100px;
      border: 3px solid #ffffff;
      border-radius: 50px;
      position: absolute;
      margin-left: -50px;
      top: 100px;
    }
    .userName {
      font-size: 15.2312px;
      height: 24.36px;
      line-height: 24.36px;
      color: #666;
    }
    .ins {
      position: absolute;
      background: #da3a3f;
      color: #fff;
      right: 0;
      display: block;
      top: 180px;
      padding: 1.74071px 13.9257px;
      border: 1px solid #e2e2e2;
      border-right: 0;
      border-radius: 17.4071px 0 0 17.4071px;
      font-size: 17.4071px;
      height: 27.8514px;
      line-height: 27.8514px;
    }
    .box {
      margin: 6px 0 0;
      .yu_e {
        font-size: 17.4071px;
        background: #59adf2;
        color: #fff;
        padding: 0 5.22214px;
        border-radius: 3.48142px;
      }
      .touxian {
        font-size: 15.2312px;
        color: #333;
        margin: 12px 0 6px;
        padding-bottom: 18.2775px;
      }
    }
    .likeLotteryType {
      border-top: 1px solid #d0d0d0;
      font-size: 19.583px;
      color: #333;
      padding: 19.583px 0 0;
    }
    .cardIconList {
      font-size: 54.3973px;
      padding: 23.4375px;
      li {
        float: left;
        margin-top: 5.43973px;
        margin-bottom: 5.43973px;
        line-height: 54.3973px;
        width: 82.0312px;
        text-align: center;
        .iconfont:before {
          color: #999;
        }
        .L_PK10_1::before {
          color: #f22751;
        }
        .L_LHC_1:before {
          color: #38b39e;
        }
        .L_SSC_1:before {
          color: #f96e00;
        }
        .L_KLC_1:before {
          color: #fc5826;
        }
      }
    }
  }
}
</style>
