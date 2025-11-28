<template>
  <div class="indexPage">
    <div class="homeMain">
      <!--        <keep-alive>-->
      <!--          <router-view/>-->
      <!--        </keep-alive>-->
      <router-view />
    </div>
    <homeFooter></homeFooter>
  </div>
</template>
<script>
import homeFooter from "./footer/footer";
export default {
  name: "index",
  components: { homeFooter },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.homeMain{
  padding-bottom: 52px;
}
</style>
