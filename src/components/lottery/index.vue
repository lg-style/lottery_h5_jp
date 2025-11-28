<template>
  <div
    class="lotteryPage"
    :class="`lotteryPage_${lotteryObj.gameCategoryCode}`"
    @click="zoushiBoxOpen = false"
  >
    <div class="titleBar_top">
      <!-- 头部 -->
      <titleBar
        :class="`${lotteryObj.gameCategoryCode}_titleBar _titleBar`"
        @toLeft="toHome"
        left_icon="arrow-left"
      />
      <ul class="top2" v-if="tabsBgOpen === '1'">
        <li class="item" @click="liveVideoOpen = false">
          <span :class="{ active: !liveVideoOpen }">
            {{ $t("lotteryIndex['我要投注']") }}
          </span>
        </li>
        <li class="item" @click="toPath('betRecord')">
          <span>{{ $t("lotteryIndex['投注记录']") }}</span>
        </li>
        <li class="item" @click="liveVideoOpen = true" v-if="data.periodId">
          <span :class="{ active: liveVideoOpen }">
            {{ $t("lotteryIndex['开奖视频']") }}
          </span>
        </li>
        <li class="item" @click="onMipaiOpen()" v-if="data.periodId">
          <span>{{ $t("lotteryIndex['咪牌']") }}</span>
        </li>
        <!---->
        <li class="item"></li>
      </ul>
      <div
        class="activeNameClass flex-center flex-left"
        @click="activeNameClassOpen = true"
      >
        <div class="text" v-html="$t('lotteryIndex.玩法提示')"></div>
        <div class="flex-center flex-justify-center">
          <div class="name">{{ activeName }}</div>
          <van-icon name="play" />
        </div>
      </div>
      <div class="activeNameClassOpen" v-if="activeNameClassOpen">
        <div class="activeNameClassOpen_body">
          <div
            class="_open_div"
            :class="{ active: active == m.id }"
            @click="
              activeNameClassOpen = false;
              onEmpty();
              active = m.id;
            "
            v-for="m in leftList"
            :key="m.id"
          >
            {{ translateLotteryText(m.text) }}
          </div>
        </div>
        <div
          class="activeNameClassOpen_zhezhao"
          @click="activeNameClassOpen = false"
        ></div>
      </div>
      <div class="lottery_right_box">
        <van-row
          type="flex"
          justify="end"
          align="center"
          class="row"
          @click="MoreGamesShow = true"
        >
          <div>{{ lotteryObj.lotteryName }}</div>
          <van-icon name="play" />
          <van-icon name="arrow-down" />
        </van-row>
        <!--    更多彩票 弹窗-->
        <van-popup
          v-model="MoreGamesShow"
          :overlay="true"
          position="right"
          :style="{ width: '335px', height: '100%' }"
          lock-scroll
        >
          <div class="MoreGames_body">
            <div class="box" v-for="(k, i) in MoreGamesList" :key="i">
              <div class="title">
                <span>
                  {{ $t("lotteryIndex['groupSeries']", { name: k.groupName }) }}
                </span>
              </div>
              <div class="box_min">
                <span
                  v-for="(n, j) in k.list"
                  :key="j"
                  class="box_min_name ofHidden"
                  :class="{ box_min_name_current: n.id == lotteryId }"
                >
                  <span v-if="n.lotteryStatus == 0">
                    {{ $t("new2['暂未开放']") }}
                  </span>
                  <span @click="togame(n, k.groupName)" v-else>
                    {{ n.lotteryName }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <!-- 开奖视频 -->
      <div class="liveVideo" v-if="liveVideoOpen">
        <!-- ssc -->
        <sscLiveVideo
          v-if="groupName == '时时彩'"
          :suijiOpenResultShow="suijiOpenResultShow"
          :OpenTime="OpenTime"
          :suijiOpenResultData="suijiOpenResultData"
          :ZHLH="ZHLH"
        />
        <!-- PK10 -->
        <pk10LiveVideo
          v-if="groupName == 'PK10'"
          :suijiOpenResultShow="suijiOpenResultShow"
          :OpenTime="OpenTime"
          :suijiOpenResultData="suijiOpenResultData"
          :periodId="setPeriodId(data.periodId)"
          :order="setPeriodId(apiData.order)"
          :lotteryName="lotteryObj.lotteryName"
          :openResult="data.openResult.split(' ')"
        />
      </div>
      <div class="topBox" v-else>
        <van-row type="flex" justify="space-between" class="topBox_box">
          <div class="_left" @click.stop="zoushiBoxOpen = !zoushiBoxOpen">
            <van-row
              type="flex"
              justify="space-between"
              align="center"
              class="left_box1"
            >
              <van-row type="flex" align="center" v-if="data.periodId">
                <div>
                  {{ setPeriodId(data.periodId) }}{{ $t("lotteryIndex['期']") }}
                </div>
                <van-icon name="arrow-down" />
              </van-row>
              <van-row type="flex" align="center" v-else>
                <div>-</div>
              </van-row>
              <div class="yu_e">
                {{ $t("lotteryIndex['余额']") }}:<span>
                  {{ amount.accountMoney ? amount.accountMoney.toFixed(2) : 0 }}
                </span>
              </div>
            </van-row>
            <div v-if="data.periodId">
              <!-- 快三 -->
              <van-row
                type="flex"
                align="center"
                class="left_box2"
                v-if="groupName == '快三'"
              >
                <img
                  class="touzi"
                  v-for="i in data.openResult.split(' ')"
                  :key="i"
                  :src="
                    require(`../../assets/new/touzi/a${i || 1}.png`) +
                    `?time=${time}`
                  "
                  v-if="i > 0 && i < 7"
                />
                <b v-else>{{ i }}</b>
              </van-row>
              <!-- pk10 -->
              <div v-if="groupName == 'PK10'">
                <van-row type="flex" align="center" class="left_box2">
                  <span
                    class="_pk10"
                    :class="`car${i < 10 ? '0' + i : i}`"
                    v-for="i in suijiOpenResultData"
                    :key="i"
                    >{{ i }}</span
                  >
                </van-row>
                <van-row
                  type="flex"
                  align="center"
                  class="left_box4"
                  v-for="(k, i) in [data.openResult.split(' ')]"
                  :key="i"
                >
                  <span>{{ k[0] / 1 + k[1] / 1 }}</span>
                  <span>
                    {{
                      k[0] / 1 + k[1] / 1 >= 12
                        ? $t("lotteryIndex['大']")
                        : $t("lotteryIndex['小']")
                    }}
                  </span>
                  <span>
                    {{
                      (k[0] / 1 + k[1] / 1) % 2 == 1
                        ? $t("lotteryIndex['单']")
                        : $t("lotteryIndex['双']")
                    }}
                  </span>
                  <span>
                    {{
                      k[0] / 1 > k[9] / 1
                        ? $t("lotteryIndex['龙']")
                        : $t("lotteryIndex['虎']")
                    }}
                  </span>
                  <span>
                    {{
                      k[1] / 1 > k[8] / 1
                        ? $t("lotteryIndex['龙']")
                        : $t("lotteryIndex['虎']")
                    }}
                  </span>
                  <span>
                    {{
                      k[2] / 1 > k[7] / 1
                        ? $t("lotteryIndex['龙']")
                        : $t("lotteryIndex['虎']")
                    }}
                  </span>
                  <span>
                    {{
                      k[3] / 1 > k[6] / 1
                        ? $t("lotteryIndex['龙']")
                        : $t("lotteryIndex['虎']")
                    }}
                  </span>
                  <span>
                    {{
                      k[4] / 1 > k[5] / 1
                        ? $t("lotteryIndex['龙']")
                        : $t("lotteryIndex['虎']")
                    }}
                  </span>
                </van-row>
              </div>

              <!-- 时时彩 -->
              <van-row
                type="flex"
                align="center"
                class="left_box2"
                v-if="groupName == '时时彩'"
              >
                <div class="qiu" v-for="(k, i) in suijiOpenResultData" :key="i">
                  {{ k }}
                </div>
              </van-row>
              <!-- 六合彩 -->
              <div class="lhc-openResult" v-if="groupName == '六合彩'">
                <van-row type="flex" align="center" class="lhc-row1">
                  <div
                    v-for="(k, i) in suijiOpenResultData"
                    :key="i"
                    class="flex-center flex-left"
                  >
                    <div v-show="i == 6">+</div>
                    <div
                      :class="{
                        'lhc-red': [
                          1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35,
                          40, 45, 46,
                        ].includes(k / 1),
                        'lhc-blue': [
                          3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42,
                          47, 48,
                        ].includes(k / 1),
                        'lhc-green': [
                          5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43,
                          44, 49,
                        ].includes(k / 1),
                      }"
                      class="box"
                    >
                      {{ setName(k) }}
                    </div>
                  </div>
                </van-row>
                <van-row type="flex" align="center" class="lhc-row2">
                  <div
                    v-for="(k, i) in data.openResult.split(' ')"
                    :key="i"
                    class="flex-center flex-left"
                  >
                    <div v-show="i == 6" style="opacity: 0">+</div>
                    <div class="box">
                      {{
                        Object.values(shengxiaoData).filter((n) =>
                          n.num.includes(setName(k))
                        )[0]
                          ? Object.values(shengxiaoData).filter((n) =>
                              n.num.includes(setName(k))
                            )[0].name
                          : ""
                      }}
                    </div>
                  </div>
                </van-row>
              </div>
              <!-- 幸运28 -->
              <div class="xy28-openResult" v-if="groupName == '快乐彩'">
                <van-row type="flex" align="center" class="left_box2">
                  <div class="qiu" v-for="i in suijiOpenResultData">
                    {{ i }}
                  </div>
                </van-row>
                <van-row type="flex" align="center" class="left_box2">
                  <!-- 和 -->
                  <div class="xy28-box">
                    {{
                      data.openResult.split(" ").reduce((p, c) => p / 1 + c / 1)
                    }}
                  </div>
                  <!-- 双面 -->
                  <div
                    class="xy28-box"
                    v-for="it in [
                      data.openResult
                        .split(' ')
                        .reduce((p, c) => p / 1 + c / 1),
                    ]"
                    :key="it"
                  >
                    <div v-if="it >= 14">
                      <span v-if="it % 2 == 0">
                        {{ $t("lotteryIndex['大双']") }}
                      </span>
                      <span v-else>{{ $t("lotteryIndex['大单']") }}</span>
                    </div>
                    <div v-else>
                      <span v-if="it % 2 == 0">
                        {{ $t("lotteryIndex['小双']") }}
                      </span>
                      <span v-else>{{ $t("lotteryIndex['小单']") }}</span>
                    </div>
                  </div>
                </van-row>
              </div>
              <van-row
                type="flex"
                align="center"
                class="left_box3"
                v-if="groupName == '时时彩'"
              >
                <div
                  class="fang"
                  v-for="(k, i) in ZHLH"
                  :key="i"
                  v-show="i < 4"
                >
                  {{ k }}
                </div>
              </van-row>
            </div>
          </div>
          <div @click="toPath('betRecord')" v-if="apiData.start">
            <div class="_right" v-if="this.LoseTime > 0">
              <div class="right_box1">
                {{ setPeriodId(apiData.order) }}{{ $t("lotteryIndex['期']") }}
              </div>
              <div class="right_box2">
                {{ $t("lotteryIndex['投注截止']") }}
              </div>
              <div class="right_box3">
                {{ timeUtil.formatTimesToHHmmSS(LoseTime) }}
              </div>
            </div>
            <div class="_right" v-else>
              <div class="right_box1">
                {{ setPeriodId(apiData.order) }}{{ $t("lotteryIndex['期']") }}
              </div>
              <div class="right_box2">
                {{ $t("lotteryIndex['开奖截止']") }}
              </div>
              <div class="right_box3">
                {{ timeUtil.formatTimesToHHmmSS(OpenTime) }}
              </div>
            </div>
            <van-icon name="play" class="sd1" />
          </div>
          <div v-else>
            <div class="_right">
              <div class="wkp_text">
                {{ $t("lotteryIndex['未开盘']") }}
              </div>
            </div>
            <van-icon name="play" class="sd1" />
          </div>
        </van-row>
        <div
          class="zoushiBox"
          v-if="zoushiBoxOpen"
          :class="'zoushiBox_' + lotteryObj.gameCategoryCode"
        >
          <div class="zoushiBox_row zoushiBox_title flex-center flex-left">
            <div class="_flex">{{ $t("lotteryIndex['期号']") }}</div>
            <div class="_flex" v-if="groupName != '六合彩'">
              {{ $t("lotteryIndex['时间']") }}
            </div>
            <div class="_flex">{{ $t("lotteryIndex['开奖号码']") }}</div>
            <div class="_flex" v-if="groupName == '六合彩'">
              {{ $t("lotteryIndex['开奖日期']") }}
            </div>
          </div>
          <div
            class="zoushiBox_row flex-center flex-left"
            v-for="(k, i) in todayOpenRecordLiu"
            :key="k.id"
          >
            <div class="_flex" v-if="groupName == 'PK10'">
              {{ setPeriodId(k.periodId, 4) }}
            </div>
            <div class="_flex" v-else-if="groupName == '六合彩'">
              {{ k.periodId }}
            </div>
            <div class="_flex" v-else>{{ setPeriodId(k.periodId, 0, 2) }}</div>
            <div class="_flex" style="color: #333" v-if="groupName != '六合彩'">
              {{ k.openTime ? k.openTime.split(" ")[1] : "" }}
            </div>
            <div
              class="_flex flex-justify-center flex-center"
              v-if="groupName == '时时彩'"
            >
              <div
                class="qiu"
                v-for="(k, i) in k.openResult.split(' ')"
                :key="i"
              >
                {{ k }}
              </div>
            </div>
            <div
              class="_flex flex-justify-center flex-center"
              v-else-if="groupName == 'PK10'"
            >
              <span
                class="_pk10"
                :class="`car${j < 10 ? '0' + j : j}`"
                v-for="j in k.openResult.split(' ')"
                :key="j + '-' + k.id"
                >{{ j }}</span
              >
            </div>
            <div
              class="_flex flex-left flex-center"
              v-else-if="groupName == '快乐彩'"
            >
              <div
                v-for="(n, i) in k.openResult.split(' ')"
                :key="i"
                class="flex-justify-center flex-center"
              >
                <div class="qiu">
                  {{ n }}
                </div>
                <div v-if="i != k.openResult.split(' ').length - 1">+</div>
                <div v-else class="flex-justify-center flex-center">
                  <div>=</div>
                  <div class="qiu">
                    {{
                      k.openResult.split(" ").reduce((p, c) => p / 1 + c / 1)
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="_flex flex-justify-center"
              v-else-if="groupName == '六合彩'"
            >
              <van-row type="flex" align="center" class="_row1">
                <div
                  v-for="(k, i) in k.openResult.split(' ')"
                  :key="i"
                  class="flex-center flex-left"
                >
                  <div
                    class="box"
                    v-show="i == 6"
                    style="font-size: 0.28432rem"
                  >
                    +
                  </div>
                  <div
                    :class="{
                      'color-red': [
                        1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40,
                        45, 46,
                      ].includes(k / 1),
                      'color-blue': [
                        3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47,
                        48,
                      ].includes(k / 1),
                      'color-green': [
                        5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43,
                        44, 49,
                      ].includes(k / 1),
                    }"
                    class="box"
                  >
                    {{ setName(k) }}
                  </div>
                </div>
              </van-row>

              <van-row type="flex" align="center" class="_row2">
                <div
                  v-for="(k, i) in k.openResult.split(' ')"
                  :key="i"
                  class="flex-center flex-left"
                >
                  <div class="box" v-show="i == 6" style="opacity: 0">+</div>
                  <div class="box">
                    {{
                      Object.values(shengxiaoData).filter((n) =>
                        n.num.includes(setName(k))
                      )[0]
                        ? Object.values(shengxiaoData).filter((n) =>
                            n.num.includes(setName(k))
                          )[0].name
                        : ""
                    }}
                  </div>
                </div>
              </van-row>
            </div>
            <div class="_flex" v-if="groupName == '六合彩'">
              {{ k.openTime ? k.openTime.split(" ")[1] : "" }}
            </div>
          </div>
        <div
          class="zoushiBox_but flex-justify-center flex-center"
          @click.stop="openResultShow()"
        >
            <img src="../../assets/首页/zsimg.png" class="zsimg1" />
            <img src="../../assets/首页/zsimg2.png" class="zsimg2" />
          <div>{{ $t("lotteryIndex['查看更多走势']") }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bodyBox" v-if="apiData.enable && apiData.start">
      <!--      返水-->
      <van-row type="flex" align="center" class="top_box1" v-show="fanshui">
        <div class="fanshui_l flex-left flex-center">
          <div>{{ $t("lotteryIndex['赔率']") }}</div>
          <div v-if="oddsShow" @click="oddsShow = false">
            {{ $t("lotteryIndex['显示']") }}
          </div>
          <div v-else @click="oddsShow = true">
            {{ $t("lotteryIndex['隐藏']") }}
          </div>
        </div>
        <van-row type="flex" justify="center" align="center" class="fanshui">
          <span class="jj" @click="onjian()"></span>
          <van-slider
            bar-height="4px"
            :max="apiData.rebate"
            step="0.01"
            v-model="$store.state.backPoint"
          >
            <template #button>
              <div class="custom-button">{{ (backPoint / 1).toFixed(2) }}</div>
            </template>
          </van-slider>
          <span class="jj" @click="onjia()">+</span>
        </van-row>
        <div class="fanshui_r">
          {{ $t("lotteryIndex['返点']") }}<span
            >{{ (backPoint / 1).toFixed(2) }}</span
          >
        </div>
      </van-row>

      <van-row type="flex">
        <!--        左边导航-->
        <div class="lift_box">
          <div class="lift_box_min">
            <div
              class="div"
              :class="{ active: active == m.id }"
              @click="
                onEmpty();
                active = m.id;
              "
              v-for="m in leftList"
              :key="m.id"
            >
              {{ translateLotteryText(m.text) }}
              <span class="dian"></span>
            </div>
          </div>
        </div>
        <!--        右边模块-->
        <lhc
          :oddsOpen2="oddsClose"
          :oddsOpen="oddsShow"
          :type="active"
          @getRow="getRow"
          :current="currentList"
          v-if="groupName == '六合彩'"
        />
        <xy28
          :oddsOpen2="oddsClose"
          :oddsOpen="oddsShow"
          :type="active"
          @getRow="getRow"
          :current="currentList"
          v-if="groupName == '快乐彩'"
        />
        <ffc
          :oddsOpen2="oddsClose"
          :oddsOpen="oddsShow"
          :type="active"
          @getRow="getRow"
          @deleteCurrentList="deleteCurrentList"
          :current="currentList"
          v-if="groupName == '时时彩'"
        />
        <pk10
          :oddsOpen2="oddsClose"
          :oddsOpen="oddsShow"
          :type="active"
          @getRow="getRow"
          :current="currentList"
          v-else-if="groupName == 'PK10'"
        />
        <kuai3
          :oddsOpen2="oddsClose"
          :oddsOpen="oddsShow"
          :type="active"
          @getRow="getRow"
          @delRow="onEmpty"
          :current="currentList"
          v-else-if="groupName == '快三'"
        />
      </van-row>
    </div>
    <div class="bodyBox2" v-else>
      <!-- <div class="time" v-if="!apiData.start && apiData.countDown">
        距离开盘时间：<b>{{ timeData }}</b>
      </div> -->
      <div class="text">{{ $t("lotteryIndex['未开盘']") }}</div>
      <!-- <img src="../../assets/首页/home/issue_stop.png" /> -->
    </div>

    <div
      class="bottomBox"
      v-if="
        apiData.enable &&
        apiData.start &&
        (tabsBgOpen === '1' ? currentListLength > 0 : true)
      "
    >
      <div class="show_currentList_Body" v-if="currentListshow">
        <div
          class="show_currentList_Body_title"
          @click="currentListshow = false"
        >
          {{ $t("lotteryIndex['选号详情']") }}
          <span class="right_cross">
            <van-icon name="arrow-down" />
          </span>
        </div>
        <van-row
          type="flex"
          justify="space-between"
          align="center"
          v-for="k in currentList"
          :key="k.id"
        >
          <div v-if="k.itemType == '过关'">
            {{ translateLotteryText(k.itemType) }} -
            <b>{{ k.optionName }}</b>
          </div>
          <div v-else>
            {{ translateLotteryText(k.itemType) }} -
            <b>{{ k.option ? `(${k.option})` : k.itemObject }}</b>
          </div>
          <div>
            @ <b style="color: #d83442">{{ setOdds(k) }}</b>
          </div>
        </van-row>
      </div>
      <div class="currentList_Body" v-show="currentListLength > 0">
        <van-row type="flex" class="title" @click="currentListshow = true">
          <van-col span="5">
            <b>{{ $t("lotteryIndex['当前选号']") }}</b>
          </van-col>
          <van-col span="18" class="ofHidden">
            <b v-for="k in currentList" :key="k.id" style="font-weight: 700">
              <span v-if="k.itemType == '过关'"
                >{{ translateLotteryText(k.itemType) }} - {{ k.optionName }}</span
              >
              <span v-else
                >{{ translateLotteryText(k.itemType) }}-{{
                  k.option ? `(${k.option})` : k.itemObject
                }}、</span
              >
            </b>
          </van-col>
          <van-col span="1">
            <van-icon v-show="!currentListshow" name="arrow-up" />
          </van-col>
        </van-row>
        <van-row
          type="flex"
          justify="space-between"
          align="center"
          class="money_class"
        >
          <div
            v-for="i in moneyList2().length > 0 && tabsBgOpen === '1'
              ? moneyList2()
              : moneyList"
            @click="money = i / 1"
            :key="i"
          >
            {{ i }}
          </div>
          <div @click="saveMoneyList()" v-if="tabsBgOpen === '1'">
            {{ $t("lotteryIndex['编辑']") }}
          </div>
          <div @click="money = null" v-else>
            {{ $t("lotteryIndex['清空']") }}
          </div>
        </van-row>
        <van-row type="flex" align="center" class="input_class">
          <div class="text">{{ $t("lotteryIndex['每注金额']") }}</div>
          <van-field v-model="money" type="number" />
          <div class="text">
            {{ $t("lotteryIndex['请输入要投注的金额']") }}
          </div>
        </van-row>
      </div>
      <van-row
        type="flex"
        justify="space-between"
        align="center"
        class="bottomBox_box"
      >
        <van-row type="flex" align="center" class="box1" @click="onEmpty()">
          <div>{{ $t("lotteryIndex['清空']") }}</div>
          <van-row type="flex" align="center" class="box2">
            <span v-show="currentListLength > 0">
              {{ $t("lotteryIndex['共']") }}{{ currentListLength
              }}{{ $t("lotteryIndex['注']") }}
            </span>
            <span v-if="currentListLength > 0 && money > 0">
              ,{{ (currentListLength * money).toFixed(4) / 1
              }}{{ $t("lotteryIndex['元']") }}
            </span>
          </van-row>
        </van-row>
        <van-row
          type="flex"
          justify="space-between"
          align="center"
          class="box3"
        >
          <van-button
            @click="$store.state.fanshui = !$store.state.fanshui"
            size="small"
            color="#dc3b40"
          >
              {{ $t("lotteryIndex['返水']") }}{{
                $store.state.fanshui
                  ? $t("lotteryIndex['关']")
                  : $t("lotteryIndex['开']")
              }}
          </van-button>

          <van-button
            v-if="this.LoseTime > 0"
            size="small"
            @click="onBet()"
            color="#dc3b40"
          >
              {{ $t("lotteryIndex['马上下注']") }}
          </van-button>
          <van-button v-else size="small" color="#dc3b40" disabled>
              {{ $t("lotteryIndex['封盘']") }}
          </van-button>
        </van-row>
      </van-row>
    </div>
    <div
      class="hKjkaS"
      v-if="
        apiData.enable &&
        apiData.start &&
        currentListLength == 0 &&
        tabsBgOpen === '1'
      "
    >
      <div class="shortcut" @click="toPath('/')">
        <div class="iconfont active"></div>
        <span class="text">{{ $t("lotteryIndex['大厅']") }}</span>
      </div>
      <div class="shortcut" @click="openResultShow()">
        <div class="iconfont"></div>
        <span class="text">{{ $t("lotteryIndex['开奖']") }}</span>
      </div>
      <div class="shortcut" @click="toPath('betRecord')">
        <div class="iconfont"></div>
        <span class="text">{{ $t("lotteryIndex['未结']") }}</span>
      </div>
      <div class="shortcut" @click="toPath('recharge')">
        <div class="iconfont"></div>
        <span class="text">{{ $t("lotteryIndex['充值']") }}</span>
      </div>
      <div class="shortcut" @click="toPath('MyCenter')">
        <div class="iconfont active"></div>
        <span class="text">{{ $t("lotteryIndex['菜单']") }}</span>
      </div>
    </div>
    <!-- 咪牌 -->
    <van-popup
      v-model="mipaiOpen"
      :overlay="true"
      duration="0"
      class="mipaiOpenClass"
      style="margin-top: 12%"
      lock-scroll
    >
      <div class="qishu_pre">
        <span
          style="color: rgb(255, 255, 255); height: 12px; line-height: 12px"
          >{{ setPeriodId(apiData.order) }}</span
        >{{ $t("lotteryIndex['期']") }}
      </div>
      <div class="jzt_gj">{{ $t("lotteryIndex['截止投注']") }}</div>
      <div class="jzs_gj">{{ timeUtil.formatTimesToHHmmSS(LoseTime) }}</div>
      <div class="jlt_gj">
        {{ $t("lotteryIndex['距离开奖']") }}<span class="jdt_gj" style=""
          >{{ timeUtil.formatTimesToHHmmSS(OpenTime) }}</span
        >
      </div>
      <div class="btn_top"></div>
      <div class="qishu_gj">
        <span
          style="color: rgb(255, 255, 255); height: 12px; line-height: 12px"
          >{{ setPeriodId(data.periodId) }}</span
        >{{ $t("lotteryIndex['期']") }}
      </div>
      <div class="gj_content_box" v-if="canvasTCOpen">
        <div class="gj_content">
          <div id="js-container" class="container">
            <form id="formDrawNumber" class="from" style="visibility: visible" v-show="canvasTCtextOpen">
              <div class="guagua-content">
                <div
                  class="guagua-bu"
                  style="
                    margin-top: 5px;
                    display: table-cell;
                    vertical-align: middle;
                  "
                >
                  <span
                    class="gj_ball gt5_ball"
                    v-for="(k, i) in suijiOpenResultData"
                    :key="i"
                    >{{ k }}</span
                  >
                </div>
              </div>
            </form>
            <canvas
              id="canvasTC"
              style="position: absolute; top: 0"
              width="260"
              height="100"
            ></canvas>
          </div>
        </div>
      </div>
      <div class="btn_guajiang"></div>
      <div class="btn_refresh" @click="onMipaiOpen()"></div>
      <div class="btn_canel" @click="mipaiOpen = false"></div>
    </van-popup>

    <!--    编辑快选金额 弹窗-->
    <van-popup
      v-model="moneyDataOpen"
      :overlay="true"
      duration="0"
      class="moneyDataOpenClass"
      overlay-class="moneyDataOpenClass_overlay"
      lock-scroll
    >
      <div class="oc2pj9-1 eCQpuJ">
        <span class="title">{{ $t("lotteryIndex['预设金额']") }}</span>
        <div
          class="iconfont"
          style="float: right; margin-right: 5px"
          @click="moneyDataOpen = false"
        >
          
        </div>
      </div>
      <div class="fieldset" v-for="(k, i) in moneyData" :key="i">
        <input
          v-model="moneyData[i]"
          :placeholder="$t('lotteryIndex.设置金额')"
          name="min"
          class="round-input"
          style="text-align: center"
        />
      </div>
      <div class="fieldset">
        <button class="field-button" @click="setMoneyData()">
          {{ $t("lotteryIndex['确认']") }}
        </button>
      </div>
    </van-popup>
    <!--    结果走势弹窗-->
    <van-popup
      v-model="resultShow"
      @opened="onopened"
      :overlay="true"
      id="resultpopup"
      duration="0"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <titleBar
        class="result_titleBar"
        :title_name="`${lotteryObj.lotteryName}${$t('lotteryIndex.走势图')}`"
        @toLeft="resultShow = false"
        left_icon="arrow-left"
      />
      <!-- 时时彩 -->
      <result ref="result" v-if="groupName == '时时彩'" />
      <!-- PK10 -->
      <resultPK10 ref="result" v-if="groupName == 'PK10'" />
      <!-- 幸运28 -->
      <resultXY28 ref="result" v-if="groupName == '快乐彩'" />
      <!-- 快三 -->
      <resultKuai3 v-if="groupName == '快三'" />
      <!-- 六合彩 -->
      <resultLHC v-if="groupName == '六合彩'" />
      <div class="table-msg">
        {{
          $t("lotteryIndex['已显示走势']", {
            count: todayOpenRecord.length,
          })
        }}
      </div>
    </van-popup>

    <!--    右上按钮-->
    <van-action-sheet
      @select="onRightBut"
      v-model="show"
      :actions="localizedActions"
      :cancel-text="$t('lotteryIndex.取消')"
      close-on-click-action
      :round="false"
    />
    <!--    二次确认 弹窗-->
    <van-dialog
      v-model="betShow"
      :title="$t('lotteryIndex.投注确认')"
      @confirm="onbackPoint"
      :show-cancel-button="false"
      :show-confirm-button="false"
      class="xiazhuOpenClass"
    >
      <div class="betShow_body">
        <div class="layui-m-layercont">
          {{ lotteryObj.lotteryName }}:
          {{ apiData.order }}{{ $t("lotteryIndex['期']") }}<br />{{
            $t("lotteryIndex['投注方案']")
          }}:
          <span style="color: red"
            >{{ currentListLength }}{{ $t("lotteryIndex['注']") }}</span
          ><br />{{ $t("lotteryIndex['投注总额']") }}:
          <span style="color: red"
            >{{ currentListLength * money }}{{ $t("lotteryIndex['元']") }}</span
          ><br />{{ $t("lotteryIndex['投注内容']") }}:
          <span v-for="(k, i) in currentList" :key="k.id"
            ><span v-show="i == 0"
              >[{{ translateLotteryText(k.itemType) }}]</span
            ><span v-if="k.itemType == '过关'">{{ k.optionName }}</span>
            <span v-else>{{ k.option ? `${k.option}` : k.itemObject }}</span
            >,</span
          >
        </div>
      </div>
      <div class="betShow_btn flex-left flex-center">
        <div @click="betShow = false" class="_but">
          {{ $t("lotteryIndex['取消']") }}
        </div>
        <div @click="onbackPoint()" class="_but">
          {{ $t("lotteryIndex['确认']") }}
        </div>
      </div>
    </van-dialog>
    <!--    开奖提示 弹窗-->
    <van-dialog
      v-model="kaijiangShow"
      :title="$t('lotteryIndex.温馨提示')"
      :showCancelButton="false"
      :closeOnClickOverlay="true"
      show-cancel-button
      class="kaijiangShowClass"
      :style="{ zIndex: '2101' }"
      :overlay-style="{ zIndex: 2100 }"
    >
      <div class="kaijiangShow_body">
        <div>
          {{ textOrder }}{{ $t("lotteryIndex['期']") }}
          {{ $t("lotteryIndex['已截止']") }}
        </div>
        <div>
          {{ $t("lotteryIndex['当前期号']") }}：<b style="color: #d83442">{{
            textOrder2
          }}</b>
        </div>
        <div>{{ $t("lotteryIndex['投注请注意期号']") }}</div>
      </div>
    </van-dialog>
    <!--    开奖音频-->
    <audio
      ref="audio"
      style="display: none"
      class="audio"
      :src="require('../../assets/new/kaijiang.mp3')"
      controls
      hidden="true"
    ></audio>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import timeUtil from "../../util/timeUtil";
import jisuanLH from "../../util/jisuanLH";

import lhc from "../lottery/lhc";
import ffc from "../lottery/ffc";
import pk10 from "../lottery/pk10";
import kuai3 from "../lottery/kuai3";
import xy28 from "../lottery/xy28";

import sscLiveVideo from "./liveVideo/ssc.vue";
import pk10LiveVideo from "./liveVideo/pk10.vue";

import result from "../playingMethod/result/index";
import resultXY28 from "../playingMethod/result/resultXY28";
import resultPK10 from "../playingMethod/result/resultPK10";
import resultLHC from "../playingMethod/result/resultLHC";
import resultKuai3 from "../playingMethod/result/resultKuai3";
import axios from "axios";
export default {
  components: {
    result,
    resultPK10,
    resultKuai3,
    resultLHC,
    resultXY28,
    lhc,
    ffc,
    pk10,
    kuai3,
    xy28,
    sscLiveVideo,
    pk10LiveVideo,
  },
  data() {
    return {
      textOrder: null,
      textOrder2: null,
      initializeOpen: false,
      oddsClose: true,
      getSuijiOpenResultObj: null,
      oddsShow: true, //赔率 显示/隐藏
      liveVideoOpen: false,
      canvasTCOpen: false,
      canvasTCtextOpen: false,
      mipaiOpen: false,
      moneyData: ["", "", "", "", ""],
      moneyDataOpen: false,
      suijiOpenResultShow: false,
      suijiOpenResult: [],
      activeNameClassOpen: false,
      zoushiBoxOpen: false,
      currentListLength: 0,
      time: Math.round(Math.random() * 10000),
      timeObj: null,
      timeObj2: null,
      onLoadOpen: false,
      todayOpenPageNo: 1,

      OpenObj: null,
      kaijiangShow: false,
      betShow: false,
      onbackPointBut: false,
      MoreGamesShow: false,

      currentListshow: false,
      show: false,
      actions: [{ name: "结果走势" }],
      money: null,
      moneyList: [10, 50, 100, 500, 1000],
      currentList: [],
      timeUtil: timeUtil,
      resultShow: false,
      active: 1,
      typeList: [
        {
          groupName: "时时彩",
          list: [
            { id: 1, text: "双面盘" },
            { id: 2, text: "定位胆" },
            { id: 3, text: "快捷" },
            { id: 4, text: "趣味" },
          ],
        },
        {
          groupName: "PK10",
          list: [
            { id: 1, text: "双面盘" },
            { id: 2, text: "定位胆" },
            { id: 3, text: "快捷" },
            { id: 4, text: "冠军和" },
          ],
        },
        // 幸运28
        {
          groupName: "快乐彩",
          list: [
            { id: 1, text: "主势盘" },
            { id: 2, text: "特码包三" },
          ],
        },
        // 六合彩
        {
          groupName: "六合彩",
          list: [
            { id: 1, text: "特码" },
            { id: 2, text: "特码双面" },
            { id: 3, text: "正码" },
            { id: 4, text: "连码" },
            { id: 5, text: "特码半波" },
            { id: 6, text: "生肖尾数" },
            { id: 7, text: "生肖连" },
            { id: 8, text: "尾数连" },
            { id: 9, text: "不中" },
            { id: 10, text: "趣味" },
            { id: 11, text: "过关" },
          ],
        },
        {
          groupName: "快三",
          list: [
            { id: 1, text: "和值" },
            // {id:2,text:'三同号通选'},
            { id: 3, text: "三同号单选" },
            { id: 4, text: "三不同号" },
            // {id:5,text:'三连号通选'},
            { id: 6, text: "二同号复选" },
            { id: 7, text: "二同号单选" },
            { id: 8, text: "二不同号" },
            { id: 9, text: "四码黑" },
            { id: 10, text: "四码红" },
            { id: 11, text: "五码黑" },
            { id: 12, text: "红黑码/豹" },
            { id: 13, text: "三军" },
            { id: 14, text: "跨度" },
            { id: 15, text: "过关" },
            // {id:16,text:'骰面不中'},
            // {id:17,text:'和值不中'},
            // {id:18,text:'不中'},
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState([
      "GroupList",
      "todayOpenRecord",
      "apiData",
      "serverDate",
      "backPoint",
      "lotteryObj",
      "fanshui",
      "amount",
      "optionObj",
      "shengxiaoData",
      "oddsTimeObj",
    ]),
    tabsBgOpen() {
      return sessionStorage["tabsBgOpen"] || "0";
    },
    suijiOpenResultData() {
      let arr = [];
      if (this.suijiOpenResultShow) {
        arr = this.suijiOpenResult;
      } else {
        arr = this.data.openResult.split(" ");
      }
      return arr;
    },
    todayOpenRecordLiu() {
      return this.todayOpenRecord.filter((k, i) => {
        return i < 10;
      });
    },
    timeData() {
      let num =
        this.apiData.countDown / 1000 > 0 ? this.apiData.countDown / 1000 : 0;
      let time = timeUtil.formatSeconds(num);
      return time;
    },
    MoreGamesList() {
      let arr = this.GroupList.filter((k) => {
        return k.groupStatus == 1 && k.list.length > 0;
      });
      return arr;
    },
    groupName() {
      return this.lotteryObj.groupName;
    },
    lotteryId() {
      return this.lotteryObj.id;
    },
    activeName() {
      let data =
        this.leftList.filter((k) => {
          return k.id == this.active;
        })[0] || {};
      const text = data.text || "";
      return text ? this.translateLotteryText(text) : "";
    },
    leftList() {
      let json =
        this.typeList.filter((k) => {
          return k.groupName == this.groupName;
        })[0] || {};
      return json.list || [];
    },
    localizedActions() {
      return this.actions.map((action) => {
        if (action.nameKey) {
          return { ...action, name: this.$t(action.nameKey) };
        }
        return {
          ...action,
          name: this.$t(`lotteryIndex['${action.name || ''}']`),
        };
      });
    },
    LoseTime() {
      if (!this.apiData.close) {
        return 0;
      }
      let time =
        Date.parse(new Date(this.apiData.close.replace(/-/g, "/"))) / 1000;
      let num = time - this.serverDate;
      if (num <= 0) {
        this.oddsClose = false; //封盘时，关闭赔率
        this.betShow = false;
        num = 0;
      }
      return num;
    },
    OpenTime() {
      if (!this.apiData.open) {
        return 0;
      }
      let time =
        Date.parse(new Date(this.apiData.open.replace(/-/g, "/"))) / 1000;
      let num = time - this.serverDate;
      if (num == 0) {
        //这里是调用语音播放
        // this.$refs.audio.currentTime = 0;
        // this.$refs.audio.play(); //开奖声音
        // setTimeout(() => {
        this.initialize(1);
        // }, 3000);
      }
      return num > 0 ? num : 0;
    },
    data() {
      let obj = {openResult:'',periodId:''};
      if(this.groupName == '六合彩'){
        obj = {
          openResult: "1 2 3 4 5 6 7",
          periodId: "20230101001",
        }
      }else if(this.groupName == '快乐彩'){
        obj = {
          openResult: "0 1 2",
          periodId: "20230101001",
        }
      }else if(this.groupName == 'PK10'){
        obj = {
          openResult: "1 2 3 4 5 6 7 8 9 10",
          periodId: "202301010001",
        }
      }else if(this.groupName == '时时彩'){
        obj = {
          openResult: "0 1 2 3 4",
          periodId: "202301010001",
        }
      }
      return this.OpenObj || obj;
    },
    ZHLH() {
      return jisuanLH.zonghelonghu(this.data.openResult.split(" ")); //总和/龙虎
    },
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.onvisibilitychange);
    clearInterval(this.timeObj);
    clearTimeout(this.timeObj2);
    clearInterval(this.oddsTimeObj);
  },
  created() {
    this.$store.state.todayOpenRecord = [];
    this.$store.state.loading = false;
    this.initialize();
  },
  mounted() {
    let _this = this;
    shuaxinNum();
    clearTimeout(this.timeObj2);
    function shuaxinNum() {
      _this.onrefreshLoad().finally(() => {
        _this.timeObj2 = setTimeout(() => {
          shuaxinNum();
        }, 10000);
      });
    }

    // 监听浏览器息屏和唤醒
    document.addEventListener("visibilitychange", this.onvisibilitychange);
  },
  methods: {
    translateLotteryText(text) {
      if (!text) {
        return "";
      }
      const key = `lotteryIndex['${text}']`;
      return this.$te(key) ? this.$t(key) : text;
    },
    ...mapActions(["onGetlottery", "onGetBetData", "onrefreshLoad"]),
    onvisibilitychange() {
      if (document.hidden) {
        this.initializeOpen = false;
        clearInterval(this.timeObj);
      } else {
        this.initialize();
      }
    },
    // 刮刮乐 弹窗
    onMipaiOpen() {
      this.mipaiOpen = true;
      this.canvasTCOpen = false;
      this.canvasTCtextOpen = false;
      setTimeout(() => {
        this.chushihua();
      }, 100);
    },
    // 初始化刮刮乐
    chushihua() {
      this.canvasTCOpen = true;
      let _this = this;
      this.$nextTick(() => {
        let canvas = document.getElementById("canvasTC"); // 获取元素
        let img = new Image();
        img.src = require("../../assets/首页/mipai_res_show.png"); // 默认的背景图片
        let ctx = canvas.getContext("2d"); // 生成画布
        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = "destination-out"; // 橡皮擦
          _this.canvasTCtextOpen = true;
        };
        // ctx.strokeStyle = '#FDF5EA' // 线的颜色
        let pos = 0, // 手指总共划过的距离
          x = 0, // x轴走过的距离
          y = 0; // y轴走过的距离
        ctx.beginPath(); // 开始
        ctx.lineWidth = 20; // 线的宽度
        let canvaL = canvas.getBoundingClientRect().left; //
        let canvaT = canvas.getBoundingClientRect().top; // 160是margin-top的距离
        
        function bodyScroll(event) {
          // 默认事件 点击canvas时屏幕不跳动
          event.preventDefault();
        }

        let startX = 0, // 手指开始的位置
          startY = 0,
          moveX = 0, // 手指移动的位置
          moveY = 0,
          num = 0; // 用他来做数据请求的条件
        canvas.ontouchstart = function (e) {
          // 手指按下位置
          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
          ctx.moveTo(startX - canvaL, startY - canvaT); // 线条开始
          document.body.addEventListener("touchmove", bodyScroll, false);
        };

        canvas.ontouchmove = function (e) {
          // 手指移动位置
          moveX = e.touches[0].pageX;
          moveY = e.touches[0].pageY;
          ctx.lineTo(moveX - canvaL, moveY - canvaT); // 线条到达位置
          // 计算手指移动的距离
          x = startX - moveX;
          y = startY - moveY;
          pos += Math.abs(x);
          pos += Math.abs(y);
          num++;
          // if (num === 1) {
          //   _this.shaveData() // 数据请求
          // }
          ctx.stroke(); // 结束
        };
      });
    },
    saveMoneyList() {
      this.moneyDataOpen = true;
    },
    setMoneyData() {
      let bool = true;
      for (let i = 0; i < this.moneyData.length; i++) {
        if (this.moneyData[i] > 0) {
          this.moneyData[i] = this.moneyData[i] / 1;
        } else {
          this.$toast(this.$t("lotteryIndex['金额错误']"));
          bool = false;
        }
      }
      if (bool) {
        localStorage["moneyList2"] = JSON.stringify(this.moneyData);
        this.moneyDataOpen = false;
      }
    },
    moneyList2() {
      return localStorage["moneyList2"]
        ? JSON.parse(localStorage["moneyList2"])
        : [];
    },
    // 开奖状态，生成结果随机数
    getSuijiOpenResult() {
      this.suijiOpenResultShow = true;
      // 开奖随机数
      clearInterval(this.getSuijiOpenResultObj);
      this.getSuijiOpenResultObj = setInterval(() => {
        let arr = [];
        if (this.groupName == "时时彩") {
          for (let i = 0; i < 5; i++) {
            arr.push(Math.floor(Math.random() * 10));
          }
        }
        if (this.groupName == "快乐彩") {
          for (let i = 0; i < 3; i++) {
            arr.push(Math.floor(Math.random() * 10));
          }
        }
        if (this.groupName == "六合彩") {
          for (let i = 0; i < 7; i++) {
            arr.push(this.randomNum(1, 49));
          }
        }
        if (this.groupName == "PK10") {
          arr = this.roa([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        }
        this.suijiOpenResult = arr;
      }, 150);
    },
    // 生成minNum-maxNum随机数(lhc)
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },
    // 随机打乱数据(pk10)
    roa(arr) {
      //arr为可能出现的元素集合
      let temp = []; //temp存放生成的随机数组
      let count = arr.length;
      for (let i = 0; i < count; i++) {
        let num = Math.floor(Math.random() * arr.length); //生成随机数num
        temp.push(arr[num]); //获取arr[num]并放入temp
        arr.splice(num, 1);
      }
      return temp;
    },
    // 清空currentList
    deleteCurrentList() {
      this.currentList = [];
    },
    // 格式化期数
    setPeriodId(periodId, num, num2) {
      let str = periodId || "";
      if (num) {
        str = periodId.slice(periodId.length - num, periodId.length);
      } else if (num2) {
        str = periodId.slice(num2, periodId.length);
      } else if (periodId && periodId.length > 10) {
        str = periodId.slice(4, periodId.length);
      }
      return str;
    },
    onLoad() {
      if (this.onLoadOpen) {
        return;
      }
      this.onLoadOpen = true;
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.$ajax
        .post(
          `lottery/todayOpenTimeRecordByPage?lotteryId=${
            this.lotteryId
          }&pageNo=${this.todayOpenPageNo}&pageSize=${20}`
        )
        .then((res) => {
          if (
            res.data &&
            res.data.records &&
            res.data.records.length > 0 &&
            this.data &&
            res.data.records[0].periodId != this.data.periodId
          ) {
            this.suijiOpenResultShow = false;
            clearInterval(this.timeObj);
          }
          this.$store.state.todayOpenRecord = res.data.records;
          this.OpenObj = this.todayOpenRecord[0];
        })
        .finally(() => {
          setTimeout(() => {
            this.onLoadOpen = false;
          }, 2000);
        });
    },
    //初始化
    initialize(type) {
      //type:1 开奖,2 唤醒
      if (this.initializeOpen) {
        return;
      }
      if (type === 1) {
        this.textOrder = this.apiData.order;
        this.textOrder2 = parseInt(this.apiData.order) + 1;
        this.kaijiangShow = true;
        this.getSuijiOpenResult();
        this.initializeOpen = true;
      }
      if (this.$route.path == "/lottery") {
        this.onLoad();
        this.onLoadOpen = false;
        this.onGetlottery();
        this.onGetBetData()
          .then((res) => {
            setTimeout(() => {
              this.kaijiangShow = false;
            }, 2000);
            this.oddsClose = true;
            clearInterval(this.timeObj);
            this.timeObj = setInterval(() => {
              if (
                this.data &&
                this.apiData &&
                this.data.periodId / 1 === this.apiData.order / 1 - 1
              ) {
                console.log("====");
              } else if (!this.resultShow) {
                this.onLoad();
              }
            }, 2000);
          })
          .finally(() => {
            this.initializeOpen = false;
          });
      }
    },
    // 计算组数
    setZushu(list) {
      let num = list.length;
      if (list[0] && list[0].itemType != "过关") {
        for (let k of list) {
          if (
            k.minL &&
            k.maxL &&
            k.option &&
            k.option.split(",").length >= k.minL
          ) {
            num -= 1;
            let arr = k.option.split(",");
            let arr2 = jisuanLH.combo(arr, k.minL);
            num += arr2.length;
          }
        }
      }
      return num;
    },
    //下注
    onBet() {
      let data = this.currentList;
      if (data.length == 0) {
        for (let i in this.optionObj) {
          if (this.optionObj[i].list.length) {
            this.$toast(this.$t("lotteryIndex['选择的投注项不足']"));
            return;
          }
        }
        this.$toast(this.$t("lotteryIndex['请选择投注项']"));
        return;
      }
      if (!this.money || this.money == 0 || this.money == "") {
        this.$toast(this.$t("lotteryIndex['请输入投注金额']"));
        return;
      }
      this.betShow = true;
    },
    onbackPoint() {
      if(this.onbackPointBut){
        return;
      }
      this.onbackPointBut = true;
      let data = this.currentList;
      data.map((k) => {
        k.odds = this.setOdds(k);
        k.betAmount = this.money;
      });
      let backPoint = this.backPoint || 0;
      this.betShow = false;
      this.$ajax
        .post(
          `/lottery/bet?rebate=${backPoint}&period=${this.apiData.order}&lotteryId=${this.lotteryId}`,
          data
        )
        .then((res) => {
          if (res.code == "510") {
            return;
          }
          this.currentListshow = false;
          this.currentList = [];
          this.currentListLength = 0;
          this.$store.commit(
            "SET_TISHI",
            `<span style="color:red">投注成功</span>，点击右上角向左箭头可查看投注记录`
          );
          this.onEmpty();
          if (this.amount.accountMoney + res.data >= 0) {
            this.$store.state.amount.accountMoney =
              (this.amount.accountMoney + res.data).toFixed(2) / 1;
          }
          // this.onrefreshLoad();
        })
        .catch((error) => {
          if (error.indexOf("undefined") == -1) {
            this.$toast(error);
          }
        })
        .finally(() => {
          this.onbackPointBut = false;
        });
    },
    // 设置name
    setName(itemObject) {
      if (!isNaN(itemObject) && itemObject > 0) {
        let num = itemObject >= 10 ? itemObject : `0${itemObject}`;
        return num;
      }
      return itemObject;
    },
    //根据返水设置赔率
    setOdds(n) {
      let num = 0;
      num = parseFloat(n.odds) - this.backPoint * 0.01 * n.limitValue;
      return num.toFixed(4);
    },
    getRow(k, n, obj) {
      let option = this.optionObj[k.name];
      if (k.name == "过关") {
        let arr = this.currentList.filter((m) => {
          return m.id == obj.id;
        });
        console.log(arr.length, obj.option.split(",").filter((m) => m).length);
        if (arr.length) {
          if (obj.option.split(",").filter((m) => m).length < obj.minL) {
            this.currentList = [];
          } else {
            this.currentList[0] = obj;
          }
        } else {
          if (obj.option.split(",").filter((m) => m).length >= obj.minL) {
            this.currentList.push(obj);
          }
        }
        this.$forceUpdate();
        // console.log(this.currentList);
      } else if (option) {
        let minL = option.minL; //最小限制选择数量
        let maxL = option.maxL; //最大限制选择数量
        let arr2 = option.list.filter((i) => {
          return i == n;
        });
        if (arr2.length > 0) {
          this.$store.state.optionObj[k.name].list = option.list.filter((i) => {
            return i != n;
          });
        } else {
          if (option.list.length >= maxL) {
          } else {
            this.$store.state.optionObj[k.name].list.push(n);
          }
        }
        let obj = k.list[0] || {};
        let arr = this.currentList.filter((m) => {
          return m.id == obj.id;
        });
        if (option.list.length == 0) {
          this.currentList = this.currentList.filter((m) => {
            return m.id != obj.id;
          });
        } else {
          if (arr.length == 0) {
            if (option.list.length == minL) {
              obj.minL = option.minL;
              obj.maxL = option.maxL;
              obj.option = option.list.join(",");
              this.currentList.push(obj);
            }
          } else {
            if (option.list.length < minL) {
              this.currentList = this.currentList.filter((m) => {
                return m.id != obj.id;
              });
            }
          }
        }
        this.currentList.map((m) => {
          if (m.itemType == k.name) {
            m.option = option.list.join(",");
          }
        });
      } else {
        //其他
        let obj = Object.assign({}, n);
        let arr = this.currentList.filter((k) => {
          return k.id == obj.id;
        });
        if (arr.length > 0) {
          this.currentList = this.currentList.filter((k) => {
            return k.id != obj.id;
          });
        } else {
          this.currentList.push(obj);
        }
      }
      this.currentListLength = this.setZushu(this.currentList);
    },
    //-
    onjian() {
      if (this.backPoint > 0) {
        this.$store.state.backPoint -= 0.01;
      } else {
        this.$store.state.backPoint = 0;
      }
    },
    //+
    onjia() {
      if (this.apiData.rebate > 0 && this.backPoint < this.apiData.rebate) {
        this.$store.state.backPoint += 0.01;
      } else {
        this.$store.state.backPoint = 0;
      }
    },
    //清空
    onEmpty() {
      this.$store.commit("SET_optionObj");
      this.currentList = [];
      // this.money = null;
      this.currentListLength = 0;
    },
    onRightBut(val) {
      if (val.name == "结果走势") {
        this.openResultShow();
      }
    },
    onopened() {
      this.$store.state.loading = false;
    },
    openResultShow() {
      if (!this.data.periodId) {
        this.$toast(this.$t("lotteryIndex['暂无开奖走势']"));
        return;
      }
      this.loading = true;
      this.finished = false;
      this.onLoad();
      this.resultShow = true;
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          lotteryId: this.lotteryId,
          redirect: this.$route.path,
        },
      });
    },
    // 切换游戏
    togame(n, groupName) {
      if (groupName == "热门") {
        if (n.gameCategoryCode === "SSC") {
          n.groupName = "时时彩";
        }
        if (n.gameCategoryCode === "PK10") {
          n.groupName = "PK10";
        }
        if (n.gameCategoryCode === "KLC") {
          n.groupName = "快乐彩";
        }
        if (n.gameCategoryCode === "LHC") {
          n.groupName = "六合彩";
        }
        if (n.gameCategoryCode === "K3") {
          n.groupName = "快三";
        }
      } else {
        n.groupName = groupName;
      }
      this.initializeOpen = false;
      this.$store.state.lotteryObj = n;
      this.OpenObj = null;
      this.zoushiBoxOpen = false;
      this.$store.state.apiData = {
        countDown: 0,
        enable: true,
        start: true,
      };
      this.$store.state.todayOpenRecord = [];
      this.initialize();
      this.onEmpty();
      this.MoreGamesShow = false;
      document.querySelector("html").scrollTop = 0; // 设置滚动条位置;
    },
    toHome() {
      this.$router.push({
        path: "/",
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.lotteryPage {
  min-height: 100%;
  position: relative;
  // overflow: hidden;
  background-color: #fff;
  .titleBar {
    background: linear-gradient(#d83442, #c62c41, #b82541);
  }
  .mipaiOpenClass {
    width: 100%;
    height: 100%;
    background: url("../../assets/首页/mipai_bg.png") no-repeat;
    background-size: 100%;
    .qishu_pre {
      font-size: 14px;
      height: 14px;
      line-height: 14px;
      position: absolute;
      margin-top: 30%;
      margin-left: 22%;
      color: #ffd56a;
      text-align: center;
    }
    .jzt_gj {
      font-size: 16px;
      position: absolute;
      margin-top: 34%;
      margin-left: 25.5%;
      color: #fff;
      display: block;
    }
    .jzs_gj {
      position: absolute;
      margin-top: 117px;
      margin-left: 177px;
      font-weight: 600;
      font-size: 23px;
      width: 97px;
      text-align: center;
    }
    .jlt_gj {
      margin-left: -105.469px;
      font-size: 15px;
      position: absolute;
      left: 50%;
      margin-top: 45%;
      color: #fede7b;
      display: block;
      text-shadow: 2px 2px 2px #820005;
      .jdt_gj {
        color: #fff;
        font-size: 14px;
        margin-left: 10px;
        font-weight: 700;
      }
    }
    .btn_top {
      padding-top: 72%;
    }
    .qishu_gj {
      font-size: 12px;
      line-height: 11px;
      position: absolute;
      margin-top: -6.5%;
      margin-left: 63.5%;
      color: #ffd56a;
      text-align: center;
      width: 20%;
    }
    .gj_content_box {
      width: 100%;
      position: absolute;
      z-index: 10;
      .gj_content {
        width: 260px;
        height: 100px;
        background: url("../../assets/首页/mipai_res_show.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
        .container {
          width: 260px;
          height: 100px;
          form {
            display: block;
            margin-top: 0;
            .guagua-content {
              width: 100%;
              text-align: center;
              font-size: 46.875px;
              font-weight: 700;
              background-color: #fff;
              border-radius: 19.4531px;
              .guagua-bu {
                height: 98px;
                .gj_ball {
                  color: #4a4a4a;
                  width: 32px;
                  display: block;
                  height: 32px;
                  font-size: 21px;
                  border: 1px solid #8d8d8d;
                  border-radius: 50%;
                  line-height: 30px;
                  float: left;
                }
                .gt5_ball {
                  margin-left: 16px;
                  margin-top: 2px;
                  margin-bottom: 2px;
                }
              }
            }
          }
          #canvasTC {
            width: 260px;
            height: 100px;
          }
        }
      }
    }
    .btn_guajiang {
      width: 260px;
      height: 100px;
      margin-left: auto;
      margin-right: auto;
      background: url("../../assets/首页/mipai_res_show2.png") no-repeat;
      background-size: 100% 100%;
    }
    .btn_refresh {
      height: 52px;
      margin-top: 2.5%;
      width: 51%;
      margin-left: auto;
      margin-right: auto;
      background: url("../../assets/首页/shuax.png") no-repeat;
      background-size: 100% 100%;
    }
    .btn_canel {
      width: 60px;
      height: 60px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 18%;
      background: url("../../assets/首页/gbbut.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .moneyDataOpenClass_overlay {
    background-color: rgba(255, 255, 255, 0.75);
  }
  .moneyDataOpenClass {
    width: 70%;
    background-color: #fff;
    text-align: center;
    padding-bottom: 12px;
    box-shadow: 0 0 30px hsla(0, 0%, 39%, 0.8);
    border-radius: 4px;
    outline: none;
    border-width: 0;
    border-style: initial;
    border-color: initial;
    -o-border-image: initial;
    border-image: initial;
    top: 38.5%;
    .eCQpuJ {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 52px;
      line-height: 52px;
      background-image: linear-gradient(90deg, #7cc9fe, #1b5295);
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      z-index: 10;
      .title {
        text-align: center;
        font-size: 16.4062px;
        color: #fff;
      }
      font-size: 21.7589px;
    }
    .fieldset {
      min-height: 40px;
      height: auto;
      line-height: 40px;
      background-color: #fff;
      box-sizing: border-box;
      position: relative;
      padding: 0 12px;
      &:not(:last-child) {
        border-bottom: 1px solid #eaeaea;
      }
      .round-input {
        display: inline-block;
        height: 90%;
        -webkit-appearance: none;
        width: 96px;
        padding: 7px 14px;
        border-radius: 24px;
        border: 1px solid #767676;
        -o-border-image: initial;
        border-image: initial;
      }
      .field-button {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        width: 100%;
        color: #fff;
        font-size: 16.4062px;
        margin-top: 5px;
        border-width: 0;
        border-style: initial;
        border-radius: 40px;
        background: linear-gradient(90deg, #7dcaff 0, #1a5194);
      }
    }
  }
  #resultpopup {
    .result_titleBar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #000;
    }
    .table-msg {
      width: 100%;
      font-size: 10.6619px;
      padding: 9.59568px 0;
      text-align: center;
      border-top: 1px solid #b4ac8c;
      background: #ebe8d6;
      box-sizing: border-box;
    }
  }
  .kuai3titleBar {
    position: fixed;
    width: 100vw;
    z-index: 99;
  }
  .van-dialog__header {
    padding: 0;
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
    width: 100%;
    box-sizing: border-box;
    height: calc(100% - 50px);
    position: absolute;
    top: 50px;
    z-index: 1;
    .activeNameClassOpen_body {
      position: absolute;
      top: 0;
      z-index: 2;
      width: 100%;
      background-color: #fff;
      padding: 4.6875px;
      box-sizing: border-box;
      min-height: 46.59px;
      ._open_div {
        line-height: 27.8514px;
        border-radius: 3px;
        cursor: pointer;
        text-align: center;
        color: #555;
        font-size: 13.9257px;
        margin: 4.6875px;
        float: left;
        border: 1px solid #ddd;
        height: 27.8514px;
        width: 63.75px;
        box-sizing: border-box;
      }
      .active {
        background: #dc3b40;
        border: 1px solid #dc3b40;
        color: #fff;
      }
    }
    .activeNameClassOpen_zhezhao {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
  .lottery_right_box {
    color: #fff;
    position: absolute;
    top: 12px;
    right: 5px;
    .row {
      font-size: 17.4px;
      .van-icon-play {
        transform: rotate(90deg);
      }
      .van-icon-arrow-down {
        display: none;
      }
    }
    .MoreGames_body {
      padding: 10px 8px;
      color: #000;
      .title {
        position: relative;
        text-align: center;
        span {
          background-color: #fff;
          display: inline-block;
          padding: 0 20px;
          font-weight: bold;
          font-size: 12px;
        }
      }
      .title:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 0;
        top: 50%;
        left: 0;
        right: 0;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        z-index: -1;
        border-top: 0.5px solid hsla(0, 0%, 70.6%, 0.62);
      }
      .box_min_name {
        text-align: center;
        display: inline-block;
        padding: 5px 0px;
        width: calc((100% / 3) - 7px);
        font-size: 13px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #eee;
        margin: 6px 3.5px 0px;
        box-sizing: border-box;
        span {
          display: inline-block;
          width: 100%;
          font-size: 12px;
        }
      }
      .box_min_name_current {
        background-color: #d5ba9e;
        color: #fff;
      }
    }
  }
  .lottery_title {
    background: linear-gradient(#d83442, #c62c41, #b82541);
    color: #fff;
    padding: 0px 10px;
    height: 40px;
    ._left {
      width: 30%;
      .van-icon {
        font-size: 22px;
      }
    }
    .name {
      font-weight: bold;
      font-size: 16px;
    }
    ._right {
      text-align: right;
      width: 30%;
      font-size: 10px;
    }
  }
  .topBox {
    /*border-bottom: 3px solid #ddd;*/
    .zoushiBox {
      border-top: 1px solid #fff;
      width: 100%;
      color: #666;
      font-size: 15.2312px;
      .zoushiBox_title {
        height: 37px;
        border-bottom: 1px solid #a7a3a3;
      }
      .zoushiBox_row {
        background-color: #e1d9ba;
        height: 35px;
        ._flex {
          text-align: center;
          line-height: 1;
          &:nth-child(1) {
            width: 20%;
          }
          &:nth-child(2) {
            width: 20%;
          }
          &:nth-child(3) {
            width: 60%;
            .qiu {
              margin-right: 2px;
              font-size: 13.7081px;
            }
            ._pk10 {
              width: 23px;
              height: 23px;
              line-height: 23px;
              border-radius: 4px;
            }
          }
        }
        .lhc-row1 {
          margin-top: 0;
          .box {
            margin: 0 3px;
          }
        }
      }
      .zoushiBox_but {
        background: #e1dabc;
        color: #595750;
        font-size: 15px;
        width: 50%;
        margin: 0 auto;
        border-radius: 0 0 10px 10px;
        text-align: center;
        height: 35px;
        line-height: 35px;
        img {
          height: 20px;
        }
        .zsimg2 {
          display: none;
        }
      }
    }
    .zoushiBox_SSC {
      .zoushiBox_row {
        ._flex {
          &:nth-child(1) {
            width: 88px;
          }
          &:nth-child(2) {
            width: 63px;
          }
          &:nth-child(3) {
            width: calc(100% - 151px);
          }
        }
      }
    }
    .zoushiBox_PK10 {
      .zoushiBox_row {
        ._flex {
          &:nth-child(1) {
            width: 40px;
          }
          &:nth-child(2) {
            width: 60px;
          }
          &:nth-child(3) {
            width: calc(100% - 100px);
          }
        }
      }
    }
    .zoushiBox_KLC {
      ._flex {
        .flex-center {
          .qiu {
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 15.2312px;
          }
          div {
            margin: 0 !important;
            margin-right: 5px !important;
          }
        }
      }
    }
    .zoushiBox_LHC {
      .zoushiBox_row {
        height: 39.7083px;
        ._flex {
          &:nth-child(1) {
            width: 122px;
          }
          &:nth-child(2) {
            width: 173px;
          }
          &:nth-child(3) {
            width: calc(100% - 295px);
          }
          ._row1 {
            font-size: 13.8604px;
            .box {
              width: 18.7292px;
              height: 16px;
              left: 16px;
              &.color-red {
                color: #dc3b40;
              }
              &.color-blue {
                color: #218ddd;
              }
              &.color-green {
                color: #38b366;
              }
            }
          }
          ._row2 {
            font-size: 10.6619px;
            .box {
              width: 18.7292px;
            }
          }
        }
      }
    }
    .topBox_box {
      position: relative;
      padding-top: 5px;
      border-top: 1px solid #e1d9ba;
      background-color: #e1d9ba;
      min-height: 81.5px;
      box-sizing: border-box;
      overflow: hidden;
      .sd1 {
        position: absolute;
        top: calc(50% - 14px);
        right: -13px;
        font-size: 28px;
        transform: rotate(180deg);
        color: #d22018;
      }
      ._left {
        width: calc(100vw - 120px);
        /*border-right: 2px solid #ddd;*/
        .left_box1 {
          margin-left: 5px;
          font-size: 15.5px;
          .yu_e {
            font-weight: bold;
            margin-right: 5px;
            font-size: 15.2px;
            span {
              color: red;
            }
          }
        }
        .lhc-openResult {
          text-align: center;
        }
        .left_box2 {
          margin-top: 2px;
          color: #000;
        }
        .left_box3 {
          text-align: center;
          color: #333;
          padding: 2px 0 0;
          font-size: 10px;
          .fang {
            border: 1px solid #b4acac;
            border-radius: 3px;
            margin-right: -2px;
            margin-left: 5px;
            height: 20px;
            line-height: 20px;
            min-width: 22px;
            background: hsla(0, 0%, 100%, 0.19);
            box-sizing: border-box;
          }
        }
        .left_box4 {
          margin-top: 2px;
          span {
            display: inline-block;
            text-align: center;
            min-width: 22px;
            height: 20px;
            line-height: 20px;
            margin-left: 5px;
            margin-right: -2px;
            border: 1px solid #b4acac;
            background: hsla(0, 0%, 100%, 0.19);
            border-radius: 3px;
            font-size: 12px;
          }
        }
      }
      ._right {
        width: 120px;
        text-align: center;
        font-size: 15.2312px;
        height: 22.8438px;
        line-height: 22.8469px;
        color: #333;
        .right_box1 {
        }
        .right_box2 {
        }
        .right_box3 {
          font-size: 21.7589px;
        }
        .wkp_text {
          font-size: 20px;
          height: 70px;
          line-height: 70px;
        }
      }
    }
  }
  .bodyBox2 {
    text-align: center;
    color: #000;
    .time {
      padding: 20px 0 0px;
      b {
        color: red;
      }
    }
    .text {
      height: 200px;
      line-height: 200px;
      font-size: 21.7589px;
    }
    // img {
    //   height: 70px;
    //   margin-top: 20px;
    // }
  }
  .bodyBox {
    margin-top: 5px;
    .top_box1 {
      margin-left: 12px;
      margin-right: 12px;
      margin-top: 17.4071px;
      border: 1px solid #e3e3e3;
      border-radius: 5px;
      box-sizing: border-box;
      height: 36.4271px;
      .fanshui_l {
        width: 85.8958px;
        font-size: 14.1433px;
        padding-left: 4.6875px;
        box-sizing: border-box;
        text-align: center;
        div:first-child {
          color: rgb(202, 202, 202);
        }
        div:last-child {
          width: 46.875px;
          color: #ff9726;
        }
      }
      .fanshui_r {
        width: 70px;
        padding-right: 4.6875px;
        box-sizing: border-box;
        color: rgb(202, 202, 202);
        font-size: 14.1433px;
        span {
          color: #ff9726;
          display: inline-block;
          width: 35px;
          text-align: center;
        }
      }
      .fanshui {
        padding-right: 4.6875px;
        .jj {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          line-height: 20px;
          text-align: center;
          background-color: #e3e3e3;
          color: #fff;
          border: 1px solid #e3e3e3;
          font-size: 25px;
          &:first-child {
            background-color: #fff;
            border: 2px solid #e3e3e3;
            color: #e3e3e3;
            position: relative;
            &:before {
              content: "";
              display: block;
              width: 12.8854px;
              height: 1.63542px;
              background: #e3e3e3;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .van-slider {
          margin: 0 9px;
          height: 6px !important;
          width: 125px;
          .van-slider__bar {
            background-color: rgb(255, 151, 38);
          }
        }
        .custom-button {
          line-height: 18px;
          height: 18px;
          width: 18px;
          text-align: center;
          background-color: #fff;
          border: 4px solid rgb(255, 151, 38);
          border-radius: 50%;
          font-size: 0;
          box-sizing: border-box;
        }
      }
    }
    .lift_box::-webkit-scrollbar {
      display: none;
    }
    .lift_box {
      // height: calc(100vh - 4.66667rem);
      // overflow-y: auto;
      width: 105px;
      text-align: center;
      line-height: 35px;
      background-color: #ffffff;
      border-right: 1px solid #d2d2d2;
      box-sizing: border-box;
      .div {
        background-color: #ffffff;
        border-bottom: 1px solid #ddd;
        // border-right: 1px solid #ddd;
        position: relative;
        box-sizing: border-box;
        .dian {
          width: 3.3px;
          height: 3.3px;
          border-radius: 50%;
          background-color: #000;
          position: absolute;
          top: 4.76px;
          left: 3.3px;
        }
      }
      .lift_box_min:last-child {
        padding-bottom: 500px;
      }
      .active {
        background: #d21f18;
        font-weight: 700;
        color: #fff;
        -webkit-box-shadow: inset 0 2px 5px 0 #7a0500;
        box-shadow: inset 0 2px 5px 0 #7a0500;
        .dian {
          background-color: #fff;
        }
      }
    }
  }
  .hKjkaS {
    position: sticky;
    bottom: 0px;
    width: 100%;
    height: 50px;
    background-color: #fff;
    box-sizing: border-box;
    border-top: 2.5px solid #ccc;
    display: flex;
    z-index: 2;
    .shortcut {
      display: block;
      margin-top: 4px;
      box-sizing: border-box;
      -ms-flex-positive: 1;
      flex-grow: 1;
      background-size: auto 42%;
      position: relative;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s ease-in-out 0s;
      background-position: center 20%;
      background-repeat: no-repeat;
      & > div {
        height: 24px;
        display: block;
        width: 24px;
        margin: 0 auto;
        font-size: 21.7589px;
      }
      .text {
        font-family: Tahoma;
        font-weight: 700;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #888;
        font-size: 14px;
        vertical-align: top;
      }
    }
  }
  .bottomBox {
    // box-shadow: 0 0 0.26667rem 0 rgba(0, 0, 0, 0.22);
    position: sticky;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #dfdfdf;
    z-index: 1;
    .show_currentList_Body {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: #999;
      border-bottom: 0.02667rem solid #ddd;
      padding: 0px 20px 5px;
      color: #fff;
      height: 300px;
      overflow: auto;
      .show_currentList_Body_title {
        border-bottom: 1px solid #ddd;
        position: relative;
        padding: 5px 0;
        text-align: center;
        font-size: 15px;
        .right_cross {
          position: absolute;
          top: -5px;
          right: -5px;
          padding: 10px;
        }
      }
    }
    .currentList_Body {
      background-color: #fff;
      .title {
        padding: 9px 10px;
        b {
          font-size: 15.2312px;
          color: #666;
          font-weight: 400;
        }
        .van-icon-arrow-up {
          font-size: 17.4px;
          color: #ccc;
          position: relative;
          top: 2px;
        }
      }
      .money_class {
        padding: 0 10px 3px;
        border-bottom: 1px solid #ddd;
        div {
          border: 1px solid #de6668;
          box-sizing: border-box;
          width: 55px;
          margin-right: 3px;
          float: left;
          text-align: center;
          color: #000;
          line-height: 24px;
          border-radius: 24px;
        }
      }
      .input_class {
        padding: 0 0 0 7.61562px;
        .text {
          color: #666;
          font-size: 15.2312px;
        }
        .van-icon-clear {
          font-size: 20px;
        }
      }
    }
    .bottomBox_box {
      border-top: 1px solid #ddd;
      height: 48px;
      background-color: #252525;
      padding: 0 10px;
      .box1 {
        width: calc(100% - 160px);
        font-size: 14px;
        color: #ffaf36;
        font-size: 21.5px;
        line-height: 1;
      }
      .box2 {
        padding-left: 11.7188px;
        color: #fff;
        span {
          font-size: 15.2312px;
          display: inline-block;
        }
      }
      .box3 {
        .van-button {
          min-width: 58px;
          padding: 0;
          height: 33.5px;
          line-height: 33.5px;
          font-size: 15.2312px;
          color: #ddd !important;
          border-radius: 6.09375px;
          .van-button__content {
            padding: 0 6px;
          }
          &:first-child {
            margin-right: 4.56937px;
          }
        }
      }
    }
  }
  .xiazhuOpenClass {
    border-radius: 0;
    width: 90%;
    max-width: 640px;
    text-align: left;
    background-color: #fff;
    font-size: 14px;
    border-radius: 5px;
    color: #000;
    .van-dialog__header {
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 400;
      border-radius: 5px 5px 0 0;
      text-align: center;
      border-bottom: 1px solid #d8d8d8;
    }
    .betShow_body {
      .layui-m-layercont {
        padding: 10px 20px;
        text-align: left;
        word-break: break-all;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .betShow_btn {
      border-top: 1px solid #d0d0d0;
      background-color: #f2f2f2;
      text-align: center;
      font-size: 14px;
      box-sizing: border-box;
      ._but {
        width: 50%;
        box-sizing: border-box;
        height: 50.67px;
        line-height: 50.67px;
        .van-loading__spinner{
          height: 20px;
        }
        ._text{
          padding-left: 10px;
        }
      }
      ._but:first-child {
        border-right: 1px solid #d0d0d0;
      }
      ._but:last-child {
        color: #40affe;
      }
    }
  }
}
</style>
<style lang="scss">
.lotteryPage {
  .titleBar_top {
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .titleBar {
    .titleBar_title {
      height: 50px;
      padding: 0 14px 0 13px;
      .name {
        font-size: 21.7589px;
      }
      .left,
      ._right {
        width: 15%;
      }
    }
  }
  .LHC_titleBar {
    background: #000 !important;
  }
  .kaijiangShowClass {
    width: 90%;
    max-width: 640px;
    border-radius: 5px;
    .van-dialog__header {
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 400;
      border-radius: 5px 5px 0 0;
      text-align: center;
      border-bottom: 1px solid #d8d8d887;
      color: #000;
    }
    .kaijiangShow_body {
      padding: 10px 20px;
      line-height: 22px;
      text-align: center;
      font-size: 14px;
    }
    .van-button {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      border-top: 1px solid #d0d0d0;
      background-color: #f2f2f2;
      color: #40affe;
    }
  }
}
.input_class {
  .van-cell {
    padding: 6.37px 0;
    width: 76.1458px;
    margin-left: 6.09249px;
    .van-field__body {
      .van-field__control {
        background-color: #f9f9f9;
        border: 1px solid #dfdfdf;
        border-radius: 2px;
        font-weight: 500;
        box-sizing: border-box;
        padding-left: 5px;
        height: 25.33px;
        &:focus-visible {
          border: 2.5px solid #ffa500;
        }
      }
    }
  }
}
</style>
