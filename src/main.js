// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import './router/permission.js'
import store from './store';
import Router from 'vue-router';
import axios from 'axios';
import './util/http';
import Vant from 'vant';
import 'amfe-flexible';//自适应插件
import 'vant/lib/index.css';
import './components/common/style.scss'; //公共样式
import './components/common/font.css'; //字体
import './components/common/tabsbg.scss'; //切换主题

import { DatePicker } from 'element-ui';
Vue.use(DatePicker)

import { Lazyload } from 'vant';
//自定义组件
import titleBar from '@/components/shared/titleBar.vue'
Vue.component("titleBar", titleBar);
import empty from '@/components/common/empty.vue'
Vue.component("empty", empty);

import FastClick from 'fastclick'
// 跳转PC
var u = navigator.userAgent;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
getResize();
window.addEventListener('resize', function() {
  getResize();
})
function getResize(){
  if(window.innerWidth>820&&process.env.HOST === 'prerelease'&&!isiOS && !isAndroid){
    let location = window.location;
    window.location.href = `${location.protocol}//pc.${location.host}${location.search}`
  }
}

//复制插件
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;

//表情包
import {EmojiPickerPlugin} from 'vue-emoji-picker'
Vue.use(EmojiPickerPlugin)
//移动端调试
import Vconsole from 'vconsole';
if(localStorage.getItem("userNo") == 'lg1122'){
  // let vConsole = new Vconsole();
}
//解决ios点击事件延时和输入框无法聚焦
FastClick.attach(document.body);
FastClick.prototype.focus = function(targetElement) {
  var length;
// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
//   deviceIsIOS&&
  if ( targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};


//---- 导入国际化资源文件
import i18n, { setLocale } from './lang';

Vue.use(Vant);
Vue.use(Router);
Vue.use(Lazyload);
Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.$setLocale = setLocale;

new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
})

