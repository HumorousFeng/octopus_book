<template>
  <div class="edit_container">
    <div>
      <!--<img :src="imgurl" class="addon">-->
      <!--<croppa v-if="showedit"-->
              <!--:width="400"-->
              <!--:height="400"-->
              <!--prevent-white-space-->
              <!--@image-remove="hideEdit"-->
      <!--&gt;-->
        <!--<img :src="imgurl" slot="initial"/>-->
      <!--</croppa>-->
    </div>

    <ul class="make_list">
      <li v-for="(item,index) in modelLists" :key="index">
        <span v-if="index == 0" class="cover img_title">封面</span>
        <span v-else v-text="index" class="img_title"></span>
        <div>
          <img  v-lazy="item.imgtrueurl" alt="1"/>


          <!--<ul v-if="item.liflag" class="icon_container">-->
            <!--<li ><i class="change_icon"></i><span>替换</span></li>-->
            <!--<li ><i class="rotate_icon"></i><span >旋转</span></li>-->
            <!--<li ><i class="amplification_icon"></i><span >放大</span></li>-->
            <!--<li ><i class="narrow_icon"></i><span >缩小</span></li>-->
          <!--</ul>-->
        </div>
        <div v-if="index == 0" class="book_name">
          <span v-text="book.book_name" v-if="editflag!=1"></span>
          <input type="text" v-model="bookname" v-else @blur="changeNameFn($event, 1)">
          <span @click="editNameFn($event, 1)"><img src="../../images/editbook.png" alt=""></span>
        </div>
        <div v-if="index == 0" class="book_author">
          <span v-text="book.author" v-if="editflag!=2"></span>
          <input type="text" v-model="bookauthor" v-else @blur="changeNameFn($event, 2)">
          <span @click="editNameFn($event, 2)"><img src="../../images/editbook.png" alt=""></span>
        </div>

       </li>
    </ul>
    <!--<div class="btn_container">-->
      <!--<van-button bottom-action>保存</van-button>-->
    <!--</div>-->
  </div>
</template>

<script>
import SERVERUTIL from "../../lib/SeviceUtil";
import { mapState, mapMutations } from "vuex";
  export default {
    components: {
    },
    data(){
      return{
        showedit: false,
        croppa: {},
        imgurl: "",
        modelLists: [], //列表
        book: {},
        editflag: 0,
        bookname:"",
        bookauthor:""
      }
    },
    methods:{
      //获取图书基本信息
      getBookInfo(id,token){
        var this_ = this;
        var obj = { service: "getBookInfo" , id: id, stoken: token };
        SERVERUTIL.base.baseurl(obj).then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              this_.book = res.data.data;
              this_.bookname = res.data.data.book_name;
              this_.bookauthor = res.data.data.author;
              this_.changeBookInfo(res.data.data);
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },
      //获取图书页面的详情
      getBookDetailInfoFn(token,id){
        var this_ = this;
        var obj={"service":"getBookDetailInfo","id":id,"stoken": token,};
        SERVERUTIL.base.baseurl(obj).then(res => {
          if(res.data.code ==0){
            if(res.data.data){
              this_.modelLists = res.data.data;
              var imgary = [];
              if(this_.modelLists.length){
                this_.modelLists.forEach(item =>{
                  if(item.result_img.length){
                    item.imgtrueurl= item.result_img;
                    item.liflag=true;
                    imgary.push({"imgtrueurl":item.imgtrueurl,"flag":true});
                  }else{
                    item.imgtrueurl= item.show_img;
                    item.liflag=false;
                    imgary.push({"imgtrueurl":item.imgtrueurl,"flag":false});
                  };
                });
              }
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },
      changeNameFn(e, flag){
        var this_ = this;
        this_.editflag = 0;
        var len = 0;
        var message = "";
        if(flag == 1){
          len = this_.strlen(this_.bookname)
        }else{
          len = this_.strlen(this_.bookauthor)
        };
        if(len==0){
          message = flag==1 ? '书名不能为空' : '作者名不能为空';
        }else if(len>20){
          message = flag==1 ? '书名不能超过10个中文字符 或 20个英文字符' : '作者名不能超过10个中文字符 或 20个英文字符';
        }
        if(message.length){
          this_.$toast({
            mask: true,
            forbidClick:true,
            message: message,
            duration:1000
          });
          return false;
        }else if(this_.bookname == this_.book.book_name && this_.bookauthor == this_.book.author){
          return true;
        }
        var paramsobj = {
          service: "setBook",
          id: this_.book.id,
          stoken: this_.token,
          book_name: this_.bookname,
          author: this_.bookauthor,
          status: this_.book.status
        };
        SERVERUTIL.base.baseurl(paramsobj).then(res => {
          if(res.data.code == 0){
            this_.getBookInfo(this_.book.id, this_.token);
          }
        }).catch(error => {
          console.log(error);
        });
      },
      strlen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);
          //单字节加1
          if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
          }
          else {
            len += 2;
          }
        }
        return len;
      },
      //编辑名称
      editNameFn(e, flag){
        e.cancelBubble =true;
        e.stopPropagation()
        this.editflag = flag;
      }
    },
    mounted(){
      var this_= this;
      document.title = '编辑图书';
      this_.book = this_.bookinfo;
      this_.bookname = this_.bookinfo.book_name;
      this_.bookauthor = this_.bookinfo.author;
      this_.getBookDetailInfoFn(this_.token,this_.bookinfo.id);
    },
    computed:{
      ...mapState(['token',"modeltypeid","modeltypename","modelid","bookinfo"])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
.edit_container{
  padding: 0.6rem 0;
  .make_list {
    display: flex;
    flex-direction: column;
    li {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 0.36rem;
      .img_title {
        display:block;
        width: 0.26rem;
        height: 0.26rem;
        line-height: 0.26rem;
        padding: 0.05rem;
        color: #fff;
        background-color: #4eb958;
        border-radius: 0.2rem;
        font-size: 0.18rem;
        text-align: center;
        margin: 0 0.4rem 0.1rem 0.2rem;
      }
      .cover {
        width: 0.56rem;
        margin-right: 0.1rem;
        border-radius: 0.2rem;
      }
      .book_name {
        position: absolute;
        top: 1.6rem;
        left: 1.4rem;
        width: 60%;
        height: 0.55rem;
        background: rgba(0,0,0,0);
        vertical-align: middle;
        text-align: center;

        span {
          font-size: 0.4rem;
        }
        span:nth-child(2) {
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          padding-top: 0.06rem;
          z-index: 20;
          img {
            width: 100%;
          }
        }
      }
      .book_author {
        position: absolute;
        top: 6.2rem;
        left: 1.4rem;
        width: 60%;
        height: 0.55rem;
        background: rgba(0,0,0,0);
        vertical-align: middle;
        text-align: center;

        span {
          font-size: 0.4rem;
        }
        span:nth-child(2) {
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          padding-top: 0.06rem;
          z-index: 20;
          img {
            width: 100%;
          }
        }
      }
      div{
        position: relative;
        width: 6rem;
        height: 8.2rem;
        background: url(../../images/coverbg.png) no-repeat;
        background-size: contain;
        margin-top: -3px;
        img {
          width: 90%;
          height: 90%;
          margin-left: 0.2rem;
        }
        .upload_img{
          position: relative;
          width: 80%;
          height: 70%;
          top: -90%;
          left: 5%;
        }
        .icon_container{
          position: absolute;
          width: 90%;
          background: white;
          display: flex;
          flex-direction: row;
          bottom: 0.6rem;
          left: 3.4%;
          li{
            display:flex;
            flex-direction:column;
            box-sizing: border-box;
            margin-bottom:0.2rem;
            i{
              display: block;
              width: 0.64rem;
              height: 0.64rem;
              line-height: 0.64rem;
              padding: 0;
              background: url('../../images/rotate.png') no-repeat 50% 62%;
              background-size: 80% 80%;
              margin-top: 0.2rem;
              border: 1px solid #ff4747;
              border-radius: 50%;
            }
            .change_icon{
              background: url('../../images/change.png') no-repeat 50% 62%;
              background-size: 80% 80%;
            }
            .amplification_icon{
              background: url('../../images/amplification.png') no-repeat 50% 62%;
              background-size: 80% 80%;
            }
            .narrow_icon{
              background: url('../../images/narrow.png') no-repeat 50% 62%;
              background-size: 80% 80%;
            }
            span{
             display: block;
             background: none;
             text-align: center;
             margin-top: 0.1rem;
            }

          }
        }
      }
    }
  }
  .btn_container{
    position: fixed;
    width: 100%;
    bottom: 0;

    button{
      background:#fff;
      color:#ff4747;
    }
  }
}

</style>
