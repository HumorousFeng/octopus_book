<template>
  <div class="personal_container" >
    <div class="back_orange">
      <div class="head_image">
        <!-- userInfo.header_img -->
        <img :src="userInfo.header_img" alt="userInfo.nick_name">
      </div>
      <div class="person_name">
        <span v-text="username" v-if="!editflag"></span>
        <input type="text" v-model="username" v-else @blur="changeNameFn($event)">
        <span @click="editFn($event)"><img src="../../images/editbook.png" alt=""></span>
      </div>
    </div>
    <div class="change_router">
        <div @click="jumptoorder(userInfo.id)">
          <img src="../../images/order.png" alt="" class="order_icon">
          <p>订单</p>
        </div>
        <div @click="jumptoaddress(true)">
          <img src="../../images/peraddress.png" alt="" class="address_icon">
          <p>地址</p>
        </div>
        <div @click="jumptogift(true)">
          <img src="../../images/giftcard.png" alt="" class="gift_icon">
          <p>礼品卡</p>
        </div>
    </div>
    <div class="my_book">
      <h4>我的书架 <span @click="jumptobook" v-if="bookflag2">更多<img src="../../images/rightjt.png" alt="无"></span></h4>
      <div v-if="bookflag">
        <van-row class="edit_item" style="border:none;">
          <van-col span="10" class="title_left">
            <img :src="bookOne.img" alt="相册">
          </van-col>
          <van-col span="14" class="content-right">
            <div class="opearte_container">
              <span class="delete_photo d-i-b" @click="operatebookFn(10)"></span>
              <span class="preview_photo d-i-b" @click="previewFn()"></span>
              <span class="edit_photo d-i-b" @click="jumptosave(bookOne)"></span>
            </div>
            <div class="use_photo tc" @click="jumptostartmakeFn(bookOne)">制作图书</div>
          </van-col>
        </van-row>
      </div>
      <div v-else class="nobook_container">
        <div class="no_book_tip tc">
          <img src="../../images/nobook.png" alt=".">
        </div>
        <p class="tc">亲~您的书架空空如也<br>快来开始著相册吧</p>
        <div class="use_photo tc" @click="jumptostartmakeFn(bookOne)">马上制作</div>
      </div>
    </div>
    <div class="footer">
       <p class="tc">客服 400-666-8888</p>
    </div>
  </div>
</template>

<script>
import SERVERUTIL from "../../lib/SeviceUtil";
import UTILS from "../../lib/utils";
import { mapState, mapMutations } from "vuex";
import { ImagePreview } from 'vant';
export default {
  data(){
    return{
      bookflag:true, //书架不为空
      bookflag2:true,//书架数量小于2
      editflag:false, //不可编辑
      username:"",
      userInfo:{}, //用户信息
      booklists:[] , //书架图书列表
      bookOne:{}, //展示的第一个
    }
  },
  methods:{
    //获取用户信息
    getUserInfoFn(token){
      var this_ = this;
      var obj={"service":"getUserInfo","stoken":token};
      SERVERUTIL.base.baseurl(obj).then(res => {
        if(res.data.code ==0){
          if(res.data.data){
            this_.userInfo = res.data.data;
            this_.username = this_.userInfo.nick_name;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取图书列表
    getBookListFn(token){
      var this_ = this;
      var obj={"service":"getBookList","stoken":token};
      SERVERUTIL.base.baseurl(obj).then(res => {
        if(res.data.code ==0){
          if(res.data.data){
            this_.booklists=res.data.data;

            if(this_.booklists.length){
              this_.bookOne=this_.booklists[0];
              if(this_.booklists.length>1){
                this_.bookflag2 = true;
              }else{
                this_.bookflag2 = false;
              }
            }else{
              this_.bookflag = false;
              this_.bookflag2 = false;
            }
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取可用礼品卡的数据
    getUserCardFn(token){
      var this_ = this;
      var obj={"service":"getUserCard","stoken":token,"status":""};
      SERVERUTIL.base.baseurl(obj).then(res => {
        if(res.data.code ==0){
          if(res.data.data){
            this_.giftcardnum = res.data.data.length;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //删除图书信息
    operatebookFn(status){
      var this_ = this;
      var status = status || "";
      this_.$dialog.confirm({
        title: '',
        message: '确定要删除此相册吗？'
      }).then(() => {
        var paramsobj={
          service: "setBookStatus",
          id: this_.booklists[0].id,
          stoken: this_.token,
          status: status
        };
        SERVERUTIL.base.baseurl(paramsobj).then(res => {
          if(res.data.code == 0){
            this_.getBookListFn(this_.token);
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {

      });
    },
    //预览图书
    previewFn(){
      var this_ = this;
      this_.changeModelTypeId(this_.bookOne.type_id);
      this_.changeModelTypeName(this_.bookOne.type_name);
      this_.changeModelId(this_.bookOne.template_id);
      this_.changeModelName(this_.bookOne.book_name);
      this_.changeBookInfo(this_.bookOne);
      this.$router.push({
        path: '/savesuccess',
        name: 'SAVESUCCESS',
        params: {
          title:"预览"
        }
      })
    },
    //编辑图书 -- 跳转到保存页面，不过是可以编辑
    jumptosave(obj){
      var this_ = this;
      this_.changeBookInfo(obj);
      this_.$router.push({
        path: '/editimg',
        name: 'EDITIMG'
      });
    },
    //跳转到我的书架更多
    jumptobook(){
      var this_ = this;
      this_.$router.push({
        path: '/mybook',
        name: 'MYBOOK'
      });
    },
    //跳转到订单页面
    jumptoorder(id){
      var this_ = this;
      this_.$router.push({
        path: '/order',
        name: 'ORDER',
        params: {
          id:id,
          token: this_.token
        },
      });
    },
    //跳转到地址页面
    jumptoaddress(flag){
      var this_ = this;
      this_.changeEnter(true);
      this_.$router.push({
        path: '/newaddress',
        name: 'NEWADDRESS'
      });
    },
    //跳转到礼品卡页面
    jumptogift(flag){
      var this_ = this;
      var flag;
      this_.changeGift(false);
      if(this_.giftcardnum>0){
        flag=true;
      }else{
        flag=false;
      }
      this_.$router.push({
        path: '/giftzero',
        name: 'GIFTZERO',
        params:{
          flag:flag
        }

      });
    },
    //制作相册 --- 跳转到马上制作页面
    jumptostartmakeFn(paramobj){
      var this_ = this;
      var quickmake = true;
      if(paramobj.type_id){
        this_.changeModelTypeId(paramobj.type_id);
        this_.changeModelTypeName(paramobj.type_name);
        this_.changeModelId(paramobj.template_id);
        this_.changeModelName(paramobj.book_name);
        this_.changeBookInfo(paramobj);
        quickmake = false;
      }
      this.$router.push({
        path: '/startmake',
        name: 'STARTMAKE',
        params: {
          quickmake: quickmake
        }
      }) ;
    },
    //修改用户名昵称
    changeNameFn(e){
      var this_ = this;
      this_.editflag =false;
      var obj={};
      obj={
        "service":"setUserInfo",
        "nick_name":this_.username,
        "stoken":this_.token,
      };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if(res.data.code == 0){
          this_.getUserInfoFn(this_.token);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //编辑名称
    editFn(e){
     e.cancelBubble =true;
     e.stopPropagation()
     this.editflag =true;
    },
    ...mapMutations([
      "changeToken","changeModelId","changeModelName","changeModelTypeId","changeModelTypeName","changeEnter","changeGift","changeBookInfo",
    ])
  },
  mounted() {
    var this_ = this;
    document.title = "个人中心";
    if(!this_.token){
      var str=window.location.href;
      var obj = UTILS.PARAMSREG.paramsregurl(str);
      this_.changeToken(obj["stoken"]);
    };
    this_.getUserInfoFn(this_.token);
    this_.getBookListFn(this_.token);
    this_.getUserCardFn(this_.token);
  },
  computed:{
    ...mapState(['token',"modelid","modeltypeid","modeltypename","vaddressenterflag","vgiftflag" ])
  }
};
</script>

<style scoped lang="scss" type="text/css">
.personal_container {
  position: relative;
  .back_orange {
    width: 100%;
    height: 4rem;
    background: url("../../images/topbg.png");
    background-size: contain;
    .head_image {
      width: 20vw;
      height: 20vw;
      margin-left: 40vw;
      padding-top: 1.2rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .person_name {
      z-index: 20;
      text-align: center;
      color: #fff;
      font-size: 0.28rem;
      padding-top: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: inline-block;
        vertical-align: top;
      }
      span:nth-child(2) {
        width: 0.4rem;
        height: 0.4rem;
        display: inline-block;
        z-index: 20;
        img {
          width: 100%;
        }
      }
    }
  }
  .change_router {
    margin:0 auto;
    margin-top: -0.45rem;
    width:90vw;
    height: 1.5rem;;
    background: #fff;
    border-radius: 0.2rem;
    border:1px solid #999;
    box-shadow: 0px 2px 2px #999;
    display: flex;
    flex-direction: row;
    justify-content:center;
    // span{
    //   display: inline-block;
    //   vertical-align: middle;
    div{
      display: flex;
      flex-direction: column;
      flex-grow: 3;
      justify-content:center;
      img{
        margin: 0 auto 0.1rem;;
        height: 0.48rem;
      }
    }
      p{
        text-align:center;
        color: #ff4747;
      }
  }
  .my_book{
    margin-top: 0.4rem;
    padding: 0 0.3rem 0 0.5rem;
    box-sizing: border-box;

    h4{
      margin-bottom:0.3rem;
      font-size:0.3rem;
      span{
        float:right;
        font-size:0.3rem;
        color: #ff4747;
        img{
          margin-left:0.1rem;
          width: 0.14rem;
          height: 0.25rem;
          vertical-align: middle;
          margin-top: -2px;
        }
      }
    }
    .edit_item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
    }
    .title_left{
      img{
        max-width:100%;
        max-height: 30vh;
      }
    }
    .content-right,.nobook_container{
      margin-left: 10px;
      .opearte_container{
        display:flex;
        flex-direction: row;
        flex-grow: 3;
        width: 100%;
        box-sizing: border-box;
        span{
          width: 1.22rem;
          height:1.20rem;
          background: url(../../images/delete.png) no-repeat;
          background-size: 100% 100%;
        }
        .preview_photo{
          background: url(../../images/bookpreview.png) no-repeat;
          background-size: 100% 100%;
        }
        .edit_photo{
          background: url(../../images/editbook.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .use_photo{
        width: 3.06rem;
        height: 0.86rem;
        line-height: 0.76rem;
        margin: 0.3rem auto 0;
        background: url(../../images/next.png) no-repeat;
        background-size: 100% 100%;
        color:white;
        font-size:0.3rem;
      }
    }
    .nobook_container{
      .no_book_tip{
        margin-bottom: 0.2rem;
        img{
          margin: 0 auto;
          width: 1.09rem;
          height: 1.09rem;
        }
      }
      p{
        color: #999;
      }
      .use_photo{
        margin-top: 0.6rem;
      }
    }
  }
  .footer{
    position: fixed;
    bottom: 0.54rem;
    width: 100%;
    p{
      width: 100%;
      color:#999;
    }
  }
}
</style>
