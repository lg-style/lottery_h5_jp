<template>
  <div class="pk10">
    <div class="max_box">
      <div class="div" v-for="(k,i) in NameList.filter(itme=>{ return itme.show==active})" :key="i">
<!--        <div class="title_text">-->
<!--          <span>{{ k.text }}</span>-->
<!--          <span v-if="k.oddsShow&&k.list[0]">-->
<!--            赔率:<b class="odds">{{ k.list[0].odds }}</b>-->
<!--          </span>-->
<!--        </div>-->
<!--        <div v-if="k.name=='三不同号'" style="text-align: center">-->
<!--          <div class="min_box minBox" v-for="j in 6" :key="j" @click="butonghao3(j,k)">-->
<!--            <van-row type="flex" justify="space-between" align="center" class="box"-->
<!--                     :class="{'current':butonghao3Arr.includes(j)}">-->
<!--              <div class="name">{{ j }}</div>-->
<!--            </van-row>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-else-if="k.name=='二不同号'" style="text-align: center">-->
<!--          <div class="min_box minBox" v-for="j in 6" :key="j" @click="butonghao2(j,k)">-->
<!--            <van-row type="flex" justify="space-between" align="center" class="box"-->
<!--                     :class="{'current':butonghao3Arr.includes(j)}">-->
<!--              <div class="name">{{ j }}</div>-->
<!--            </van-row>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-else-if="k.name=='不中'" style="text-align: center">-->
<!--          <div class="min_box minBox" v-for="j in 6" :key="j" @click="buzhong(j,k)">-->
<!--            <van-row type="flex" justify="space-between" align="center" class="box"-->
<!--                     :class="{'current':butonghao3Arr.includes(j)}">-->
<!--              <div class="name">{{ j }}</div>-->
<!--            </van-row>-->
<!--          </div>-->
<!--          <div v-if="currentList[0]" style="padding: 10px 0">倍率：{{ currentList[0].odds }}</div>-->
<!--          <div v-else></div>-->
<!--        </div>-->
<!--        <div v-else-if="k.name=='二同号单选'" style="text-align: center">-->
<!--          <div class="min_box minBox" v-for="j in 6" :key="j+6" @click="shuanghao(j+''+j,k)">-->
<!--            <van-row type="flex" justify="space-between" align="center" class="box"-->
<!--                     :class="{'current':shuanghaoArr.includes(j+''+j)}">-->
<!--              <div class="name">{{ j+''+j }}</div>-->
<!--            </van-row>-->
<!--          </div>-->
<!--          <hr>-->
<!--          <div class="min_box minBox" v-for="j in 6" :key="j" @click="danhao(j,k)">-->
<!--            <van-row type="flex" justify="space-between" align="center" class="box"-->
<!--                     :class="{'current':danhaoArr.includes(j)}">-->
<!--              <div class="name">{{ j }}</div>-->
<!--            </van-row>-->
<!--          </div>-->
<!--        </div>-->
        <div>
          <div class="min_box" :class="'min_box'+k.show" v-for="(n,j) in k.list" :key="j" @click="getRow(k,n)" v-show="onShow(n)" v-if="[110,111,112,113,
            114,115,116,117].indexOf(n.id)>-1">
            <van-row type="flex" justify="space-between" align="center" class="box"
                     :class="{'current':currentList.filter(itme=>{return itme.id==n.id}).length>0}">
              <div class="name">{{ translateLotteryText(n.itemObject) }}</div>
              <div class="odds">{{ setOdds(n) }}</div>
            </van-row>
          </div>
          <div class="min_box" :class="'min_box'+k.show" v-for="(n,j) in k.list" :key="j" @click="getRow(k,n)" v-show="onShow(n)" v-if="[110,111,112,113,
            114,115,116,117].indexOf(n.id)==-1">
            <van-row type="flex" justify="space-between" align="center" class="box"
                     :class="{'current':currentList.filter(itme=>{return itme.id==n.id}).length>0}">
              <div class="name">{{ translateLotteryText(n.itemObject) }}</div>
              <div class="odds">{{ setOdds(n) }}</div>
            </van-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState,mapActions} from "vuex";
  import config from "../../util/config";
  export default {
    props:['type','current'],
    data() {
      return {
        danhaoArr:[],
        shuanghaoArr:[],
        butonghao3Arr:[],
        show:false,
        but_currentList:['冠军'],
        resultShow:false,
      };
    },
    computed:{
      ...mapState(['lotteryNameList','lotteryObj','fanshui','backPoint']),
      NameList(){
        let json = this.lotteryNameList.filter(k=>{return k.groupName==this.lotteryObj.groupName})[0] || {}
        return json.list || []
      },
      currentList(){
        return this.current || []
      },
      active(){
        return this.type
      },
    },
    mounted() {
      // console.log(config.math(6,3))
    },
    methods: {
      translateLotteryText(text) {
        if (!text && text !== 0) {
          return text;
        }
        const key = `lotteryIndex.${text}`;
        return this.$te(key) ? this.$t(key) : text;
      },
      //根据反水设置赔率
      setOdds(n){
        let num = 0
        if(this.fanshui){
          num = n.odds-this.backPoint*0.01*n.limitValue
        }else {
          num = n.odds
        }
        return num.toFixed(4)/1
      },
      getRow(k,n){
        this.$emit("getRow",k,n);
      },
      onShow(list){
        return true
      },
      //  二同号单选-双号
      shuanghao(num,obj,bool){
        let arr = this.shuanghaoArr.filter(i=>{return i == num})
        if(arr.length>0){
          this.shuanghaoArr = this.shuanghaoArr.filter(i=>{return i != num})
        }else {
          this.shuanghaoArr.push(num)
        }
        if(!bool){
          for (let k of this.danhaoArr){
            if(num==k+''+k){
              this.danhao(k,obj,true)
              return
            }
          }
        }
        this.$emit("delRow");
        this.shuanghaoArr.map(k=>{
          this.danhaoArr.map(m=>{
            let numArr=(k+m).split('').sort()
            let itemObject = numArr.join('')
            let n = obj.list.filter(k=>{return k.itemObject==itemObject})[0]
            this.$emit("getRow",obj,n);
          })
        })
      },
      //  二同号单选-单号
      danhao(num,obj,bool){
        let arr = this.danhaoArr.filter(i=>{return i == num})
        if(arr.length>0){
          this.danhaoArr = this.danhaoArr.filter(i=>{return i != num})
        }else {
          this.danhaoArr.push(num)
        }
        if(!bool) {
          for (let k of this.shuanghaoArr) {
            if (k == num + '' + num) {
              this.shuanghao(k, obj, true)
              return
            }
          }
        }
        this.$emit("delRow");
        this.shuanghaoArr.map(k=>{
          this.danhaoArr.map(m=>{
            let numArr=(k+m).split('').sort()
            let itemObject = numArr.join('')
            let n = obj.list.filter(k=>{return k.itemObject==itemObject})[0]
            this.$emit("getRow",obj,n);
          })
        })

      },
      buzhong(num,obj){
        let arr = this.butonghao3Arr.filter(i=>{return i == num})
        if(arr.length>0){
          this.butonghao3Arr = this.butonghao3Arr.filter(i=>{return i != num})
        }else {
          if(this.butonghao3Arr.length<5){
            this.butonghao3Arr.push(num)
          }
        }
        this.$emit("delRow");
        if(this.butonghao3Arr.length>0){
          let itemObject = this.butonghao3Arr.sort().join(',')
          let n = obj.list.filter(k=>{return k.itemObject==itemObject})[0]
          this.$emit("getRow",obj,n);
        }
      },
      //  二不同号
      butonghao2(num,obj){
        let arr = this.butonghao3Arr.filter(i=>{return i == num})
        if(arr.length>0){
          this.butonghao3Arr = this.butonghao3Arr.filter(i=>{return i != num})
        }else {
          this.butonghao3Arr.push(num)
        }
        //清空选择
        this.$emit("delRow");
        if(this.butonghao3Arr.length>=2){
          var array = this.butonghao3Arr;
          for(var i = 0, len1 = array.length; i < len1; i++) {
            var a2 = array.concat();
            a2.splice(0, i + 1);
            for(var j = 0, len2 = a2.length; j < len2; j++) {
              let numArr=[array[i],a2[j]].sort()
              let itemObject = numArr.join('')
              let n = obj.list.filter(k=>{return k.itemObject==itemObject})[0]
              this.$emit("getRow",obj,n);
            }
          }

        }
      },
      //  三不同号玩法
      butonghao3(num,obj){
        let arr = this.butonghao3Arr.filter(i=>{return i == num})
        if(arr.length>0){
          this.butonghao3Arr = this.butonghao3Arr.filter(i=>{return i != num})
        }else {
          this.butonghao3Arr.push(num)
        }
        //清空选择
        this.$emit("delRow");
        if(this.butonghao3Arr.length>=3){
          var array = this.butonghao3Arr;
          for(var i = 0, len1 = array.length; i < len1; i++) {
            var a2 = array.concat();
            /*
            排除之前已经组合过的数据
            比如：第一次的时候，i[0] = 1, 这个时候2层循环, 只循环 2~5,
            第二次的时候, i[1] = 2, 这个时候2层循环, 只循环 3~5
            同理：3层循环也是相比于2层循环来
            */
            a2.splice(0, i + 1);
            for(var j = 0, len2 = a2.length; j < len2; j++) {
              var a3 = a2.concat();
              a3.splice(0, j + 1);
              for(var k = 0, len3 = a3.length; k < len3; k++) {
                let numArr=[array[i],a2[j],a3[k]].sort()
                let itemObject = numArr.join('')
                let n = obj.list.filter(k=>{return k.itemObject==itemObject})[0]
                this.$emit("getRow",obj,n);
              }
            }
          }

        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .pk10{
    width: 80%;
    .max_box{
      // height: calc(100vh - 175px);
      // overflow-y: auto;
      // font-weight: bold;
      .but{
        padding: 2px 1px;
        display: inline-block;
        width: 17.5%;
        text-align: center;
        border: 1px solid #ddd;
        margin: 5px 1px 0px;
        border-radius: 5px;
      }
      .but_current{
        border-color: #d83442;
        background-color: #d83442;
        color: #fff;
      }
      .title_text{
        font-size: 12px;
        padding: 5px 0;
        line-height: 20px;
        .odds{
          display: inline-block;
          font-size: 20px;
          color: #d83442;
          position: relative;
          top: 2px;
        }
      }
      .title{
        height: 35px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.5);
      }
      .min_box{
        background-color: #fff;
        display: inline-block;
        width: 48%;
        font-size: 16px;
        margin: 2px;
        .box{
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          .name{

          }
          .odds{
            color: #d83442;
          }
        }
        .current{
          border-color: #d83442;
          background-color: #d83442;
          .name{
            color: #fff;
          }
          .odds{
            color: #fff;
          }
        }
      }
      .min_box2,.min_box5,.min_box17,.min_box11{
        width: 100% !important;
      }
      .minBox{
        width: 31.5%;
        font-size: 25px;
        .box{
          padding: 20px 10px;
          .name{
            text-align: center;
            width: 100%;
          }
        }
      }
      .div:last-child{
        padding-bottom: 400px;
      }
    }
  }
</style>
