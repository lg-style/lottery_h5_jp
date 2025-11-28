<template>
  <div class="result">
    <div class="vanTable">
      <van-row type="flex" align="center" class="vanTable_title sticky-box">
        <div class="row_box" style="width: 1rem">
          {{ $t('result[\'期号\']') }}
        </div>
        <div class="row_box" style="width: 1rem">
          {{ $t('result[\'开奖\']') }}
        </div>
        <div class="row_box" style="width: 1.8rem">
          {{ $t('result[\'组选分布\']') }}
        </div>
        <div class="row_box" style="width: 6rem">
          {{ $t('result[\'和值\']') }}
        </div>
        <div class="row_box" style="width: 1rem">
          {{ $t('result[\'大小\']') }}
        </div>
        <div class="row_box" style="width: 1rem">
          {{ $t('result[\'单双\']') }}
        </div>
        <div class="row_box" style="width: 1.7rem">
          {{ $t('result[\'跨度\']') }}
        </div>
      </van-row>
      <div class="vanTable_body" id="vanTable">
        <van-row type="flex" align="center" class="vanTable_body_row" v-for="(k,j) in dataList" :key="j">
          <div class="row_box" style="width: 1rem">
            <van-row type="flex" justify="center" align="center" class="b_box">
              {{ k.periodId }}
            </van-row>
          </div>
          <div class="row_box" style="width: 1rem;background-color: rgba(238,238,238,0.59)">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <b :class="'kaijiang'+kaijiang(k)" v-for="i in k.openResult.split(' ')" style="display: inline-block;width: 33%">
                {{ i }}
              </b>
            </van-row>
          </div>
          <div class="row_box" style="width: 1.8rem">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <div v-for="i in 6"
                   :class="getSameNum(i,k.openResult.split(' '))>0?'':'no_active'">
                <b :class="'kaijiang'+kaijiang(k)" v-if="getSameNum(i,k.openResult.split(' '))>1">{{ i }}</b>
                <b v-else>{{ i }}</b>
              </div>
            </van-row>
          </div>
          <div class="row_box" style="width: 6rem;background-color: rgba(238,238,238,0.59)">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <span class="hezhi" :class="{'hezhiY':hezhi(k.openResult.split(' '))==i,['kaijiang'+kaijiang(k)]:true}" v-for="i in 18" v-if="i>2">
                <b>{{ i }}</b>
              </span>
            </van-row>
          </div>
          <div class="row_box" style="width: 1rem">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <b class="daxiao" style="color: #bd20bf;" :class="{'opacity0':!(hezhi(k.openResult.split(' '))>10)}">{{ $t('result[\'大\']') }}</b>
              <b class="daxiao" style="color: #bd20bf;" :class="{'opacity0':hezhi(k.openResult.split(' '))>10}">{{ $t('result[\'小\']') }}</b>
            </van-row>
          </div>
          <div class="row_box" style="width: 1rem">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <b class="daxiao" style="color: #2a1f9c" :class="{'opacity0':!(hezhi(k.openResult.split(' '))%2==1)}">{{ $t('result[\'单\']') }}</b>
              <b class="daxiao" style="color: #2a1f9c" :class="{'opacity0':(hezhi(k.openResult.split(' '))%2==1)}">{{ $t('result[\'双\']') }}</b>
            </van-row>
          </div>
          <div class="row_box" style="width: 1.7rem;background-color: rgba(238,238,238,0.59)">
            <van-row type="flex" justify="center" align="center" class="b_box">
              <span class="kuadu" :class="{'kuaduY':getkuadu(k,i),['kaijiang'+kaijiang(k)]:true}" v-for="i in 6">
                <b>{{ i-1 }}</b>
              </span>
            </van-row>
          </div>
        </van-row>
      </div>
    </div>
    <canvas id="mc" width="500" height="1000" v-if="canvasShow"></canvas>
    <canvas id="mc2" width="500" height="1000" v-if="canvasShow"></canvas>
  </div>
</template>
<script>
  import util from "../../../util/jisuanLH"
  import {mapState} from "vuex";
  export default {
    data() {
      return {
        util:util,
        canvasShow:false,
        typeId:1,
        active:'',
      };
    },
    computed:{
      ...mapState(['todayOpenRecord']),
      dataList(){
        return this.todayOpenRecord
      },
    },
    watch:{
        "dataList":{
          handler:function(a,b){
            this.showZheXian()
          }
        },
    },
    mounted() {
      this.showZheXian()
    },
    methods: {
      showZheXian(){
        this.canvasShow=false
        setTimeout(()=>{
          this.canvasShow=true
        },50)
        setTimeout(()=> {
          var canvas = document.getElementById('mc');
          var canvas2 = document.getElementById('mc2');
          var vanTable = document.getElementById('vanTable');
          canvas.height = vanTable.offsetHeight
          canvas.width = vanTable.offsetWidth
          canvas2.height = vanTable.offsetHeight
          canvas2.width = vanTable.offsetWidth
          var ctx = canvas.getContext('2d');
          var ctx2 = canvas2.getContext('2d');
          ctx.beginPath();
          ctx.lineWidth = "1";
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx2.beginPath();
          ctx2.lineWidth = "1";
          ctx2.strokeStyle = "rgba(0,0,0,0.3)";

          // console.log( this.todayOpenRecord)
          // console.log($('.kuaduY'))
          for (let i in this.todayOpenRecord) {
            let x = $('.kuaduY')[i].offsetWidth - $('.kuaduY')[i].offsetHeight
            let x2 = $('.hezhiY')[i].offsetHeight - $('.hezhiY')[i].offsetWidth
            ctx.lineTo($('.kuaduY')[i].offsetLeft + $('.kuaduY')[i].offsetWidth - 7, $('.kuaduY')[i].offsetTop+5+x2)
            ctx2.lineTo($('.hezhiY')[i].offsetLeft + $('.hezhiY')[i].offsetWidth - 7, $('.hezhiY')[i].offsetTop+5+x2)
          }
          ctx.stroke();
          ctx2.stroke();
        },100)
      },
      getkuadu(k,i){
        let arr = k.openResult.split(' ')
        return i-1==arr[2]-arr[0]
      },
      kaijiang(k){
        let arr = k.openResult.split(' ')
        if(arr[0]==arr[1]&&arr[0]==arr[2]&&arr[1]==arr[2]){
          return '1'
        }else if(arr[0]==arr[1]||arr[0]==arr[2]||arr[1]==arr[2]){
          return '2'
        }
      },
      //数组查找相同元素并取个数
      getSameNum(val,arr){
        let processArr = arr.filter(function(value) {
          return value == val;
        })
        return processArr.length;
      },
      hezhi(arr){
        let num=0
        arr.map(k=>{
          num+=parseInt(k)
        })
        return num
      },
      onClick(){

      },
    }
  };
</script>

<style lang="scss" scoped>
  .result{
    padding-top: 40px;
    .vanTable{
      text-align: center;
      margin: 0px 0px;
      border-right: none;
      border-bottom:none;
      font-size: 11px;
      .vanTable_title{
        position: -webkit-sticky;
        position: sticky;
        top: 40px;
        z-index: 999;

        width: 13.5rem;
        font-weight: bold;
        color: #fff;
        background-color: #d83442;
        .row_box{
          line-height: 30px;
        }
      }
      .sticky-box {

      }
      .vanTable_body{
        width: 13.5rem;
        position: relative;
        .vanTable_body_row{
          border-bottom: 1px solid #ddd;
          .row_box{
            padding: 0px 0;
            .hezhi{
              font-size: 15px;
              display: inline-block;
              box-sizing: border-box;
              width: 6.25%;
              b{
                opacity: 0;
              }
            }
            .hezhiY:first-child{
              border: 0;
            }
            .hezhiY{
              b{
                opacity: 1;
              }
            }
            .kuadu{
              font-size: 13px;
              display: inline-block;
              box-sizing: border-box;
              width: 16.666666666%;
              border-left: 1px solid #EFEEF4;
              b{
                opacity: 0;
              }
            }
            .kuadu:first-child{
              border: 0;
            }
            .kuaduY{
              b{
                opacity: 1;
              }
            }
            .daxiao{
              display: inline-block;
              width: 0.5rem;
              font-weight: bolder;
              font-size: 12px;
            }
            .opacity0{
              opacity: 0;
            }
            .b_box{
              .kaijiang1{
                color: blue;
              }
              .kaijiang2{
                color: red;
              }
              .b{
                margin: 0 3px;
                color: #fff;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: #5A7D36;
                position: relative;
              }
              .miniNum{
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                transform: scale(0.7);
                display: inline-block;
                top: -8px;
                right: -10px;
                background-color: #d83442;
              }
              .danhuang{
                border-radius: 5px;
                background-color: #02A7F0;
              }
              .danhuang_dan{
                background-color: #F59A23;
              }
              .zonghelonghu{
                border-radius: 5px;
                background: none;
                color: #000;
                height: auto;
              }
              .no_active{
                opacity: 0;
              }
            }
          }
        }
      }
      .row_box{
        border-right: 1px solid #ddd;
        .van-button--mini{
          min-width: 0;
          padding: 0 1px;
          margin-left: 3px;
          .van-button__text{
            transform: scale(0.85);
          }
        }
      }
      .row_box:last-child{
        border: 0;
      }
    }
    #mc{
      position: absolute;
      top: 70px;
      left: 0;
    }
    #mc2{
      position: absolute;
      top: 70px;
      left: 0;
    }
  }
</style>
