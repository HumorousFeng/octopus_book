<template>
  <div class="orderdetail_container">
    <!-- 状态栏 -->
    <div class="status_container">
      <van-row class="box">
        <van-col span="14" class="text_left">
          <div>
             <p class="tl title" v-text="chinaStatus"></p>
             <p class="tl subtitle" v-text="chinaSubStatus"></p>
          </div>
        </van-col>
        <van-col span="10" class="icon_right">
          <div class="fr" :class="orderimg"></div>
        </van-col>
      </van-row>
    </div>
    <!-- 收货地址栏 -->
    <div class="address_container">
      <van-row class="box">
        <van-col span="2" class="icon_left">
          <div><img src="../../images/address.png" alt="address"></div>
        </van-col>
        <van-col span="21" class="address_right">
          <div>收货人：<span v-text="orderItem.name"></span><span class="fr" v-text="orderItem.tel"></span></div>
          <div>收货地址：<span v-text="orderItem.district+' '+orderItem.address"></span></div>
        </van-col>
      </van-row>
    </div>
    <!-- 签收情况栏 -->
    <div class="get_container" v-if="getstatus">
       <h4>物流信息</h4>
       <van-row class="box">
        <van-col span="2" class="icon_left">
         <div :class="logisticsimg"></div>
        </van-col>
        <van-col span="19" class="address_right">
          <div v-text="getText" class="logistics_text"></div>
          <div v-text="">2017-05-06 17:55:12</div>
        </van-col>
        <van-col span="2" class="icon_left">
         <div><img src="../../images/rightjt.png" alt="下一步"></div>
        </van-col>
      </van-row>
    </div>
    <!-- 商品信息栏 -->
    <div class="order_container">
        <div class="order_title">
          <span>订单号：<i v-text="orderItem.order_id"></i></span>
        </div>
        <div class="order_content">
           <van-card class="card_content" :title="orderItem.template_name" :desc="orderItem.discount_price" :num="orderItem.num" :price="orderItem.unit_price" :thumb="orderItem.img"/> 
        </div>
        <div class="gift_container">
          <div>
            <span class="fr money_num">￥<i v-text=""></i>00</span>
            <span class="">运费</span>
          </div>
          <div>
            <span class="fr money_num">-￥<i v-text="orderItem.discount_price"></i></span>
            <span class="">礼品卡</span>
          </div>
        </div>
        <div class="order_money">
          <span class="fr money_num">￥<i v-text="orderItem.real_price"></i><span style="font-size:0.24rem;color:#ff5547;">.00</span></span>
          <span class="fl">订单金额</span>
        </div>
    </div>
    <div class="clear"></div>
    <!-- 订单时间信息栏 -->
    <div class="orderTime_container">
      <div>
        <span class="fr"><i v-text="orderItem.order_id"></i></span>
        <span class="">订单号</span>
      </div>
      <div>
        <span class="fr"><i v-text="orderItem.created_at"></i></span>
        <span class="">创建时间</span>
      </div>
      <div>
        <span class="fr"><i v-text="orderItem.updated_at"></i></span>
        <span class="">付款时间</span>
      </div>
    </div>
    <!-- 操作栏 -->
    <div class="operate_container" v-if="operateflag">
      <van-row>
        <van-col span="12" class="time_left" v-if="timenum>0">
          <span v-text="waitTimeStr"></span>
        </van-col>
        <van-col span="12" class="btn_right">
          <div class="order_btn" @click="onClickLeft">
            <div class="tc fr" v-text="paymoneytext1"></div>
          </div>
          <div class="order_btn" @click="onClickRight">
            <div class="tc fr" v-text="paymoneytext2"></div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import SERVERUTIL from "../../lib/SeviceUtil";
import UTILS from "../../lib/utils";
import { mapState, mapMutations } from "vuex";
  export default {
    data(){
      return{
        orderstatus:"", //订单状态
        chinaStatus:"",  //订单中文
        chinaSubStatus:"", //订单下标题
        orderimg:"yfk",  //订单状态图片
        getstatus:false, //签收栏不显示
        orderItem:{},  //订单信息数据
        getText:"", //物流信息内容
        operateflag:false, //操作不显示
        waitTimeStr:"", //待付款的倒计时
        paymoneytext1:"", //按钮显示内容
        paymoneytext2:"", //按钮显示内容
        logisticsimg:"logywc",
        timenum:0, //倒计时
        timer:null,
      }
    },
    methods:{
      getOrderInfoFn(orderid){
        var this_ = this;
        var obj = {
          service:"getUserOrderInfo",
          stoken:this_.token,
          id:orderid
        };
        SERVERUTIL.base.baseurl(obj).then(res => {
          if(res.data.code ==0) {
            if (res.data.data) {
              this_.orderstatus = res.data.data.status;
              this_.orderItem = res.data.data;
              this_.orderItem.real_price = Number(this_.orderItem.real_price).toFixed(0);
              this_.detailFn();
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },
      detailFn(){
        var this_ = this;
        if(this_.orderstatus == 1){
          this_.chinaStatus = '待付款';
          this_.timenum = this_.orderItem.wait_time;
          if(this_.timenum > 0){
            var str = UTILS.TIMERSET.FORMATSECONDS(this_.timenum);
            this_.chinaSubStatus = str + "后将自动取消";
            this_.waitTimeStr = UTILS.TIMERSET.FORMATTIME(this_.timenum);

            this_.timer = setInterval(function(){
              if(this_.timenum > 0){
                this_.timenum--;
                var str = UTILS.TIMERSET.FORMATSECONDS(this_.timenum);
                this_.chinaSubStatus = str + "后将自动取消";
                this_.waitTimeStr = UTILS.TIMERSET.FORMATTIME(this_.timenum);
              }else{
                clearInterval(this_.timer);
                this_.timer = null;
                this_.getOrderInfoFn(this_.orderItem.order_id);
              }
            },1000);
          };
          this_.orderimg = 'dfk';
          this_.paymoneytext1 ="取消订单";
          this_.paymoneytext2 ="继续支付";
          this_.operateflag = true;
        }else if(this_.orderstatus == 2){
          this_.chinaStatus = '已取消';
          this_.chinaSubStatus = "";
          this_.waitTimeStr = "";
          this_.orderimg = 'yqx';
          this_.getstatus = false;
          this_.operateflag = false;
        }else if(this_.orderstatus == 3){
          this_.chinaStatus = '已付款，待印刷';
          this_.chinaSubStatus = "照片书正在检查，等待印刷";
          this_.waitTimeStr = "";
          this_.orderimg = 'yfk';
          this_.getstatus = false;
          this_.operateflag = false;
        }else if(this_.orderstatus == 4){
          this_.chinaStatus = '已发货';
          this_.getstatus = true;
          this_.chinaSubStatus = "货物已发出，请注意查收";
          this_.waitTimeStr = "";
          this_.orderimg = 'yfh';
          this_.getText = "申通物流已揽收";
          this_.operateflag = true;
          this_.paymoneytext1 ="物流详情";
          this_.paymoneytext2 ="确认收货";
        }else if(this_.orderstatus == 5){
          this_.chinaStatus = '已签收';
          this_.getstatus = true;
          this_.chinaSubStatus = "";
          this_.waitTimeStr = "";
          this_.orderimg = 'yqs';
          this_.getText = "您已签收本次订单包裹，本次配送完成";
          this_.operateflag = true;
          this_.paymoneytext1 ="物流详情";
          this_.paymoneytext2 ="确认收货";
        }else{
          this_.chinaStatus = '已完成';
          this_.operateflag = false;
          this_.getstatus = true;
          this_.chinaSubStatus = "";
          this_.waitTimeStr = "";
          this_.orderimg = 'ywc';
          this_.getText = "您已签收本次订单包裹，本次配送完成";
        };
      },
      onClickLeft(){
        var this_ = this;
        if(this_.orderstatus == 1){
          this_.$dialog.confirm({
            title: '',
            message: '确定要取消此订单吗？'
          }).then(() => {
            var paramsobj = {
              service: "setOrder",
              stoken: this_.token,
              id: this_.orderItem.order_id,
              status: 2
            };
            SERVERUTIL.base.baseurl(paramsobj).then(res => {
              if (res.data.code == 0) {
                clearInterval(this_.timer);
                this_.timer = null;
                this_.getOrderInfoFn(this_.orderItem.order_id);
              }
            }).catch(error => {
              console.log(error);
            });
          }).catch(() => {

          });
        }else if(this_.orderstatus == 4 || this_.orderstatus == 5){
          alert('物流详情');
        }
      },
      onClickRight(){
        var this_ = this;
        if(this_.orderstatus == 1){
          //调用wx支付
          var paramsobj = {
            service: "payOrder",
            stoken: this_.token,
            id: this_.orderItem.order_id
          };
          SERVERUTIL.base.baseurl(paramsobj).then(res => {
            if(res.data.code ==0){
              if(res.data.data){
                localStorage.setItem('token', this_.token);
                //调用wx支付接口
                var url = res.data.data;
                window.location.href = encodeURI(url);
              }
            }else{
              const toast = this_.$toast({
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '下单失败：'+res.data.message
              });
            }
          }).catch(error => {
            console.log(error);
          });
        }else if(this_.orderstatus == 4 || this_.orderstatus == 5){
          alert('确定收货');
        }
      },
      ...mapMutations([
        "changeToken"
      ])
    },
    mounted() {
      var this_ = this;
      document.title = "订单详情";
      this_.orderstatus = this_.$route.params.status;
      if(this_.$route.params.data){
        this_.orderItem = this_.$route.params.data;
        this_.orderItem.real_price = Number(this_.orderItem.real_price).toFixed(0);
        this_.detailFn();
      }else{
        this_.getOrderInfoFn(this_.orderid);
      }
    },
    beforeDestroy() {
      var this_ = this;
      if(this_.timer) {
        clearInterval(this_.timer); //关闭
      }
    },
    computed:{
      ...mapState(['token','orderid'])
    },
  }
</script>

<style scoped lang="scss" type="text/css">
.orderdetail_container{
    font-family: '微软雅黑';
  .status_container,.address_container,{
    height: 2rem;
    width: 100vw;
    background: url(../../images/ordertopbg.png) no-repeat;
    background-size: 100% 100%;
    .box{
      height: 100%;
      .text_left{
        height: 100%;
        div{
         padding-top: 0.70rem;
         padding-left:0.72rem;
         box-sizing: border-box;
         .title{
           color: #fff;
           font-size:0.30rem;  
         }
         .subtitle{
           color: #ccc;
           font-size:0.24rem;
         }
        }
      }
      .icon_right{
        div{
         width: 1.82rem;
         height: 1.02rem;
         background: url(../../images/ywc.png) no-repeat;
         background-size:100% 100%;
         margin-top: 0.6rem;
         margin-right: 1.48rem;
        }
        .dfk{
          height: 0.95rem;
          background: url(../../images/dfk.png) no-repeat;
          background-size:100% 100%;  
        }
        .yfk{
          height: 0.97rem;
          background: url(../../images/yfk.png) no-repeat;
          background-size:100% 100%;  
        }
        .yfh{
          height: 0.77rem;
          background: url(../../images/yfh.png) no-repeat;
          background-size:100% 100%;  
        }
        .yqx{
          height: 0.95rem;
          background: url(../../images/yqx.png) no-repeat;
          background-size:100% 100%;  
        }
        .yqs{
          height: 1.02rem;
          background: url(../../images/yqs.png) no-repeat;
          background-size:100% 100%;     
        }
        .ywc{
          width: 0.8rem;
          height: 0.8rem;
          background: url(../../images/ywc.png) no-repeat;
          background-size:100% 100%;  
        }
      }
    }
    
  }
  .address_container,.get_container{
    height: 1.24rem;
    padding:0.3rem;
    background: white;
    box-sizing: border-box;
    color: #999;
    margin-bottom: 0.2rem;
    .icon_left{
      margin-right: 0.1rem;
    }
  }
  .get_container,.order_container{
    height: 1.76rem;
    background: white;
    margin-bottom: 0.2rem;
    .box{
      margin-top: 0.15rem;
      .logistics_text{
        color: black;
        font-size: 0.3rem;
      }
    }
    .logywc{
     width: 0.44rem;
     height: 0.44rem;
     background: url(../../images/complete.png) no-repeat;
     background-size: 100% 100%;
     margin-top: 0.1rem;
   }
  }

  .order_container{
    background: white;
    margin-bottom:0.2rem;
    .order_title,.order_money{
      height: 0.7rem;
      line-height: 0.7rem;
      padding: 0 0.3rem 0 0.4rem;
      color: #999;
      font-size:0.24rem;
      .pay_status{
        line-height: 0.7rem;
        color: #ff5747;
        font-size:0.28rem;
      }
    }
    .gift_container{
      padding:0.1rem;
      height:1.24rem;
      box-sizing: border-box;
      background: white;
      padding:0.3rem;
      border-bottom:1px solid #f1f1f1;
      color: #999;
    }
    .order_money{
      border-bottom: 1px solid #f1f1f1;
      background:white;
      span{
        color:#111;
        font-size: 0.3rem;
        line-height: 0.7rem;
      }
      .money_num{
        font-size: 0.3rem;
        color:#ff5747;
        i{
          font-size: 0.3rem;
        }
      }
    }
    
    .order_content{
      .card_content{
        height:2rem;
        .van-card__thumb{
          width:0.9rem;
          height:0.9rem;
        }
        img{
          width:0.9rem;
          height:0.9rem;
        }
      }
    }
  }
  .orderTime_container{
    padding:0.3rem;
    box-sizing: border-box;
    background: white;
    border-bottom:1px solid #f1f1f1;
    color: #999;
    margin-top: 0.2rem;
  }
  .operate_container{
    .time_left{
      color:#F44;
      padding:0.25rem;
      span{
        font-size: 16px;
      }
    }
    .btn_right{
      float: right;
      display: flex;
      flex-direction: row;
      .order_btn{
        height: 1rem;
        line-height: 1rem;
        div{
          width: 1.6rem;
          height: 0.6rem;line-height: 0.6rem;
          background: url(../../images/orderbtn.png) no-repeat;
          background-size:100% 100%; 
          margin-right: 0.3rem;
          margin-top: 0.2rem;
          color: #ff5547;
          font-size:0.28rem;
        }
      }
    }
    
  }
}  
</style>