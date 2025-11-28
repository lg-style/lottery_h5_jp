<template>
  <div class="xy28">
    <div class="max_box">
      <div
        class="div"
        v-for="(k, i) in NameList.filter((itme) => {
          return itme.show.indexOf(active) >= 0;
        })"
        :key="i"
      >
        <van-row type="flex" justify="center" align="center" class="title">
          <div>{{ translateLotteryText(k.name) }}</div>
        </van-row>
        <div v-if="active != 2">
          <div
            class="min_box"
            v-for="(n, j) in k.list"
            :key="j"
            @click="getRow(k, n)"
          >
            <van-row
              type="flex"
              justify="center"
              align="center"
              class="box"
              :class="{
                current:
                  currentList.filter((itme) => {
                    return itme.id == n.id;
                  }).length > 0,
              }"
            >
              <div class="name">
                {{ translateLotteryText(setName(n.itemObject)) }}
              </div>
              <div class="odds">{{ setOdds(n) }}</div>
            </van-row>
          </div>
        </div>
        <div v-else>
          <div
            class="min_box"
            v-for="(n, j) in 28"
            :key="j"
            @click="getRow(k, j)"
          >
            <van-row
              type="flex"
              justify="center"
              align="center"
              class="box"
              :class="{
                current: optionObj[k.name].list.includes(j),
              }"
            >
              <div class="name">{{ translateLotteryText(setName(j)) }}</div>
            </van-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["type", "current","oddsOpen","oddsOpen2"],
  data() {
    return {
      resultShow: false,
      oddsShow: true,
      oddsClose: true,
    };
  },
  computed: {
    ...mapState(["lotteryNameList", "lotteryObj", "fanshui", "backPoint", "optionObj"]),
    NameList() {
      let json =
        this.lotteryNameList.filter((k) => {
          return k.groupName == this.lotteryObj.groupName;
        })[0] || {};
      return json.list || [];
    },
    currentList() {
      return this.current || [];
    },
    active() {
      return this.type;
    },
  },
  watch: {
    oddsOpen(n, o) {
      this.oddsShow = n;
    },
    oddsOpen2(n, o) {
      this.oddsClose = n;
    },
  },
  created(){
    this.oddsShow = this.oddsOpen;
    this.oddsClose = this.oddsOpen2;
  },
  mounted() {},
  methods: {
    translateLotteryText(text) {
      if (!text && text !== 0) {
        return text;
      }
      const key = `lotteryIndex.${text}`;
      return this.$te(key) ? this.$t(key) : text;
    },
    // 设置name
    setName(itemObject) {
      if (!isNaN(itemObject) && itemObject >= 0) {
        let num = itemObject >= 10 ? itemObject : `0${itemObject}`;
        return num;
      }
      return itemObject;
    },
    //根据反水设置赔率
    setOdds(n) {
      let num = 0;
      num = n.odds - this.backPoint * 0.01 * n.limitValue;
      return !this.oddsShow?'':!this.oddsClose?'-':num.toFixed(4) / 1;
    },
    getRow(k, n) {
      this.$emit("getRow", k, n);
    },
  },
};
</script>

<style lang="scss" scoped>
.xy28 {
  width: 273px;
  .max_box {
    // height: calc(100vh - 175px);
    // overflow-y: auto;
    .title {
      height: 25.26px;
      font-size: 16px;
      color: #585858;
      border-bottom: 1px solid #f5f5f9;
    }
    .min_box {
      display: inline-block;
      width: 50%;
      font-size: 16px;
      box-sizing: border-box;
      .box {
        padding: 0 10px;
        border-right: 1px solid #f5f5f9;
        box-shadow: inset 0 -1px 1px -1px #c8c7cc;
        height: 42.19px;
        .name {
          font-size: 18px;
          color: #585858;
          margin-right: 1.172px;
          font-weight: 600;
        }
        .odds {
          color: red;
          font-size: 14px;
          box-sizing: border-box;
          padding-left: 5px;
        }
      }
      .current {
        border: 2.5px solid #ff625c;
        background: url("../../assets/首页/dui.png") right bottom no-repeat;
        background-size: 20.671px auto;
        .name {
        }
        .odds {
        }
      }
    }
    .div:last-child {
      // padding-bottom: 400px;
    }
  }
}
</style>
