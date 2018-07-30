<template>
  <div class="order_container">
    <div v-if="orderflag" class="has_order">
      <ul class="order_box">
         <li v-for="(item,index) in orderlists" v-if="item.status!=10" :key="index" @touchstart='touchStart' @touchend='touchEnd' >
           <van-cell-swipe :right-width="100" :on-close="onClose">
             <van-cell-group>
               <div class="order_title" @click="jumptodetail(item.status,item)">
                 <span>订单号：<i v-text="item.order_id"></i></span>
                 <span class="pay_status  fr" v-text="item.chinaStatus"></span>
               </div>
               <div class="order_content" @click="jumptodetail(item.status,item)">
                 <van-card :title="item.template_name" :desc="item.discount_price" :num="item.num" :price="item.unit_price" :thumb="item.img"/>
               </div>
               <div class="order_money">
                 <span class="fr money_num">￥<i v-text="item.real_price"></i><span style="font-size:0.24rem;color:#ff5547;">.00</span></span>
                 <span class="fr" v-text="item.paymoneyflag?'实付款':'需付款'"></span>
               </div>
               <div class="order_btn" v-if="item.paymoneybtn" @click="operatebtnFn(item.paymoneytext,item)">
                 <div class="tc fr " v-text="item.paymoneytext?'物流详情':'继续支付'"></div>
               </div>
             </van-cell-group>
             <span slot="right" style="height: 100%;width: 100px;background: #F44;
                       display: flex;padding-left: 15px;align-items: center"
                  @click="showOrDel(item.status,item)">
               <i style="font-size: 35px;color: #FFFFFF;" v-text="item.status == 2 || item.status == 6 ? '删除':'查看'"></i>
             </span>
           </van-cell-swipe>
         </li>
      </ul>
    </div>
    <div v-else class="no_order">
       <div class="no_order_tip">
           <img src="../../images/noorder.png" alt="暂无订单">
       </div> 
       <p class="tc">还没有订单哦</p>
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
        orderflag:true, //有订单
        userid:"",
        orderlists:[],
        startX:0,
        disX:0,
      }
    },
    methods:{
      //订单列表数据
      orderFn(){
        var this_ = this;
        var obj = {
          service: "getUserOrderList",
          stoken: this_.token,
        };
        SERVERUTIL.base.baseurl(obj).then(res => {
          if(res.data.code ==0){
            if(res.data.data){
              if(res.data.data.length){
                this_.orderlists = res.data.data;
                this_.orderlists.forEach((  item,index)=>{
                  item.real_price = Number(item.real_price).toFixed(0);
                  item.paymoneyflag=true;
                  item.paymoneybtn=false;
                  item.paymoneytext=false;
                  if(item.status == 1){
                    item.chinaStatus = '待付款';
                    item.paymoneyflag=false;
                    item.paymoneybtn=true;
                  }else  if(item.status == 2){
                    item.chinaStatus = '已取消';
                  }else  if(item.status == 3){
                    item.chinaStatus = '已付款，待印刷'; 
                  }else  if(item.status == 4){
                    item.chinaStatus = '已发货';
                    item.paymoneybtn=true; 
                    item.paymoneytext=true;
                  }else  if(item.status == 5){
                    item.chinaStatus = '已签收'; 
                  }else  if(item.status == 6){
                    item.chinaStatus = '已完成'; 
                  };
                }); 
              }else{
                this_.orderflag = false;
              }
             
            }
          }
        }).catch(error => {
          console.log(error);
        });
       
      },
      showOrDel(status,obj){
        var this_ = this;
        this_.disX = 0;
        if(status == 2) {
          //删除
          this_.$dialog.confirm({
            title: '',
            message: '确定要删除此订单吗？'
          }).then(() => {
            var paramsobj = {
              service: "setOrder",
              stoken: this_.token,
              id: obj.order_id,
              status: 10
            };
            SERVERUTIL.base.baseurl(paramsobj).then(res => {
              if (res.data.code == 0) {
                this_.orderFn();
              }
            }).catch(error => {
              console.log(error);
            });
          }).catch(() => {

          });
        }else{
          this_.jumptodetail(status,obj);
        }
      },
      //跳转到详情页
      jumptodetail(status,obj){
        var this_ = this;
        if(this_.disX > 0){
          return;
        }
        this_.changeOrderId(obj.order_id);
        this.$router.push({  
          path: '/orderdetail',
          name: 'ORDERDETAIL', 
          params: {   
            status: status,
            data:obj
          }, 
        }) ;
      },
      //继续支付和物流详情操作
      operatebtnFn(flag,obj){
        var this_ = this;
        //flag -true 物流详情   
        //flag -false  继续支付
        if(flag){
          this.$router.push({  
            path: '/logistics',
            name: 'LOGISTICS',
            params: {   
              id:obj.id
            }
          }) ;
        }else{
          //调用wx支付
        }
      },
      touchStart(ev){
        var this_ = this;
        ev = ev || event
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        if(ev.touches.length == 1){
          // 记录开始位置
          this_.startX = ev.touches[0].clientX;
        }
      },
      touchEnd(ev){
        var this_ = this;
        if (ev.changedTouches.length == 1) {
          let endX = ev.changedTouches[0].clientX;
          if(this_.startX - endX >= 10){
            this_.disX = this_.startX - endX;
          }
        }
      },
      onClose(clickPosition, instance) {
        var this_ = this;
        switch (clickPosition) {
          case 'left':
          case 'cell':
            instance.close();
            this_.disX = 0;
            break;
          case 'outside':
            instance.close();
            this_.disX = 0;
            break;
          case 'right':
            break;
        }
      },
      ...mapMutations([
        "changeToken","changeOrderId"
      ])
    },
    mounted() {
      var this_ = this;
      document.title = "我的订单";
      this_.userid = this_.$route.params.id;
      this_.orderFn();
      
    }, 
    computed:{
      ...mapState(['token'])
    }
   }
</script>

<style scoped lang="scss" type="text/css">
.order_container{
  .no_order{
    padding-top: 2.6rem;
    .no_order_tip{
      width: 0.9rem;
      height: 0.86rem;
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
  }
  .has_order{
    padding: 0.3rem 0;
    border-top:1px solid  #ccc;
    .order_box{
      li{
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
        .order_money{
          border-bottom: 1px solid #f1f1f1;
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
}
</style>