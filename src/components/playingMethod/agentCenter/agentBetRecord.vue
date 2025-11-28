<template>
  <div class="betRecord">
    <div
      class="betRecord_top"
      :style="activeNameClassOpen ? 'z-index:9999' : ''"
    >
      <title-bar @toLeft="to" left_icon="arrow-left" class="titleBar" />
      <div
        class="activeNameClass flex-center flex-left"
        @click="activeNameClassOpen = true"
      >
        <div class="text">{{ $t('agentCenter[\'选择\']') }}</div>
        <div class="flex-center flex-justify-center">
          <div class="name">{{ form.gameClassName }}</div>
          <van-icon name="play" />
        </div>
      </div>
      <div class="dateBox">
        <el-date-picker
          :clearable="false"
          @change="onRefresh()"
          v-model="form.startDate"
          type="date"
          format="MM-dd"
          value-format="yyyy-MM-dd"
          :placeholder="$t('agentCenter[\'选择日期\']')"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 平台弹窗 -->
    <van-popup
      v-model="activeNameClassOpen"
      position="top"
      duration="0"
      :overlay-style="{ background: 'rgba(0,0,0,.5)' }"
      lock-scroll
    >
      <div class="activeNameClassOpen">
        <div class="activeNameClassOpen_body">
          <div
            class="_open_div"
            :class="{ active: form.gameClassCode == m.gameClassCode }"
            @click="
              form.categoryCode = '';
              activeNameClassOpen = false;
              form.gameClassCode = m.gameClassCode;
              form.gameClassName = m.gameClassName;
              onRefresh();
            "
            v-for="m in gameList"
            :key="m.gameClassCode"
          >
            {{ m.gameClassName }}
          </div>
        </div>
      </div>
    </van-popup>

    <div
      class="titleName flex-left flex-center"
      @click="titleNameOpen = true"
      v-show="0"
    >
      <div>{{ form.gameClassName }}</div>
      <van-icon name="arrow-up" v-if="titleNameOpen" />
      <van-icon name="arrow-down" v-else />
    </div>
    <van-popup v-model="titleNameOpen" round position="bottom" v-show="0" lock-scroll>
      <van-picker
        :title="$t('agentCenter[\'选择类型\']')"
        show-toolbar
        value-key="gameClassName"
        :columns="gameList"
        @confirm="onConfirm1"
        @cancel="titleNameOpen = false"
      />
    </van-popup>

    <!-- 彩票 -->
    <div v-if="form.gameClassCode == 'LOTTERY'" class="caipiaoClass">
      <div class="totalmsg2 flex-left">
        <van-row type="flex" align="center" class="info" justify="center">
          <van-cell-group>
            <van-field v-model="form.username" :placeholder="$t('agentCenter[\'下级代理查询\']')" />
          </van-cell-group>
          <div class="info_but" @click="onRefresh()">
            <van-icon name="arrow" />
          </div>
        </van-row>
        <select v-model="form.lotteryId" class="sel50" @change="onRefresh()">
          <option :value="0">{{ $t('agentCenter[\'全部\']') }}</option>
          <option :value="k.id" v-for="(k, i) in typeList" :key="i">
            {{ k.lotteryName }}
          </option>
        </select>
      </div>
      <div class="totalmsg">
        {{ $t('agentCenter[\'有效投注\']') }}:{{ (betAmountToday || 0).toFixed(2) }}&nbsp;&nbsp;{{ $t('agentCenter[\'损益\']') }}:<span>{{
          (totalWinToday || 0).toFixed(2)
        }}</span>
      </div>
      <div class="tabsBox flex-center flex-left">
        <div
          class="_tab"
          :class="{
            _tabShow: form.orderStatus
              ? form.orderStatus === k.id
              : form.win === k.id,
          }"
          @click="setType(k)"
          v-for="(k, i) in idList"
          :key="i"
        >
          {{ k.text }}
        </div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" loading-text="">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="list.length > 0 ? $t('agentCenter[\'已显示全部记录\']') : ''"
          loading-text=" "
          @load="onLoad"
        >
          <div class="betRecord_body" v-if="list.length > 0">
            <div
              class="_row"
              v-for="(k, i) in list"
              :key="i"
              @click="onDetail(k)"
            >
              <div style="width: 100%">
                <p>
                  {{ k.lotteryName }}<span>￥{{ k.betAmount.toFixed(2) }}</span>
                </p>
                <span>{{ k.betTime }}<br/>{{ k.betOrderNo }} [{{ k.userNo }}]</span>
              </div>
              <div class="fr">
                <p class="fr" v-if="k.gameResult == 0">{{ $t('agentCenter[\'未中奖\']') }}</p>
                <p class="fr" v-else-if="k.gameResult == 1" style="color:red;text-align: right;">
                  +{{ k.winAmount }}<br/>{{ $t('agentCenter[\'已中奖\']') }}
                </p>
                <p class="fr" v-else-if="k.gameResult == 2">{{ $t('agentCenter[\'和\']') }}</p>
                <p class="fr" v-else style="color:green">{{ $t('agentCenter[\'等待开奖\']') }}</p>
              </div>
            </div>
          </div>
          <empty v-else-if="!loading" />
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 综合 -->
    <div v-else class="zongheClass">
      <div class="totalmsg2 flex-left">
        <van-row type="flex" align="center" class="info" justify="center">
          <van-cell-group>
            <van-field v-model="form.username" :placeholder="$t('agentCenter[\'下级代理查询\']')" />
          </van-cell-group>
          <div class="info_but" @click="onRefresh()">
            <van-icon name="arrow" />
          </div>
        </van-row>
        <select v-model="form.categoryCode" class="sel50" @change="onRefresh()">
          <option :value="''">全部</option>
          <option
            :value="k.categoryCode"
            v-for="(k, i) in gameCategoryList()"
            :key="i"
          >
            {{ k.categoryName }}
          </option>
        </select>
      </div>
      <div class="totalmsg">
        {{ $t('agentCenter[\'有效投注\']') }}:{{ (betAmountToday || 0).toFixed(2) }}&nbsp;&nbsp;{{ $t('agentCenter[\'损益\']') }}:<span>{{
          (totalWinToday || 0).toFixed(2)
        }}</span>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" loading-text="">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="list.length > 0 ? $t('agentCenter[\'已显示全部记录\']') : ''"
          loading-text=" "
          @load="onLoad"
        >
          <div class="betRecord_body" v-if="list.length > 0">
            <div
              class="_row"
              v-for="(k, i) in list"
              :key="i"
              @click="onDetail(k)"
            >
              <div style="width: 100%">
                <p>
                  {{ k.categoryName }} {{ k.gameName
                  }}<span>￥{{ k.betAmount.toFixed(2) }}</span>
                </p>
                <span>{{ k.startTime }}<br/>{{ k.matchNumber }}  [{{ k.userNo }}]</span>
              </div>
              <div class="fr">
                <p class="fr" v-if="k.gameResult == 1" style="color:red;text-align: right;">+{{ k.winAmount }}<br/>胜</p>
                <p class="fr" v-else-if="k.gameResult == 0">负</p>
                <p class="fr" v-else-if="k.gameResult == 2">和</p>
                <p class="fr" v-else style="color:green">等待开奖</p>
              </div>
            </div>
          </div>
          <empty v-else-if="!loading" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 彩票 投注记录详情 -->
    <van-popup
      duration="0"
      class="detailOpenClass"
      v-model="detailOpen"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <titleBar
        :title_name="$t('agentCenter[\'注单详情\']')"
        @toLeft="detailOpen = false"
        left_icon="arrow-left"
      />
      <div class="main_detail">
        <div class="tzHead">
          <div
            :class="`L_${formData.gameCategoryCode}`"
            class="fl iconfont"
          ></div>
          <h1>{{ formData.lotteryName }}</h1>
          <span class="fr" v-if="formData.gameResult == 0">未中奖</span>
          <span class="fr" v-else-if="formData.gameResult == 1" style="color:red">已中奖</span>
          <span class="fr" v-else-if="formData.gameResult == 2">和</span>
          <span class="fr" v-else style="color:green">等待开奖</span>
          <p>第{{ formData.periodId }}期</p>
        </div>
        <table class="table_detail">
          <tbody>
            <tr>
              <td>投注帐号</td>
              <td>{{ formData.userNo }}</td>
            </tr>
            <tr>
              <td>投注时间</td>
              <td>{{ formData.betTime }}</td>
            </tr>
            <tr>
              <td>投注单号</td>
              <td>{{ formData.betOrderNo }}</td>
            </tr>
            <tr>
              <td>投注金额</td>
              <td>¥{{ formData.betAmount }}元</td>
            </tr>
            <tr>
              <td>派送奖金</td>
              <td>
                ¥{{ formData.sendAmount }}元<span
                  v-if="formData.gameResult == 2"
                  >（退款）</span
                >
              </td>
            </tr>
            <tr>
              <td>返点金额</td>
              <td>¥{{ formData.returnAmount }}元</td>
            </tr>
            <tr>
              <td>盈亏金额</td>
              <td>¥{{ formData.winAmount }}元</td>
            </tr>
            <tr>
              <td>开奖号码</td>
              <td>{{ formData.openResult }}</td>
            </tr>
          </tbody>
        </table>
        <section class="section_detail">
          <header>我的投注</header>
          <ul>
            <li></li>
            <li>
              <div
                style="
                  overflow-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                "
              >
                {{ formData.itemType }}
              </div>
              <span
                >{{
                  formData.lotteryOptions
                    ? `(${formData.lotteryOptions})`
                    : formData.itemObject
                }}@</span
              ><span style="color: red">{{ formData.odds }}</span>
              <!---->
              <p class="hr1px"></p>
            </li>
            <li></li>
          </ul>
        </section>
      </div>
    </van-popup>
    <!-- 综合 投注记录详情 -->
    <van-popup
      duration="0"
      class="detailOpenClass"
      v-model="detailOpen2"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <titleBar
        :title_name="$t('agentCenter[\'注单详情\']')"
        @toLeft="detailOpen2 = false"
        left_icon="arrow-left"
      />
      <div class="main_detail">
        <div class="tzHead" v-if="formData.categoryCode">
          <img class="gameImg" :src="require(`../../../assets/gameImg/AG_DZ_8.png`)" v-if="formData.thirdPlatformName === 'AG平台'"/>
          <img class="gameImg" :src="require(`../../../assets/gameImg/${formData.categoryCode}_${formData.gameCode}.png`)" v-else/>
          <h1>{{ formData.thirdPlatformName }}</h1>
          <span class="fr" v-if="formData.gameResult == 1" style="color:red">胜</span>
          <span class="fr" v-else-if="formData.gameResult == 0">负</span>
          <span class="fr" v-else-if="formData.gameResult == 2">和</span>
          <span class="fr" v-else style="color:green">等待开奖</span>
          <p>局号：{{ formData.matchNumber }}</p>
        </div>
        <table class="table_detail">
          <tbody>
            <tr>
              <td>投注帐号</td>
              <td>{{ formData.userNo }}</td>
            </tr>
            <tr>
              <td>投注时间</td>
              <td>{{ formData.startTime }}</td>
            </tr>
            <tr>
              <td>投注局号</td>
              <td>{{ formData.matchNumber }}</td>
            </tr>
            <tr>
              <td>投注金额</td>
              <td>¥{{ formData.betAmount }}元</td>
            </tr>
            <!-- <tr>
              <td>派送奖金</td>
              <td>
                ¥{{ formData.sendAmount }}元<span
                  v-if="formData.gameResult == 2"
                  >（退款）</span
                >
              </td>
            </tr> -->
            <tr>
              <td>盈亏金额</td>
              <td>¥{{ formData.winAmount }}元</td>
            </tr>
            <tr>
              <td>投注游戏</td>
              <td>{{ formData.categoryName }}</td>
            </tr>
          </tbody>
        </table>
        <section class="section_detail">
          <header>我的投注</header>
          <ul>
            <li></li>
            <li>
              <div
                style="
                  overflow-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                "
              >
                {{ formData.gameName }}
              </div>
              <span>{{ formData.roomName }}</span>
              <p class="hr1px"></p>
            </li>
            <li></li>
          </ul>
        </section>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import titleBar from "../../shared/titleBar.vue";
export default {
  components: { titleBar },
  data() {
    return {
      activeNameClassOpen: false,
      detailOpen2: false,
      detailOpen: false,
      titleNameOpen: false,
      loading: false,
      finished: false,
      refreshing: false,

      minDate: new Date(2010, 0, 1),
      maxDate: new Date(),
      idList: [],
      dateList: [],
      dateShow: false,
      formData: {},
      form: {
        startDate: "",
        endDate: "",
        lotteryId: 0,
        pageNo: 0,
        pageSize: 20,
        win: "",
        orderStatus: null,
        categoryCode: "",
        gameClassName: "彩票",
        categoryId: "",
        gameClassCode: "LOTTERY"
      },
      total: 0,
      list: [],
      betAmountToday: 0,
      totalWinToday: 0,
      gameList: [],
    };
  },
  computed: {
    ...mapState(["GroupList"]),
    routeData() {
      return this.$route.query.data ? JSON.parse(this.$route.query.data) : null;
    },
    lotteryId() {
      return this.$route.query.lotteryId || 0;
    },
    userNo() {
      return this.$route.query.userNo || '';
    },
    typeList() {
      let arr = [];
      this.GroupList.map((k) => {
        arr = [...arr, ...k.list];
      });
      return arr;
    },
  },
  created() {
    // 初始化 idList
    this.idList = [
      { id: "", text: this.$t("agentCenter['全部']") },
      { id: 1, text: this.$t("agentCenter['已中奖']") },
      { id: 0, text: this.$t("agentCenter['未中奖']") },
      // { id: 3, text: this.$t("agentCenter['和']") },
      { id: 10, text: this.$t("agentCenter['待开奖']") },
    ];
    
    this.form.lotteryId = this.lotteryId;
    this.form.username = this.userNo;
    let date = new Date();
    let getMonth = date.getMonth() + 1;
    let getDate = date.getDate();
    this.form.endDate = this.form.startDate = `${date.getFullYear()}-${
      getMonth > 9 ? getMonth : "0" + getMonth
    }-${getDate > 9 ? getDate : "0" + getDate}`;
    this.getGameCategory();
  },
  methods: {
    // 查看详情
    onDetail(row) {
      this.formData = Object.assign({}, row);
      if (this.form.gameClassCode == "LOTTERY") {
        this.detailOpen = true;
      } else {
        this.detailOpen2 = true;
      }
    },
    gameCategoryList() {
      let json =
        this.gameList.filter(
          (item) => item.gameClassCode == this.form.gameClassCode
        )[0] || {};
      return json.list || [];
    },
    onConfirm1(value, index) {
      this.form.categoryId = "";
      this.form.gameClassName = value.gameClassName;
      this.form.gameClassCode = value.gameClassCode;
      this.titleNameOpen = false;
      this.onRefresh();
    },
    getGameCategory() {
      this.$ajax.post(`/list/gameCategory`).then((res) => {
        let arr = [];
        for (let k of res.data) {
          let idx = arr
            .map((item) => item.gameClassName)
            .indexOf(k.gameClassName);
          if (idx > -1) {
            arr[idx].list.push(k);
          } else {
            arr.push({
              gameClassName: k.gameClassName,
              gameClassCode: k.gameClassCode,
              list: [k],
            });
          }
        }
        this.form.gameClassName = arr[0].gameClassName;
        this.form.gameClassCode = arr[0].gameClassCode;
        this.gameList = arr;
      });
    },
    onselect(date) {
      if (date.length == 3) {
        this.dateList = [new Date(date[2])];
        this.$refs.myCalendar.reset();
      }
    },
    onRefresh() {
      // 清空列表数据
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.form.pageNo = 0;
      this.onLoad();
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.form.pageNo += 1;
      this.onbetRecord();
    },
    setType(k) {
      if (k.id == 10) {
        this.form.win = "";
        this.form.orderStatus = 10;
      } else {
        this.form.orderStatus = null;
        this.form.win = k.id;
      }
      this.onRefresh();
    },
    //投注记录列表
    onbetRecord() {
      if (!this.form.gameClassCode) return;
      let url = "";
      let data = {};
      if (this.form.gameClassCode == "LOTTERY") {
        url = "/lottery/betRecordSlave";
        data = {
          startDate: this.form.startDate + " 00:00:00",
          endDate: this.form.startDate + " 23:59:59",
          lotteryId: this.form.lotteryId,
          pageNo: this.form.pageNo,
          username: this.form.username,
          pageSize: this.form.pageSize,
          win: this.form.win,
          orderStatus: this.form.orderStatus,
        };
      } else {
        console.log(this.form.gameClassCode);
        url = "/channel/searchMemberGameRecord";
        data = {
          categoryCode: this.form.categoryCode || null,
          startDate: this.form.startDate + " 00:00:00",
          endDate: this.form.startDate + " 23:59:59",
          gameClassCode: this.form.gameClassCode,
          userNo: this.form.username,
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
        };
      }

      this.$ajax
        .post(url, data)
        .then((res) => {
          if (res.data) {
            this.betAmountToday =
              res.data.betAmountToday || res.data.totalBetAmount;
            this.totalWinToday = res.data.totalWinToday;
            this.total = res.data.page.total;
            this.list = [...this.list, ...res.data.page.records || []];

            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.list.length >= this.total) {
              this.finished = true;
            }
          } else {
            this.betAmountToday = 0;
            this.totalWinToday = 0;
            this.total = 0;
            this.list = [];
          }
        })
        .catch((error) => {
          this.$toast(error);
          this.finished = true;
        });
    },
    to() {
      this.$router.push({
        path: this.$route.query.redirect,
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.betRecord {
  // min-height: 100vh;
  background-color: #fff;
  .caipiaoClass {
    .van-list {
      height: calc(100vh - 250px);
      overflow: auto;
    }
  }
  .zongheClass {
    .van-list {
      height: calc(100vh - 202px);
      overflow: auto;
    }
  }
  .betRecord_top {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .activeNameClass {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    height: 50px;
    .text {
      font-size: 12px;
      line-height: 14.0998px;
      height: 28.1979px;
      margin-left: -16.4497px;
      margin-top: 11.7498px;
      position: absolute;
      top: 0;
    }
    .flex-center {
      font-size: 0.8em;
      border-radius: 3.48125px;
      border: 1px solid hsla(0, 0%, 100%, 0.5);
      vertical-align: top;
      height: 34.8125px;
      padding: 0 6.96285px;
      .name {
        font-size: 17.4071px;
        margin-right: 2px;
      }
      .van-icon {
        transform: rotate(90deg);
        color: #f0c930;
        font-size: 18.5px;
      }
    }
  }
  .activeNameClassOpen {
    width: 100vw;
    padding-top: 50px;
    .activeNameClassOpen_body {
      width: 100%;
      padding: 4.6875px 4.6875px 0;
      box-sizing: border-box;
      min-height: 46.59px;
      ._open_div {
        line-height: 35.2396px;
        border-radius: 3px;
        cursor: pointer;
        text-align: center;
        color: #555;
        font-size: 13.9257px;
        margin: 4.6875px;
        margin-top: 0;
        float: left;
        border: 1px solid #ddd;
        height: 35.2396px;
        width: 63.75px;
        box-sizing: border-box;
      }
      .active {
        background: #dc3b40;
        border: 1px solid #dc3b40;
        color: #fff;
      }
    }
  }
  .tabsBox {
    background: #f3f3f3;
    font-size: 17.4071px;
    ._tab {
      height: 47.25px;
      line-height: 47.25px;
      box-sizing: border-box;
      width: calc(100% / 4);
      text-align: center;
    }
    ._tabShow {
      color: #dc3b40;
      border-bottom: 2.5px solid #dc3b40;
    }
  }
  .totalmsg {
    height: 38.2917px;
    text-align: center;
    font-size: 17.4071px;
    padding: 3.481px 0;
    color: #4c4c4c;
    background-color: #efeef4;
    box-sizing: border-box;
  }
  .totalmsg2 {
    background-color: #efeef4;
    padding: 13px;
    .sel50 {
      height: 35px;
      line-height: 35px;
      margin-right: 5px;
      font-size: 16.4062px;
      margin-left: 13px;
    }
    .info {
      background-color: #fff;
      border-radius: 4.35px;
      width: 161.552px;
      .van-cell-group {
        border-radius: 4.35px;
        width: calc(100% - 28.86px);
        height: 24.36px;
        padding: 4.5px 0;
      }
      .info_but {
        height: 24.36px;
        line-height: 24.36px;
        width: 24.36px;
        background-color: #dc3b40;
        border-radius: 3px;
        color: white;
        margin-right: 4.5px;
        font-size: 18.2px;
        position: relative;
        i {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .van-icon-warning {
        color: #d83442;
      }
      .text {
        margin-left: 5px;
        color: #999;
        font-size: 12px;
      }
      .van-cell {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
  .betRecord_body {
    padding: 10px 0;
    ._row {
      padding: 4px 0;
      color: #000;
      font-size: 15.2312px;
      box-sizing: border-box;
      border-bottom: 1px solid #584e4e29;
      margin: 0 5%;
      position: relative;
      div {
        line-height: 27.1986px;
        display: inline-block;
        p {
          margin: 0;
          span {
            font-size: 12.185px;
            margin-left: 4.87399px;
            color: #989898;
          }
        }
        span {
          color: #989898;
        }
      }
      div.fr {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .detailOpenClass {
    .main_detail {
      padding-top: 13px;
      .tzHead {
        height: 65.2708px;
        margin-bottom: 10.8795px;
        .gameImg{
          width: 54.3958px;
          height: 54.3958px;
          margin: 0 21.7589px 0 23.4375px;
          float: left;
        }
        .fl {
          float: left;
        }
        .iconfont {
          font-size: 54.3973px;
          margin: 0 21.7589px 0 23.4375px;
          width: 54.3958px;
          height: 54.3958px;
        }
        span {
          font-size: 19.583px;
          display: inline;
          float: right;
          position: relative;
          right: 30px;
          top: -32.7036px;
        }
        h1 {
          font-size: 19.583px;
          line-height: 32.7036px;
          font-weight: 400;
          margin: 0;
        }
        p {
          font-size: 15.2312px;
          line-height: 30.4625px;
          color: #bbb;
          margin: 0;
        }
      }
      .table_detail {
        tr {
          height: 43.5178px;
          font-size: 17.4071px;
        }
      }
      tr:before {
        right: 0;
        left: auto;
        content: "";
        position: absolute;
        background: #d0d0d0;
        width: 360.938px;
        height: 1px;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      td:first-of-type {
        width: 113.01px;
        text-align: center;
      }
      .section_detail {
        margin-top: 21.7589px;
        .hr1px {
          margin: 3.48142px auto 0;
          height: 1px;
          background-image: -webkit-linear-gradient(
            90deg,
            #d0d0d0,
            #d0d0d0 50%,
            transparent 0
          );
        }
        header {
          height: 30px;
          line-height: 30px;
          padding: 0 17.4071px;
          font-size: 17.4071px;
        }
        li {
          padding: 0 26.1107px;
          color: #bbb;
          background-image: url("../../../assets/MyCenter/dfgdfa.png");
          background-repeat: no-repeat;
          background-size: 100% 300%;
          background-position: 0 80%;
          height: auto;
          font-size: 17.4071px;
          span {
            font-size: 13.9257px;
          }
        }
        li:first-of-type {
          background-position: 0 0;
          height: 34.8125px;
          background-size: 100% auto;
        }
        li:last-of-type {
          background-position: 0 130%;
          height: 43.5104px;
          background-size: 100% 150%;
        }
      }
    }
  }
}
</style>
