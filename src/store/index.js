import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex);





const state = {
  token:"",
  vnickname:"", //名称作者
  modeltypeid:"",  //模板类型的id
  modeltypename:"",//模板类型的名称
  modelid:"",  //选择的模板的id
  modelname:"",//模板名称
  bookinfo:{}, //图书信息
  vgiftuserlist:[], //礼品卡使用的数量
  vgiftflag:true, // 礼品卡的入口 false-个人中心   true -- 确认支付
  vaddressenterflag:false, //地址管理的入口 false-确认支付   true -- 个人中心
  vaddress:"",  //最后收货地址
  vbuynum:1, //购买数量
  vfailimgary:[], //不合格的图片列表,
  vsavetoeditflag:false, //从保存到编辑页面
  paybook:{}, //保存成功的制作相册的下一步时保存的图书信息
  orderid:"", //订单id
}

const mutations = {
  //token值的保留
  changeToken(state, value){
    state.token = value;
  },
   //昵称值的 -- 在个人中心修改会改变，首页是第一次保存
   changeNickname(state, value){
    state.vnickname = value;
  },
  //模板类型的id
  changeModelTypeId(state, value){
    state.modeltypeid = value;
  },
  //模板类型的name
  changeModelTypeName(state, value){
    state.modeltypename = value;
  },
  //选择的模板的id
  changeModelId(state, value){
    state.modelid = value;
  },
  //模板的name
  changeModelName(state, value){
    state.modelname = value;
  },
  //图书信息
  changeBookInfo(state,value){
    state.bookinfo=value;
  },
  //保存成功的制作相册的下一步时保存的图书信息
  changePayBook(state,value){
    state.paybook=value;
  },
   //礼品卡使用的数量
  changeGiftlist(state,value){
    state.vgiftuserlist=value;
  },
  //礼品卡的入口
  changeGift(state,value){
    state.vgiftflag=value;
  },
  //地址管理的入口
  changeEnter(state,value){
    state.vaddressenterflag=value;
  },
  //收获地址
  changeaddress(state,value){
    state.vaddress=value;
  },
  //购买数量
  changebuynum(state,value){
    state.vbuynum=value;
  },
  //获取上传成功的图片
  changefailimg(state,value){
    state.vfailimgary=value;
  },
  //从保存到编辑页面
  changesaveflag(state,value){
    state.vsavetoeditflag=value;
  },
  //订单id
  changeOrderId(state,value){
    state.orderid=value;
  }
}

export default new Vuex.Store({
  state,
  mutations,
})
