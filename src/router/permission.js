import router from "./index.js"
import store from '@/store'
// 路由守卫
router.beforeEach((to,from,next)=>{
  store.dispatch('isNewVersion');
  //切换路由时，初始化
  store.state.loading=false
  //切换线路后，自动登录
  let token = getUrlParam('token')
  if(token){
    sessionStorage['sessionId']=getUrlParam('token')
    window.location=window.location.origin
  }
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  document.querySelector("head > title").innerHTML = `巴登 - ${to.name}`;
  if (!sessionStorage['load']&&to.path!='/load'&&store.state.device=='1') {
    next({
      path:"/load"
    });
  }else if(to.matched.some(res=>res.meta.isLogin)){
    if (sessionStorage['sessionId']) {
      next();
    }else{
      next({
        path:"/login",
        query:{
          redirect:to.fullPath
        }
      });
    }
  }else{
    next()
  }

});

export default router;
