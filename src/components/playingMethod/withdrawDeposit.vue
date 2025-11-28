<template>
  <div class="withdrawDeposit">
    <div v-show="showType">
      <titleBar
        title_name="选择提款方式"
        class="titleBar"
        left_icon="arrow-left"
        @toLeft="to"
      />
      <div class="xuanzheBody" v-if="freeze !== '1'">
        <div
          class="xuanzheBody-row flex-left flex-center"
          @click="changeTabs(1)"
        >
          <img src="../../assets/首页/unionPay.png" />
          <div class="row-box">
            <div>公司提款</div>
            <div>支持大额转账</div>
          </div>
          <van-icon name="arrow" />
        </div>
        <div
          class="xuanzheBody-row flex-left flex-center"
          @click="changeTabs(2)"
        >
          <img src="../../assets/首页/xnhb.png" />
          <div class="row-box">
            <div>数字币提款</div>
            <div>支持大额转账</div>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div v-show="!showType">
      <titleBar
        :title_name="active == 1 ? '公司提款' : active == 2 ? '数字币提款' : ''"
        class="titleBar"
        @toLeft="showType = true"
        left_icon="arrow-left"
        right_icon="balance-list-o"
        @toRight="toPath('tradingRecord')"
      />
      <div class="withdrawDeposit_body" v-show="active == 1">
        <div class="inputBox">
          <van-cell-group>
            <van-field
              disabled
              v-model="cashoutUserInfo.fundAmount"
              label="账户余额"
              class="text_1"
            />
            <van-field
              disabled
              v-model="cashoutUserInfo.withdrawalAmount"
              label="可提金额"
              class="text_1"
            />
            <van-field
              readonly
              :right-icon="showPicker2 ? 'arrow-up' : 'arrow-down'"
              v-model="cashoutUserInfo.cardNo"
              label="提现账户"
              @click="showPicker2 = true"
            />
            <van-popup v-model="showPicker2" position="bottom" lock-scroll>
              <van-picker
                value-key="cardNo2"
                title="提现账户"
                show-toolbar
                :columns="userBankInfoList"
                @confirm="onConfirm2"
                @cancel="showPicker2 = false"
              />
            </van-popup>
            <van-field
              @input="setAmount2"
              v-model="cashoutUserInfo.amount"
              type="number"
              label="提款金额"
              placeholder="请输入您要提现的金额"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              disabled
              v-model="
                cashoutUserInfo.amount >=
                  cashoutUserInfo.greaterThanEqualAmount &&
                cashoutUserInfo.greaterThanEqualAmount > 0 &&
                cashoutUserInfo.thanServiceChargeRate > 0
                  ? cashoutUserInfo.thanServiceChargeRate
                  : cashoutUserInfo.currentServiceChargeRate
              "
              label="手续费(%)"
              class="text_1"
            >
              <template #button>
                <span
                  v-if="
                    cashoutUserInfo.amount2 > 0 && cashoutUserInfo.amount > 0
                  "
                >
                  手续费{{
                    (cashoutUserInfo.amount - cashoutUserInfo.amount2).toFixed(
                      2
                    )
                  }}元
                </span>
                <span v-else> 手续费{{ 0 }}元 </span>
              </template>
            </van-field>
            <van-field
              disabled
              v-model="cashoutUserInfo.amount2"
              label="到账金额"
              placeholder="0"
              class="text_1"
            />
            <div class="mixWaletAddress flex-left flex-center">
              <div class="_text">收款图片</div>
              <van-uploader
                :after-read="afterRead"
                @delete="ondelete"
                v-model="fileList"
                multiple
                :max-count="2"
                :before-read="beforeRead" 
              />
            </div>
            <van-field
              v-model="cashoutUserInfo.fundPwd"
              type="password"
              label="安全密码"
              placeholder="请输入安全密码"
            />
          </van-cell-group>
        </div>
        <div class="bottomBox">
          <van-button
            type="primary"
            @click="submit()"
            :loading="butloading"
            block
            >确定</van-button
          >
        </div>
        <div data-v-5611415d="" class="tips-security">
          <div v-html="cashoutUserInfo.remark"></div>
        </div>
      </div>
      <div class="withdrawDeposit_body" v-show="active == 2">
        <div class="inputBox">
          <van-cell-group>
            <van-field
              disabled
              v-model="userVirtualCurrencyInfo.fundAmount"
              label="账户余额"
              class="text_1"
            />
            <van-field
              disabled
              v-model="userVirtualCurrencyInfo.withdrawalAmount"
              label="可提金额"
              class="text_1"
            />
            <van-field
              readonly
              :right-icon="showPicker ? 'arrow-up' : 'arrow-down'"
              v-model="userVirtualCurrencyInfo.cardNo"
              label="提现账户"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom" lock-scroll>
              <van-picker
                value-key="cardNo2"
                title="提现账户"
                show-toolbar
                :columns="userVirtualCurrencyList"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
            <van-field
              @input="setAmount"
              v-model="userVirtualCurrencyInfo.amount"
              type="number"
              label="提款金额"
              placeholder="请输入您的提现金额"
            />
            <van-field
              class="text_1"
              disabled
              v-model="userVirtualCurrencyInfo.virtualCurrencyRate"
              label="汇率"
            />
            <van-field
              class="text_1"
              disabled
              v-model="userVirtualCurrencyInfo.amount2"
              label="货币数量"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              v-model="userVirtualCurrencyInfo.fundPwd"
              type="password"
              label="安全密码"
              placeholder="请输入安全密码"
            />
          </van-cell-group>
          <!-- <div class="inputBox_text">
            <div
              style="text-align: left; text-indent: 2em; font-weight: bolder"
            >
              温情提示：
            </div>
            <div v-html="userVirtualCurrencyInfo.remark"></div>
          </div> -->
        </div>
        <div class="bottomBox">
          <van-button
            type="primary"
            @click="submitByVirtualCurrency()"
            :loading="butloading"
            block
            >确定</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Compressorjs from "compressorjs";
import lrz from 'lrz';
export default {
  data() {
    return {
      fileList: [],
      newFileList: [],
      showPicker: false,
      showPicker2: false,
      userVirtualCurrencyList: [],
      active: 0,
      showType: true,
      userBankInfoList: [],
      userVirtualCurrencyInfo: {
        amount2: 0,
      },
      cashoutUserInfo: {
        amount2: 0,
      },
      butloading: false,
      allArr: [],
      freeze: '1'
    };
  },
  created() {
    this.getStatus();
    this.getUserBankInfoList();
  },
  methods: {
    getStatus() {
      this.$ajax
        .post("/cashout/status")
        .then((res) => {
          this.freeze = res.data || false;
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    // 返回布尔值
    beforeRead(file) {
      if (file.type.indexOf('image') == -1) {
        this.$toast('请上传正常格式的图片');
        return false;
      }
      return true;
    },
    // 删除回调
    ondelete(file,data){
      this.newFileList.splice(data.index, 1);
    },
    afterRead(file) {
      let quality = 1;
      if (file.file.size < 400 * 1000) {
        //小于400k
        quality = 0.5;
      } else if (file.file.size < 5000 * 1000) {
        //小于5M
        quality = 0.5;
      } else {
        quality = 0.2;
      }
      if(quality === 1){
        this.newFileList.push(file.content)
      }else{
        lrz(file.content,{
          width: 600, // 目标宽度
          height: null, // 保持比例自动计算高度
          quality: quality, // 压缩质量 (0 - 1)
        }).then((res) => {
          const compressedBase64Str = res.base64;
          this.newFileList.push(compressedBase64Str)
        });
      }
    },
    onConfirm2(data) {
      this.showPicker2 = false;
      this.onChange(data.id);
    },
    onConfirm(data) {
      this.showPicker = false;
      this.onChange(data.id);
    },
    setAmount(val) {
      this.userVirtualCurrencyInfo.amount2 =
        Math.floor(
          (val / this.userVirtualCurrencyInfo.virtualCurrencyRate) * 100
        ) / 100;
    },
    changeTabs(active) {
      if(this.freeze === '1'){
        this.$toast("操作过快，请稍后再试。");
        return;
      }else if(this.freeze){
        this.$toast("不是正常状态，不能提现。");
        return
      }
      if (active == 1 && this.userBankInfoList.length == 0) {
        this.$toast("您还未绑定银行卡");
        this.$router.push({ path: "/Security" });
      } else if (active == 2 && this.userVirtualCurrencyList.length == 0) {
        this.$toast("您还未绑定数字货币钱包");
        this.$router.push({ path: "/Security" });
      }
      this.active = active;
      this.showType = false;
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
          redirect2: this.$route.query.redirect,
        },
      });
    },
    // 获取用户银行卡列表
    getUserBankInfoList() {
      this.$store.state.loading = true;
      this.$ajax
        .post("/cashout/userBankInfoList")
        .then((res) => {
          for (let k of res.data) {
            k.cardNo2 = `${k.bankName}：${k.cardNo}`;
          }
          this.allArr = res.data;
          this.userBankInfoList = res.data.filter((k) => {
            return (
              k.bankCode != "BB" && k.bankCode != "BA" && k.bankCode != "HB"
            );
          });
          this.userVirtualCurrencyList = res.data.filter((k) => {
            return (
              k.bankCode === "BB" || k.bankCode === "BA" || k.bankCode === "HB"
            );
          });
          if (this.userBankInfoList.length > 0) {
            let obj = this.userBankInfoList[0];
            this.getConfigList(obj.id, 1);
          }
          if (this.userVirtualCurrencyList.length > 0) {
            let obj = this.userVirtualCurrencyList[0];
            this.getConfigList(obj.id, 2);
          }
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    //出款用户信息,银行卡
    getConfigList(id, type) {
      this.$store.state.loading = true;
      this.$ajax
        .post(`/cashout/userBankInfo?userBankInfoId=${id}`)
        .then((res) => {
          if (res.data) {
            res.data.amount2 = 0;
            res.data.remark = res.data.remark.replace(/\n/g, "<br>");
            // console.log(res.data.remark);
            if (type == 1) {
              this.cashoutUserInfo = res.data;
            } else if (type == 2) {
              this.userVirtualCurrencyInfo = res.data;
            }
          }
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    onChange(id) {
      // 银行卡
      if (this.active == 1) {
        this.getConfigList(id, 1);
        // 虚拟币
      } else if (this.active == 2) {
        this.getConfigList(id, 2);
      }
    },
    to() {
      this.$router.push({
        path: this.$route.query.redirect,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    setAmount2(val) {
      if (
        this.cashoutUserInfo.greaterThanEqualAmount > 0 &&
        val >= this.cashoutUserInfo.greaterThanEqualAmount
      ) {
        if (!val || val == "") {
          this.cashoutUserInfo.amount2 = 0;
        } else {
          this.cashoutUserInfo.amount2 = (
            parseFloat(val) -
            (this.cashoutUserInfo.thanServiceChargeRate * val) / 100
          ).toFixed(2);
        }
      } else {
        if (!val || val == "") {
          this.cashoutUserInfo.amount2 = 0;
        } else {
          this.cashoutUserInfo.amount2 = (
            parseFloat(val) -
            (this.cashoutUserInfo.currentServiceChargeRate * val) / 100
          ).toFixed(2);
          if (
            this.cashoutUserInfo.serviceChargeMaxLimit > 0 &&
            this.cashoutUserInfo.amount - this.cashoutUserInfo.amount2 >=
              this.cashoutUserInfo.serviceChargeMaxLimit
          ) {
            this.cashoutUserInfo.amount2 =
              parseFloat(val) - this.cashoutUserInfo.serviceChargeMaxLimit;
          }
        }
      }
    },
    // 银行卡
    submit() {
      if (this.butloading) {
        return;
      }
      let data = this.cashoutUserInfo;
      let payment = '';
      // console.log(data);
      if (!data.userBankInfoId || data.userBankInfoId == "") {
        this.$toast("请选择提款银行卡");
        return;
      }
      if (!data.amount || data.amount == "" || data.amount == 0) {
        this.$toast("请填写提款金额");
        return;
      }
      if (!data.fundPwd || data.fundPwd == "") {
        this.$toast("请输入安全密码");
        return;
      }
      if (this.newFileList.length == 0) {
        this.$toast("请上传收款图片");
        return;
      }
      if(this.newFileList.length>0){
        payment = this.newFileList.join("aaa===aaa===aaa");
      }
      this.$dialog
        .confirm({
          title: "确认提款",
          message: `是否确认提款?`,
        })
        .then(() => {
          this.butloading = true;
          this.$ajax
            .post(`/cashout/submitByBank`, {
              amount: data.amount,
              fundPwd: data.fundPwd,
              userBankInfoId: data.userBankInfoId,
              payment: payment,
            })
            .then((res) => {
              this.$store.commit("SET_TISHI", `提交成功`);
              this.to();
            })
            .catch((error) => {
              this.$toast(error);
            })
            .finally(() => {
              setTimeout(() => {
                this.butloading = false;
              }, 1000);
            });
        })
    },
    // 虚拟币
    submitByVirtualCurrency() {
      if (this.butloading) {
        return;
      }
      let data = this.userVirtualCurrencyInfo;
      // console.log(data);
      if (!data.userBankInfoId || data.userBankInfoId == "") {
        this.$toast("请选择数字货币钱包");
        return;
      }
      if (!data.amount || data.amount == "" || data.amount == 0) {
        this.$toast("请填写提款金额");
        return;
      }
      if (!data.fundPwd || data.fundPwd == "") {
        this.$toast("请输入安全密码");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认提款",
          message: `是否确认提款?`,
        })
        .then(() => {
          this.butloading = true;
          this.$ajax
            .post(`/cashout/submitByVirtualCurrency`, {
              amount: data.amount,
              fundPwd: data.fundPwd,
              userVirtualCurrencyId: data.userBankInfoId,
            })
            .then((res) => {
              this.$store.commit("SET_TISHI", `提交成功`);
              this.to();
            })
            .catch((error) => {
              this.$toast(error);
            })
            .finally(() => {
              setTimeout(() => {
                this.butloading = false;
              }, 1000);
            });
        })
    },
  },
};
</script>

<style lang="scss">
.withdrawDeposit {
  .titleBar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .xuanzheBody {
    padding-top: 13px;
    .xuanzheBody-row {
      margin-bottom: 13px;
      height: 65px;
      box-sizing: border-box;
      padding: 10px 0;
      background: #fff;
      border-top: #efeef4 1px solid;
      border-bottom: 1px solid #efeef4;
      img {
        height: 43.5px;
        width: 54.5px;
        margin: 0 12px 0 18px;
      }
      .row-box {
        width: 250px;
        div:first-child {
        }
        div:last-child {
        }
      }
    }
  }
  .withdrawDeposit_body {
    .inputBox {
      margin-top: 15px;
      position: relative;
      background-color: #fff;
      border: 1px solid #eee;
      .van-cell-group {
        background: none;
        .van-cell {
          padding-left: 5px;
          padding-right: 5px;
          background: none;
          border-bottom: 1px solid #d0d0d0;
          .van-field__control {
            font-size: 17.4px;
          }
          .van-cell__title {
            width: 105px !important;
            font-size: 17.4px;
          }
          .van-field__label {
            width: 100px;
            padding: 0;
          }
        }
        .text_1 {
          .van-field__control {
            color: #f46e00 !important;
          }
        }
      }
      .inputBox_text {
        padding: 10px 0;
        color: #999;
        font-size: 12px;
        position: relative;
        color: red;
        line-height: 18px;
        div {
          padding: 0 40px;
        }
        div:first-child {
          padding: 0;
        }
      }
      .mixWaletAddress {
        padding: 10px 5px;
        font-size: 18px;
        border-bottom: 1px solid #d0d0d0;
        ._text {
          width: 101.25px;
        }
        .van-uploader {
          .van-uploader__preview {
          }
          .van-uploader__upload {
            margin-bottom: 0;
          }
        }
      }
    }
    .bankBox {
      padding: 10px 10px 0 10px;
      .bankBox_title {
        font-size: 14.5px;
        font-weight: bold;
      }
      .tjyhk-but {
        height: 120px;
        text-align: center;
        position: relative;
        div {
          padding: 5px 10px;
          background: linear-gradient(#d83442, #c62c41, #b82541);
          height: 30px;
          line-height: 30px;
          color: #fff;
          width: 60%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 5px;
        }
      }
      .tab_bankBox {
        width: 80%;
        margin: 8px auto 0px;
        height: 120px;
        /*border: 3px solid #D5BA9E;*/
        /*border-radius: 10px;*/
        padding: 20px 25px;
        background-size: 100% 100% !important;
        color: white;
        .tab_bankBox_top {
          .icon {
            margin: 0 10px 0 0px;
          }
          .text {
            font-weight: bold;
            font-size: 14px;
          }
        }
        .bankNum {
          line-height: 30px;
          font-weight: bold;
        }
        .name {
          line-height: 40px;
        }
      }
      .van-swipe__indicator {
        background-color: #666;
      }
      .van-swipe__indicator--active {
        background-color: #1989fa;
      }
      .van-swipe__indicators {
        bottom: 15px;
      }
    }
    .bottomBox {
      width: 90%;
      margin: 20px auto 0;
      .van-button {
        color: rgb(255, 255, 255);
        /*background: linear-gradient(to left, #D4B89B, #e3d5c8);*/
        background-color: #dc3b40;
        border: 0px;
        font-size: 19.583px;
      }
    }
  }
}
</style>
