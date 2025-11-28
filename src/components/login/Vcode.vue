<template>
  <div class="ValidCode disabled-select" @click="refreshCode">
    <!-- <span
      :class="`shine${index}`"
      v-for="(item, index) in codeList"
      :key="index"
      :style="getStyle(item)"
      >{{ item.code }}</span
    > -->
    <img :src="url" style="opacity: 0.7;"/>
  </div>
</template>

<script>
export default {
  name: "validCode",
  props: {
    length: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      codeList: [],
      url:'',
      tiemObj: null
    };
  },
  beforeDestroy() {
    clearTimeout(this.tiemObj);
  },
  mounted() {
    this.createdCode();
  },
  methods: {
    refreshCode() {
      this.createdCode();
    },
    createdCode() {
      clearTimeout(this.tiemObj);
      let len = this.length,
        codeList = [],
        chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789",
        charsLen = chars.length;
      // 生成
      this.$ajax.post("/user/getVerify").then((res) => {
        this.url = res.data.img;
        // let codeArr = res.data.code.split("");
        // for (let i = 0; i < codeArr.length; i++) {
        //   let rgb = [
        //     Math.round(Math.random() * 220),
        //     Math.round(Math.random() * 240),
        //     Math.round(Math.random() * 200),
        //   ];
        //   codeList.push({
        //     code: codeArr[i],
        //     color: `rgb(${rgb})`,
        //     padding: `${[Math.floor(Math.random() * 5)]}px`,
        //     transform: `rotate(${
        //       Math.floor(Math.random() * 45) - Math.floor(Math.random() * 45)
        //     }deg)`,
        //   });
        // }
        // 指向
        // this.codeList = codeList;
        // console.log(this.codeList);
        // 将当前数据派发出去
        this.$emit(
          "update",
          // codeList.map((item) => item.code).join(""),
          '',
          res.data.uuid
        );
      }).finally(()=>{
        this.tiemObj = setTimeout(() => {
          this.createdCode();
        }, 90000);
      })
    },
    getStyle(data) {
      return `color: ${data.color}; padding: ${data.padding}; transform: ${data.transform};`;
    },
  },
};
</script>

<style scoped lang="scss">
.ValidCode {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  // background-color: #b3ffff;
  border-radius: 5px;
  // width: 80px;
  // height: 25px;
  span {
    display: inline-block;
    font-weight: bold;
    font-size: 30px;
  }

  /* 定义一个闪烁的关键帧 */
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  /* 定义闪光的样式 */
  .shine0 {
    display: inline-block;
    position: relative;
    color: #fff;
    // animation: blink 1.2s ease-in-out infinite;
  }
  .shine1 {
    display: inline-block;
    position: relative;
    color: #fff;
    // animation: blink 2s ease-in-out infinite;
  }
  .shine2 {
    display: inline-block;
    position: relative;
    color: #fff;
    // animation: blink 1.7s ease-in-out infinite;
  }
  .shine3 {
    display: inline-block;
    position: relative;
    color: #fff;
    // animation: blink 1.4s ease-in-out infinite;
  }
}
</style>
