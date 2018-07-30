<template>
  <div class="paysuccess_container">
    <div class="success_icon">
      <img src="../../images/paysuccess.png" alt="支付成功">
    </div>
    <p class="tc">已成功支付，请等待发货，并在个人<br>中心的订单页面中及时关注物流信息。</p>
    <div class="detail_next" @click="jumptodetail()">查看详情</div>
  </div>
</template>

<script>
import UTILS from "../../lib/utils";
import { mapState, mapMutations } from "vuex";
  export default {
    methods:{
      jumptodetail(){
        var this_ = this;
        var str=window.location.href;
        var obj = UTILS.PARAMSREG.paramsregurl(str);
        console.log(obj);
        this_.changeOrderId(obj['order_id']);
        var token = localStorage.getItem('token');
        this_.changeToken(token);
        console.log('token'+token);
        this.$router.push({
          path: '/orderdetail',
          name: 'ORDERDETAIL'
        }) ;
      },
      ...mapMutations([
        "changeToken","changeOrderId"
      ])
    },
    mounted(){
      var this_ = this;
      document.title = '支付成功';
    },
    computed:{
      ...mapState([])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
.paysuccess_container{
    padding-top: 2.2rem;
  .success_icon {
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
}
</style>