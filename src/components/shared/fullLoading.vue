<template>
  <div v-if="$store.state.loading || 1" class="fullLoading">
      <div class="loadingCell">
        <div class="iconLoadingCon">
          <img src="../../assets/首页/rolling.svg" class="loadingImg" />
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "fullLoading",
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
.fullLoading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background: #fff;
  display: table;
  width: 100%;
  height: 100%;
  .loadingCell {
    display: table-cell;
    vertical-align: middle;
    .iconLoadingCon {
      height: 108.792px;
      width: 108.792px;
      display: block;
      margin: 0 auto;
      position: relative;
      text-align: center;
      .loadingImg {
        width: 60px;
        height: 85px;
      }
    }
  }
}
</style>
