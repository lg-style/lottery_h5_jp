<template>
  <div class="Service">
    <titleBar
      :title_name="$t('agentCenter[\'代理说明\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
    />
    <div class="text_imgBox">
      <img src="../../../assets/new/title.jpg" class="img" />
      <div class="agentIntroDes">
        <span
          >{{ $t('agentCenter[\'当您能看到这个页面，说明您的账号即是玩家账号也是代理账号，即可以自己投注，也可以发展下级玩家，赚取返点佣金。\']') }}</span
        >
        <h3><i class="iconfont"></i>{{ $t('agentCenter[\'如何赚取返点？\']') }}</h3>
        <div class="agentIntroP">
          <p>
            {{ $t('agentCenter[\'可获得的返点，等于自身返点与下级返点的差值，如自身返点5，下级返点3，你将能获得下级投注金额2%的返点，如下级投注100元，你将会获得2元。\']') }}
          </p>
          <p>{{ $t('agentCenter[\'点击下级开户，可查看自身返点，也可为下级设置返点。\']') }}</p>
        </div>
        <h3><i class="iconfont"></i>{{ $t('agentCenter[\'如何为下级开户？\']') }}</h3>
        <div class="agentIntroP">
          <p>
            {{ $t('agentCenter[\'点击下级开户，先为您的下级设置返点，设置成功后会生成一条邀请码，将邀请码发送给您的下级注册，注册后他就是您的下级，点击会员管理，就能查看他注册的账号；\']') }}
          </p>
          <p>
            {{ $t('agentCenter[\'如果您为下级设置的是代理类型的账号，那么您的下级就能继续发展下级，如果设置的是玩家类型，那么您的下级只能投注，不能再发展下级，也看不到代理中心；\']') }}
          </p>
        </div>
        <h3><i class="iconfont"></i>{{ $t('agentCenter[\'温馨提示：\']') }}</h3>
        <div class="agentIntroP agentIntroP2">
          <p>{{ $t('agentCenter[\'返点不同赔率也不同，点击返点赔率表，可查看返点赔率；\']') }}</p>
          <p>{{ $t('agentCenter[\'返点越低，赔率就越低，建议为下级设置的返点不要过低；\']') }}</p>
          <p>{{ $t('agentCenter[\'可在代理报表、投注明细、交易明细查看代理的发展情况；\']') }}</p>
          <p>{{ $t('agentCenter[\'建议开设的下级也是代理类型，无论发展了几级，您都能获得返点。\']') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
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
.Service {
  min-height: 100vh;
  background-color: #fff;
  .text_imgBox {
    .img {
      width: 100%;
    }
    .agentIntroDes {
      color: #333;
      padding: 15.2312px 9.13874px;
      line-height: 1.8;
      font-size: 15.2312px;
      h3 {
        font-size: 17.8205px;
        color: #dc3b40;
        font-weight: 400;
        margin: 0;
      }
      .agentIntroP {
        p {
          padding-left: 25.8931px;
          position: relative;
          margin: 0;
          &:before {
            content: "";
            position: absolute;
            width: 0.3em;
            height: 0.3em;
            background: #b9bcc2;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 0 1px #b9bcc2;
            left: 0.3em;
            top: 0.6em;
            z-index: 1;
          }
          &:after {
            content: "";
            position: absolute;
            height: 94.3854px;
            border-left: 1px dotted #b9bcc2;
            left: 0.54em;
            top: 1.4em;
          }
        }
        p:last-child{
          &:after {
            height: 0;
          }
        }
      }
      .agentIntroP2 {
        p:after {
          height: 39.5729px;
        }
      }
    }
  }
}
</style>
