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
          <img v-if="index == 0" ref="coverRef"  v-lazy="item.imgtrueurl" alt="1"/>
          <img v-else v-lazy="item.imgtrueurl" alt="1"/>


          <!--<ul v-if="item.liflag" class="icon_container">-->
            <!--<li ><i class="change_icon"></i><span>替换</span></li>-->
            <!--<li ><i class="rotate_icon"></i><span >旋转</span></li>-->
            <!--<li ><i class="amplification_icon"></i><span >放大</span></li>-->
            <!--<li ><i class="narrow_icon"></i><span >缩小</span></li>-->
          <!--</ul>-->
        </div>
        <div v-if="index == 0 && editicon.left" class="book_name">
          <span :style="editicon" @click="editNameFn($event)"><img src="../../images/editbook.png" alt=""></span>
        </div>

       </li>
    </ul>
    <van-popup v-model="editflag" class="bindgift_container" :overlay-style = "overstyleObj" >
      <div >
        <h4 class="tc">编辑书名</h4>
        <div class="ps_input">书&nbsp;&nbsp;&nbsp;名：<input type="text" v-model="bookname" placeholder="请输入书名"></div>
        <div class="ps_input">作者名：<input type="text" v-model="bookauthor" placeholder="请输入作者名"></div>
        <div class="sure_btn tc" @click="changeNameFn">确定</div>
      </div>
    </van-popup>

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
        editflag: false,    //编辑标识
        overstyleObj: {
          //蒙层样式
          background: "rgba(0,0,0,0.3)"
        },
        bookname:"",    //书名
        bookauthor:"",  //作者
        coverRealImg:{},//封面图片
        editicon:{}
      }
    },
    methods:{
      //获取图书基本信息
      getBookInfo(token, id){
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
                this_.modelLists.forEach((item, index) =>{
                  if(item.result_img.length){
                    item.imgtrueurl= item.result_img;
                    item.liflag=true;
                    imgary.push({"imgtrueurl":item.imgtrueurl,"flag":true});
                  }else{
                    item.imgtrueurl= item.show_img;
                    item.liflag=false;
                    imgary.push({"imgtrueurl":item.imgtrueurl,"flag":false});
                  };
                  if(index == 0){
                    this_.coverRealImg = new Image();
                    this_.coverRealImg.src = item.imgtrueurl;
                    this_.coverRealImg.onload = function () {
                      var naturalWidth = this_.coverRealImg.width;
                      var naturalHeight = this_.coverRealImg.height;
                      var curImg = this_.$refs.coverRef[0];
                      this_.editIconPos(curImg.x, curImg.y, curImg.width, curImg.height, naturalWidth, naturalHeight)
                    }
                  };
                });
              }
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },
      editIconPos(x, y, width, height, naturalWidth, naturalHeight){
        var this_ = this;
        console.log("x:"+x+" y:"+y+" width:"+width+" height:"+height+" naturalWidth:"+naturalWidth+" naturalHeight:"+naturalHeight);
        var realX = this_.book.position['x'];
        var realY = this_.book.position['Y'];
        var size = this_.book.position['size'];
        var realSize = Math.ceil(this_.strlen(this_.book.book_name)/2/2 * size * width / naturalWidth);
        console.log("realSize:"+realSize);
        console.log("realX:"+realX+" realY:"+realY);
        realX = Math.ceil(realX *  width / naturalWidth) + realSize;
        realY = Math.ceil((realY - size/2) *  height / naturalHeight) - 5 ;
        console.log("x:" + realX + " y:" + realY);
        this_.editicon = {
          'width': '0.5rem',
          'height': '0.5rem',
          'position': 'absolute',
          'left':realX+'px', 'top':realY+'px'}

      },
      changeNameFn(){
        var this_ = this;
        var message = "";
        var len1 = this_.strlen(this_.bookname);
        var len2 = this_.strlen(this_.bookauthor);

        if(len1==0){
          message = '书名不能为空';
        }else if(len1>20){
          message = '书名不能超过10个中文字符 或 20个英文字符';
        }else if(len2==0){
          message = '作者名不能为空';
        }else if(len2>20){
          message = '作者名不能超过10个中文字符 或 20个英文字符';
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
          this_.editflag = false;
          return true;
        }
        var paramsobj = {
          service: "setBook",
          id: this_.book.id,
          stoken: this_.token,
          book_name: this_.bookname,
          author: this_.bookauthor
        };
        SERVERUTIL.base.baseurl(paramsobj).then(res => {
          if(res.data.code == 0){
            this_.editflag = false;
            this_.getBookInfo(this_.token, this_.book.id);
            this_.getBookDetailInfoFn(this_.token, this_.book.id);
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
      editNameFn(e){
        e.cancelBubble =true;
        e.stopPropagation()
        this.editflag = true;
      }
    },
    mounted(){
      var this_= this;
      document.title = '编辑图书';
      this_.getBookInfo(this_.token, this_.bookinfo.id)
      this_.getBookDetailInfoFn(this_.token, this_.bookinfo.id);
    },
    updated(){
      var this_= this;
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
        width: 5.5rem;
        height: 2rem;
        left: 0.9rem;
        top: 1rem;
        margin-top: -3px;
        background: rgba(0,0,0,0);
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
  .bindgift_container {
  //position: relative;
    width: 5.5rem;
    height: 3.6rem;
    background: white;
    border-radius: 8px;
    h4 {
      margin: 0.2rem;
      font-size: 0.3rem;
      color: #111;
    }
    .ps_input {
      padding: 0.1rem 0.3rem;
      box-sizing: border-box;
      height: 0.8rem;
      input {
        width: 80%;
        height: 100%;
        border-radius: 5px;
        border: 0;
        -webkit-appearance: none;
        border: 1px solid #ccc;
        padding-left: 0.2rem;
        color: #999;
        box-sizing: border-box;
      }
    }
    .sure_btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #ff4747;
      color: #fff;
      font-size: 0.3rem;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
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
