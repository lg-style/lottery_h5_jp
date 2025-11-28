<template>
  <div class="newNotice">
    <titleBar
      :title_name="$t('myCenter[\'公告\']')"
      @toLeft="to"
      left_icon="arrow-left"
      class="titleBar titleBar_top"
    />
    <empty/>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    to() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.newNotice {
    height: 100%;
    background-color: #fff;
}
</style>
