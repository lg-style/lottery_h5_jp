import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function (location) {
  try {
    return originalPush.call(this,location).catch(err=>err);
  }catch (error) {
    console.error(error)
  }
}

const index = r => require.ensure([], () => r(require('@/components/index')), 'index')
const login = r => require.ensure([], () => r(require('@/components/login/index')), 'login')
const load = r => require.ensure([], () => r(require('@/components/login/load')), 'load')
const home = r => require.ensure([], () => r(require('@/components/home/index')), 'home')
const changlong = r => require.ensure([], () => r(require('@/components/home/changlong')), 'changlong')
const gameplayer = r => require.ensure([], () => r(require('@/components/home/gameplayer')), 'gameplayer')
const extend = r => require.ensure([], () => r(require('@/components/home/extend')), 'extend')
const newNotice = r => require.ensure([], () => r(require('@/components/MyCenter/newNotice')), 'newNotice')



const MyCenter = r => require.ensure([], () => r(require('@/components/MyCenter/index')), 'MyCenter')
const statement = r => require.ensure([], () => r(require('@/components/MyCenter/statement')), 'statement')
const edhz = r => require.ensure([], () => r(require('@/components/MyCenter/edhz')), 'edhz')
const tradingRecord = r => require.ensure([], () => r(require('@/components/MyCenter/tradingRecord')), 'tradingRecord')
const betRecord = r => require.ensure([], () => r(require('@/components/MyCenter/betRecord')), 'betRecord')
const switchLine = r => require.ensure([], () => r(require('@/components/MyCenter/switchLine')), 'switchLine')
const Security = r => require.ensure([], () => r(require('@/components/MyCenter/Security')), 'Security')
const customerService = r => require.ensure([], () => r(require('@/components/MyCenter/customerServiceDetail')), 'customerService')


const discounts = r => require.ensure([], () => r(require('@/components/playingMethod/discounts')), 'discounts')
const recharge = r => require.ensure([], () => r(require('@/components/playingMethod/recharge')), 'recharge')
const discover = r => require.ensure([], () => r(require('@/components/playingMethod/discover')), 'discover')
const withdrawDeposit = r => require.ensure([], () => r(require('@/components/playingMethod/withdrawDeposit')), 'withdrawDeposit')
const Service = r => require.ensure([], () => r(require('@/components/playingMethod/Service')), 'Service')
const agentPage = r => require.ensure([], () => r(require('@/components/playingMethod/agentPage')), 'agentPage')
const MyMessage = r => require.ensure([], () => r(require('@/components/MyCenter/MyMessage')), 'MyMessage')
const linkUrl = r => require.ensure([], () => r(require('@/components/MyCenter/linkUrl')), 'linkUrl')

const lottery = r => require.ensure([], () => r(require('@/components/lottery/index')), 'lottery')

//代理中心
const agentExplain = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/agentExplain')), 'agentExplain')
const agentBetRecord = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/agentBetRecord')), 'agentBetRecord')
const agentTradingRecord = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/agentTradingRecord')), 'agentTradingRecord')
const agentStatement = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/agentStatement')), 'agentStatement')
const subordinateStatement = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/subordinateStatement')), 'agentStatement')
const MemberManage = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/MemberManage')), 'MemberManage')
const InvitationCodeManage = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/InvitationCodeManage')), 'InvitationCodeManage')
const createInvitationCode = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/createInvitationCode')), 'createInvitationCode')
const huazhuan = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/huazhuan')), 'huazhuan')
const huazhuan2 = r => require.ensure([], () => r(require('@/components/playingMethod/agentCenter/huazhuan2')), 'huazhuan2')

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/login',name:'用户登录', component: login,},//登录页
    {path: '/load', component: load,},//加载页
    {path: '/Service',name:'客服中心', component: Service},//客服中心1
    {path: '/customerService', component: customerService},//客服中心2
    {
      path: '/',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'首页',
        component:home,
      }]
    },
    {
      path: '/discounts',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'活动中心',
        component:discounts,
      }]
    },
    {
      path: '/recharge',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'充值中心',
        component:recharge,
      }]
    },
    {
      path: '/discover',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'中奖信息',
        component:discover,
      }]
    },
    {
      path: '/MyCenter',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'我的账户',
        component:MyCenter,
      }]
    },
    {
      path: '/agentExplain',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理说明',
        component:agentExplain,
      }]
    },
    {
      path: '/agentExplain',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理说明',
        component:agentExplain,
      }]
    },
    {
      path: '/agentBetRecord',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理投注记录',
        component:agentBetRecord,
      }]
    },
    {
      path: '/agentTradingRecord',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理交易记录',
        component:agentTradingRecord,
      }]
    },
    {
      path: '/agentStatement',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理报表',
        component:agentStatement,
      }]
    },
    {
      path: '/subordinateStatement',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'下级报表',
        component:subordinateStatement,
      }]
    },
    {
      path: '/MemberManage',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'会员报表',
        component:MemberManage,
      }]
    },
    {
      path: '/InvitationCodeManage',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'邀请码管理',
        component:InvitationCodeManage,
      }]
    },
    {
      path: '/createInvitationCode',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'生成邀请码',
        component:createInvitationCode,
      }]
    },
    {
      path: '/kaihu',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'立即开户',
        component:createInvitationCode,
      }]
    },
    {
      path: '/huazhuan',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'给下级转账',
        component:huazhuan,
      }]
    },
    {
      path: '/huazhuan2',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'给上级转账',
        component:huazhuan2,
      }]
    },
    {
      path: '/agentPage',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'代理中心',
        component:agentPage,
      }]
    },
    {
      path: '/withdrawDeposit',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'提现',
        component:withdrawDeposit,
      }]
    },
    {
      path: '/MyMessage',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'我的消息',
        component:MyMessage,
      }]
    },
    {
      path: '/linkUrl',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'线路',
        component:linkUrl,
      }]
    },
    {
      path: '/Security',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'安全中心',
        component:Security,
      }]
    },
    {
      path: '/edhz',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'额度划转',
        component:edhz,
      }]
    },
    {
      path: '/betRecord',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'投注记录',
        component:betRecord,
      }]
    },
    {
      path: '/tradingRecord',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'交易记录',
        component:tradingRecord,
      }]
    },
    {
      path: '/statement',
      component: index,
      meta:{isLogin:true},
      children:[{
        path:'',
        name:'个人报表',
        component:statement,
      }]
    },

    {path: '/changlong', name:'长龙助手', component: changlong,meta:{isLogin:true}},//长龙下注

    {path: '/lottery', name:'彩票中心', component: lottery,meta:{isLogin:true}},//彩票
    // {path: '/statement', component: statement,meta:{isLogin:true}},//个人报表
    // {path: '/edhz', component: edhz,meta:{isLogin:true}},//三方游戏 额度划转
    // {path: '/tradingRecord', component: tradingRecord,meta:{isLogin:true}},//交易记录
    // {path: '/betRecord', component: betRecord,meta:{isLogin:true}},//投注记录
    // {path: '/switchLine', component: switchLine,meta:{isLogin:true}},//线路选择2
    // {path: '/Security', component: Security,meta:{isLogin:true}},//安全中心
    // {path: '/withdrawDeposit', component: withdrawDeposit,meta:{isLogin:true}},//提现
    // {path: '/agentPage', component: agentPage,meta:{isLogin:true}},//代理中心
    // {path: '/MyMessage', component: MyMessage,meta:{isLogin:true}},//我的消息
    // {path: '/linkUrl', component: linkUrl,meta:{isLogin:true}},//线路选择

  //  代理中心
    // {path: '/agentExplain', component: agentExplain,meta:{isLogin:true}},//代理说明
    // {path: '/agentBetRecord', component: agentBetRecord,meta:{isLogin:true}},//代理投注记录
    // {path: '/agentTradingRecord', component: agentTradingRecord,meta:{isLogin:true}},//代理交易记录
    // {path: '/agentStatement', component: agentStatement,meta:{isLogin:true}},//代理报表
    // {path: '/subordinateStatement', component: subordinateStatement,meta:{isLogin:true}},//下级报表
    // {path: '/MemberManage', component: MemberManage,meta:{isLogin:true}},//会员报表
    // {path: '/InvitationCodeManage', component: InvitationCodeManage,meta:{isLogin:true}},//邀请码管理
    // {path: '/createInvitationCode', component: createInvitationCode,meta:{isLogin:true}},//生成邀请码
    // {path: '/kaihu', component: createInvitationCode,meta:{isLogin:true}},//立即开户
    // {path: '/huazhuan', component: huazhuan,meta:{isLogin:true}},//额度划转

    {path: '/gameplayer', name:'游戏中心', component: gameplayer,meta:{isLogin:true}},//游戏
    {path: '/extend', name:'全民推广', component: extend,meta:{isLogin:true}},//推广
    {path: '/newNotice', name:'公告', component: newNotice,meta:{isLogin:true}},//最新公告
    

  ],
  // mode:"history"
})

