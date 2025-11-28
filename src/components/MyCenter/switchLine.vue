<template>
  <div class="switchLine">
      <titleBar :title_name="$t('myCenter[\'线路选择\']')" @toLeft="to" left_icon="arrow-left" class="titleBar"/>
  </div>
</template>
<script>

  export default {
    data() {
      return {

      };
    },
    mounted() {

    },
    methods: {
      to(){
        this.$router.push({
          path: this.$route.query.redirect,
          query:{
            redirect:this.$route.path
          }})
      },
    }
  };
</script>

<style lang="scss">
  .switchLine{

  }
</style>
