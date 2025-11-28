<template>
  <div class="Security">
    <titleBar
      :title_name="$t('myCenter[\'安全中心\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
    />
    <div class="Security_top">
      <div class="text flex-center flex-justify-center">
        <span></span>
        <div>
          {{ $t("myCenter['您的账号安全等级为']") }}{{ value < 3 ? $t("myCenter['低']") : value < 5 ? $t("myCenter['中']") : $t("myCenter['高']") }}
        </div>
        <span></span>
      </div>
      <van-rate
        readonly
        v-model="value"
        :size="35"
        allow-half
        color="#f90"
        void-icon="star"
        void-color="#cdcdd1"
      />
      <div class="text2 flex-center flex-justify-center">
        <div>{{ $t("myCenter['上次登录']") }}：{{ userInfo.lastLoginTime }}</div>
        <div class="_xian">|</div>
        <div
          @click="
            onOpen(
              list.filter((k) => {
                return k.type == 1;
              })[0]
            )
          "
        >
          {{ $t("myCenter['不是我登录？']") }}
        </div>
      </div>
    </div>
    <div class="Security_body">
      <van-cell
        :value="setText(k)"
        @click="onOpen(k)"
        is-link
        v-for="(k, i) in list"
        :key="i"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{ k.name }}</span>
        </template>
      </van-cell>
    </div>

    <!--  弹窗-->
    <van-popup
      v-model="openBody.open"
      @close="closePopup"
      position="right"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <div class="openBody">
        <titleBar
          :title_name="openBody.title"
          class="titleBar"
          @toLeft="onQuit()"
          left_icon="arrow-left"
        />
        <!--        登录密码-->
        <div class="inputBox" v-if="openBody.type == 1">
          <van-cell-group>
            <van-field
              type="password"
              v-model="form.loginPwd"
              :label="$t('myCenter[\'新密码\']')"
              :placeholder="$t('myCenter[\'请输入新密码\']')"
            />
            <van-field
              type="password"
              v-model="form.loginPwd2"
              :label="$t('myCenter[\'确认密码\']')"
              :placeholder="$t('myCenter[\'请输入确认密码\']')"
            />
            <van-field
              type="password"
              v-model="form.oldLoginPwd"
              :label="$t('myCenter[\'原登录密码\']')"
              :placeholder="$t('myCenter[\'请输入原登录密码\']')"
            />
          </van-cell-group>
          <div class="but" @click="updateLoginPwd">{{ $t("myCenter['确定']") }}</div>
        </div>
        <!--        安全密码-->
        <div class="inputBox" v-if="openBody.type == 2">
          <van-cell-group>
            <van-field
              type="password"
              v-if="form.hasFundPwd"
              v-model="form.oldFundPwd"
              :label="$t('myCenter[\'原安全密码\']') + '：'"
              :placeholder="$t('myCenter[\'请输入原安全密码\']')"
            />
            <van-field
              type="password"
              v-else
              v-model="form.loginPwd"
              :label="$t('myCenter[\'登录密码\']')"
              :placeholder="$t('myCenter[\'请输入登录密码\']')"
            />
            <van-field
              type="password"
              v-model="form.fundPwd"
              :label="$t('myCenter[\'安全密码\']')"
              :placeholder="$t('myCenter[\'请输入安全密码\']')"
            />
            <van-field
              type="password"
              v-model="form.fundPwd2"
              :label="$t('myCenter[\'确认安全密码\']')"
              :placeholder="$t('myCenter[\'请输入确认安全密码\']')"
            />
          </van-cell-group>
          <div class="but" @click="fundPwdSubmit">{{ $t("myCenter['确定']") }}</div>
          <div class="tips-security">
            <div>{{ $t("myCenter['安全密码用于提现、绑定银行卡等操作，可保障资金安全。']") }}</div>
          </div>
        </div>
        <!--        手机号-->
        <div class="inputBox" v-if="openBody.type == 3">
          <van-cell-group>
            <van-field
              v-model="form.phoneNo"
              type="digit"
              :label="$t('myCenter[\'手机号\']')"
              :placeholder="$t('myCenter[\'请输入手机号\']')"
            />
            <van-field
              type="password"
              v-model="form.fundPwd"
              :label="$t('myCenter[\'安全密码\']')"
              :placeholder="$t('myCenter[\'请输入安全密码\']')"
            />
          </van-cell-group>
          <div class="but" @click="updatePhoneNo">{{ $t("myCenter['确定']") }}</div>
        </div>
        <!--        邮箱-->
        <div class="inputBox" v-if="openBody.type == 4">
          <van-cell-group>
            <van-field
              v-model="form.email"
              :label="$t('myCenter[\'邮箱地址\']')"
              :placeholder="$t('myCenter[\'请输入邮箱地址\']')"
            />
            <van-field
              type="password"
              v-model="form.fundPwd"
              :label="$t('myCenter[\'安全密码\']')"
              :placeholder="$t('myCenter[\'请输入安全密码\']')"
            />
          </van-cell-group>
          <div class="but" @click="updateEmail">{{ $t("myCenter['确定']") }}</div>
        </div>
        <!--        银行卡管理-->
        <div class="inputBox" v-if="openBody.type == 5">
          <div v-show="showOpen">
            <div class="bankBox">
              <div
                class="_row flex-left flex-center"
                v-for="(k, i) in bankList"
                :key="i"
              >
                <img
                  src="https://8i7rb.com/mobile/v1/static/bankimg/CDRE.png"
                />
                <div class="bankNameClass">
                  <div>{{ k.bankName }}</div>
                  <div>{{ $t("myCenter['尾号']") }}：******{{ k.cardNo.substr(-4) }}</div>
                </div>
                <div class="xiugai_but" @click="changeUserBank(k)">{{ $t("myCenter['修改']") }}</div>
              </div>
            </div>
            <div
              v-if="bankList.length < 5"
              class="but"
              @click="
                radio = 'YHK';
                form = {};
                butshow = false;
                showOpen = false;
                showOpenNum = 1;
              "
            >
              {{ $t("myCenter['添加银行卡']") }}
            </div>
            <div class="tips-security">
              <div>
                {{ $t("myCenter['您已绑定1张银行卡，一共可以绑定5张银行卡。为了您的资金安全，成功提现的银行卡会自动锁定，无法删除和修改。']") }}
              </div>
            </div>
          </div>
          <div v-show="!showOpen">
            <div v-show="showOpenNum == 1">
              <div class="radio_text">{{ $t("myCenter['请选择提现方式类型']") }}：</div>
              <div class="radio_box">
                <van-radio-group v-model="radio" direction="horizontal">
                  <van-radio name="YHK">{{ $t("myCenter['银行卡']") }}</van-radio>
                  <van-radio name="ZFB">{{ $t("myCenter['支付宝']") }}</van-radio>
                  <van-radio name="WX">{{ $t("myCenter['微信']") }}</van-radio>
                  <van-radio name="BA">{{ $t("myCenter['币安']") }}</van-radio>
                  <van-radio name="HB">{{ $t("myCenter['火币']") }}</van-radio>
                  <van-radio name="BB">{{ $t("myCenter['波比']") }}</van-radio>
                  <van-radio name="GOPAY">GOPAY</van-radio>
                </van-radio-group>
              </div>
              <div class="but" @click="setshowOpenNum()">{{ $t("myCenter['下一步']") }}</div>
            </div>
            <div v-show="showOpenNum == 2">
              <van-cell-group>
                <van-field
                  v-model="form.bankName"
                  :right-icon="fieldShow1 ? 'arrow-up' : 'arrow-down'"
                  readonly
                  :label="$t('myCenter[\'选择银行\']')"
                  :placeholder="$t('myCenter[\'请选择银行\']')"
                  @click="fieldShow1 = true"
                />
                <van-popup v-model="fieldShow1" round position="bottom" lock-scroll>
                  <van-picker
                    :title="$t('myCenter[\'选择银行\']')"
                    show-toolbar
                    value-key="bankName"
                    :columns="allbankList2"
                    @confirm="onConfirm1"
                    @cancel="fieldShow1 = false"
                  />
                </van-popup>
                <van-field
                  v-model="form.province"
                  :right-icon="fieldShow ? 'arrow-up' : 'arrow-down'"
                  readonly
                  :label="$t('myCenter[\'开户省\']')"
                  :placeholder="$t('myCenter[\'请选择所在开户省\']')"
                  @click="fieldShow = true"
                />
                <van-popup v-model="fieldShow" round position="bottom" lock-scroll>
                  <van-picker
                    :title="$t('myCenter[\'选择开户省\']')"
                    show-toolbar
                    value-key="provinceName"
                    :columns="ProvinceList"
                    @confirm="onConfirm"
                    @cancel="fieldShow = false"
                  />
                </van-popup>
                <van-field
                  v-model="form.city"
                  :right-icon="fieldShow2 ? 'arrow-up' : 'arrow-down'"
                  readonly
                  :label="$t('myCenter[\'开户市\']')"
                  :placeholder="$t('myCenter[\'请选择所在开户市\']')"
                  @click="
                    cityList.filter((k) => {
                      return k.provinceId == form.provinceId;
                    }).length > 0
                      ? (fieldShow2 = true)
                      : ''
                  "
                />
                <van-popup v-model="fieldShow2" round position="bottom" lock-scroll>
                  <van-picker
                    :title="$t('myCenter[\'选择开户市\']')"
                    show-toolbar
                    value-key="cityName"
                    :columns="
                      cityList.filter((k) => {
                        return k.provinceId == form.provinceId;
                      })
                    "
                    @confirm="onConfirm2"
                    @cancel="fieldShow2 = false"
                  />
                </van-popup>
                <van-field
                  v-model="form.branchBankAddress"
                  :label="$t('myCenter[\'开户地址\']')"
                  :placeholder="$t('myCenter[\'请输入开户行地址\']')"
                />
                <van-field
                  :readonly="realName.length > 0"
                  v-model="form.realName"
                  :label="$t('myCenter[\'开户人姓名\']')"
                  :placeholder="$t('myCenter[\'请输入开户人姓名\']')"
                />
                <van-field
                  v-model="form.cardNo"
                  type="digit"
                  :label="$t('myCenter[\'银行卡号\']')"
                  :placeholder="$t('myCenter[\'请输入银行卡号\']')"
                />
                <van-field
                  v-model="form.cardNo2"
                  type="digit"
                  :label="$t('myCenter[\'确认卡号\']')"
                  :placeholder="$t('myCenter[\'请输入确认银行卡号\']')"
                />
                <van-field
                  type="password"
                  v-model="form.fundPwd"
                  label="安全密码"
                  placeholder="请输入安全密码"
                />
              </van-cell-group>
              <div class="but" @click="updateBankInfo">{{ $t("myCenter['确认添加']") }}</div>
            </div>
            <div v-show="showOpenNum == 3">
              <van-cell-group>
                <van-field
                  v-model="form.bankName"
                  readonly
                  :label="$t('myCenter[\'提现方式\']')"
                  :placeholder="$t('myCenter[\'请选择提现方式\']')"
                />
                <van-field
                  v-if="radio === 'BB'"
                  v-model="form.mainNetwork"
                  :right-icon="fieldShow3 ? 'arrow-up' : 'arrow-down'"
                  readonly
                  :label="$t('myCenter[\'选择主网\']')"
                  :placeholder="$t('myCenter[\'请选择主网\']')"
                  @click="fieldShow3 = true"
                />
                <van-popup v-model="fieldShow3" round position="bottom" lock-scroll>
                  <van-picker
                    :title="$t('myCenter[\'选择主网\']')"
                    show-toolbar
                    value-key="val"
                    :columns="mainNetworkList"
                    @confirm="onConfirm3"
                    @cancel="fieldShow3 = false"
                  />
                </van-popup>
                <van-field
                  :readonly="realName.length > 0"
                  v-model="form.realName"
                  :label="$t('myCenter[\'真实姓名\']')"
                  :placeholder="$t('myCenter[\'请输入真实姓名\']')"
                />
                <van-field
                  v-model="form.cardNo"
                  :label="$t('myCenter[\'账号\']')"
                  :placeholder="$t('myCenter[\'请输入账号\']')"
                />
                <van-field
                  v-model="form.cardNo2"
                  :label="$t('myCenter[\'确认账号\']')"
                  :placeholder="$t('myCenter[\'请输入确认账号\']')"
                />
                <van-field
                  type="password"
                  v-model="form.fundPwd"
                  :label="$t('myCenter[\'安全密码\']') + '：'"
                  :placeholder="$t('myCenter[\'请输入安全密码\']')"
                />
              </van-cell-group>
              <div class="but" @click="updateBankInfo">{{ $t("myCenter['确认添加']") }}</div>
            </div>
            <div v-show="showOpenNum == 4">
              <van-cell-group>
                <van-field
                  v-model="form.bankName"
                  readonly
                  :label="$t('myCenter[\'提现方式\']')"
                  :placeholder="$t('myCenter[\'请选择提现方式\']')"
                />
                <van-field
                  v-model="form.mainNetwork"
                  :right-icon="fieldShow3 ? 'arrow-up' : 'arrow-down'"
                  readonly
                  :label="$t('myCenter[\'选择主网\']')"
                  :placeholder="$t('myCenter[\'请选择主网\']')"
                  @click="fieldShow3 = true"
                />
                <van-popup v-model="fieldShow3" round position="bottom" lock-scroll>
                  <van-picker
                    :title="$t('myCenter[\'选择主网\']')"
                    show-toolbar
                    value-key="val"
                    :columns="mainNetworkList"
                    @confirm="onConfirm3"
                    @cancel="fieldShow3 = false"
                  />
                </van-popup>
                <van-field
                  :readonly="realName.length > 0"
                  v-model="form.realName"
                  :label="$t('myCenter[\'真实姓名\']')"
                  :placeholder="$t('myCenter[\'请输入真实姓名\']')"
                />
                <van-field
                  v-model="form.cardNo"
                  :label="$t('myCenter[\'账号\']')"
                  :placeholder="$t('myCenter[\'请输入账号\']')"
                />
                <van-field
                  v-model="form.cardNo2"
                  :label="$t('myCenter[\'确认账号\']')"
                  :placeholder="$t('myCenter[\'请输入确认账号\']')"
                />
                <van-field
                  type="password"
                  v-model="form.fundPwd"
                  label="安全密码"
                  placeholder="请输入安全密码"
                />
              </van-cell-group>
              <div class="but" @click="updateBankInfo">{{ $t("myCenter['确认添加']") }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!--    绑定银行卡成功后 弹窗-->
    <van-dialog
      :showConfirmButton="false"
      :showCancelButton="false"
      v-model="chenggongShow"
      :title="$t('myCenter[\'温馨提示\']')"
      :closeOnClickOverlay="true"
      show-cancel-button
      class="chenggongShowClass"
    >
      <div class="chenggongShow_body">{{ $t("myCenter['银行卡已绑定成功，是否立即去提现?']") }}</div>
      <div class="chenggongShow_btn flex-left flex-center">
        <div @click="chenggongShow = false">{{ $t("myCenter['否']") }}</div>
        <div @click="toPath('withdrawDeposit')">{{ $t("myCenter['是']") }}</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      chenggongShow: false,
      showOpenNum: 1,
      radio: "YHK",
      fieldShow: false,
      fieldShow1: false,
      fieldShow2: false,
      fieldShow3: false,

      showOpen: false,
      butshow: false,
      form: {},
      openBody: {
        type: null,
        open: false,
        title: "",
      },
      list: [],
      cityList: [],
      ProvinceList: [],
      allbankList: [],
      allbankList2: [],
      bankList: [],
      userVirtualCurrencyList: [],
      mainNetworkList: [{ val: "ETH" }, { val: "TRX" }, { val: "WAVES" }],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    realName() {
      return this.userInfo.realName || "";
    },
    value() {
      let num = 2;
      if (this.userInfo.hasFundPwd) {
        num += 1;
      }
      if (this.userInfo.phoneNo && this.userInfo.phoneNo != "") {
        num += 1;
      }
      if (this.userInfo.email && this.userInfo.email != "") {
        num += 1;
      }
      console.log(num);
      return num;
    },
    show() {
      return this.$route.query.redirect;
    },
    type() {
      return this.$route.query.type;
    },
  },
  created() {
    // 初始化 list 数组的多语言
    this.list = [
      {
        name: this.$t("myCenter['设置登录密码']"),
        val: "",
        type: 1,
        text: this.$t("myCenter['修改']"),
        title: this.$t("myCenter['修改登录密码']"),
        hint_text: "",
      },
      {
        name: this.$t("myCenter['设置安全密码']"),
        val: "",
        type: 2,
        text: this.$t("myCenter['未设置']"),
        title: this.$t("myCenter['设置安全密码']"),
      },
      {
        name: this.$t("myCenter['设置手机号']"),
        val: "",
        type: 3,
        text: this.$t("myCenter['未绑定']"),
        title: this.$t("myCenter['绑定密保手机']"),
      },
      {
        name: this.$t("myCenter['设置邮箱']"),
        val: "",
        type: 4,
        text: this.$t("myCenter['未绑定']"),
        title: this.$t("myCenter['绑定密保邮箱']"),
      },
      {
        name: this.$t("myCenter['银行卡管理']"),
        val: "",
        type: 5,
        text: this.$t("myCenter['未绑定']"),
        title: this.$t("myCenter['银行卡管理']"),
      },
    ];
    this.getProvinceList();
    this.getcityList();
    this.setAllBankList();
    this.getInfo();
    this.getUserBankList();
    // this.getUserVirtualCurrencyList();
  },
  mounted() {
    // if(this.type&&this.type=='phoneNo'){
    //   this.onOpen(this.list.filter(k=>{return k.type==3})[0])
    // }else if(this.type&&this.type=='email'){
    //   this.onOpen(this.list.filter(k=>{return k.type==4})[0])
    // }
  },
  methods: {
    ...mapActions(["getInfo"]),
    setshowOpenNum() {
      if (
        this.radio == "ZFB" ||
        this.radio == "WX" ||
        this.radio == "BB" ||
        this.radio == "GOPAY"
      ) {
        if (!this.realName) {
          this.$toast(this.$t("myCenter['请先绑定银行卡']"));
          return;
        }
        if (this.radio == "BB") {
          this.form.mainNetwork = this.form.mainNetwork || "ETH";
        }
        let obj =
          this.allbankList.filter((k) => {
            return k.bankCode == this.radio;
          })[0] || {};
        this.form.bankCode = obj.bankCode;
        this.form.bankName = obj.bankName;
        this.showOpenNum = 3;
      } else if (this.radio == "BA" || this.radio == "HB") {
        let obj =
          this.allbankList.filter((k) => {
            return k.bankCode == this.radio;
          })[0] || {};
        this.form.mainNetwork = "ETH";
        this.form.bankCode = obj.bankCode;
        this.form.bankName = obj.bankName;
        this.showOpenNum = 4;
      } else {
        this.radio = "YHK";
        this.allbankList2 = this.allbankList.filter((k) => {
          return (
            k.bankCode != "ZFB" &&
            k.bankCode != "WX" &&
            k.bankCode != "BB" &&
            k.bankCode != "GOPAY" &&
            k.bankCode != "BA" &&
            k.bankCode != "HB"
          );
        });
        this.showOpenNum = 2;
      }
      this.form.realName = this.form.realName || this.realName;
    },
    onConfirm(value, index) {
      this.form.province = value.provinceName;
      this.form.provinceId = value.id;
      this.fieldShow = false;
    },
    onConfirm1(value, index) {
      this.form.bankCode = value.bankCode;
      this.form.bankName = value.bankName;
      this.fieldShow1 = false;
    },
    onConfirm2(value, index) {
      this.form.city = value.cityName;
      this.fieldShow2 = false;
    },
    onConfirm3(value, index) {
      console.log(value);
      this.form.mainNetwork = value.val;
      this.fieldShow3 = false;
    },
    closePopup() {
      this.getInfo();
      if (this.openBody.type == 5) {
        this.getUserBankList();
      }
    },
    // 获取用户数字货币钱包列表
    getUserVirtualCurrencyList() {
      this.$ajax.post("/cashout/userVirtualCurrencyList").then((res) => {
        this.showOpen = true;
        this.userVirtualCurrencyList = res.data;
      });
    },
    //获取用户银行卡信息
    getUserBankList() {
      this.$ajax
        .post(`/user/center/userBankInfo`)
        .then((res) => {
          this.showOpen = true;
          this.bankList = res.data;
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //修改虚拟货币钱包
    changeVirtualCurrency(k) {
      this.butshow = true;
      k.userVirtualCurrencyId = k.id;
      this.showOpen = false;
      this.form = JSON.parse(JSON.stringify(k));
      console.log(this.form);
    },
    //修改银行卡
    changeUserBank(k) {
      this.butshow = true;
      k.userBankInfoId = k.id;
      k.cardNo2 = k.cardNo;
      this.showOpen = false;
      this.radio = k.bankCode;
      this.form = JSON.parse(JSON.stringify(k));
      this.setshowOpenNum();
      console.log(this.form);
    },
    // 新增或修改虚拟货币钱包
    updateVirtualCurrency() {
      if (this.butloading) {
        return;
      }
      let data = this.form;
      if (!data.currencyType || data.currencyType == "") {
        this.$toast(this.$t("myCenter['请填写货币类型']"));
        return;
      }
      if (!data.waletName || data.waletName == "") {
        this.$toast(this.$t("myCenter['请填写钱包名称']"));
        return;
      }
      if (!data.waletAddress || data.waletAddress == "") {
        this.$toast(this.$t("myCenter['请填写钱包地址']"));
        return;
      }
      if (!data.fundPwd || data.fundPwd == "") {
        this.$toast(this.$t("myCenter['请输入安全密码']"));
        return;
      }
      //修改
      if (this.butshow) {
        this.$ajax
          .post(`/user/center/editUserVirtualCurrency`, data)
          .then((res) => {
            this.$store.commit("SET_TISHI", this.$t("myCenter['修改成功']"));
            this.getUserVirtualCurrencyList();
          })
          .catch((error) => {
            this.$toast(error);
          })
          .finally(() => {
            this.butloading = false;
          });
      } else {
        this.$ajax
          .post(`/user/center/addUserVirtualCurrency`, data)
          .then((res) => {
            this.$store.commit("SET_TISHI", this.$t("myCenter['新增成功']"));
            this.getUserVirtualCurrencyList();
            this.getInfo();
          })
          .catch((error) => {
            this.$toast(error);
          })
          .finally(() => {
            this.butloading = false;
          });
      }
    },
    // 新增或修改银行卡
    updateBankInfo() {
      if (this.butloading) {
        return;
      }
      let data = this.form;
      if (this.showOpenNum == 2) {
        if (!data.bankName || data.bankName == "") {
          this.$toast(this.$t("myCenter['请选择银行']"));
          return;
        }
        if (!data.province || data.province == "") {
          this.$toast(this.$t("myCenter['请选择开户省']"));
          return;
        }
        if (!data.city || data.city == "") {
          this.$toast(this.$t("myCenter['请选择开户市']"));
          return;
        }
        if (!data.branchBankAddress || data.branchBankAddress == "") {
          this.$toast(this.$t("myCenter['请填写开户行地址']"));
          return;
        }
        if (!data.realName || data.realName == "") {
          this.$toast(this.$t("myCenter['请填写开户人姓名']"));
          return;
        }
        if (!data.cardNo || data.cardNo == "") {
          this.$toast(this.$t("myCenter['请填写银行卡号码']"));
          return;
        }
        if (!data.cardNo2 || data.cardNo2 == "") {
          this.$toast(this.$t("myCenter['请填写确认银行卡号码']"));
          return;
        }
        if (data.cardNo != data.cardNo2) {
          this.$toast(this.$t("myCenter['两次银行卡号码必须一致']"));
          return;
        }
        if (!data.fundPwd || data.fundPwd == "") {
          this.$toast(this.$t("myCenter['请输入安全密码']"));
          return;
        }
      } else if (this.showOpenNum == 3) {
        if (!data.bankName || data.bankName == "") {
          this.$toast(this.$t("myCenter['请选择提现类型']"));
          return;
        }
        if (!data.realName || data.realName == "") {
          this.$toast(this.$t("myCenter['请填写真实姓名']"));
          return;
        }
        if (!data.cardNo || data.cardNo == "") {
          this.$toast(this.$t("myCenter['请填写卡号']"));
          return;
        }
        if (!data.cardNo2 || data.cardNo2 == "") {
          this.$toast(this.$t("myCenter['请填写确认卡号']"));
          return;
        }
        if (data.cardNo != data.cardNo2) {
          this.$toast(this.$t("myCenter['两次卡号必须一致']"));
          return;
        }
        if (!data.fundPwd || data.fundPwd == "") {
          this.$toast(this.$t("myCenter['请输入安全密码']"));
          return;
        }
      } else if (this.showOpenNum == 4) {
        if (!data.bankName || data.bankName == "") {
          this.$toast(this.$t("myCenter['请选择提现类型']"));
          return;
        }
        if (!data.realName || data.realName == "") {
          this.$toast(this.$t("myCenter['请填写真实姓名']"));
          return;
        }
        if (!data.cardNo || data.cardNo == "") {
          this.$toast(this.$t("myCenter['请填写卡号']"));
          return;
        }
        if (!data.cardNo2 || data.cardNo2 == "") {
          this.$toast(this.$t("myCenter['请填写确认卡号']"));
          return;
        }
        if (data.cardNo != data.cardNo2) {
          this.$toast(this.$t("myCenter['两次卡号必须一致']"));
          return;
        }
        if (!data.fundPwd || data.fundPwd == "") {
          this.$toast(this.$t("myCenter['请输入安全密码']"));
          return;
        }
      }
      this.butloading = true;
      //修改
      if (this.butshow) {
        this.$ajax
          .post(`/user/center/editUserBankInfo`, data)
          .then((res) => {
            this.form = {};
            this.showOpen = true;
            this.showOpenNum = 1;
            this.getUserBankList();
            this.chenggongShow = true;
          })
          .catch((error) => {
            this.$toast(error);
          })
          .finally(() => {
            this.butloading = false;
          });
      } else {
        this.$ajax
          .post(`/user/center/addUserBankInfo`, data)
          .then((res) => {
            this.form = {};
            this.showOpen = true;
            this.showOpenNum = 1;
            this.getUserBankList();
            this.chenggongShow = true;
          })
          .catch((error) => {
            this.$toast(error);
          })
          .finally(() => {
            this.butloading = false;
          });
      }
    },
    getProvinceList() {
      this.$ajax
        .post(`/list/province`)
        .then((res) => {
          this.ProvinceList = res.data || [];
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    getcityList() {
      this.$ajax
        .post(`/list/city`)
        .then((res) => {
          this.cityList = res.data || [];
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    setAllBankList() {
      this.$ajax
        .post(`/list/bank`)
        .then((res) => {
          this.allbankList2 = [...(res.data || [])];
          this.allbankList = [...(res.data || [])];
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //提交手机号
    updatePhoneNo() {
      if (!this.form.phoneNo || this.form.phoneNo == "") {
        this.$toast(this.$t("myCenter['手机号不能为空']"));
        return;
      }
      if (this.form.phoneNo.length != 11) {
        this.$toast(this.$t("myCenter['请输入11位手机号码']"));
        return;
      }
      if (!this.form.fundPwd || this.form.fundPwd == "") {
        this.$toast(this.$t("myCenter['安全密码不能为空']"));
        return;
      }

      this.$ajax
        .post(
          `/user/center/updatePhoneNo?phoneNo=${this.form.phoneNo}&fundPwd=${this.form.fundPwd}`
        )
        .then((res) => {
          this.openBody.open = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['提交成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //提交邮箱
    updateEmail() {
      if (!this.form.email || this.form.email == "") {
        this.$toast(this.$t("myCenter['邮箱地址不能为空']"));
        return;
      }
      var myreg =
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!myreg.test(this.form.email)) {
        this.$toast(this.$t("myCenter['请输入正确的邮箱地址']"));
        return;
      }
      if (!this.form.fundPwd || this.form.fundPwd == "") {
        this.$toast(this.$t("myCenter['安全密码不能为空']"));
        return;
      }

      this.$ajax
        .post(
          `/user/center/updateEmail?email=${this.form.email}&fundPwd=${this.form.fundPwd}`
        )
        .then((res) => {
          this.openBody.open = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['提交成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //提交修改登录密码
    updateLoginPwd() {
      if (!this.form.oldLoginPwd || this.form.oldLoginPwd == "") {
        this.$toast(this.$t("myCenter['原登录密码不能为空']"));
        return;
      }
      if (!this.form.loginPwd || this.form.loginPwd == "") {
        this.$toast(this.$t("myCenter['新登录密码不能为空']"));
        return;
      }
      if (!this.form.loginPwd2 || this.form.loginPwd2 == "") {
        this.$toast(this.$t("myCenter['确认登录密码不能为空']"));
        return;
      }
      if (this.form.loginPwd != this.form.loginPwd2) {
        this.$toast(this.$t("myCenter['两次登录密码必须一致']"));
        return;
      }

      this.$ajax
        .post(
          `/user/center/updateLoginPwd?oldLoginPwd=${this.form.oldLoginPwd}&loginPwd=${this.form.loginPwd}`
        )
        .then((res) => {
          this.openBody.open = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['提交成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    //提交安全密码
    fundPwdSubmit() {
      if (!this.form.fundPwd || this.form.fundPwd == "") {
        this.$toast(this.$t("myCenter['安全密码不能为空']"));
        return;
      }
      if (!this.form.fundPwd2 || this.form.fundPwd2 == "") {
        this.$toast(this.$t("myCenter['确认安全密码不能为空']"));
        return;
      }
      if (this.form.fundPwd != this.form.fundPwd2) {
        this.$toast(this.$t("myCenter['两次安全密码必须一致']"));
        return;
      }
      if (this.form.hasFundPwd) {
        if (!this.form.oldFundPwd || this.form.oldFundPwd == "") {
          this.$toast(this.$t("myCenter['原安全密码不能为空']"));
          return;
        }
        this.updateFundPwd();
      } else {
        if (!this.form.loginPwd || this.form.loginPwd == "") {
          this.$toast(this.$t("myCenter['登录密码不能为空']"));
          return;
        }
        this.setFundPwd();
      }
    },
    updateFundPwd() {
      this.$ajax
        .post(
          `/user/center/updateFundPwd?oldFundPwd=${this.form.oldFundPwd}&fundPwd=${this.form.fundPwd}`
        )
        .then((res) => {
          this.openBody.open = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['提交成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    setFundPwd() {
      this.$ajax
        .post(
          `/user/center/setFundPwd?loginPwd=${this.form.loginPwd}&fundPwd=${this.form.fundPwd}`
        )
        .then((res) => {
          this.openBody.open = false;
          this.$store.commit("SET_TISHI", this.$t("myCenter['提交成功']"));
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    onOpen(obj) {
      if (obj.type == 3 || obj.type == 4 || obj.type == 5 || obj.type == 6) {
        if (!this.userInfo.hasFundPwd) {
          this.$toast(this.$t("myCenter['您还未设置安全密码，请先设置安全密码']"));
          return;
        }
      }
      this.butloading = false;
      this.form = Object.assign({}, this.userInfo);
      this.openBody.type = obj.type;
      this.openBody.title = obj.title;
      this.openBody.open = true;
    },
    onQuit() {
      if (this.showOpen == false) {
        this.showOpen = true;
      }
      this.openBody.open = false;
    },
    setText(k) {
      if (k.type == 3) {
        if (this.userInfo.phoneNo && this.userInfo.phoneNo != "") {
          return this.userInfo.phoneNo;
        }
      } else if (k.type == 4) {
        if (this.userInfo.email && this.userInfo.email != "") {
          return this.userInfo.email;
        }
      } else if (k.type == 2) {
        if (this.userInfo.hasFundPwd) {
          return "修改";
        }
      } else if (k.type == 5 && this.bankList.length) {
        return "修改";
      } else if (k.type == 6 && this.userVirtualCurrencyList.length) {
        return "修改";
      }
      return k.text;
    },
    to() {
      this.$router.push({ path: "/MyCenter" });
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.Security {
  .Security_top {
    background: -webkit-linear-gradient(top, #4b4f6f, #2e304c);
    text-align: center;
    height: 150px;
    box-sizing: border-box;
    .text {
      height: 60px;
      line-height: 70px;
      font-size: 16.25px;
      color: #7f83af;
      div {
        margin: 0 8.12695px;
      }
      span {
        width: 36.1146px;
        vertical-align: super;
        background: #7f83af;
        height: 1px;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
    }
    .text2 {
      height: 40px;
      color: #878996;
      font-size: 15.2312px;
      ._xian {
        margin: 0 5px;
      }
    }
  }
  .Security_body {
    margin-top: 13px;
    background-color: #fff;
    .van-cell {
      border-bottom: 1px solid #d0d0d050;
      padding: 13.7px 8.75px;
      margin: 0 10px;
      width: calc(100% - 20px);
      .van-cell__title {
        font-size: 17.4px;
      }
      .van-cell__value {
        font-size: 17.4px;
        color: #ccc;
      }
      .van-icon {
        font-size: 17.4071px;
        color: #ccc;
        margin: 0;
      }
    }
  }
  // 绑定银行卡成功后 弹窗
  .chenggongShowClass {
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
      border-bottom: 1px solid #d0d0d080;
      color: #000;
    }
    .chenggongShow_body {
      padding: 10px 20px;
      text-align: left;
      word-break: break-all;
      line-height: 22px;
      font-size: 14px;
      color: #000;
    }
    .chenggongShow_btn {
      border-top: 1px solid #d0d0d0;
      background-color: #f2f2f2;
      text-align: center;
      font-size: 14px;
      box-sizing: border-box;
      div {
        width: 50%;
        box-sizing: border-box;
        height: 50.67px;
        line-height: 50.67px;
      }
      div:first-child {
        border-right: 1px solid #d0d0d0;
      }
      div:last-child {
        color: #40affe;
      }
    }
  }
  /*弹窗*/
  .openBody {
    height: 100%;
    background: #efeef4;
    .inputBox {
      margin-top: 15px;
      .radio_text {
        padding: 15px 0 5px;
        font-size: 17.4071px;
        color: #000;
      }
      .radio_box {
        padding: 10px 20px;
        .van-radio {
          margin-bottom: 8px;
        }
      }
      .but {
        width: 337.5px;
        height: 43.5104px;
        margin: 21.7589px auto 0;
        line-height: 43.5104px;
        text-align: center;
        clear: both;
        background: -webkit-linear-gradient(
          bottom,
          #dc3b40 2%,
          #dc3b40 50%,
          #db3b40 51%,
          #d7363b
        );
        font-size: 19.583px;
        color: #fff;
        border-radius: 4.35178px;
      }
      .van-cell-group {
        .van-cell {
          padding: 0;
          border-top: 0.5px solid #d0d0d0;
          backface-visibility: hidden;
          box-sizing: border-box;
          height: 43.51px;
          line-height: 43.51px;
          .van-field__label {
            width: 28%;
            text-indent: 8.70356px;
            padding: 0;
            font-size: 17.4071px;
            color: #000;
          }
          .van-field__control {
            font-size: 17.4071px;
          }
          .van-field__right-icon {
            padding-right: 20px;
            i {
              font-size: 17.4071px;
              color: #969799;
            }
          }
        }
      }
      .inputBox_text {
        padding: 10px 30px;
        text-align: center;
        color: #999;
        font-size: 12px;
      }
    }
    .bankBox {
      ._row {
        height: 65.2708px;
        padding: 10.8795px 0;
        box-sizing: border-box;
        background: #fff;
        border-top: 1px solid #d0d0d0;
        backface-visibility: hidden;
        position: relative;
        img {
          width: 43.5104px;
          height: 43.5104px;
          border-radius: 4.35178px;
          margin-left: 18.75px;
          margin-right: 11.7188px;
        }
        .bankNameClass {
          div:first-child {
            font-size: 17.4071px;
            letter-spacing: 0.870356px;
            color: #000;
          }
          div:last-child {
            font-size: 15.2312px;
            color: #686868;
          }
        }
        .xiugai_but {
          position: absolute;
          right: 11.719px;
          margin-right: 11.719px;
          top: 50%;
          transform: translateY(-50%);
          color: #dc2e2e;
          font-size: 19.583px;
        }
      }
    }
  }
}
</style>
