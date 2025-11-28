<template>
  <div class="pk10Page">
    <div class="max_box" v-if="active != 3">
      <div
        class="div"
        v-for="(k, i) in NameList.filter((itme) => {
          return itme.show.indexOf(active) >= 0;
        })"
        :key="i"
      >
        <van-row
          type="flex"
          justify="center"
          align="center"
          class="title"
          v-show="k.name != '冠军和'"
        >
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
            <div
              class="name"
              :class="n.itemObject<=10&&k.name!='冠军和'?'car car'+setName(n.itemObject):''"
            >
              {{
                k.name === "冠军和" && !(n.itemObject > 0)
                  ? `${translateLotteryText('和')}${translateLotteryText(setName(n.itemObject))}`
                  : translateLotteryText(setName(n.itemObject))
              }}
            </div>
            <div class="odds">{{ setOdds(n) }}</div>
          </van-row>
        </div>
      </div>
    </div>
    <div class="max_box" v-else>
      <div
        style="
          margin: 5px 0 0;
          padding: 8px;
          display: flex;
          background-color: #fff;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-flex: 0;
          border-bottom: 1px solid #ccc;
        "
      >
        <span
          class="but"
          :class="{ but_current: but_currentList.includes(k.name) }"
          @click="setbut_currentList(k)"
          v-for="(k, i) in NameList.filter((itme) => {
            return itme.show.indexOf(active) >= 0;
          })"
          :key="i"
          >{{ translateLotteryText(k.name) }}</span
        >
      </div>
      <div
        class="div"
        v-for="(k, i) in NameList.filter((itme) => {
          return itme.show.indexOf(active) >= 0;
        })"
        :key="i"
        v-if="i == 0"
      >
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
                  return itme.itemObject == n.itemObject;
                }).length > 0,
            }"
          >
            <div
              class="name"
              :class="n.itemObject<=10?'car car'+setName(n.itemObject):''"
            >
              {{ translateLotteryText(setName(n.itemObject)) }}
            </div>
            <!-- <div class="odds">{{ setOdds(n) }}</div> -->
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
      but_currentList: [],
      resultShow: false,
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
    type(to, from) {
      this.but_currentList = [];
    },
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
      if (!isNaN(itemObject)) {
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
    setbut_currentList(n) {
      let data = this.but_currentList.filter((k) => {
        return k == n.name;
      });
      let arr = this.NameList.filter((itme) => {
        return itme.show.indexOf(this.active) >= 0;
      });
      let arr2 = this.currentList.filter((k) => {
        return k.itemType == this.currentList[0].itemType;
      });

      arr2.map((k) => {
        arr.map((m) => {
          if (m.name == n.name) {
            m.list.map((b) => {
              if (b.itemObject == k.itemObject) {
                this.$emit("getRow", m, b);
              }
            });
          }
        });
      });

      if (data.length > 0) {
        this.but_currentList = this.but_currentList.filter((k) => {
          return k != n.name;
        });
      } else {
        this.but_currentList.push(n.name);
      }
      console.log(this.but_currentList);
    },
    getRow(k, n) {
      if (this.active == 3) {
        let arr = this.NameList.filter((itme) => {
          return itme.show.indexOf(this.active) >= 0;
        });
        arr.map((obj) => {
          let data = this.but_currentList.filter((name) => {
            return name == obj.name;
          });
          if (data.length > 0) {
            obj.list.map((m) => {
              if (n.itemObject == m.itemObject) {
                this.$emit("getRow", obj, m);
              }
            });
          }
        });
      } else {
        this.$emit("getRow", k, n);
      }
    },
    onShow(list) {
      if (this.active == 1 && !isNaN(list.itemObject)) {
        //两面盘
        return false;
      } else if (this.active == 2 && isNaN(list.itemObject)) {
        //数字盘
        return false;
      } else if (
        this.active == 3 &&
        (list.itemObject == "龙" || list.itemObject == "虎")
      ) {
        return false;
      } else if (this.active == 4) {
        console.log(list);
      }
      return true;
    },
  },
};
</script>

<style lang="scss">
.pk10Page {
  width: 273px;
  .max_box {
    // height: calc(100vh - 175px);
    // overflow-y: auto;
    .but {
      display: inline-block;
      width: 49px;
      font-size: 12px;
      white-space: nowrap;
      box-sizing: border-box;
      text-align: center;
      -o-border-image: initial;
      border-image: initial;
      border: 2px solid #ccc;
      padding: 6px 4px;
      color: #000;
      margin-right: 2px;
      margin-bottom: 2px;
      &:nth-child(5n){
        margin-right: 0;
      }
    }
    .but_current {
      border: 2.5px solid #ff625c;
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
        .car{
          font-size: 18px;
          color: #fff;
          width: 26px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border-radius: 3px;
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
