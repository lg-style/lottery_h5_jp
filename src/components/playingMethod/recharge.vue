<template>
  <div class="recharge">
    <div v-show="showType">
      <titleBar
        title_name="选择充值方式"
        class="titleBar"
        left_icon="arrow-left"
        @toLeft="to"
      />
      <div class="xuanzheBody" v-if="freeze !== '1'">
        <div
          v-show="mixCurrencyList.length > 0"
          class="xuanzheBody-row flex-left flex-center"
          @click="changeTabs(0)"
        >
          <img src="../../assets/首页/qmhy.png" />
          <div class="row-box">
            <div>七码合一</div>
            <div>二维码扫码支付</div>
          </div>
          <van-icon name="arrow" />
        </div>
        <div
          v-show="userCompanyBankList.length > 0"
          class="xuanzheBody-row flex-left flex-center"
          @click="changeTabs(1)"
        >
          <img src="../../assets/首页/unionPay.png" />
          <div class="row-box">
            <div>公司入款</div>
            <div>支持大额转账</div>
          </div>
          <van-icon name="arrow" />
        </div>
        <div
          v-show="virtualCurrencyList.length > 0"
          class="xuanzheBody-row flex-left flex-center"
          @click="changeTabs(2)"
        >
          <img src="../../assets/首页/xnhb.png" />
          <div class="row-box">
            <div>数字币支付</div>
            <div>支持大额转账</div>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div v-show="!showType">
      <titleBar
        :title_name="
          active === 0
            ? '七码合一'
            : active === 1
            ? '公司入款'
            : active === 2
            ? '数字币支付'
            : ''
        "
        class="titleBar"
        @toLeft="showType = true"
        left_icon="arrow-left"
      />
      <div v-show="active == 0" class="recharge_body">
        <div class="inputBox">
          <van-cell-group>
            <van-field
              readonly
              :right-icon="showPicker2 ? 'arrow-up' : 'arrow-down'"
              v-model="mixCurrencyData.channelName"
              label="充值通道"
              placeholder="请选择充值通道"
              @click="showPicker2 = true"
            />
            <van-popup v-model="showPicker2" position="bottom" lock-scroll>
              <van-picker
                title="充值通道"
                show-toolbar
                :columns="mixCurrencyList"
                @confirm="onConfirm2"
                @cancel="showPicker2 = false"
              />
            </van-popup>
            <van-field
              v-model="mixCurrencyData.name"
              label="转账姓名"
              class="text_1"
              readonly
            >
              <template #button>
                <div @click="handleCopy(mixCurrencyData.name, $event)">
                  复制<i class="iconfont copy"></i>
                </div>
              </template>
            </van-field>
            <van-field
              v-model="text_1"
              label="转账账号"
              readonly
              class="text_1"
            >
              <template #button>
                <div @click="handleCopy(text_1, $event)">
                  复制<i class="iconfont copy"></i>
                </div>
              </template>
            </van-field>
            <van-field
              v-model="mixCurrencyData.amount"
              label="充值金额"
              type="number"
              :placeholder="
                mixCurrencyData.amountMinLimit > 0 &&
                mixCurrencyData.amountMaxLimit > 0
                  ? `限额${mixCurrencyData.amountMinLimit}-${mixCurrencyData.amountMaxLimit}`
                  : '请输入充值金额'
              "
              @input="setAmount2"
            />
            <van-field
              v-model="mixCurrencyData.depositor"
              label="充值昵称"
              placeholder="请输入您的真实姓名"
            />
            <div class="mixWaletAddress flex-left flex-center" v-if="waletAddressLoading">
              <div class="_text">扫码支付</div>
              <van-loading v-if="waletAddressLoading"/>
            </div>
            <div v-else-if="mixCurrencyData.waletAddress && mixCurrencyData.waletAddress.length>0">
              <div class="mixWaletAddress flex-left flex-center">
                <div class="_text">扫码支付</div>
                <div>
                  <div class="flex-left flex-center" v-for="(k,i) in Math.ceil(mixCurrencyData.waletAddress.length/3)" :key="i">
                    <img class="_img" :src="n" v-for="(n,j) in mixCurrencyData.waletAddress.slice(i * 3,(i + 1) * 3)" :key="j" @click="onEnlargementImg(n)"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="mixWaletAddress flex-left flex-center">
              <div class="_text">充值凭证</div>
              <van-uploader
                :after-read="afterRead"
                @delete="ondelete"
                v-model="fileList"
                multiple
                :max-count="2"
                :before-read="beforeRead" 
              />
            </div>
          </van-cell-group>
        </div>
        <div class="bottomBox">
          <van-button
            type="primary"
            block
            @click="submitMixCurrencyCashin()"
            :loading="butloading"
            >确认</van-button
          >
        </div>

        <div data-v-5611415d="" class="tips-security">
          <div>1.尊敬的贵宾，每笔充值需要1倍流水，即可出款。</div>
          <div>2.请正确填写您的充值金额和昵称。</div>
          <div>3.若无昵称，请直接填写账号、转账单号等以便核对。</div>
          <div>4.请务必转账后，再提交充值订单。</div>
          <div>5.转账1笔提交1次，请勿重复提交订单。</div>
          <div>6.转账后请保留单据作为核对证明。</div>
        </div>
      </div>
      <div v-show="active == 1" class="recharge_body">
        <div>
          <div class="inputBox">
            <van-cell-group>
              <van-field
                readonly
                :right-icon="showPicker2 ? 'arrow-up' : 'arrow-down'"
                v-model="data.cardNo"
                label="充值通道"
                placeholder="请选择充值通道"
                @click="showPicker3 = true"
              />
              <van-popup v-model="showPicker3" position="bottom" lock-scroll>
                <van-picker
                  title="充值通道"
                  value-key="cardNo2"
                  show-toolbar
                  :columns="userCompanyBankList"
                  @confirm="onConfirm3"
                  @cancel="showPicker3 = false"
                />
              </van-popup>
              <van-field
                v-model="data.realName"
                label="转账姓名"
                class="text_1"
                readonly
              >
                <template #button>
                  <div @click="handleCopy(data.realName, $event)">
                    复制<i class="iconfont copy"></i>
                  </div>
                </template>
              </van-field>
              <van-field
                v-model="text_2"
                label="转账账号"
                readonly
                class="text_1"
              >
                <template #button>
                  <div @click="handleCopy(text_2, $event)">
                    复制<i class="iconfont copy"></i>
                  </div>
                </template>
              </van-field>
              <van-field
                v-model="data.depositor"
                label="存款姓名"
                placeholder="请输入存款人姓名"
              />
              <van-field
                v-model="data.amount"
                type="number"
                label="存款金额"
                placeholder="请输入存款金额"
              />
            </van-cell-group>
            <div class="inputBox_text">
              尊敬的贵宾，每笔充值需要1倍流水，即可出款
            </div>
          </div>
          <div class="bottomBox">
            <van-button
              type="primary"
              block
              @click="submit()"
              :loading="butloading"
              >提 交</van-button
            >
          </div>
          <div data-v-5611415d="" class="tips-security">
            <div>1.尊敬的贵宾，每笔充值需要1倍流水，即可出款。</div>
            <div>2.请转账到以上收款银行账户。</div>
            <div>
              3.请正确填写转账银行卡的持卡人姓名和充值金额，以便及时核对。
            </div>
            <div>4.转账1笔提交1次，请勿重复提交订单。</div>
            <div>5.请务必提交订单后再转账,否则无法及时查到您的款项！</div>
          </div>
        </div>
      </div>
      <div v-show="active == 2" class="recharge_body">
        <div class="inputBox">
          <van-cell-group>
            <van-field
              readonly
              :right-icon="showPicker ? 'arrow-up' : 'arrow-down'"
              v-model="virtualCurrencyData.channelName"
              label="充值通道"
              placeholder="请选择充值通道"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom" lock-scroll>
              <van-picker
                title="虚拟币账户"
                show-toolbar
                :columns="virtualCurrencyList"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
            <div class="zhuwang_name">
              {{ virtualCurrencyData.controllerTips }}
            </div>
            <van-field
              class="text_1"
              v-model="virtualCurrencyData.waletAddress"
              type="number"
              label="收款地址"
              readonly
            >
              <template #button>
                <div
                  @click="handleCopy(virtualCurrencyData.waletAddress, $event)"
                >
                  复制<i class="iconfont copy"></i>
                </div>
              </template>
            </van-field>
            <canvas id="canvas"></canvas>
            <div class="zhuwang_name" style="border:none" @click="xiazaiQRCode()">点击下载图片</div>
            <div class="zhuwang_name">请使用钱包进行转账或扫码充值</div>
            <van-field
              v-model="virtualCurrencyData.amount"
              label="货币数量"
              type="number"
              :placeholder="
                virtualCurrencyData.amountMinLimit > 0 &&
                virtualCurrencyData.amountMaxLimit > 0
                  ? `限额${virtualCurrencyData.amountMinLimit}-${virtualCurrencyData.amountMaxLimit}`
                  : '请输入货币数量'
              "
              @input="setAmount2"
            />
            <van-field
              v-model="virtualCurrencyData.floatingExchangeRate"
              label="存款汇率"
              readonly
            />
            <van-field
              v-model="virtualCurrencyData.amount2"
              label="汇款金额"
              readonly
            />
            <van-field
              v-model="virtualCurrencyData.serialNumber"
              label="转账ID"
              placeholder="完整转账流水ID，不是账号UID"
            />
            <van-field
              v-model="virtualCurrencyData.depositor"
              label="存款人姓名"
              placeholder="请输入您的存款人姓名"
            />
          </van-cell-group>
        </div>
        <div class="bottomBox">
          <van-button
            type="primary"
            block
            @click="submitVirtualCurrencyCashin()"
            :loading="butloading"
            >确定</van-button
          >
        </div>

        <div class="tips-security">
          <div>1.尊敬的贵宾，每笔充值需要1倍流水，即可出款。</div>
          <div>2.适合单笔35元以上大额转账，填写区块链交易ID。</div>
          <div>3.若通道无法正常支付，建议选择银行卡支付，实时到账。</div>
          <div>
            4.请务必提交订单后再转账，否则无法及时查到您的款项！转账1笔提交1次，请勿重复提交订单。
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="imgShow" class="_enlargementImg" :closeable="true">
      <img :src="enlargementImg"/>
    </van-popup>

    <!--    公司入款 提交 弹窗-->
    <van-popup
      v-model="open"
      position="right"
      :overlay="true"
      :style="{ width: '100%', height: '100%' }"
      lock-scroll
    >
      <div class="openBody">
        <titleBar
          title_name="收款银行卡信息"
          class="titleBar"
          @toLeft="open = false"
          left_icon="arrow-left"
        />
        <van-row type="flex" align="center" class="openBody_box">
          <van-col span="6">
            <!-- <img class="icon" :src="require(`../../assets/new/${submitCompanyCashinData.bankCode || 'ABOC'}.png`)"/> -->
          </van-col>
          <van-col span="14">
            <span class="text">{{ submitCompanyCashinData.bankName }}</span>
          </van-col>
        </van-row>
        <div class="openBody_zhong">
          <van-row type="flex" class="openBody_row">
            <van-col span="6">收款人：</van-col>
            <van-col span="14"
              ><b>{{ submitCompanyCashinData.payee }}</b></van-col
            >
            <van-col span="4" class="copy">
              <span @click="handleCopy(submitCompanyCashinData.payee, $event)"
                >复制</span
              >
            </van-col>
          </van-row>
          <van-row type="flex" class="openBody_row">
            <van-col span="6">收款账号：</van-col>
            <van-col span="14"
              ><b>{{ submitCompanyCashinData.cardNo }}</b></van-col
            >
            <van-col span="4" class="copy">
              <span @click="handleCopy(submitCompanyCashinData.cardNo, $event)"
                >复制</span
              >
            </van-col>
          </van-row>
          <van-row type="flex" class="openBody_row">
            <van-col span="6">开户网点：</van-col>
            <van-col span="14"
              ><b>{{ submitCompanyCashinData.branchBankAddress }}</b></van-col
            >
            <van-col span="4" class="copy">
              <span
                @click="
                  handleCopy(submitCompanyCashinData.branchBankAddress, $event)
                "
                >复制</span
              >
            </van-col>
          </van-row>
          <van-row type="flex" class="openBody_row">
            <van-col span="6">附言：</van-col>
            <van-col span="14"
              ><b>{{ submitCompanyCashinData.controllerTips }}</b></van-col
            >
            <van-col span="4" class="copy">
              <span
                @click="
                  handleCopy(submitCompanyCashinData.controllerTips, $event)
                "
                >复制</span
              >
            </van-col>
          </van-row>
        </div>
        <div class="openBody_bottom" v-show="show">
          <div class="openBody_bottom_title">存款信息</div>
          <van-row type="flex" class="openBody_row">
            <van-col span="7">订单号：</van-col>
            <van-col span="17"
              ><b>{{ submitCompanyCashinData.orderNumber }}</b></van-col
            >
          </van-row>
          <van-row type="flex" class="openBody_row">
            <van-col span="7">存款金额：</van-col>
            <van-col span="17"
              ><b>{{ submitCompanyCashinData.amount }}</b></van-col
            >
          </van-row>
          <van-row type="flex" class="openBody_row">
            <van-col span="7">收款人姓名：</van-col>
            <van-col span="17"
              ><b>{{ submitCompanyCashinData.depositor }}</b></van-col
            >
          </van-row>
          <div class="openBody_bottom_but">
            <div class="but" @click="open = false">返 回</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import QRCode from "qrcode";
import clip from "../../util/clipboard.js"; // use clipboard directly
import { mapActions, mapState } from "vuex";
import Compressorjs from "compressorjs";
import lrz from 'lrz';
export default {
  data() {
    return {
      imgShow: false,
      enlargementImg: '',
      waletAddressLoading: false,
      fileList: [],
      newFileList: [],
      text_1: "扫码成功联系客服！！！",
      text_2: "请先去绑定银行卡！！！",
      showPicker: false,
      showPicker2: false,
      showPicker3: false,
      virtualCurrencyList: sessionStorage["virtualCurrencyList"] ? JSON.parse(sessionStorage["virtualCurrencyList"]) : [],
      showType: true,
      submitCompanyCashinData: {},
      show: false,
      form: {},
      open: false,
      butloading: false,
      data: {
        bankCode: "ABOC",
        depositor: "",
        amount: null,
        companyBankInfoId: null,
        text: "中国银行",
        code: "1341564351354asd41541",
      },
      virtualCurrencyData: {},
      active: 0,
      ConfigList: {},
      freeze: '1',
      userCompanyBankList: [],
      bankList: [
        { text: "中国银行", id: 1 },
        { text: "建设银行", id: 2 },
        { text: "工商银行", id: 3 },
      ],
    };
  },
  computed: {
    ...mapState(["userInfo", "mixCurrencyList", "mixCurrencyData"]),
  },
  created() {
    if(this.virtualCurrencyList.length>0){
      this.virtualCurrencyData = this.virtualCurrencyList[0] || {};
    }
    this.onUserCompanyBankList();
    this.getConfigList();
    this.userCompanyVirtualCurrencyList();
    this.userCompanyMixCurrencyList().then(()=>{
      this.getImg();
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["userCompanyMixCurrencyList"]),
    // 放大图片
    onEnlargementImg(img) {
      this.enlargementImg = img;
      this.imgShow = true;
    },
    // 获取图片
    getImg() {
      this.waletAddressLoading = true;
      let id = this.mixCurrencyData.companyMixCurrencyId;
      if(!id){
        return;
      }
      this.$ajax
        .post(`/cashin/mixCurrencyAddress?companyMixCurrencyId=${id}`)
        .then((res) => {
          this.mixCurrencyData.waletAddress = res.data.split("aaa===aaa===aaa");
        })
        .finally(() => {
          this.waletAddressLoading = false;
        });
    },
    // 返回布尔值
    beforeRead(file) {
      console.log(file);
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
    // 上传回调
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
    to() {
      this.$router.go(-1);
    },
    setAmount2(val) {
      this.virtualCurrencyData.amount2 =
        Math.floor(this.virtualCurrencyData.floatingExchangeRate * val * 100) /
        100;
    },
    onConfirm(data) {
      this.virtualCurrencyData = data;
      this.showPicker = false;
    },
    onConfirm2(data) {
      this.$store.state.mixCurrencyData = data;
      this.showPicker2 = false;
      this.getImg();
    },
    onConfirm3(data) {
      console.log(data);
      // this.mixCurrencyData = data;
      this.showPicker3 = false;
      this.onOpen(data);
    },
    changeTabs(active) {
      if(this.freeze === '1'){
        this.$toast("操作过快，请稍后再试！");
        return;
      }else if(this.freeze){
        this.$toast("不是正常状态，不能充值。");
        return
      }
      if (active == 1 && this.userCompanyBankList.length == 0) {
        this.$toast("暂无该充值方式，请稍后再试");
        return;
      } else if (active == 2 && this.virtualCurrencyList.length == 0) {
        this.$toast("暂无该充值方式，请稍后再试");
        return;
      } else if (active == 0 && this.mixCurrencyList.length == 0) {
        this.$toast("暂无该充值方式，请稍后再试");
        return;
      }
      this.active = active;
      this.showType = false;
    },
    useqrcode(url) {
      var canvas = document.querySelector("#canvas");
      // 调用函数去生成二维码，参数依次为：二维码的容器、要生成的内容、回调函数
      QRCode.toCanvas(canvas, url, { margin: 0 }, function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log("success!");
        }
      });
    },
    xiazaiQRCode() {
      var canvas = document.getElementById("canvas");
      let base64 = canvas.toDataURL("image/png");
      this.downloadFileByBase64(base64, 'QRCode');
    },
    downloadFileByBase64(base64, name) {
      var myBlob = this.dataURLtoBlob(base64);
      var myUrl = URL.createObjectURL(myBlob); //创建图片的临时url
      this.downloadFile(myUrl, name);
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    downloadFile(url, name) {
      var a = document.createElement("a"); //新建一个a链接
      a.setAttribute("href", url); // a链接的url为图片的url
      a.setAttribute("download", name);
      a.setAttribute("target", "_blank");
      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      a.dispatchEvent(clickEvent);
    },
    toPath(path) {
      this.$router.push({
        path: path,
        query: {
          redirect: this.$route.path,
        },
      });
    },
    handleCopy(text, event) {
      //复制
      this.$toast("复制成功！");
      clip(text, event);
    },
    onOpen(k) {
      this.data.companyBankInfoId = k.companyBankInfoId;
      this.data.bankName = k.bankName;
      this.data.bankCode = k.bankCode;
      console.log(k);
      this.form = Object.assign({}, k);
    },
    //用户可见公司入款银行卡列表
    onUserCompanyBankList() {
      this.$store.state.loading = true;
      this.$ajax
        .post("/cashin/userCompanyBankList")
        .then((res) => {
          for (let k of res.data) {
            k.depositor = this.userInfo.realName;
            k.cardNo2 = `${k.bankName}：${k.cardNo}`;
          }
          this.userCompanyBankList = res.data || [];
          this.data = res.data[0] || {};
        })
        .catch((error) => {
          this.$toast(error);
        })
        .finally(() => {
          this.$store.state.loading = false;
        });
    },
    //获取公司入款配置
    getConfigList() {
      this.$ajax
        .post("/cashin/companyConfig")
        .then((res) => {
          this.ConfigList = res.data || {};
          this.freeze = this.ConfigList.freeze || false;
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    // 获取数字货币配置
    userCompanyVirtualCurrencyList() {
      this.$ajax
        .post("/cashin/userCompanyVirtualCurrencyList")
        .then((res) => {
          if (res.data) {
            for (let k of res.data) {
              k.depositor = this.userInfo.realName;
              k.text = k.channelName;
              k.amount2 = 0;
            }
            this.virtualCurrencyList = res.data || [];
            sessionStorage["virtualCurrencyList"] = JSON.stringify(this.virtualCurrencyList);
            this.virtualCurrencyData = res.data[0] || {};
            if(res.data[0]){
              setTimeout(() => {
                this.useqrcode(this.virtualCurrencyData.waletAddress);
              }, 500);
            }
          }
        })
        .catch((error) => {
          this.$toast(error);
        });
    },
    // 提交数字货币支付
    submitVirtualCurrencyCashin() {
      if (this.butloading) {
        return;
      }
      let data = this.virtualCurrencyData;
      if (
        !data.companyVirtualCurrencyId ||
        data.companyVirtualCurrencyId == ""
      ) {
        this.$toast("请选择充值通道");
      }
      if (!data.amount || data.amount == "") {
        this.$toast("请填写货币数量");
        return;
      }
      if (!data.serialNumber || data.serialNumber == "") {
        this.$toast("请填写转账ID");
        return;
      }
      if (!data.depositor || data.depositor == "") {
        this.$toast("请填写存款人姓名");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认充值",
          message: `是否确认充值?`,
        })
        .then(() => {
          this.show = false;
          this.butloading = true;
          this.$ajax
            .post("/cashin/submitVirtualCurrencyCashin", data)
            .then((res) => {
              // this.submitCompanyCashinData = res.data;
              this.$store.commit("SET_TISHI", `提交成功`);
              this.userCompanyVirtualCurrencyList();
              // this.show = true;
              // this.open = true;
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
    // 提交二维码支付
    submitMixCurrencyCashin() {
      if (this.butloading) {
        return;
      }
      let data = this.mixCurrencyData;
      let payment = '';
      if (!data.companyMixCurrencyId || data.companyMixCurrencyId == "") {
        this.$toast("请选择充值通道");
      }
      if (!data.amount || data.amount == "") {
        this.$toast("请填写充值金额");
        return;
      }
      if (!data.depositor || data.depositor == "") {
        this.$toast("请填写充值昵称");
        return;
      }
      if (this.newFileList.length == 0) {
        this.$toast("请上传充值凭证图片");
        return;
      }
      if(this.newFileList.length>0){
        payment = this.newFileList.join("aaa===aaa===aaa");
      }
      this.$dialog
        .confirm({
          title: "确认充值",
          message: `是否确认充值?`,
        })
        .then(() => {
          this.show = false;
          this.butloading = true;
          this.$ajax
            .post("/cashin/submitMixCurrencyCashin", {
              companyMixCurrencyId: data.companyMixCurrencyId,
              amount: data.amount,
              depositor: data.depositor,
              payment: payment
            })
            .then((res) => {
              // this.submitCompanyCashinData = res.data;
              this.$store.commit("SET_TISHI", `提交成功`);
              this.fileList = [];
              this.userCompanyMixCurrencyList().then(()=>{
                this.getImg();
              });
              // this.show = true;
              // this.open = true;
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
    //提交充值
    submit() {
      if (this.butloading) {
        return;
      }
      let data = this.data;
      if (!data.depositor || data.depositor == "") {
        this.$toast("请填写入款人真实姓名");
        return;
      }
      if (!data.amount || data.amount == "") {
        this.$toast("请填写入款金额");
        return;
      }
      if (!data.companyBankInfoId || data.companyBankInfoId == "") {
        this.$toast("请选择公司入款银行卡");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认充值",
          message: `是否确认充值?`,
        })
        .then(() => {
          this.show = false;
          this.butloading = true;
          this.$ajax
            .post("/cashin/submitCompanyCashin", {
              amount: data.amount,
              companyBankInfoId: data.companyBankInfoId,
              depositor: data.depositor.trim(),
            })
            .then((res) => {
              this.submitCompanyCashinData = res.data;
              this.$store.commit("SET_TISHI", `提交成功`);
              this.show = true;
              this.open = true;
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
.recharge {
  ._enlargementImg {
    background: none;
    img {
      width: 90vw;
    }
  }
  .xuanzheBody {
    padding-top: 13px;
    .xuanzheBody-row {
      margin-bottom: 13px;
      height: 65px;
      box-sizing: border-box;
      padding: 10px 0;
      background: #fff;
      border-top: #d0d0d0 1px solid;
      border-bottom: 1px solid #d0d0d0;
      img {
        height: 43.5px;
        width: 54.5px;
        margin: 0 12px 0 18px;
      }
      .row-box {
        width: 250px;
        div:first-child {
          font-size: 17.12px;
          color: #000;
        }
        div:last-child {
          color: #686868;
          font-size: 15px;
        }
      }
      i {
        color: #989898;
        font-size: 15px;
      }
    }
  }
  .recharge_body {
    padding: 0px 0 55px;
    .warning_text {
      font-size: 15px;
      color: #f46e00;
      i {
        color: #d83442;
        font-size: 15px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .inputBox {
      background-color: #fff;
      border: 1px solid #eee;
      .van-cell-group {
        background: none;
        .text_1 {
          .van-field__control {
            color: #f46e00;
          }
          .copy:after {
            content: "\E61F";
          }
        }
        .zhuwang_name {
          line-height: 43.5178px;
          font-size: 17.4071px;
          height: 43.5104px;
          color: #000;
          text-align: center;
          border-bottom: 1px solid #d0d0d0;
        }
        .van-cell {
          background: none;
          font-size: 17.4071px;
          padding-left: 8.7px;
          border-bottom: 1px solid #d0d0d0;
          color: #000;
          .van-cell__title {
            padding-right: 5px;
          }
        }
      }
      .mixWaletAddress {
        padding: 6.96285px 8.7px;
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
        ._img {
          width: 80px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
      #canvas {
        display: block;
        margin: 0 auto;
        width: 150px !important;
        height: 150px !important;
      }
      .inputBox_text {
        padding: 10px 0;
        text-align: center;
        color: #999;
        font-size: 12px;
      }
    }
    .bankBox {
      max-height: calc(100vh - 380px);
      /*overflow: auto;*/
      .box {
        padding: 10px 0 20px;
        margin-top: 10px;
        height: 120px;
        background-size: 100% 100% !important;
        opacity: 0.7;
        .icon {
          margin: 0 20px;
        }
        .text {
          font-weight: bold;
          color: white;
          font-size: 20px;
        }
      }
      .is_active {
        opacity: 1;
      }
      .amountLimit {
        padding-left: 20px;
        color: #000;
        .bank_text {
          font-size: 13px;
          line-height: 22px;
          position: relative;
          .fuzu {
            color: #2b9bdb;
            display: inline-block;
            position: absolute;
            right: 25px;
          }
        }
        .bank_amount {
          line-height: 30px;
        }
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
        font-weight: bold;
        .van-button__text {
          font-size: 19.583px;
        }
      }
    }
  }
  /*弹窗*/
  .openBody {
    background-color: #f9f9f9;
    height: 100vh;
    .openBody_row {
      height: 30px;
      .copy {
        text-align: right;
        color: #fff;
        span {
          padding: 3px 10px;
          display: inline-block;
          border: 1px solid #eee;
          text-align: center;
          border-radius: 30px;
          background-color: #d5ba9e;
        }
      }
    }
    .openBody_box {
      padding: 10px;
      .icon {
        margin: 0 20px;
      }
      .text {
        display: inline-block;
        font-weight: bold;
        font-size: 14.5px;
        margin-left: 10px;
      }
    }
    .openBody_zhong {
      padding: 0px 20px 20px;
    }
    .openBody_bottom {
      padding: 20px;
      .openBody_bottom_title {
        font-weight: bold;
        font-size: 14.5px;
        padding-bottom: 30px;
      }
      .openBody_bottom_but {
        padding: 20px 0;
        .but {
          width: 100px;
          padding: 10px 20px;
          border: 1px solid #eee;
          background-color: #d5ba9e;
          margin: 0 auto;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}
</style>
