<template>
  <div class="paysuccess_container">
    <div class="home_icon" @click="jumptoHome">
      <img src="../../images/home.png" alt="首页">
    </div>
    <div class="success_icon">
      <img src="../../images/paysuccess.png" alt="支付成功">
    </div>
    <p class="tc">已成功支付，请等待发货，并在个人<br>中心的订单页面中及时关注物流信息。</p>
    <div class="detail_next" @click="jumptodetail()">查看详情</div>
    <div class="success_str"><span v-text="timenum+'s后自动回到首页'"></span></div>
  </div>
</template>

<script>
import UTILS from "../../lib/utils";
import { mapState, mapMutations } from "vuex";
  export default {
    data(){
      return{
        timer:null,
        timenum:5, //倒计时5s
      }
    },
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
        });
      },
      ...mapMutations([
        "changeToken","changeOrderId"
      ])
    },
    mounted(){
      var this_ = this;
      document.title = '支付成功';
      var str = window.location.href;
      var obj = UTILS.PARAMSREG.paramsregurl(str);
      this_.changeOrderId(obj['orderid']);
      var token = localStorage.getItem('token');
      this_.changeToken(token);
      console.log(obj);

      this_.timer = setInterval(function(){
        if(this_.timenum > 0){
          this_.timenum--;
        }else{
          clearInterval(this_.timer);
          this_.timer = null;
          this_.jumptoHome();
        }
      },1000);
    },
    beforeDestroy() {
      var this_ = this;
      if(this_.timer) {
        clearInterval(this_.timer); //关闭timer
      }
    },
    computed:{
      ...mapState([])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
.paysuccess_container{
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
  .success_icon {
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
    margin: 1.1rem auto 0.4rem;
    width: 6.9rem;
    height: 1.0rem;
    line-height: 0.9rem;
    text-align: center;
    background: url('../../images/longbtn.png') no-repeat;
    background-size: cover;
    font-size: 0.38rem;
    color: white;
  }
  .success_str{
    color:#F44;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    width: 100%;
    span{
      font-size: 0.24rem;
    }
  }
}
</style>