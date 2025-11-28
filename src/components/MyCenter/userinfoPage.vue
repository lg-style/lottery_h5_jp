<template>
  <div class="userinfoPage">
      <titleBar :title_name="$t('myCenter[\'个人信息\']')" @toLeft="to" left_icon="arrow-left" />
    <div class="userinfoPage_body">
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="onEditShow(1)"
      >
        <div class="text">{{ $t("myCenter['头像']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <img
            :src="require(`../../assets/MyCenter/face/${data.faceId || 0}.jpg`)"
            class="faceImg"
          />
          <van-icon name="arrow" />
        </van-row>
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="onEditShow(2)"
      >
        <div class="text">{{ $t("myCenter['昵称']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <div class="text2" v-if="nichengShow">
            <van-field
              ref="nickName"
              @blur="updateNickName()"
              v-model="form.nickName"
              :placeholder="$t('myCenter[\'请设置昵称\']')"
            />
          </div>
          <div class="text2" v-else-if="data.nickName && data.nickName != ''">
            {{ data.nickName }}
          </div>
          <div class="text2" v-else>{{ $t("myCenter['未设置']") }}</div>
          <van-icon name="arrow" />
        </van-row>
      </van-row>
      <van-row type="flex" justify="space-between" align="center" class="box">
        <div class="text">{{ $t("myCenter['账号']") }}</div>
        <div class="text2">{{ data.userNo }}</div>
      </van-row>
      <div class="_xian"></div>
      <van-row
        style="background: none"
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPush('/Security', 'phoneNo')"
      >
        <div class="text">{{ $t("myCenter['手机']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <div class="text2" v-if="data.phoneNo && data.phoneNo != ''">
            {{ data.phoneNo }}
          </div>
          <div class="text2" v-else>{{ $t("myCenter['未绑定']") }}</div>
          <van-icon name="arrow" />
        </van-row>
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="toPush('/Security', 'email')"
      >
        <div class="text">{{ $t("myCenter['邮箱']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <div class="text2" v-if="data.email && data.email != ''">
            {{ data.email }}
          </div>
          <div class="text2" v-else>{{ $t("myCenter['未绑定']") }}</div>
          <van-icon name="arrow" />
        </van-row>
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="onEditShow(4)"
      >
        <div class="text">{{ $t("myCenter['性别']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <div class="text2">
            {{ data.gender == 0 ? $t("myCenter['男']") : data.gender == 1 ? $t("myCenter['女']") : $t("myCenter['保密']") }}
          </div>
          <van-icon name="arrow" />
        </van-row>
      </van-row>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="box"
        @click="onEditShow(5)"
      >
        <div class="text">{{ $t("myCenter['生日']") }}</div>
        <van-row type="flex" justify="end" align="center" class="box_min">
          <div class="text2" v-if="data.birthday && data.birthday != ''">
            {{ data.birthday }}
          </div>
          <div class="text2" v-else>{{ $t("myCenter['未设置']") }}</div>
          <van-icon name="arrow" />
        </van-row>
      </van-row>
    </div>
    <!--    修改头像-->
    <van-popup
      v-model="touxiangShow"
      position="bottom"
      :overlay="true"
      duration="0"
      :overlay-style="{'background': 'rgba(0,0,0,.5)'}"
      lock-scroll
    >
      <div class="editShow_touxaing">
        <div class="touxaing_title flex-between flex-center">
          <div>{{ $t("myCenter['修改头像']") }}</div>
          <img src="../../assets/MyCenter/gbtx.png" alt="" @click="touxiangShow = false"/>
        </div>
        <div class="touxiang_content">
          <div class="_text">{{ $t("myCenter['预览']") }}</div>
          <img :src="require(`../../assets/MyCenter/face/${form.faceId||1}.jpg`)" class="yulan_img" />
          <div class="_text">{{ touxiangArr.filter(k=>form.faceId == k.id)[0]?touxiangArr.filter(k=>form.faceId == k.id)[0].name:'张曼玉' }}</div>
          <div class="headImgListCon">
            <span class="nomore"><i class="iconfont"></i></span>
            <div class="headImgList">
              <div class="fixedHeadImgWidth">
                <img
                  @click="form.faceId = k.id"
                  :title="k.name"
                  :src="require(`../../assets/MyCenter/face/${k.id}.jpg`)"
                  v-for="(k, i) in touxiangArr"
                  :key="i"
                />
              </div>
            </div>
            <span><i class="iconfont"></i></span>
          </div>
          <div class="changeBtn">
            <div class="subBtn" @click="updateFace()">{{ $t("myCenter['保存头像']") }}</div>
            <div class="subBtn cancel" @click="touxiangShow = false">{{ $t("myCenter['取消']") }}</div>
          </div>
        </div>
      </div>
    </van-popup>
    <!--    个人信息-->
    <van-popup
      v-model="editShow"
      position="bottom"
      :overlay="true"
      duration="0"
      :style="'width:100%;'"
      lock-scroll
    >
      <div class="editShow_body">
        <!--        性别-->
        <div class="sex" v-if="type == 4">
          <div
            class="sex_box"
            :class="{ b: form.gender == 0 }"
            @click="form.gender = 0"
          >
            {{ $t("myCenter['男']") }}
          </div>
          <div
            class="sex_box"
            :class="{ b: form.gender == 1 }"
            @click="form.gender = 1"
          >
            {{ $t("myCenter['女']") }}
          </div>
          <div
            class="sex_box"
            :class="{ b: form.gender == 2 }"
            @click="form.gender = 2"
          >
            {{ $t("myCenter['保密']") }}
          </div>
        </div>
        <!--        生日-->
        <div class="date" v-if="type == 5">
          <van-datetime-picker
            v-model="form.birthday"
            type="date"
            :title="$t('myCenter[\'选择年月日\']')"
            :min-date="minDate"
            :max-date="maxDate"
            cancel-button-text=" "
            confirm-button-text=" "
          />
        </div>
        <div class="editShow_body_bottom">
          <van-button color="#7F7F7F" size="small" @click="editShow = false"
            >{{ $t("myCenter['取消']") }}</van-button
          >
          <van-button color="#169BD5" size="small" @click="submit()"
            >{{ $t("myCenter['保存']") }}</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import timeUtil from "../../util/timeUtil";
export default {
  props: ["userInfoData"],
  data() {
    return {
      nichengShow: false,
      touxiangShow: false,
      data: {},
      form: {
        birthday: "",
        gender: 0,
        nickName: "",
      },
      editShow: false,
      type: null,
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(2021, 0, 17),
      touxiangArr: [
        { name: "张曼玉", id: 1 },
        { name: "李小璐", id: 2 },
        { name: "陈小春", id: 3 },
        { name: "吴京", id: 4 },
        { name: "舒淇", id: 5 },
        { name: "奥巴马", id: 6 },
        { name: "葛优", id: 7 },
        { name: "李小龙", id: 8 },
        { name: "刘亦菲", id: 9 },
        { name: "权志龙", id: 10 },
        { name: "小女孩", id: 11 },
        { name: "扎克伯格", id: 12 },
        { name: "泷泽萝拉", id: 13 },
        { name: "赵丽颖", id: 14 },
        { name: "李云迪", id: 15 },
        { name: "刘诗诗", id: 16 },
        { name: "朱茵", id: 17 },
        { name: "宋慧乔", id: 18 },
        { name: "宋仲基", id: 19 },
        { name: "郭富城", id: 20 },
        { name: "鹿晗", id: 21 },
        { name: "科比", id: 22 },
        { name: "金正恩", id: 23 },
        { name: "邱淑贞", id: 24 },
        { name: "杨幂", id: 25 },
        { name: "李晨", id: 26 },
        { name: "杰森斯坦森", id: 27 },
        { name: "迪丽热巴", id: 28 },
        { name: "徐峥", id: 29 },
        { name: "迈克尔杰克逊", id: 30 },
        { name: "吴亦凡", id: 31 },
        { name: "曾志伟", id: 32 },
        { name: "梅西", id: 33 },
        { name: "范冰冰", id: 34 },
        { name: "周星驰", id: 35 },
        { name: "黄晓明", id: 36 },
        { name: "杜特尔特", id: 37 },
        { name: "张家辉", id: 38 },
        { name: "周迅", id: 39 },
        { name: "谢霆锋", id: 40 },
        { name: "郑伊健", id: 41 },
        { name: "特普朗", id: 42 },
        { name: "陈冠希", id: 43 },
        { name: "潘长江", id: 44 },
        { name: "周润发", id: 45 },
        { name: "angelababy", id: 46 },
        { name: "萨达姆", id: 47 },
        { name: "周慧敏", id: 48 },
        { name: "关之琳", id: 49 },
        { name: "倪妮", id: 50 },
        { name: "李敏镐", id: 51 },
        { name: "本拉登", id: 52 },
        { name: "张学友", id: 53 },
        { name: "文章", id: 54 },
        { name: "钟欣潼", id: 55 },
        { name: "陈道明", id: 56 },
        { name: "沈腾", id: 57 },
        { name: "古天乐", id: 58 },
        { name: "成龙", id: 59 },
        { name: "比尔盖茨", id: 60 },
        { name: "安吉丽娜朱莉", id: 61 },
        { name: "杨洋", id: 62 },
        { name: "林心如", id: 63 },
        { name: "钟汉良", id: 64 },
        { name: "黄渤", id: 65 },
        { name: "王宝强", id: 66 },
        { name: "赵本山", id: 67 },
        { name: "陆毅", id: 68 },
        { name: "陈坤", id: 69 },
        { name: "张一山", id: 70 },
        { name: "胡歌", id: 71 },
        { name: "宋承宪", id: 72 },
        { name: "林志玲", id: 73 },
        { name: "小男孩", id: 74 },
        { name: "朴信惠", id: 75 },
        { name: "罗纳尔多", id: 76 },
        { name: "希拉里", id: 77 },
        { name: "宋小宝", id: 78 },
        { name: "赵薇", id: 79 },
        { name: "宋慧乔", id: 80 },
        { name: "甄子丹", id: 81 },
        { name: "张柏芝", id: 82 },
        { name: "章子怡", id: 83 },
        { name: "张国立", id: 84 },
        { name: "吴奇隆", id: 85 },
        { name: "王力宏", id: 86 },
        { name: "黎明", id: 87 },
        { name: "林志颖", id: 88 },
        { name: "林允儿", id: 89 },
        { name: "苏有朋", id: 90 },
        { name: "李连杰", id: 91 },
        { name: "普京", id: 92 },
        { name: "波多野结衣", id: 93 },
        { name: "刘德华", id: 94 },
        { name: "贝克汉姆", id: 95 },
        { name: "邓超", id: 96 },
        { name: "李冰冰", id: 97 },
        { name: "苍井空", id: 98 },
        { name: "郭德纲", id: 99 },
        { name: "吴彦祖", id: 100 },
      ],
    };
  },
  created() {
    this.data = this.userInfoData;
  },
  mounted() {},
  methods: {
    ...mapActions(["getInfo"]),
    submit() {
      if (this.type == 4) {
        this.updateGender();
      } else if (this.type == 5) {
        this.updateBirthday();
      }
    },
    updateFace() {
      this.$ajax
        .post(`/user/center/updateFace?faceId=${this.form.faceId}`)
        .then((res) => {
          this.data.faceId = this.form.faceId;
          this.touxiangShow = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['资料修改成功。']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    updateNickName() {
      if(this.data.nickName == this.form.nickName){
        this.nichengShow = false;
        return;
      }
      if (!this.form.nickName || this.form.nickName == "") {
        this.$toast(this.$t("myCenter['昵称不能为空']"));
        return;
      }
      this.$ajax
        .post(`/user/center/updateNickName?nickName=${this.form.nickName}`)
        .then((res) => {
          this.data.nickName = this.form.nickName;
          this.nichengShow = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['资料修改成功。']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    updateBirthday() {
      let date = timeUtil.renderTime(this.form.birthday).split(" ")[0];
      this.$ajax
        .post(`/user/center/updateBirthday?birthday=${date}`)
        .then((res) => {
          this.data.birthday = date;
          this.editShow = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['资料修改成功。']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    updateGender() {
      this.$ajax
        .post(`/user/center/updateGender?gender=${this.form.gender}`)
        .then((res) => {
          this.data.gender = this.form.gender;
          this.editShow = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['资料修改成功。']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onEditShow(type) {
      this.form = Object.assign({}, this.data);
      this.form.birthday = new Date(this.form.birthday);
      if(type == 1){
        this.touxiangShow = true;
      } else if(type == 2){
        this.nichengShow = true;
        setTimeout(() => {
          this.$refs.nickName.focus();
        }, 100);
        
      } else{
        this.type = type;
        this.editShow = true;
      }
    },
    toPush(path, type) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
          type: type,
        },
      });
    },
    to() {
      this.getInfo();
      this.$emit("closeUserShow");
    },
  },
};
</script>

<style lang="scss">
.userinfoPage {
  background-color: #efeef4;
  height: 100%;
  .userinfoPage_body {
    background-color: #fff;
    ._xian {
      background-color: #efeef4;
      height: 15.2312px;
    }
    .box {
      min-height: 52.22px;
      box-sizing: border-box;
      padding: 13.0553px 8.70356px;
      margin: 0 13.9257px;
      padding-right: 0;
      border: none;
      background-image: -webkit-linear-gradient(
        90deg,
        #d0d0d082,
        #d0d0d082 50%,
        transparent 0
      );
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: top;
      .text {
        width: 40%;
        font-size: 17.4071px;
        color: #000;
      }
      .text2 {
        margin-right: 10px;
        font-size: 17.4071px;
        color: #000;
        text-align: right;
        .van-cell{
          padding: 0;
          width: 212.667px;
          .van-field__control{
            height: 20.6667px;
            line-height: 20.6667px;
            font-size: 17.4071px;
            border: 2px solid #000;
          border-radius: 3px;
          }
        }
      }
      .box_min {
        width: 50%;
        .faceImg {
          height: 50px;
          border-radius: 3.48142px;
          box-sizing: border-box;
        }
        .van-icon-arrow {
          font-size: 17.4071px;
          color: #ccc;
        }
      }
    }
  }
  .editShow_touxaing {
    .touxaing_title {
      height: 51.5625px;
      font-size: 17.4071px;
      color: #333;
      padding: 0 13.9257px;
      img {
        width: 24.5px;
        height: 24.5px;
      }
    }
    .touxiang_content {
      padding: 18.75px 0;
      ._text {
        text-align: center;
        font-size: 17.4071px;
        color: #666;
      }
      .yulan_img {
        display: block;
        width: 117.188px;
        height: 117.188px;
        border-radius: 2.34375px;
        margin: 4.6875px auto;
      }
      .headImgListCon {
        span {
          display: block;
          width: 46.875px;
          margin: 23.4375px 0;
          height: 75px;
          line-height: 75px;
          font-size: 26.1107px;
          text-align: center;
          float: left;
          color: #888;
        }
        .nomore {
          color: #dbdbdb;
        }
        .headImgList {
          width: 281.25px;
          margin: 23.4375px 0;
          overflow: auto;
          float: left;
          .fixedHeadImgWidth {
            width: 7031.25px;
            overflow: hidden;
            img {
              display: block;
              width: 58.5938px;
              float: left;
              border-radius: 2.34375px;
              margin: 5.85938px;
            }
          }
        }
      }
      .changeBtn {
        text-align: center;
        .subBtn {
          background: #e4393c;
          color: #fff;
          display: inline-block;
          width: 140.625px;
          font-size: 17.4071px;
          height: 37.4px;
          line-height: 37.4px;
          border-radius: 3.51562px;
          margin: 0 1px;
        }
        .cancel{
          background: #d6d6d6 !important;
        }
      }
    }
  }
  .editShow_body {
    padding-bottom: 70px;
    .head {
      padding: 10px 20px 10px;
      .faceImg {
        border: 2px solid #ddd;
        border-radius: 5px;
        width: 25%;
        margin: 10px calc(4% - 2px);
        opacity: 0.8;
      }
      .b {
        border-color: #e3a826;
        opacity: 1;
      }
    }
    .sex {
      .sex_box {
        border-top: 1px solid #ddd;
        font-size: 15px;
        font-weight: bold;
        line-height: 50px;
        text-align: center;
      }
      .b {
        background-color: #02a7f0;
        color: #fff;
      }
    }
    .editShow_body_bottom {
      border-top: 1px solid #ddd;
      padding: 20px 0;
      text-align: center;
      background-color: #fff;
      width: 100%;
      position: fixed;
      bottom: 0;
      .van-button {
        margin: 0 20px;
        padding: 0 25px;
      }
    }
  }
}
</style>
