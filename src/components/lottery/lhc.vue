<template>
  <div class="lhc">
    <div class="max_box">
      <!-- 正码、生肖尾数 -->
      <div v-if="active == 3 || active == 6">
        <div
          class="zmTab"
          :class="{ 'zmTab-active': dataObj.name == k.name }"
          @click="dataObj = k"
          v-for="(k, i) in itList"
          :key="i"
        >
          <div v-if="k.name == '六肖'">
            <span>{{ k.name }}</span
            ><span class="min-odds">{{ setOdds(k.list[0]) }}</span>
          </div>
          <div v-else>{{ k.name }}</div>
        </div>
        <div class="zmTab-title">{{ dataObj.name }}</div>
        <div v-if="dataObj.name == '六肖'">
          <div class="liuxiao">
            <div
              @click="getRow(dataObj, j)"
              class="liuxiao-row flex-between flex-center"
              v-for="(n, j) in shengxiaoData"
              :key="j"
              :class="{
                current: optionObj[dataObj.name].list.includes(j),
                [n.color]: true,
              }"
            >
              <div class="liuxiao-row-box">{{ j }}</div>
              <div class="liuxiao-row-box flex-right flex-center">
                <div v-for="(m, x) in n.num" :key="x">
                  {{ m }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div
            :class="!isNaN(n.itemObject) ? 'min_box-num' : 'min_box'"
            v-for="(n, j) in dataObj.list"
            :key="j + 'num'"
            @click="getRow(dataObj, n)"
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
                [shengxiaoData[n.itemObject]
                  ? shengxiaoData[n.itemObject].color
                  : '']: true,
              }"
            >
              <div
                class="name"
                :class="{
                  'lhc-red': [
                    1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45,
                    46,
                  ].includes(n.itemObject / 1),
                  'lhc-blue': [
                    3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48,
                  ].includes(n.itemObject / 1),
                  'lhc-green': [
                    5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44,
                    49,
                  ].includes(n.itemObject / 1),
                }"
              >
                {{ setName(n.itemObject) }}
              </div>
              <div class="odds">{{ setOdds(n) }}</div>
            </van-row>
          </div>
        </div>
      </div>
      <!-- 连码、生肖连、尾数连、不中 -->
      <div v-else-if="active == 4 || active == 7 || active == 8 || active == 9" style="font-size:0.32rem">
        <div
          class="zmTab"
          :class="{
            'zmTab-active': dataObj.name == k.name,
            'zmTab-min':
              k.name == '三中二' ||
              k.name == '二中特' ||
              k.name == '二肖连' ||
              k.name == '三肖连' ||
              k.name == '四肖连' ||
              k.name == '二尾连' ||
              k.name == '三尾连' ||
              k.name == '四尾连',
          }"
          @click="dataObj = k"
          v-for="(k, i) in itList"
          :key="i"
        >
          <!-- 宽度100% -->
          <div
            v-if="
              k.name == '三中二' ||
              k.name == '二中特' ||
              k.name == '二肖连' ||
              k.name == '三肖连' ||
              k.name == '四肖连' ||
              k.name == '二尾连' ||
              k.name == '三尾连' ||
              k.name == '四尾连'
            "
            class="flex-justify-center flex-center"
          >
            <div class="min-name">{{ k.name }}</div>
            <div v-for="(n, j) in k.list" :key="j">
              <span class="min-itemObject">{{ n.itemObject }}</span>
              <span class="min-odds">{{ setOdds(n) }}</span>
            </div>
          </div>
          <!-- 宽度50% -->
          <div v-else class="flex-justify-center flex-center">
            <div class="min-name">{{ k.name }}</div>
            <div v-for="(n, j) in k.list" :key="j">
              <span class="min-odds">{{ setOdds(n) }}</span>
            </div>
          </div>
        </div>
        <div class="zmTab-title">{{ dataObj.name }}</div>
        <!-- 生肖连 -->
        <div v-if="dataObj.name && active == 7">
          <div class="liuxiao">
            <div
              @click="getRow(dataObj, n.name)"
              class="liuxiao-row flex-between flex-center"
              v-for="(n, j) in shengxiaoData"
              :key="j"
              :class="{
                current: optionObj[dataObj.name].list.includes(j),
                [n.color]: true,
              }"
            >
              <div class="liuxiao-row-box">{{ j }}</div>
              <div class="liuxiao-row-box flex-right flex-center">
                <div v-for="(m, x) in n.num" :key="x">
                  {{ m }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 尾数连 -->
        <div v-else-if="dataObj.name && active == 8">
          <div class="liuxiao">
            <div
              @click="getRow(dataObj, n.name)"
              class="liuxiao-row flex-between flex-center"
              v-for="(n, j) in weishuData"
              :key="j"
              :class="{
                current: optionObj[dataObj.name].list.includes(j),
                [n.color]: true,
              }"
            >
              <div class="liuxiao-row-box">{{ j }}</div>
              <div class="liuxiao-row-box flex-right flex-center">
                <div v-for="(m, x) in n.num" :key="x">
                  {{ m }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="dataObj.name && (active == 4 || active == 9)">
          <div
            :class="!isNaN(n) ? 'min_box-num' : 'min_box'"
            v-for="(n, j) in 49"
            :key="j"
            @click="getRow(dataObj, n)"
          >
            <van-row
              type="flex"
              justify="center"
              align="center"
              class="box"
              :class="{
                current: optionObj[dataObj.name].list.includes(n),
              }"
            >
              <div
                class="name"
                :class="{
                  'lhc-red': [
                    1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45,
                    46,
                  ].includes(n),
                  'lhc-blue': [
                    3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48,
                  ].includes(n),
                  'lhc-green': [
                    5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44,
                    49,
                  ].includes(n),
                }"
              >
                {{ setName(n) }}
              </div>
            </van-row>
          </div>
        </div>
      </div>
      <!-- 过关 -->
      <div v-else-if="dataObj.name && active == 11">
        <div class="div" v-for="(k, i) in itList" :key="i">
          <van-row type="flex" justify="center" align="center" class="title">
            <div>{{ k.name }}</div>
          </van-row>
          <div
            :class="{
              'min_box-num': !isNaN(n.itemObject),
              min_box: isNaN(n.itemObject),
              min_box2: active == 11 && (j + 1) % 7 == 0,
            }"
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
                current: optionObj[dataObj.name].list.includes(n.id),
              }"
            >
              <div class="name">
                {{ setName(n.itemObject) }}
              </div>
              <div class="odds">{{ setOdds(n) }}</div>
            </van-row>
          </div>
        </div>
      </div>
      <!-- 其他 -->
      <div v-else>
        <div class="div" v-for="(k, i) in itList" :key="i">
          <van-row type="flex" justify="center" align="center" class="title">
            <div>{{ k.name }}</div>
          </van-row>
          <div
            :class="{
              'min_box-num': !isNaN(n.itemObject),
              min_box: isNaN(n.itemObject),
            }"
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
              <div
                class="name"
                :class="{
                  'lhc-red': [
                    1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45,
                    46,
                  ].includes(n.itemObject / 1),
                  'lhc-blue': [
                    3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48,
                  ].includes(n.itemObject / 1),
                  'lhc-green': [
                    5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44,
                    49,
                  ].includes(n.itemObject / 1),
                }"
              >
                {{ setName(n.itemObject) }}
              </div>
              <div class="odds">{{ setOdds(n) }}</div>
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
      dataObj: {},
      oddsShow: true,
      oddsClose: true,
    };
  },
  computed: {
    ...mapState([
      "lotteryNameList",
      "lotteryObj",
      "fanshui",
      "backPoint",
      "optionObj",
      "shengxiaoData",
      "weishuData",
    ]),
    itList() {
      let list = this.NameList.filter((itme) => {
        return itme.show == this.active;
      });
      return list;
    },
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
    type(n, o) {
      this.dataObj = this.NameList.filter((itme) => {
        return itme.show == this.active;
      })[0];
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
      if (k.name == "过关") {
        let optionObj = this.optionObj[this.dataObj.name];
        for (let i in optionObj.list) {
          if (n.itemType.indexOf(i / 1 + 1) > -1) {
            if (optionObj.list[i] == n.id) {
              optionObj.list[i] = "";
              optionObj.name[i] = "";
              optionObj.odds[i] = "";
            } else {
              optionObj.list[i] = n.id;
              optionObj.name[i] = n.itemObject;
              optionObj.odds[i] = n.odds;
            }
          }
        }
        let odds = 1;
        optionObj.odds.map((m) => {
          if (m) {
            odds = (m / 1) * odds;
          }
        });
        let obj = {
          id: 1135,
          minL: 2,
          maxL: 6,
          itemType: k.name,
          itemObject: k.name,
          option: optionObj.list.join(","),
          optionName: optionObj.name.join(","),
          odds: odds,
        };
        this.$forceUpdate();
        this.$emit("getRow", k, n.id, obj);
      } else {
        this.$emit("getRow", k, n);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.lhc {
  width: 273px;
  // height: calc(100vh - 4.66667rem);
  // overflow-y: auto;
  color: #000;
  .max_box {
    // padding-bottom: 400px;
    .zmTab {
      width: 50%;
      height: 48px;
      line-height: 48px;
      display: inline-block;
      box-sizing: border-box;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      text-align: center;
      font-weight: bold;
      &:nth-child(odd) {
        border-left: 1px solid #ddd;
      }
      .min-name {
        margin-right: 5px;
      }
      .min-itemObject {
        color: #444444;
        font-weight: 400;
      }
      .min-odds {
        margin-left: 3px;
        color: red;
        font-weight: 400;
        letter-spacing: 0.05rem;
      }
    }
    .zmTab-min {
      width: 100%;
      border: 1px solid #ddd;
    }
    .zmTab-active {
      border: 2px solid #35a8e0 !important;
    }
    .zmTab-title {
      text-align: center;
      color: #999;
      height: 25px;
      line-height: 25px;
    }
    .title {
      height: 25.26px;
      font-size: 16px;
      color: #585858;
      border-bottom: 1px solid #f5f5f9;
    }
    .min_box2 {
      margin-right: 50% !important;
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
        border: 2.5px solid #ff625c !important;
        background: url("../../assets/首页/home/dui.png") bottom right no-repeat;
        background-size: 20.671px;
        .name {
          color: #000;
        }
        .odds {
          color: #d22018;
        }
      }
    }
    .min_box-num {
      background-color: #fff;
      display: inline-block;
      width: 33%;
      font-size: 16px;
      .box {
        padding: 5px 0;
        border: 1px solid #ddd;
        box-sizing: border-box;
        .name {
          border: 1px solid rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          font-weight: bold;
        }
      }
      .current {
        border: 2.5px solid #ff625c !important;
        background: url("../../assets/首页/home/dui.png") bottom right no-repeat;
        background-size: 20.671px;
        .name {
          color: #fff;
        }
        .lhc-red {
          background: #e7352e;
          border: 1px solid #e7352e;
        }
        .lhc-blue {
          border: 1px solid #00b6ff;
          background: #00b6ff;
        }
        .lhc-green {
          border: 1px solid #1c971b;
          background: #1c971b;
        }
        .odds {
          color: #d22018;
        }
      }
    }
    .liuxiao {
      .current {
        border: 2px solid #d83442 !important;
        background: url("../../assets/首页/home/dui.png") bottom right no-repeat;
        background-size: 15px;
      }
      .liuxiao-row {
        box-sizing: border-box;
        padding: 0 10px;
        height: 42px;
        border-bottom: 1px solid #c8c7cc;
        border-top: 1px solid #fff;
        .liuxiao-row-box {
          width: 38%;
          div {
            width: 23.5px;
            height: 23.5px;
            line-height: 23.5px;
            text-align: center;
            border: 1px solid #b2b2b2;
            border-radius: 50%;
            margin-left: 5px;
          }
          &:last-child {
            width: 62%;
          }
        }
      }
    }
    .lhc-red {
      color: #e7352e;
    }
    .lhc-blue {
      color: #00b6ff;
    }
    .lhc-green {
      color: #1c971b;
    }
    .odds {
      color: red;
      font-size: 14px;
      box-sizing: border-box;
      padding-left: 2px;
    }
  }
}
</style>
