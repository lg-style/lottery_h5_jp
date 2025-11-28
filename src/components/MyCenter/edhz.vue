<template>
  <div class="edhz">
    <titleBar
      :title_name="$t('myCenter[\'额度划转\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
    />
    <div class="edhz-inputBox">
      <div class="edhz-row flex-left flex-center">
        <div class="label">{{ $t("myCenter['我的钱包']") }}</div>
        <div class="num">{{ amount.accountMoney }}</div>
      </div>
      <div
        class="edhz-row flex-left flex-center"
        v-for="(k, i) in gameList2"
        :key="i"
      >
        <div class="label">{{ k.platformName }}</div>
        <div class="num">{{ k.amount }}</div>
      </div>
      <div class="edhz-row flex-left flex-center">
        <div class="label">{{ $t("myCenter['转出平台']") }}</div>
        <div>
          <van-field
            v-model="form.platformNameTo"
            :right-icon="show1 ? 'arrow-up' : 'arrow-down'"
            readonly
            :placeholder="$t('myCenter[\'请选择平台\']')"
            @click="show1 = true"
          />
          <van-popup v-model="show1" round position="bottom" lock-scroll>
            <van-picker
              :title="$t('myCenter[\'选择平台\']')"
              show-toolbar
              value-key="platformName"
              :columns="gameList"
              @confirm="onConfirm1"
              @cancel="show1 = false"
            />
          </van-popup>
        </div>
      </div>
      <div class="edhz-row flex-left flex-center">
        <div class="label">{{ $t("myCenter['转入平台']") }}</div>
        <div>
          <div>
            <van-field
              v-model="form.platformNameOut"
              :right-icon="show2 ? 'arrow-up' : 'arrow-down'"
              readonly
              :placeholder="$t('myCenter[\'请选择平台\']')"
              @click="show2 = true"
            />
            <van-popup v-model="show2" round position="bottom" lock-scroll>
            <van-picker
              :title="$t('myCenter[\'选择平台\']')"
              show-toolbar
              value-key="platformName"
              :columns="gameList"
              @confirm="onConfirm2"
              @cancel="show2 = false"
            />
            </van-popup>
          </div>
        </div>
      </div>
      <div class="edhz-row flex-left flex-center">
        <div class="label">{{ $t("myCenter['划转金额']") }}</div>
        <div>
          <van-field
            label-align="right"
            v-model="form.amount"
            type="number"
            :placeholder="$t('myCenter[\'请输入划转金额\']')"
          />
        </div>
      </div>
    </div>
    <div class="but" @click="submit" v-if="loading">{{ $t("myCenter['确认划转']") }}</div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      loading: false,
      show1: false,
      show2: false,
      form: {
        amount: null,
        platformIdTo: 0,
        platformNameTo: "",
        platformIdOut: 0,
        platformNameOut: "",
      },
      gameList: [],
      gameList2: [],
    };
  },
  computed: {
    ...mapState(["amount", "userInfo"]),
  },
  created() {
    this.form.platformNameTo = this.$t("myCenter['我的钱包']");
    this.form.platformNameOut = this.$t("myCenter['我的钱包']");
    this.getStatus();
    this.searchAllAmount();
  },
  methods: {
    ...mapActions(["onrefreshLoad"]),
    getStatus() {
      this.loading = false;
      this.$ajax
        .post("/cashout/status")
        .then((res) => {
          if(res.data){
            this.$toast(this.$t("myCenter['不是正常状态，不能划转']"));
            this.$router.push({ path: "/MyCenter" });
          }else {
            this.loading = true;
          }
        })
        .catch((error) => {
          this.$toast(error);
        })
    },
    searchAllAmount() {
      this.$ajax.post(`/channel/searchAllAmount`).then((res) => {
        let obj = [
          {
            platformId: 0,
            platformName: this.$t("myCenter['我的钱包']"),
          },
        ];
        this.gameList = [...obj, ...(res.data || [])];
        this.gameList2 = res.data || [];
      });
    },
    onConfirm1(value, index) {
      this.form.platformIdTo = value.platformId;
      this.form.platformNameTo = value.platformName;
      this.show1 = false;
    },
    onConfirm2(value, index) {
      this.form.platformIdOut = value.platformId;
      this.form.platformNameOut = value.platformName;
      this.show2 = false;
    },
    //提交
    submit() {
      let data = this.form;
      console.log(data);
      if ((data.platformIdTo == data.platformIdOut) || (data.platformIdTo !=0 && data.platformIdOut != 0)) {
        this.$toast(this.$t("myCenter['平台选择有误']"));
        return;
      }
      if (!data.amount) {
        this.$toast(this.$t("myCenter['请填写划转金额']"));
        return;
      }
      if(data.platformIdTo == 0){
        this.amountTransferInto();
      }else if(data.platformIdOut == 0){
        this.amountTransferOut();
      }
    },
    // 转出
    amountTransferOut() {
      this.$dialog
        .confirm({
          title: this.$t("myCenter['确认转出']"),
          message: `${this.$t("myCenter['从']")} ${this.form.platformNameTo} ${this.$t("myCenter['转出']")} ${this.form.amount} ${this.$t("myCenter['到']")} ${this.$t("myCenter['我的钱包']")}`,
        })
        .then(() => {
          this.$store.state.loading = true;
          this.$ajax
            .post(
              `/channel/amountTransferOut?amount=${this.form.amount}&platformId=${this.form.platformIdTo}`
            )
            .then((res) => {
              this.onrefreshLoad();
              this.searchAllAmount();
              this.$store.commit("SET_TISHI", this.$t("myCenter['转出成功']"));
              this.form.amount = null;
            })
            .finally(() => {
              this.$store.state.loading = false;
            });
        })
    },
    // 转入
    amountTransferInto() {
      this.$dialog
        .confirm({
          title: this.$t("myCenter['确认转入']"),
          message: `${this.$t("myCenter['从']")} ${this.$t("myCenter['我的钱包']")} ${this.$t("myCenter['转入']")} ${this.form.amount} ${this.$t("myCenter['到']")} ${this.form.platformNameOut}`,
        })
        .then(() => {
          this.$store.state.loading = true;
          this.$ajax
            .post(
              `/channel/amountTransferInto?amount=${this.form.amount}&platformId=${this.form.platformIdOut}`
            )
            .then((res) => {
              this.onrefreshLoad();
              this.searchAllAmount();
              this.$store.commit("SET_TISHI", this.$t("myCenter['转入成功']"));
              this.form.amount = null;
            })
            .finally(() => {
              this.$store.state.loading = false;
            });
        })
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
.edhz {
  .edhz-inputBox {
    background-color: #fff;
    margin-top: 12px;
    border-top: 1px solid #d0d0d0;
    .edhz-row {
      height: 43.5px;
      border-bottom: 1px solid #d0d0d0;
      font-size: 17.4071px;
      .van-cell {
        padding: 0;
        width: calc(100vw - 120px);
        .van-field__control{
          font-size: 17.4071px;
        }
      }
      .label {
        width: 105px;
        box-sizing: border-box;
        padding-left: 10px;
        color: #000;
      }
      .num {
        color: #f46e00;
      }
    }
  }
  .but {
    box-sizing: border-box;
    font-size: 19.583px;
    background: -webkit-linear-gradient(
      bottom,
      #dc3b40 2%,
      #dc3b40 50%,
      #db3b40 51%,
      #d7363b
    );
    width: 337px;
    margin: 20px auto;
    text-align: center;
    color: white;
    border-radius: 4.35178px;
    height: 43.5104px;
    line-height: 43.5104px;
  }
}
</style>
