<template>
  <div class="notice">
    <van-notice-bar scrollable :text="noticeText" color="#333" />
    <div class="flex-left flex-center notice_but" @click="index = 0;show = true">
      <div>{{ $t("homeNotice['更多']") }}</div>
      <van-icon name="arrow" />
    </div>
    <van-popup v-model="show" duration="0" lock-scroll>
      <div class="noticeOpen">
        <div class="notification_title">{{ $t("homeNotice['最新公告']") }}</div>
        <div
          class="notification_content"
          v-show="index == i"
          v-for="(k, i) in notice2"
          :key="i"
        >
          <div v-html="k.noticeContent"></div>
        </div>
        <div class="notification_btn flex-between flex-center">
          <div class="_btn _btn1" v-if="index==0">
            {{ $t("homeNotice['上一条']") }}
          </div>
          <div class="_btn _btn2" v-else @click="index--">
            {{ $t("homeNotice['上一条']") }}
          </div>
          <div class="_btn _btn3" @click="show = false">
            {{ $t("homeNotice['关闭']") }}
          </div>
          <div class="_btn _btn1" v-if="index==notice2.length-1">
            {{ $t("homeNotice['下一条']") }}
          </div>
          <div class="_btn _btn2" v-else @click="index++">
            {{ $t("homeNotice['下一条']") }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: ["notice2"],
  data() {
    return {
      index: 0,
      show: false,
    };
  },
  computed: {
    noticeText() {
      let text = "";
      if (this.notice2.length > 0) {
        text = `${this.notice2[0].noticeContent}`;
      }
      return text;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<!--滚动公告-->
<style lang="scss">
.notice {
  width: 95%;
  margin: 0 auto;
  font-size: 12px;
  position: relative;
  .van-notice-bar {
    background: none;
    height: 20px;
    box-sizing: border-box;
    font-size: 12px;
    padding-left: 0;
    padding-right: 37px;
  }
  .notice_but {
    position: absolute;
    right: 0;
    top: 0;
    color: #000;
    height: 20px;
    line-height: 20px;
  }
  .van-popup {
    background: none;
  }
}
</style>
