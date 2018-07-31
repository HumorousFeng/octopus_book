<template>
  <div class="payfail_container">
    <div class="home_icon" @click="jumptoHome">
      <img src="../../images/home.png" alt="首页">
    </div>
    <div class="fail_icon">
      <img src="../../images/warning.png" alt="支付失败">
    </div>
    <p class="tc">支付失败，请重新支付，在个人<br>中心的订单页面中可查看订单信息。</p>
    <div class="detail_next">
      <div class="btn" @click="jumptodetail">查看详情</div>
      <div class="btn" @click="jumptopay">继续支付</div>
    </div>
  </div>
</template>

<script>
import SERVERUTIL from "../../lib/SeviceUtil";
import UTILS from "../../lib/utils";
import { mapState, mapMutations } from "vuex";
  export default {
    methods:{
      jumptoHome(){
        var this_ = this;
        this.$router.push({
          path: '/index',
          name: 'INDEX'
        });
      },
      jumptodetail(){
        var this_ = this;
        this.$router.push({
          path: '/orderdetail',
          name: 'ORDERDETAIL'
        }) ;
      },
      jumptopay(){
        var this_ = this;

        var paramsobj = {
          service: "payOrder",
          stoken: token,
          id: order_id
        };
        SERVERUTIL.base.baseurl(paramsobj).then(res => {
          if(res.data.code ==0){
            if(res.data.data){
              localStorage.setItem('token', token);
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
      },
      ...mapMutations([
        "changeToken","changeOrderId"
      ])
    },
    mounted(){
      var this_ = this;
      document.title = '支付失败';
      var str = window.location.href;
      var obj = UTILS.PARAMSREG.paramsregurl(str);
      this_.changeOrderId(obj['orderid']);
      var token = localStorage.getItem('token');
      this_.changeToken(token);
      console.log(obj);
    },
    computed:{
      ...mapState([])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .payfail_container{
    padding-top: 0.5rem;
    .home_icon{
      float: right;
      width: 1rem;
      height: 1rem;
      padding-right: 0.2rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .fail_icon {
      padding-top: 1.9rem;
      width: 3.14rem;
      height: 2.01rem;
      margin: 0rem auto 0.3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      font-size: 0.24rem;
      color: #999;
    }
    .detail_next{
      white-space: nowrap;
      .btn{
        display: inline-block;
        margin: 1.1rem 0.5rem 0.5rem 0.5rem;
        width: 2.8rem;
        height: 0.86rem;
        line-height: 0.76rem;
        text-align: center;
        background: url('../../images/next.png') no-repeat;
        background-size: cover;
        font-size: 0.3rem;
        color: white;
      }
    }
  }
</style>