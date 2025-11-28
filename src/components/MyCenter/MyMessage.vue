<template>
  <div class="MyMessage">
    <titleBar
      :title_name="$t('myCenter[\'我的消息\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar"
    />
    <div class="contents">
      <van-pull-refresh
        v-model="isDownLoading"
        @refresh="onDownRefresh()"
        class="orderinfo-top"
        style="min-height: 100%"
      >
        <van-list
          v-model="isUpLoading"
          :finished="upFinished"
          :offset="offset"
          :finished-text="msglist.length > 0 ? $t('myCenter[\'已显示全部记录\']') : ''"
          loading-text=" "
          @load="getNotice"
        >
          <div
            v-for="(it, index) in msglist"
            :key="index"
            @click="onShowDetails(it)"
          >
            <div class="detail-list">
              <div class="read" v-show="it.siteMessageRead==0"></div>
              <div class="detail-top">
                <div class="h20">
                  <div class="font12 color-grey">{{ it.createTime }}</div>
                  <div class="font14 color-black">
                    {{ it.siteMessageTitle }}
                  </div>
                </div>
              </div>
              <div :class="'detail-bottom font12 yidu'">
                {{ it.siteMessageContent }}
              </div>
            </div>
          </div>
        </van-list>
        <empty
          v-if="msglist.length == 0 && !isUpLoading"
        />
      </van-pull-refresh>
    </div>
    <!-- 信息详情 -->
    <van-popup
      class="bet"
      v-model="showDetails"
      position="right"
      duration="0.2"
      :style="{ height: '100%', width: '100%' }"
      lock-scroll
    >
      <titleBar
        :title_name="$t('myCenter[\'内容\']')"
        @toLeft="showDetails = false"
        left_icon="arrow-left"
        class="titleBar"
      />
      <div class="showDetailsBody">
        <div class="showDetailsBody-t">{{ formData.siteMessageTitle }}</div>
        <div class="showDetailsBody-c">{{ formData.siteMessageContent }}</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import footerVue from "../footer/footer.vue";

export default {
  data() {
    return {
      isDownLoading: false, // 下拉刷新
      isUpLoading: false, // 上拉加载
      upFinished: false, // 上拉加载完毕
      offset: 100, // 滚动条与底部距离小于 offset 时触发load事件
      pageNo: 1,
      total: 0,
      msglist: [], //信息列表
      showDetails: false,
      formData: {},
    };
  },
  created() {
    this.onDownRefresh();
  },
  methods: {
    onShowDetails(row) {
      this.formData = Object.assign({}, row);
      this.showDetails = true;
      this.readSiteMessage(row.id)
    },
    getNotice() {
      this.$ajax
        .post(`/user/center/siteMessageList`, {
          pageNo: this.pageNo,
          pageSize: 5,
        })
        .then((res) => {
          if (res.data) {
            this.pageNo++;
            this.total = res.data.total;
            this.msglist = [...this.msglist, ...res.data.records];
            if (this.msglist.length >= this.total) {
              this.isUpLoading = false;
              this.upFinished = true;
            } else {
              this.isUpLoading = false;
            }
          }
        });
    },
    readSiteMessage(id) {
      this.$ajax.post(`/user/center/readSiteMessage?id=${id}`).then((res) => {
        this.onDownRefresh();
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
    //下拉刷新
    onDownRefresh() {
      this.pageNo = 1;
      this.msglist = [];
      this.upFinished = false;
      this.isDownLoading = false;
      this.isUpLoading = true;
      this.getNotice();
    },
  },
};
</script>

<style lang="scss" scoped>
.MyMessage {
  background-color: #fff;
  .titleBar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .showDetailsBody {
    padding: 20px;
    .showDetailsBody-t {
      font-size: 20px;
    }
    .showDetailsBody-c {
      padding-top: 10px;
      font-size: 14px;
    }
  }
  .contents {
    width: 100%;
    .van-pull-refresh {
      min-height: calc(100vh - 90px);
    }

    .detail-list {
      border: 1px solid #cdcdcd;
      background: #ffffff;
      width: 95%;
      margin: 10px auto;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      position: relative;
      .read{
        width: 8px;
        height: 8px;
        background: linear-gradient(#d83442,#c62c41,#b82541);
        border-radius: 50%;
        position: absolute;
        right: -3px;
        top: -3px;
      }
      .detail-top {
        padding-left: 22px;
        padding-right: 22px;
        line-height: 20px;
        padding-top: 11px;
        padding-bottom: 6px;
        .color-black {
          color: #000;
          font-size: 18px;
          padding-top: 6px;
          font-weight: 500;
        }
      }

      .detail-bottom {
        padding-left: 22px;
        padding-right: 22px;
        padding-bottom: 11px;
        text-indent: 2em;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-stretch: normal;
        font-style: normal;
      }
      .yidu {
        color: #999;
      }
      .operate-btn {
        text-align: center;
        margin-bottom: 10px;
      }
      .delete-button {
        text-align: center;
        height: 30px;
        border-radius: 3px;
        background-color: #e4393c;
      }

      /deep/ .van-button--danger {
        background-color: #e4393c;
        border-color: #e4393c;
      }
    }
    .no-data {
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
