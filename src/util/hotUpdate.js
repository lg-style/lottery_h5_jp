import Vue from 'vue';
import { Toast } from 'vant';
import store from '@/store'
export default {
  plusReady(){
    //检查热更
    let versionNum = store.state.VersionData.appVersion
    let updateAddress = store.state.VersionData.updateAddress
    console.log("热更版本：" + versionNum);
    plus.runtime.getProperty(plus.runtime.appid, function (inf) {
      let wgtVer = inf.version;
      console.log("当前应用版本：" + wgtVer);
      if (parseFloat(versionNum) > parseFloat(wgtVer)) {
        // 下载wgt文件
        var wgtUrl=updateAddress+"qyh"+versionNum+".wgt";
        console.log('下载地址----',wgtUrl)
        let downTasks = plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
          console.log('下载状态----',status)
          if ( status == 200 ) {
            plus.nativeUI.closeWaiting();
            console.log("下载wgt成功："+d.filename);
            plus.nativeUI.showWaiting("正在安装...");//安装...
            plus.runtime.install(d.filename,{},function(){
              console.log("安装wgt文件成功！");
              plus.nativeUI.closeWaiting();
              plus.nativeUI.alert("应用资源更新完成！",function(){
                plus.runtime.restart();
              });
            },function(e){
              plus.nativeUI.closeWaiting();
              console.log("安装wgt文件失败["+e.code+"]："+e.message);
              plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
            });
          } else {
            console.log("下载wgt失败！");
            plus.nativeUI.alert("下载wgt失败！");
          }
          plus.nativeUI.closeWaiting();
        })
        downTasks.addEventListener('statechanged', (task) => {
          if (!downTasks) { return; }
          let progressVal = 0;
          // no default
          switch (task.state) {
            case 1:
              console.log('开始下载');
              break;
            case 2:
              console.log('链接到服务器...');
              break;
            case 3:
              progressVal = Math.ceil(task.downloadedSize / task.totalSize* 100) ;
              console.log('进度----',progressVal)
              if(progressVal<100){
                store.state.hotType=progressVal
              }
              break;
            case 4:
              console.log('监听下载完成');
              break;
          }
        });
        downTasks.start();
      }else {
        store.state.hotType=100
      }
    });
  },
  get(){
    store.state.hotType=1
    setTimeout(()=>{
      if(store.state.hotType<=1){
        store.state.hotType=100
      }
    },2000)
    if(window.plus){
      this.plusReady();
    }else{
      document.addEventListener('plusready',this.plusReady,false);
    }
  },
}
