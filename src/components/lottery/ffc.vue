<template>
  <div class="ffc">
    <div class="max_box" v-if="active == 3">
      <div class="_kuaijie flex-center flex-between">
        <div
          class="_kuaijie_box"
          :class="{ _kuaijie_box_1: kuaijieObjList.includes(k.name) }"
          v-for="(k, i) in NameList.filter((itme) => {
            return itme.show.indexOf(active) >= 0;
          })"
          :key="i"
          @click="onTabs(k)"
        >
          {{ translateLotteryText(k.name) }}
        </div>
      </div>
      <div class="_kuaijie2">
        <div
          class="_kuaijie_arr"
          :class="{ _kuaijie_arr_1: kuaijieObjListMin.includes(k) }"
          v-for="(k, i) in kuaijieArr"
          :key="i"
          @click="setKuaijie(k)"
        >
          <span>{{ translateLotteryText(k) }}</span>
        </div>
      </div>
    </div>
    <div class="max_box" v-else>
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
        <div
          class="min_box"
          v-for="(n, j) in k.list"
          :key="j"
          @click="getRow(k, n)"
          v-show="onShow(n)"
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
              {{
                k.name === "总和" && ['大','小','单','双'].includes(n.itemObject)
                  ? `${translateLotteryText('和')}${translateLotteryText(n.itemObject)}`
                  : translateLotteryText(n.itemObject)
              }}
            </div>
            <div class="odds">{{ setOdds(n) }}</div>
          </van-row>
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
      kuaijieArr: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "大",
        "小",
        "单",
        "双",
      ],
      kuaijieObjList: [],
      kuaijieObjListMin: [],
      oddsShow: true,
      oddsClose: true,
    };
  },
  computed: {
    ...mapState(["lotteryNameList", "lotteryObj", "fanshui", "backPoint"]),
    NameList() {
      let json =
        this.lotteryNameList.filter((k) => {
          return k.groupName == this.lotteryObj.groupName;
        })[0] || {};
      return json.list || [];
    },
    currentList() {
      // console.log(this.current);
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
      if (!text) {
        return text;
      }
      const key = `lotteryIndex.${text}`;
      return this.$te(key) ? this.$t(key) : text;
    },
    // 快捷
    setKuaijie(k) {
      let arr = this.kuaijieObjListMin.filter((n) => n === k);
      if (arr.length > 0) {
        this.kuaijieObjListMin = this.kuaijieObjListMin.filter((n) => n != k);
      } else {
        this.kuaijieObjListMin.push(k);
      }
      this.setKuaijieGetRow();
    },
    onTabs(k) {
      let arr = this.kuaijieObjList.filter((n) => n === k.name);
      if (arr.length > 0) {
        this.kuaijieObjList = this.kuaijieObjList.filter((n) => n != k.name);
      } else {
        this.kuaijieObjList.push(k.name);
      }
      this.setKuaijieGetRow();
    },
    setKuaijieGetRow() {
      this.$emit('deleteCurrentList');
       let list = this.NameList.filter((itme) => {
        return itme.show.indexOf(this.active) >= 0;
      });
      for(let n of list){
        for(let key of this.kuaijieObjList){
          if(key == n.name){
            for(let itme of n.list){
              for(let itme2 of this.kuaijieObjListMin){
                if(itme.itemObject == itme2){
                  this.getRow(n, itme);
                }
              }
            }
          }
        }
      }
    },
    // 设置name
    setName(itemObject) {
      if (!isNaN(itemObject) && itemObject > 0) {
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
      // this.NameList.map(k2=>{
      //   k2.list.map(n2=>{
      //     this.$emit("getRow",k2,n2);
      //   })
      // })
      // return
      this.$emit("getRow", k, n);
    },
    onShow(list) {
      if (this.active == 1 && !isNaN(list.itemObject)) {
        //两面盘
        return false;
      } else if (this.active == 2 && isNaN(list.itemObject)) {
        //定位盘
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.ffc {
  width: 273px;
  .max_box {
    // height: calc(100vh - 175px);
    // overflow-y: auto;
    ._kuaijie {
      box-sizing: border-box;
      width: 100%;
      background-color: #fff;
      padding: 8px;
      border-bottom: 1px solid #ccc;
      ._kuaijie_box {
        padding: 1px;
        font-size: 12px;
        border: 2.5px solid #ccc;
        padding: 6px 4px;
        margin: 1.5px;
      }
      ._kuaijie_box_1 {
        border: 2.5px solid #ff625c;
      }
    }
    ._kuaijie2 {
      width: 100%;
      ._kuaijie_arr {
        box-sizing: border-box;
        display: inline-block;
        width: 50%;
        height: 42.1875px;
        line-height: 42.1875px;
        border-right: 1px solid #f5f5f9;
        -webkit-box-shadow: inset 0 -1px 1px -1px #c8c7cc;
        box-shadow: inset 0 -1px 1px -1px #c8c7cc;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #585858;
      }
      ._kuaijie_arr_1 {
        border: 2.5px solid #ff625c;
        background: url("../../assets/首页/dui.png") right bottom no-repeat;
        background-size: 20.671px auto !important;
      }
    }
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
          width: 55%;
          box-sizing: border-box;
          padding-left: 5px;
        }
      }
      .current {
        border: 2.5px solid #ff625c;
        background: url("../../assets/首页/dui.png") right bottom no-repeat;
        background-size: 20.671px auto;
        .name {
          color: #000;
        }
        .odds {
          color: #d22018;
        }
      }
    }
    .div:last-child {
      // padding-bottom: 400px;
    }
  }
}
</style>
