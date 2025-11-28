<template>
  <!-- 赔率表 -->
  <div class="plbOpen_body">
    <div class="plbOpen_body_top">
      <div class="_title flex-between flex-center">
        <i class="iconfont back" @click="onClose()"></i>
        <div class="_tabs flex-between">
          <div :class="{ on: groupType == 20 }" @click="onTabs(20)">{{ $t('agentCenter[\'官方彩\']') }}</div>
          <div :class="{ on: groupType == 10 }" @click="onTabs(10)">{{ $t('agentCenter[\'信用彩\']') }}</div>
        </div>
        <i class="iconfont back" style="opacity: 0"></i>
        <div class="nickname">{{ nickname }}</div>
      </div>
      <div class="_nav flex-left flex-center">
        <div
          @click="setNameType(i)"
          class="_nav_min"
          :class="{ on: nameType == i }"
          v-for="(k, i) in plbData[groupType]"
          :key="i"
        >
          <i class="iconfont" :class="k.icon"></i>
          <div>{{ i }}</div>
        </div>
      </div>
      <!-- 下拉 -->
      <div class="_nav_xiala" v-show="xialaOpen">
        <div
          @click="setItemObject(k)"
          class="_box"
          :class="{ active: itemObject == k.typeName }"
          v-for="(k, i) in plbData[groupType][nameType].typeList"
          :key="i"
        >
          {{ k.typeName }}
        </div>
      </div>
    </div>
    <div
      class="plbOpen_body_bot"
      v-if="
        itemObjectData[groupType] &&
        itemObjectData[groupType].filter((n) =>
          n.matching.includes(itemObject)
        )[0]
      "
    >
      <div class="rebateTitle">
        <div class="row"><i>{{ $t('agentCenter[\'玩法\']') }}</i><span></span><em>{{ $t('agentCenter[\'返点\']') }}</em></div>
        <div
          class="row"
          v-for="(k, i) in itemObjectData[groupType].filter((n) =>
            n.matching.includes(itemObject)
          )[0].itemObjectList"
          :key="i"
        >
          {{ k.itemObject }}
        </div>
      </div>
      <div class="rebateTableCon">
        <div class="_box" v-for="(n, x) in 1000" :key="x">
          <div class="row">{{ ((1000 - x) * 0.01).toFixed(2) / 1 }}</div>
          <div
            class="row"
            v-for="(k, i) in itemObjectData[groupType].filter((n) =>
              n.matching.includes(itemObject)
            )[0].itemObjectList"
            :key="i"
          >
            {{ $t('agentCenter[\'奖金\']') }}{{
              (
                k.pl -
                ((10 - (1000 - x) * 0.01).toFixed(2) / 1) * 0.01 * k.jxz
              ).toFixed(4) / 1
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      xialaOpen: false,
      groupType: 20,
      nameType: "PK10",
      itemObject: "189极速赛车",
      nickname: "極速賽車",
      plbData: {
        10: {
          PK10: {
            icon: "A_PK10",
            typeList: [
              { typeName: "189极速赛车", nickname: "極速賽車" },
              { typeName: "189澳洲赛马", nickname: "3分" },
              { typeName: "189澳洲赛车", nickname: "5分" },
              { typeName: "189幸运赛车", nickname: "幸运5" },
              { typeName: "189极速飞艇", nickname: "飞艇" },
              { typeName: "168极速赛车", nickname: "168赛车" },
              { typeName: "老北京赛车", nickname: "老北京" },
              { typeName: "上海PK10", nickname: "上海" },
              { typeName: "新加坡飞艇", nickname: "新加坡" },
              { typeName: "168澳洲幸运10", nickname: "澳幸10" },
              { typeName: "168幸运飞艇", nickname: "168飞艇" },
              { typeName: "168SG飞艇", nickname: "SG飞艇" },
              { typeName: "168极速飞艇", nickname: "极速飞艇" },
              { typeName: "哈希1分赛车", nickname: "1分赛车" },
              { typeName: "哈希3分赛车", nickname: "3分赛车" },
              { typeName: "哈希5分赛车", nickname: "5分赛车" },
              { typeName: "哈希10分赛车", nickname: "10分赛车" },
            ],
          },
          时时彩: {
            icon: "A_SSC",
            typeList: [
              { typeName: "189极速分分彩", nickname: "极速1分" },
              { typeName: "189幸运五分彩", nickname: "极速5分" },
              { typeName: "168澳洲幸运5", nickname: "澳洲5" },
              { typeName: "189幸运分分彩", nickname: "幸运" },
              { typeName: "189柚子分分彩", nickname: "柚子" },
              { typeName: "168极速时时彩", nickname: "168彩" },
              { typeName: "哈希1分彩", nickname: "1分彩" },
              { typeName: "哈希3分彩", nickname: "3分彩" },
              { typeName: "哈希5分彩", nickname: "5分彩" },
              { typeName: "哈希10分彩", nickname: "10分彩" },
            ],
          },
          快乐彩: {
            icon: "A_KLC",
            typeList: [
              { typeName: "189新加坡28", nickname: "澳洲28" },
            ],
          },
          六合彩: {
            icon: "A_SIX",
            typeList: [
              { typeName: "香港六合彩", nickname: "六合彩" },
              { typeName: "老澳门六合彩", nickname: "老澳门六合彩" },
              { typeName: "189六合5分彩", nickname: "六合5分" },
              { typeName: "新澳门六合彩", nickname: "新澳门六合彩" },
            ],
          },
        },
        20: {
          PK10: {
            icon: "A_PK10",
            typeList: [
              { typeName: "189极速赛车", nickname: "極速賽車" },
              { typeName: "189澳洲赛马", nickname: "3分" },
              { typeName: "189澳洲赛车", nickname: "5分" },
              { typeName: "189幸运赛车", nickname: "幸运5" },
              { typeName: "189极速飞艇", nickname: "飞艇" },
              { typeName: "老北京赛车", nickname: "老北京" },
              { typeName: "上海PK10", nickname: "上海" },
              { typeName: "新加坡飞艇", nickname: "新加坡" },
              { typeName: "168SG飞艇", nickname: "SG飞艇" },
            ],
          },
          时时彩: {
            icon: "A_SSC",
            typeList: [
              { typeName: "189极速分分彩", nickname: "极速1分" },
              { typeName: "189幸运五分彩", nickname: "极速5分" },
              { typeName: "189幸运分分彩", nickname: "幸运" },
              { typeName: "189柚子分分彩", nickname: "柚子" },
            ],
          },
        },
      },
      itemObjectData: {
        10: [
          {
            matching: [
              "189极速赛车",
              "189澳洲赛马",
              "189澳洲赛车",
              "189幸运赛车",
              "189极速飞艇",
              "168极速赛车",
              "上海PK10",
              "新加坡飞艇",
              "168澳洲幸运10",
              "168幸运飞艇",
              "168SG飞艇",
              "168极速飞艇",
              "哈希1分赛车",
              "哈希3分赛车",
              "哈希5分赛车",
              "哈希10分赛车",
            ],
            itemObjectList: [
              { itemObject: "冠军", pl: 9.999, jxz: 10 },
              { itemObject: "第十名", pl: 9.999, jxz: 10 },
              { itemObject: "亚军", pl: 9.999, jxz: 10 },
              { itemObject: "第三名", pl: 9.999, jxz: 10 },
              { itemObject: "第四名", pl: 9.999, jxz: 10 },
              { itemObject: "第五名", pl: 9.999, jxz: 10 },
              { itemObject: "第六名", pl: 9.999, jxz: 10 },
              { itemObject: "第七名", pl: 9.999, jxz: 10 },
              { itemObject: "第八名", pl: 9.999, jxz: 10 },
              { itemObject: "第九名", pl: 9.999, jxz: 10 },
              { itemObject: "1-10单双-单", pl: 1.9999, jxz: 2 },
              { itemObject: "1-10单双-双", pl: 1.9999, jxz: 2 },
              { itemObject: "1-10大小-大", pl: 1.9999, jxz: 2 },
              { itemObject: "1-10大小-小", pl: 1.9999, jxz: 2 },
              { itemObject: "冠亚军和-3，4", pl: 42, jxz: 45 },
              { itemObject: "冠亚军和-5，6", pl: 20.7, jxz: 22.5 },
              { itemObject: "冠亚军和-7，8", pl: 13.8, jxz: 15 },
              { itemObject: "冠亚军和-9，10", pl: 10.35, jxz: 11.25 },
              { itemObject: "冠亚军和-11", pl: 8.28, jxz: 9 },
              { itemObject: "冠亚军和单双-单", pl: 1.7869, jxz: 1.787 },
              { itemObject: "冠亚军和单双-双", pl: 2.13, jxz: 2.198 },
              { itemObject: "冠亚军和大小-大", pl: 2.13, jxz: 2.198 },
              { itemObject: "冠亚军和大小-小", pl: 1.7869, jxz: 1.787 },
              { itemObject: "1-5龙虎-龙", pl: 1.9999, jxz: 2 },
              { itemObject: "1-5龙虎-虎	", pl: 1.9999, jxz: 2 },
            ],
          },
          {
            matching: [
              "189极速分分彩",
              "189幸运五分彩",
              "168澳洲幸运5",
              "189幸运分分彩",
              "189柚子分分彩",
              "168极速时时彩",
              "168极速飞艇",
              "哈希1分彩",
              "哈希3分彩",
              "哈希5分彩",
              "哈希10分彩",
              "168澳洲幸运5",
            ],
            itemObjectList: [
              { itemObject: "第一球", pl: 9.999, jxz: 10 },
              { itemObject: "第二球", pl: 9.999, jxz: 10 },
              { itemObject: "第三球", pl: 9.999, jxz: 10 },
              { itemObject: "第四球", pl: 9.999, jxz: 10 },
              { itemObject: "第五球", pl: 9.999, jxz: 10 },
              { itemObject: "1-5单双-单", pl: 1.9999, jxz: 2 },
              { itemObject: "1-5单双-双", pl: 1.9999, jxz: 2 },
              { itemObject: "1-5大小-大", pl: 1.9999, jxz: 2 },
              { itemObject: "1-5大小-小", pl: 1.9999, jxz: 2 },
              { itemObject: "后三-豹子", pl: 95	, jxz: 100 },
              { itemObject: "后三-顺子", pl: 16.7, jxz: 16.7 },
              { itemObject: "后三-对子", pl: 3.7, jxz: 3.7 },
              { itemObject: "后三-半顺", pl: 2.77, jxz: 2.77 },
              { itemObject: "后三-杂六", pl: 3.33, jxz: 3.33 },
              { itemObject: "龙虎和-龙，虎", pl: 1.999, jxz: 2.2224 },
              { itemObject: "龙虎和-和", pl: 8.93, jxz: 10 },
              { itemObject: "前三-豹子", pl: 95, jxz: 100 },
              { itemObject: "前三-顺子", pl: 16.7, jxz: 16.7 },
              { itemObject: "前三-对子", pl: 3.7, jxz: 3.7 },
              { itemObject: "前三-半顺", pl: 2.77, jxz: 2.77 },
              { itemObject: "前三-杂六", pl: 3.33, jxz: 3.33 },
              { itemObject: "中三-豹子", pl: 95, jxz: 100 },
              { itemObject: "中三-顺子", pl: 16.7, jxz: 16.7 },
              { itemObject: "中三-对子", pl: 3.7, jxz: 3.7 },
              { itemObject: "中三-半顺", pl: 2.77, jxz: 2.77 },
              { itemObject: "中三-杂六", pl: 3.33, jxz: 3.33 },
              { itemObject: "总和单双-单", pl: 1.9999, jxz: 2 },
              { itemObject: "总和单双-双", pl: 1.9999, jxz: 2 },
              { itemObject: "总和大小-大", pl: 1.9999, jxz: 2 },
              { itemObject: "总和大小-小", pl: 1.9999, jxz: 2 },
            ],
          },
          {
            matching: [
              "189新加坡28",
            ],
            itemObjectList: [
              { itemObject: "豹子", pl: 45, jxz: 100 },
              { itemObject: "混合组合", pl: 3.55, jxz: 5 },
              { itemObject: "极值", pl: 8.5, jxz: 20 },
              { itemObject: "波色", pl: 2.66, jxz: 2.99 },
              { itemObject: "特码-00/27", pl: 138, jxz: 300 },
              { itemObject: "特码-01/26", pl: 88, jxz: 240 },
              { itemObject: "特码-02/25", pl: 38, jxz: 120 },
              { itemObject: "特码-03/24", pl: 18, jxz: 90 },
              { itemObject: "特码-04/23", pl: 16, jxz: 48 },
              { itemObject: "特码-05/22", pl: 14, jxz: 42 },
              { itemObject: "特码-06/21", pl: 11, jxz: 32 },
              { itemObject: "特码-07/20", pl: 11, jxz: 24 },
              { itemObject: "特码-08/19", pl: 11, jxz: 20 },
              { itemObject: "特码-09/18", pl: 11, jxz: 16 },
              { itemObject: "特码-10/17", pl: 9, jxz: 13 },
              { itemObject: "特码-11/16", pl: 9, jxz: 12 },
              { itemObject: "特码-12/15", pl: 9, jxz: 13 },
              { itemObject: "特码-13/14", pl: 8, jxz: 12 },
              { itemObject: "特码包三", pl: 3.62, jxz: 3.6939 },
              { itemObject: "单双", pl: 1.96, jxz: 2 },
              { itemObject: "大小", pl: 1.96, jxz: 2 },
            ],
          },
          {
            matching: [
              "香港六合彩",
              "老澳门六合彩",
              "189六合5分彩",
              "新澳门六合彩",
            ],
            itemObjectList: [
              { itemObject: "第一球", pl: 9.999, jxz: 10 },
              { itemObject: "半波-红单", pl: 5.748, jxz: 10 },
              { itemObject: "半波-红双", pl: 5.175, jxz: 10 },
              { itemObject: "半波-蓝单", pl: 5.748, jxz: 10 },
              { itemObject: "半波-蓝双", pl: 5.748, jxz: 10 },
              { itemObject: "半波-绿单", pl: 5.748, jxz: 10 },
              { itemObject: "半波-绿双", pl: 6.532, jxz: 10 },
              { itemObject: "半波-红大", pl: 6.502, jxz: 10 },
              { itemObject: "半波-红小", pl: 4.693, jxz: 5 },
              { itemObject: "半波-蓝大", pl: 5.172, jxz: 10 },
              { itemObject: "半波-蓝小", pl: 6.502, jxz: 10 },
              { itemObject: "半波-绿大", pl: 5.818, jxz: 10 },
              { itemObject: "半波-绿小", pl: 6.502, jxz: 10 },
              { itemObject: "半波-红合单", pl: 5.155, jxz: 10 },
              { itemObject: "半波-红合双", pl: 5.748, jxz: 10 },
              { itemObject: "半波-蓝合单", pl: 5.748, jxz: 10 },
              { itemObject: "半波-蓝合双", pl: 5.748, jxz: 10 },
              { itemObject: "半波-绿合单", pl: 6.502, jxz: 10 },
              { itemObject: "半波-绿合双", pl: 5.748, jxz: 10 },
              { itemObject: "黑红", pl: 1.988, jxz: 3.33 },
              { itemObject: "总和单双-单", pl: 1.948, jxz: 3.33 },
              { itemObject: "总和单双-双", pl: 1.948, jxz: 3.33 },
              { itemObject: "总和大小-大", pl: 1.948, jxz: 3.33 },
              { itemObject: "总和大小-小", pl: 1.948, jxz: 3.33 },
              { itemObject: "雷电", pl: 1.988, jxz: 3.33 },
              { itemObject: "龙虎", pl: 1.988	, jxz: 3.33 },
              { itemObject: "六肖", pl: 1.978, jxz: 3.33 },
              { itemObject: "神奇", pl: 1.988, jxz: 3.33 },
              { itemObject: "生肖", pl: 2.088, jxz: 2 },
              { itemObject: "生肖-兔", pl: 1.7789, jxz: 2 },
              { itemObject: "生肖不中", pl: 1.02, jxz: 1 },
              { itemObject: "生肖不中-兔", pl: 1.02, jxz: 1 },
              { itemObject: "生肖连-二肖连", pl: 4.55, jxz: 5 },
              { itemObject: "生肖连-连兔", pl: 3.847, jxz: 5 },
              { itemObject: "生肖连-二肖连不中", pl: 0, jxz: 5 },
              { itemObject: "生肖连-连兔", pl: 0, jxz: 5 },
              { itemObject: "生肖连-三肖连", pl: 10.8, jxz: 10 },
              { itemObject: "生肖连-连兔", pl: 8.893, jxz: 10 },
              { itemObject: "生肖连-三肖连不中", pl: 0, jxz: 5 },
              { itemObject: "生肖连-连兔", pl: 0, jxz: 5 },
              { itemObject: "生肖连-四肖连", pl: 33.8, jxz: 40 },
              { itemObject: "生肖连-连兔", pl: 27.48, jxz: 30 },
              { itemObject: "生肖连-四肖连不中", pl: 0, jxz: 40 },
              { itemObject: "生肖连-连兔", pl: 0, jxz: 30 },
              { itemObject: "生肖连-五肖连不中", pl: 0, jxz: 110 },
              { itemObject: "生肖连-连兔", pl: 0, jxz: 90 },
              { itemObject: "特串", pl: 165, jxz: 200 },
              { itemObject: "天地", pl: 1.988, jxz: 3.33 },
              { itemObject: "特码", pl: 48.52, jxz: 49 },
              { itemObject: "特码单双-单", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码单双-双", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码大小-大", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码大小-小", pl: 1.948, jxz: 3.33 },
              { itemObject: "大小单双", pl: 3.826, jxz: 5 },
              { itemObject: "特码合数单双-单", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码合数单双-双", pl: 1.948, jxz: 3.33 },
              { itemObject: "家禽野兽-家禽", pl: 1.948, jxz: 3.33 },
              { itemObject: "家禽野兽-野兽", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码色波-色波", pl: 2.943, jxz: 3 },
              { itemObject: "特码色波-红波", pl: 2.78, jxz: 3 },
              { itemObject: "特码生肖", pl: 11.68, jxz: 10 },
              { itemObject: "特码生肖-兔", pl: 9.486, jxz: 10 },
              { itemObject: "特码摊子", pl: 3.5, jxz: 5 },
              { itemObject: "特码尾数大小-大", pl: 1.948, jxz: 3.33 },
              { itemObject: "特码尾数大小-小", pl: 1.948, jxz: 3.33 },
              { itemObject: "尾数", pl: 1.778, jxz: 2 },
              { itemObject: "尾数-0尾", pl: 2.088, jxz: 2 },
              { itemObject: "尾数不中", pl: 1.02, jxz: 2 },
              { itemObject: "尾数不中-二尾连", pl: 1.02, jxz: 2 },
              { itemObject: "尾数连-连0", pl: 3.6, jxz: 5 },
              { itemObject: "尾数连-三尾连", pl: 6.29, jxz: 10 },
              { itemObject: "尾数连-连0", pl: 7.5, jxz: 10 },
              { itemObject: "尾数连-三尾连不中", pl: 6.29, jxz: 10 },
              { itemObject: "尾数连-连0", pl: 7.5, jxz: 10 },
              { itemObject: "尾数连-四尾连", pl: 14.97, jxz: 20 },
              { itemObject: "尾数连-连0", pl: 17.95, jxz: 20 },
              { itemObject: "尾数连-四尾连不中", pl: 14.97, jxz: 20 },
              { itemObject: "位数连-连0", pl: 17.95, jxz: 20 },
              { itemObject: "尾数连-五尾连", pl: 41.87, jxz: 40 },
              { itemObject: "尾数连-连0", pl: 53.96, jxz: 50 },
              { itemObject: "尾数连-五尾连不中", pl: 41.87, jxz: 40 },
              { itemObject: "尾数连-连0", pl: 53.96, jxz: 50 },
              { itemObject: "十不中", pl: 5.3, jxz: 6 },
              { itemObject: "正1特", pl: 47.96, jxz: 49 },
              { itemObject: "二全中", pl: 63, jxz: 72 },
              { itemObject: "正2特", pl: 47.96, jxz: 49 },
              { itemObject: "二中特-中特", pl: 32, jxz: 39 },
              { itemObject: "二中特-中二", pl: 53, jxz: 63 },
              { itemObject: "三全中", pl: 663, jxz: 911 },
              { itemObject: "三中二-中二", pl: 20.58, jxz: 25 },
              { itemObject: "三中二-中三", pl: 88, jxz: 129 },
              { itemObject: "正3特", pl: 47.96, jxz: 49 },
              { itemObject: "四中一", pl: 1.97, jxz: 2 },
              { itemObject: "正4特", pl: 47.96, jxz: 49 },
              { itemObject: "五不中", pl: 2.12, jxz: 2 },
              { itemObject: "正5特", pl: 47.96, jxz: 49 },
              { itemObject: "六不中", pl: 2.53, jxz: 3 },
              { itemObject: "正6特", pl: 47.96, jxz: 49 },
              { itemObject: "七不中", pl: 3.02, jxz: 3 },
              { itemObject: "八不中", pl: 3.62, jxz: 4 },
              { itemObject: "九不中", pl: 4.37, jxz: 5 },
              { itemObject: "正码", pl: 7.91, jxz: 8 },
              { itemObject: "正码1-6单双-单", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6单双-双", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6大小-大", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6大小-小", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码过关-双面", pl: 0, jxz: 0 },
              { itemObject: "正码过关-色波", pl: 0, jxz: 0 },
              { itemObject: "正码1-6合数单双-单", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6合数单双-双", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6合数大小-大", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6合数大小-小", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6色波-色波", pl: 2.911, jxz: 5 },
              { itemObject: "正码1-6色波-红波", pl: 2.722, jxz: 10 },
              { itemObject: "正码1-6尾数大小-大", pl: 1.948, jxz: 3.3 },
              { itemObject: "正码1-6尾数大小-小", pl: 1.948, jxz: 3.3 },
              { itemObject: "庄闲", pl: 1.988, jxz: 5 },

            ],
          },
        ],
        20: [
          {
            matching: [
              "189极速赛车",
              "189澳洲赛马",
              "189澳洲赛车",
              "189幸运赛车",
              "189极速飞艇",
            ],
            itemObjectList: [
              { itemObject: "定位胆-后五", pl: 17.999, jxz: 20 },
              { itemObject: "定位胆-前五", pl: 17.999, jxz: 20 },
              { itemObject: "大小单双-冠亚大小单双", pl: 7.1996, jxz: 8 },
              { itemObject: "冠军-常规选号", pl: 17.999, jxz: 20 },
              { itemObject: "前二名-单式", pl: 161.991, jxz: 180 },
              { itemObject: "前二名-复式", pl: 161.991, jxz: 180 },
              { itemObject: "前三名-单式", pl: 1295.928, jxz: 1440 },
              { itemObject: "前三名-复式", pl: 1295.928, jxz: 1440 },
            ],
          },
          {
            matching: ["老北京赛车", "上海PK10", "新加坡飞艇"],
            itemObjectList: [
              { itemObject: "定位胆-后五", pl: 16.999, jxz: 20 },
              { itemObject: "定位胆-前五", pl: 16.999, jxz: 20 },
              { itemObject: "大小单双-冠亚大小单双", pl: 7.1996, jxz: 8 },
              { itemObject: "冠军-常规选号", pl: 17, jxz: 20 },
              { itemObject: "前二名-单式", pl: 153, jxz: 180 },
              { itemObject: "前二名-复式", pl: 153, jxz: 180 },
              { itemObject: "前三名-单式", pl: 1224, jxz: 1440 },
              { itemObject: "前三名-复式", pl: 1224, jxz: 1440 },
            ],
          },
          {
            matching: ["168SG飞艇"],
            itemObjectList: [
              { itemObject: "定位胆-后五", pl: 17.4, jxz: 20 },
              { itemObject: "定位胆-前五", pl: 17.4, jxz: 20 },
              { itemObject: "大小单双-冠亚大小单双", pl: 0, jxz: 8 },
              { itemObject: "冠军-常规选号", pl: 17.4, jxz: 20 },
              { itemObject: "前二名-单式", pl: 156.6, jxz: 180 },
              { itemObject: "前二名-复式", pl: 156.6, jxz: 180 },
              { itemObject: "前三名-单式", pl: 1252.8, jxz: 1440 },
              { itemObject: "前三名-复式", pl: 1252.8, jxz: 1440 },
            ],
          },
          {
            matching: [
              "189极速分分彩",
              "189幸运五分彩",
              "189幸运分分彩",
              "189柚子分分彩",
            ],
            itemObjectList: [
              { itemObject: "不定位-三星一码", pl: 0.59, jxz: 4 },
              { itemObject: "不定位-三星二码", pl: 29.69, jxz: 30 },
              { itemObject: "不定位-四星一码", pl: 3.59, jxz: 4 },
              { itemObject: "不定位-四星二码", pl: 16.55, jxz: 20 },
              { itemObject: "不定位-五星二码", pl: 10.79, jxz: 10 },
              { itemObject: "不定位-五星三码", pl: 36.89, jxz: 40 },
              { itemObject: "定位胆-五星定位胆", pl: 17.99, jxz: 20 },
              { itemObject: "大小单双-任二大小", pl: 7.199, jxz: 8 },
              { itemObject: "趣味-一帆风顺", pl: 3.86, jxz: 4 },
              { itemObject: "趣味-好事成双", pl: 19.79, jxz: 20 },
              { itemObject: "趣味-三星报喜", pl: 188.98, jxz: 210 },
              { itemObject: "趣味-四季发财", pl: 3509.8, jxz: 3900 },
              { itemObject: "二星组选-单式", pl: 89.99, jxz: 100 },
              { itemObject: "二星组选-复式", pl: 89.99, jxz: 100 },
              { itemObject: "二星组选-组选包胆", pl: 89.99, jxz: 100 },
              { itemObject: "二星和值-直选和值", pl: 179.99, jxz: 200 },
              { itemObject: "二星直选-单式", pl: 179.99, jxz: 200 },
              { itemObject: "二星直选-复式", pl: 179.99, jxz: 200 },
              { itemObject: "二星直选-直选跨度", pl: 179.99, jxz: 200 },
              { itemObject: "三星组选-组三单式", pl: 599.96, jxz: 670 },
              { itemObject: "三星组选-组三复式", pl: 599.96, jxz: 670 },
              { itemObject: "三星组选-混合组选", pl: 600, jxz: 670 },
              { itemObject: "三星组选-组六单式", pl: 299.98, jxz: 330 },
              { itemObject: "三星组选-组六复试", pl: 299.98, jxz: 330 },
              { itemObject: "三星祖选-直选和值", pl: 1799.9, jxz: 2000 },
              { itemObject: "三星直选-单式", pl: 1799.9, jxz: 2000 },
              { itemObject: "三星直选-复式", pl: 1799.9, jxz: 2000 },
              { itemObject: "三星直选-直选跨度", pl: 1799.9, jxz: 2000 },
              { itemObject: "四星组选-组选12", pl: 1499.91, jxz: 1670 },
              { itemObject: "四星组选-组选24", pl: 749.65, jxz: 830 },
              { itemObject: "四星组选-组选4", pl: 4499.75, jxz: 5000 },
              { itemObject: "四星组选-组选6", pl: 2999.83, jxz: 3330 },
              { itemObject: "四星直选-单式", pl: 17999, jxz: 20000 },
              { itemObject: "四星组选-复式", pl: 17999, jxz: 20000 },
              { itemObject: "五星组选-组选10", pl: 17999, jxz: 20000 },
              { itemObject: "五星组选-组选120", pl: 1499.91, jxz: 1670 },
              { itemObject: "五星组选-组选20", pl: 8999.5, jxz: 10000 },
              { itemObject: "五星组选-组选30", pl: 5999.66, jxz: 6670 },
              { itemObject: "五星组选-组选5", pl: 35998, jxz: 40000 },
              { itemObject: "五星组选-组选60", pl: 2999.83, jxz: 3330 },
              { itemObject: "五星直选-单式", pl: 179990, jxz: 200000 },
              { itemObject: "五星直选-复试", pl: 179990, jxz: 200000 },
            ],
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    setItemObject(k) {
      this.nickname = k.nickname;
      this.itemObject = k.typeName;
      this.xialaOpen = false;
    },
    setNameType(name) {
      this.nameType = name;
      this.xialaOpen = true;
    },
    onTabs(val) {
      this.itemObject = "189极速赛车";
      this.nameType = "PK10";
      this.groupType = val;
    },
  },
};
</script>

<style lang="scss">
// 赔率表弹窗
.plbOpen_body {
  .plbOpen_body_top {
    position: sticky;
    top: 0;
    z-index: 9;
    ._title {
      height: 50.0417px;
      text-align: center;
      color: #fff;
      background: -webkit-linear-gradient(
        bottom,
        #d83442 2%,
        #d83442 50%,
        #d83442 51%,
        #d83442
      );
      position: relative;
      .nickname {
        position: absolute;
        right: 8px;
        font-size: 17.6247px;
      }
      i {
        font-size: 19.583px;
        width: 48.9479px;
      }
      ._tabs {
        width: 210.938px;
        border-radius: 3.9166px;
        border: 1px solid #fff;
        div {
          width: 50%;
          height: 33.2812px;
          line-height: 33.2812px;
          font-size: 15.6664px;
        }
        .on {
          background: #fff;
          color: #dc2e2e;
        }
      }
    }
    ._nav {
      background-color: #22292c;
      ._nav_min {
        width: 91.3854px;
        text-align: center;
        padding: 0;
        color: #5c5f60;
        height: 73.1042px;
        font-size: 17.4071px;
        padding-top: 8.70356px;
        box-sizing: border-box;
        i {
          line-height: 34.8142px;
          font-size: 34.8142px;
        }
      }
      .on {
        background-color: #151b1d;
        color: #fff;
      }
    }
    ._nav_xiala {
      background-color: #fff;
      position: absolute;
      width: 100%;
      z-index: 1;
      ._box {
        width: calc(100% / 3);
        float: left;
        text-align: center;
        background: #fff;
        height: 53.3021px;
        line-height: 47.2168px;
        border: 4px solid #fff;
        color: rgba(0, 0, 0, 0.5);
        font-size: 15.2312px;
        box-sizing: border-box;
      }
      .active {
        background: #dc3b40;
        color: #fff;
      }
    }
  }
  .plbOpen_body_bot {
    background-color: #fff;
    padding-bottom: 15.2312px;
    overflow: hidden;
    .rebateTitle {
      position: relative;
      box-shadow: 7.61562px 0 7.61562px #d5d5d5;
      float: left;
      .row {
        position: relative;
        overflow: hidden;
        width: 137.073px;
        text-align: center;
        height: 39.6012px;
        line-height: 39.6012px;
        font-size: 15.2312px;
        color: #333;
        &:nth-child(odd) {
          background: #f5f5f5;
        }
        &:first-child {
          background: #eee;
          i {
            position: absolute;
            left: 15px;
            bottom: -6px;
            z-index: 2;
            font-style: inherit;
          }
          em {
            position: absolute;
            right: 15px;
            top: -6px;
            z-index: 2;
            font-style: inherit;
          }
        }
        &:first-child:before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          border-bottom: 39.3333px solid #dedede;
          border-right: 116.667px solid transparent;
          content: "";
          z-index: 1;
        }
        &:first-child:after {
          position: absolute;
          left: 0;
          right: 1px;
          top: 1px;
          bottom: 0;
          border-bottom: 39.3333px solid #eee;
          border-right: 116.667px solid transparent;
          content: "";
          z-index: 1;
        }
      }
    }
    .rebateTableCon {
      float: left;
      width: calc(100% - 137.073px);
      overflow: auto;
      font-size: 0;
      white-space: nowrap;
      ._box {
        display: inline-block;
        .row {
          width: 112.708px;
          text-align: center;
          height: 39.6012px;
          line-height: 39.6012px;
          font-size: 15.2312px;
          color: #333;
        }
        .row:first-child {
          background: #eee;
        }
        .row:nth-child(odd) {
          background: #f5f5f5;
        }
      }
    }
  }
}
</style>
