<template>
  <div class="makeContainer">
    <div class="titleContainer" v-if="showflag">
      <van-row>
        <van-col span="22">
           <van-row class="title_con">
              <van-col span="12"><span class="title_name" v-text="photoName"></span></van-col>
              <van-col span="12" style="text-align:right;" ><a href="javascript:;" class="detail_name" @click="jumptodetail()">查看详情<i>></i></a></van-col>
           </van-row>
          <div class="make_container">
            <ul class="make_list">
              <li v-for="(item,index) in modelLists" :key="index">
                 <span v-if="index == 0" class="cover">封面</span>
                 <span v-else v-text="index"></span>
                 <div>
                   <img :src="item.imgtrueurl" alt="1"/>
                   <!-- <img :src="item.imgurl " alt="" class="upload_img"> -->
                   <i class="warning_icon" v-if="item.warnflag" ></i>
                 </div>
              </li>
            </ul>
            <div class="iconcontainer">
              <van-row>
                <van-col span="8">
                  <span class="preview_icon d-i-b" @click="previewFn()">
                    <img src="../../images/preview.png" alt="预览">
                  </span>
                </van-col>
                <van-col span="8">
                  <span class="onload_icon d-i-b">
                    <!-- <form ref="form"></form> -->
                    <van-uploader :after-read="onRead" accept="image/*" multiple class="fileImage" v-if="leftnum>0">
                      <van-icon name="photograph" />
                    </van-uploader>
                    <img src="../../images/onload.png" alt="上传" @click="completeFn()">
                    <span v-if="leftnum>0" class="mark tc" v-text="leftnum"></span>
                  </span>
                </van-col>
                <van-col span="8">
                  <span class="save_icon d-i-b">
                    <img src="../../images/save.png" alt="保存" @click="saveFn()">
                  </span>
                </van-col>
              </van-row>
            </div>
          </div>
        </van-col>
        <van-col span="2">
          <div class="scaling scale">
             <img src="../../images/scale.png" alt="" @click="showflag=false;" class="icon_img"/>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="titleContainer" v-else>
      <van-row>
        <van-col span="17" >
           <van-row class="title_con">
              <van-col span="12"><span  class="title_name" v-text="photoName"></span></van-col>
              <van-col span="12" style="text-align:right;"><a href="javascript:;" class="detail_name" @click="jumptodetail()">查看详情<i>></i></a></van-col>
           </van-row>
          <div class="make_container">
            <ul class="make_list">
              <li v-for="(item,index) in modelLists" :key="index">
                 <span v-if="index == 0" class="cover">封面</span>
                 <span v-else v-text="index"></span>
                 <div>
                   <img :src="item.imgtrueurl" alt="1"/>
                   <!-- <img :src="item.imgurl " alt="" class="upload_img"> -->
                </div>
              </li>
            </ul>
            <div class="iconcontainer iconcontainershow">
              <van-row>
                <van-col span="8">
                  <span class="preview_icon d-i-b" @click="previewFn()">
                    <img src="../../images/preview.png" alt="预览">
                  </span>
                </van-col>
                <van-col span="8">
                  <span class="onload_icon d-i-b" @click="markflag=true;">
                    <!-- <form ref="form">  </form> -->
                      <van-uploader :after-read="onRead" accept="image/*" multiple class="fileImage" v-if="leftnum>0">
                        <van-icon name="photograph" />
                      </van-uploader>
                    <img src="../../images/onload.png" alt="上传" @click="completeFn()">
                    <span v-if="leftnum>0" class="mark tc" v-text="leftnum"></span>
                  </span>
                </van-col>
                <van-col span="8">
                  <span class="save_icon d-i-b">
                    <img src="../../images/save.png" alt="保存" @click="saveFn()">
                  </span>
                </van-col>
              </van-row>
            </div>
          </div>
        </van-col>
        <van-col span="7">
          <div class="scaling ">
             <img src="../../images/scale.png" alt="" @click="showflag=true;" class="icon_img"/>
             <div class="option_container" >
               <van-collapse v-model="activeNames" accordion id="myselect">
                 <van-collapse-item :title="modeltypevalue" name='1'>
                   <ul class="tc modeltype_list">
                     <li class="tc" v-for="item in tabarys" :key="item.id" v-text="item.name" @click="getvalueFn(item.name,item.id)"></li>
                   </ul>
                </van-collapse-item>
               </van-collapse>
             </div>
             <ul class="prewimg">
               <li v-for="(item,index) in tabLists" :key="index">
                 <div @click="selectPrewImgFn(index,item)" :class="item.template_id==modelid?'selDiv':'defDiv'">
                   <img :src="item.show_img" :alt="index" />
                 </div>
               </li>
             </ul>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 当图片出现不合格的时候弹框 -->
    <div class="imgnofit_container" v-if="nofitflag" :style="{'position':nofitflag?'fixed':'absolute'}">
      <div class="img_container">
         <h4 class="tc"><span class="tc" style="color:#ff5547;" v-text="nofitnum"></span>
           <span>张照片像素过低或大小不合格<br>建议删除再重新上传<br>(2816 x 2112像素以上, 500K~20M之间)</span>
         </h4>
         <ul class="img_list">
           <li v-for="(item,index) in fileList" :key="index"
               :style="{'border':item.flag!=0?'1.3px solid #FF0000':'1px solid #000000'}">
             <img :src="item.image.src" alt="index">
            </li>
         </ul>
         <div class="img_operate w100">
           <van-row class="w100">
            <van-col span="12">
              <van-button class="w100" type="default" bottom-action style="background:none;color:black;" @click="cancleImgFn">取消</van-button >
            </van-col>
            <van-col span="12">
              <van-button  class="w100" type="default"  bottom-action style="background:none;color:#ff5547;" @click="deleteImgFn">删除</van-button >
            </van-col>
          </van-row>
         </div>
      </div>
    </div>
    <!-- 提示未制作完成， -->
    <div class="imgnosucce_container" v-if="nosucceeflag" :style="{'position':nosucceeflag?'fixed':'absolute'}">
      <div class="img_container tip_container">
         <h4 class="tc">提示</h4>
         <p class="tc">本书尚未制作完成<br>还需上传<span v-text="leftnum" style="color:#ff5547"></span>张照片</p>
         <div class="img_operate w100">
           <van-row class="w100">
            <van-col span="12">
              <van-button class=" w100 ft14" type="default" bottom-action style="background:none;font-size:0.28rem;color:black;" @click="savebookFn()">先保存至书架</van-button >
            </van-col>
            <van-col span="12">
              <van-button  class=" w100 ft14" type="default"  bottom-action style="background:none;font-size:0.28rem;color:black;">继续上传</van-button >
               <van-uploader :after-read="nextonRead" accept="image/*" multiple class="fileImage">
                  <van-icon name="photograph" />
              </van-uploader>
            </van-col>
          </van-row>
         </div>
      </div>
    </div>
     <!-- 提示照片清晰度不足， -->
    <div class="imgnosucce_container" v-if="noprefactflag" :style="{'position':noprefactflag?'fixed':'absolute'}">
      <div class="img_container tip_container">
         <h4 class="tc">照片清晰度不足</h4>
         <p class="tc">像素不足会影响印刷清晰度<br>建议选择清晰度高的<span v-text="9" style="color:#ff5547"></span>照片制作</p>
         <div class="img_operate w100">
           <van-row class="w100">
            <van-col span="12">
              <van-button class=" w100 ft14" type="default" bottom-action style="background:none;font-size:0.28rem;color:black;" @click="gochangeFn()">去修改</van-button >
            </van-col>
            <van-col span="12">
              <van-button  class=" w100 ft14" type="default"  bottom-action style="background:none;font-size:0.28rem;color:black;" @click="continueFn()">继续提交</van-button >
            </van-col>
          </van-row>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import SERVERUTIL from "../../lib/SeviceUtil";
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import VueCoreImageUpload from 'vue-core-image-upload'
export default {
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
  },
  data() {
    return {
      activeNames: '',
      modeltypevalue:"",//模板类型名字
      photoName: "",//模板名字
      tabarys: [], //模板类型列表
      leftnum: 0, //模板总共有几张，上传成功之后，剩余多少张需要上传，动态计算
      modelLists: [],//模板的详情页面列表
      tabLists: [], //右侧的类型列表
      showflag: true,
      i: 0, //当前选中的列表项
      nofitflag: false, //不合格弹框
      nosucceeflag:false , //没有制作成功的弹框
      noprefactflag:false,  //清晰度不高的弹框
      nofitnum: 0,   //不合格的数量
      fileList: [],  //不合格的图片的数据集
      bookinfos:{}, //获取到的图书的信息
      makenum:0,  //制作成功的数量
      loadflag:false,  //判断是否点击了上传按钮
      canusenum:0, //从制作成功返回的可用的图片张数
      totalnum:0, //获取当前模板可以上传的最大图片数
      finishnum:0, //获取当前模板已经上传成功的图片数量
      checktimer:null,
      imagelimit: {width: 2816, height:2112, min_size:1024*500, max_size:1024*1024*20},
      uploadUrl: SERVERUTIL.base.uploadurl()
      // 2048 X 1536 3145728 320万
      // 2304 X 1728 3981312 400万
      // 2580 X 1936 4994880 500万
      // 2816 X 2112 5947392 600万

    };
  },
  methods: {
    //获取图书基本信息
    getBookInfo(id,token){
      var this_ = this;
      var obj = { service: "getBookInfo" , id: id, stoken: token };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this_.changeBookInfo(res.data.data);
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取图书所有页面详情 -- 为了获取模板中是否已经有上传的图片了
    getBookDetailInfoFn(id,token,isupload){
      var this_ = this;
      var obj = { service: "getBookDetailInfo" , id: id, stoken: token };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            if (res.data.data.length) {
              this_.modelLists = res.data.data;
              console.log(this_.modelLists);
              // 给每个页面增加一个上传图片的url属性
              this_.modelLists.forEach((item,index)=>{
                if(item.result_img.length){
                  item.imgtrueurl = item.result_img;
                }else{
                  item.imgtrueurl = item.show_img;
                }
              });
              if(isupload){
                this_.checkFinish(1)
              }
            }else{
              this_.modelLists = [];
            }
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //右侧的点击每一项更换模板 - 查询上一本书的制作情况，确认更换后 调用选择模板的接口获取新的bookid
    selectPrewImgFn(index, obj) {
      var this_ = this;
      if(obj.template_id == this_.modelid){
        this_.$toast({
          mask: true,
          message: "该模板已被选中",
          duration:1000
        });
      }else{
        //更换模板
        if(this_.leftnum > 0 && this_.finishnum > 0){
          var content = "当前模板中图片未全部上传，确定更换模板";
          this_.$dialog.confirm({
            title: '确认更换',
            message: content
          }).then(() => {
            this_.changeNewMode(obj)
          }).catch(() => {
            // on cancel
          });
        }else {
          this_.changeNewMode(obj)
        }
      }
    },
    //切换模板
    changeNewMode(obj){
      var this_ = this;
      this_.$toast.loading({
        mask: true,
        message: "正在更换模板...",
        duration: 1000
      });
      this_.modelLists.forEach(item=>{
        item.imgurl ="";
      });
      //获取新的book_id
      this_.changeModelId(obj.template_id);
      this_.changeModelName(obj.title);
      this_.changeModelTypeId(obj.type_id);
      this_.changeModelTypeName(this_.modeltypevalue);
      this_.photoName = obj.title;
      //重新加载图书
      this_.getTempBookFn(this_.modelid,this_.token,true);
    },
    //获取模板类型
    modelTypeFn() {
      var this_ = this;
      var obj = { service: "getTemplateType" };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this_.tabarys = res.data.data;
            this_.modelListFn(this_.modeltypeid);
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //更改右侧模板类型下拉对应的模板列表变化
    getvalueFn(value,id){
      var this_ = this;
      this_.modeltypevalue = value;
      this_.activeNames='';
      this_.$toast.loading({
        mask: true,
        message: "正在更换模板类型...",
      });
      this_.modelListFn(id);
    },
    //获取右侧不同模板类型下不同模板列表
    modelListFn(typeId) {
      var this_ = this;
      var obj = { service: "getBookImageByTemplateTypeId", type_id: typeId };
      SERVERUTIL.base.baseurl(obj).then(res => {
          if (res.data.code == 0) {
            this_.$toast.clear();
            if (res.data.data) {
              this_.tabLists = res.data.data;
            }
          }
        }).catch(error => {
          console.log(error);
        });
    },
    //获取未完成的模板
    getTempBookFn(modelid, token, tips){
      var this_ = this;
      var obj = {
        service: "getBookInfoByTemplateId",
        id: modelid,
        stoken: token
      };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data && res.data.data.id) {
            if(tips){
              this_.$dialog.confirm({
                message: '你所选择的模板还有未完成的图书，请选择编辑未完成的图书还是制作新的图书？',
                confirmButtonText: '编辑图书',
                cancelButtonText: '制作图书'
              }).then(() => {
                this_.getBookInfo(res.data.data.id,this_.token);
                this_.getBookDetailInfoFn(res.data.data.id,this_.token);
                this_.getBookStatusFn(res.data.data.id,this_.token);
              }).catch(() => {
                // on cancel 制作新的图书
                this_.getbookidFn(modelid, token, this_.modelname,this_.vnickname)
              });
            }else{
              // 默认查找之前未完成的图书
              this_.getBookInfo(res.data.data.id,this_.token);
              this_.getBookDetailInfoFn(res.data.data.id,this_.token);
              this_.getBookStatusFn(res.data.data.id,this_.token);
            }
          }else{
            //没有未完成，直接新增图书
            this_.getbookidFn(modelid, token, this_.modelname,this_.vnickname)
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //用户选择模板 -- 获取book_id
    getbookidFn(modelid, token, bookname, author) {
      var this_ = this;
      var obj = {
        service: "addBook",
        id: modelid,
        stoken: token,
        book_name: bookname,
        author: author
      };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this_.getBookInfo(res.data.data.book_id,this_.token);
            this_.getBookDetailInfoFn(res.data.data.book_id,this_.token);
            this_.getBookStatusFn(res.data.data.book_id,this_.token);
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //上传图片
    uploadImg(file,index,count){
      var this_ = this;
      this_.loadflag = true;
      let formData = new FormData();
      var type = file.type;
      if (type !="image/jpg" && type !="image/jpeg" && type !="image/bmp" && type !="image/png"&& type !="image/gif") {
        this_.$toast({
          mask: true,
          forbidClick:true,
          message: "请选择图片格式文件上传(jpeg,jpg,png,gif,bmp)！"
        });
        return false;
      };

      formData.append("file", file);
      $.ajax({
        url:SERVERUTIL.base.uploadurl(),
        type:'POST',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        success:function(res){
          if(res.data && res.data.url){
            var imgurl=res.data.url;

            console.log(index);
            //每上传一张图片，创建一次图书
            this_.checktimer = setTimeout(function() {
              this_.$toast.loading({
                mask: true,
                forbidClick: true,
                message: "上传照片"+ index +"/"+ count,
                duration: 30000
              });
              this_.makeModelFn(imgurl);
            }, index*660);
            if(index == count){
              this_.checktimer = setTimeout(function(){
                this_.$toast.loading({
                  mask: true,
                  forbidClick: true,
                  message: "正在制作图书",
                  duration: 30000
                });
                this_.getBookDetailInfoFn(this_.bookinfo.id, this_.token, true);
              },count*1000);
            }
          }else{
            this_.$toast({
              mask: true,
              message: res.message || res.detail
            });
          }
        },
        error:function(){
          this_.$toast.loading({
            mask: true,
            message: "上传图片失败"
          });
        }
      });

    },
     //上传图片成功的执行函数
    onRead(file) {
      var this_ = this;
      var morenum = file.length || 1;
      var message = "";

      //如果是从保存页面返回的，有之前保存的图片的情况
      if(morenum > this_.leftnum) {
        message="最多只能上传"+this_.leftnum+"照片";
      }else if(morenum>9){
        message="一次最多上传9张照片";
      }
      if(this_.leftnum==0) {
        message = "已全部上传完毕，不可再传";
      }
      if(message.length){
        this_.$toast({
          mask: true,
          forbidClick:true,
          message: message,
          duration:1000
        });
        return false;
      }

      if(morenum>1){//不止上传一张
        file.forEach((item,index)=>{
          this_.makeFileList(item, index);
        });
      }else{ //只上传一张
        this_.makeFileList(file, 1);
      }
      this_.$toast.loading({
        mask: true,
        forbidClick: true,
        message: "正在检查照片...",
        duration: 1000
      });
      this_.checkImage(morenum);
    },
    makeFileList(file, index){
      var this_ = this;
      var flag = 0;
      var image = new Image();
      image.src = file.content;
      image.onload = function () {
        var sizeflag = file.file.size >= this_.imagelimit.min_size && file.file.size <= this_.imagelimit.max_size;
        var pxflag = (image.width >= this_.imagelimit.width && image.height >= this_.imagelimit.height) ||
                     (image.width >= this_.imagelimit.height && image.height >= this_.imagelimit.width);
        if(!sizeflag){
          this_.nofitnum++;
          flag = 1;
        }else if(!pxflag){
          this_.nofitnum++;
          flag = 2
        }
        console.log(flag);
        this_.fileList.push({index:index, file:file.file, image:image, flag:flag})
      }
    },
    checkImage(morenum){
      var this_ = this;
      if(this_.fileList.length != morenum){
        this_.checktimer = setTimeout(function(){
          this_.checkImage(morenum)
        }, 200);
      }else{
        // this_.$toast.clear();
        if(this_.nofitnum > 0){
          this_.nofitflag = true;
        }else{
          this_.uploadImgStart()
        }
      }
    },
    uploadImgStart(){
      var this_ = this;
      var list = [];
      this_.fileList.forEach(item => {
        if(item.flag==0){
          list.push(item.file)
        }
      });
      var morenum = list.length;
      console.log('total:' + this_.fileList.length);
      console.log('upload:' + morenum);
      this_.nofitnum = 0;
      this_.fileList = [];

      if(morenum>0){
        this_.$toast.loading({
          mask: true,
          forbidClick: true,
          message: "上传照片1/"+ morenum,
          duration: 30000
        });

        this_.checktimer = setTimeout(function () {
          list.forEach((item,index)=>{
            this_.uploadImg(item,index+1,morenum);
          });
        }, 1000);
      }
    },
    //当上传的图片数已满时，继续上传的操作 提示不可再传
    completeFn(){
      var this_ = this;
      this_.$toast({
        mask: true,
        forbidClick:true,
        message: "已全部上传完毕,可点击保存相册",
        duration:1000
      });
    },
    //制作模版
    makeModelFn(url){
      var this_ = this;
      var obj = {
        service: "createBook",
        id: this_.bookinfo.id,
        stoken: this_.token,
        url:url
      };

      SERVERUTIL.base .baseurl(obj) .then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this_.makenum++;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //查看图片的上传请况
    getBookStatusFn(id, token) {
      var this_ = this;
      var obj = { service: "getBookStatus", id: id, stoken: token };
      SERVERUTIL.base.baseurl(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this_.totalnum = res.data.data.total_num;
            this_.finishnum = res.data.data.finish_num;
            this_.leftnum = this_.totalnum-this_.finishnum;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    checkFinish(count) {
      var this_ = this;
      this_.$toast.loading({
        mask: true,
        forbidClick: true,
        message: "正在制作图书",
        duration: 30000
      });
      if(count > 10){
        this_.$toast.clear();
        this_.getBookStatusFn(this_.bookinfo.id,this_.token);
        return false;
      }
      var num = 0;
      this_.modelLists.forEach(item=>{
        if(item.source_img.length>0 && item.result_img.length==0){
          num++;
        }
      });
      if(num){
        this_.checktimer = setTimeout(function(){
          this_.getBookDetailInfoFn(this_.bookinfo.id, this_.token);
          this_.checkFinish(count+1)
        },3000);
      }else{
        this_.$toast.clear();
        this_.getBookStatusFn(this_.bookinfo.id,this_.token);
      }
    },
    //查看详情 跳转到详情页面传入模板的id
    jumptodetail() {
      var this_ = this;
      this_.$router.push({
        path: "/detail",
        name: "DETAIL",
        params: {
          bookid: this_.bookinfo.id
        }
      });
    },
    //保存至书架
    savebookFn(){
     var this_ = this;
     this_.saveFn(true);
    },
    //继续上传
    nextonRead(file){
      var this_ = this;
      this_.nosucceeflag = false;
      this_.onRead(file);
    },
    //去修改
    gochangeFn(){
      var this_ = this;
      alert("去修改");

    },
    //继续提交
    continueFn(){
      var this_ = this;
      alert("继续提交");
    },
    //大小不合格的取消操作
    cancleImgFn(){
      var this_ = this;
      this_.nofitflag = false;
      this_.nofitnum = 0;
      this_.fileList = [];
    },
    //删除图片
    deleteImgFn(){
      var this_ = this;
      this_.nofitflag = false;
      this_.uploadImgStart();
    },
    //预览功能
    previewFn() {
      var this_ = this;
      this.$router.push({
        path: "/savesuccess",
        name: "SAVESUCCESS",
        params: {
          title: "预览"
        }
      });
    },
    //保存功能并跳到保存成功页面
    saveFn(sure) {
      var this_ = this;
      if(this_.leftnum > 0){
        if(this_.finishnum == 0){
          this_.$toast({
            mask: true,
            message: "请先选择上传图片",
          });
          return false;
        }
        if(sure){
          this_.nosucceeflag = false;
          this_.$toast.loading({
            mask: true,
            message: "正在提交模板...",
          });
        }else{
          this_.nosucceeflag = true;
        }
      }else{
        this_.$toast.loading({
          mask: true,
          message: "正在提交模板...",
        });
        setTimeout(() => {
          this.previewFn();
        }, 2000)

      }
    },
    ...mapMutations([ "changeToken", "changeNickname", "changeModelTypeId", "changeModelTypeName",
      "changeModelId", "changeModelName", "changeBookInfo","changefailimg","changesaveflag"
    ])
  },
  mounted() {
    var this_ = this;
    document.title = "马上制作";
    if(this_.vsavetoeditflag){
      this_.$router.push({
        path: '/editimg',
        name: 'EDITIMG'
      });
    }else{
      if(this_.$route.params.quickmake){
        this.showflag = false;
      }
      if(this_.modelid){
        this_.photoName = this_.modelname;
        this_.modeltypevalue = this_.modeltypename;
      };
      this_.modelTypeFn();

      if(this_.bookinfo.id){
        this_.getBookDetailInfoFn(this_.bookinfo.id,this_.token);
        this_.getBookStatusFn(this_.bookinfo.id,this_.token);
      }else{
        this_.getTempBookFn(this_.modelid,this_.token);
      }

    };
    this_.changesaveflag(false);

  },
  beforeDestroy(){
    var this_ = this;
    if(this_.checktimer) {
      this_.$toast.clear();
      clearTimeout(this_.checktimer); //关闭timer
    }
  },
  computed: {
    ...mapState([
      "token",
      "vnickname",
      "modeltypeid",
      "modeltypename",
      "modelid",
      "modelname",
      "bookinfo","vfailimgary","vsavetoeditflag"
    ])
  }
};
</script>

<style scoped lang="scss" type="text/css">
body {
  // background: lightcyan;
}

.makeContainer {
  margin-left: 0.3rem;
  .titleContainer {
    width: 100%;
    .title_con {
      margin: 0.26rem 0 0.6rem 0rem;
      .title_name,
      .detail_name {
        font-size: 0.32rem;
      }
      .detail_name {
        font-size: 0.26rem;
        margin-right: 0.2rem;
        color: #ff4747;
        text-align: right;
        i {
          margin-left: 0.08rem;
        }
      }
    }
    .scaling {
      position: fixed;
      width: 2.2rem;
      height: 14rem;
      background: white;
      .icon_img {
        position: absolute;
        top: 40%;
        left: -0.42rem;
      }
      .option_container {
        margin: 0 auto;
        select {
          display: block;
          border: none;
          outline: none;
          margin: 0.36rem auto 0.56rem;
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          option {
            border: none;
            outline: none;
            text-align: center;
            color: #333;
            font-size: 0.28rem;
          }
          &:fouce {
            border: 0px;
            outline: none;
          }
        }
        #myselect{
          width: 1.8rem;
          position: fixed;
          text-align: center;
          background: none;
          right:0.1rem;
          div{
            padding: 0;
            font-size: 0.28rem;
            div{
              padding: 0;
              .van-cell__value--alone{
                text-align: center;
                font-size: 0.28rem;
              }
            }

          }
          .van-collapse-item__content{
            padding:0;
            background: red;
            .modeltype_list{
              padding: 0;
              background: none;
              li{
                padding: 0.06rem;
                font-size: 0.28rem;
                box-sizing: border-box;
              }
            }
          }
        }


      }

      .prewimg {
        display: flex;
        flex-direction: column;
        margin-top: 0.88rem;
        li {
          width: 100%;
          height: 100%;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          div,
          .defDiv{
            margin: 0 auto;
            max-width: 1.6rem;
            max-height: 2.2rem;
            background-size: contain;
            padding: 5px;
            box-sizing: border-box;
            // display: flex;
            justify-content: center;
            align-content: center;
            img{
              max-width: 90%;
              max-height: 90%;
              box-shadow: 0 2px 5px 1px #ddd8df;
            }
          }
          .selDiv {
            margin: 0 auto;
            max-width: 1.6rem;
            max-height: 2.2rem;
            // background: url(../../images/rightselectbg.png) no-repeat;
            background-size: contain;
            padding: 5px;
            box-sizing: border-box;
            // display: flex;
            justify-content: center;
            align-content: center;
            img {
              max-width: 90%;
              max-height: 90%;
              box-shadow: 0 2px 5px 1px #F44;
            }
          }
          // .selDiv {
          //   width: 1.78rem;
          //   height: 2.38rem;
          //   // background: url(../../images/rightselectbg.png) no-repeat;
          //   background-size: contain;
          // }
        }
      }
    }
    .make_container {
      position: relative;
      .make_list {
        display: flex;
        flex-direction: column;
        li {
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-bottom: 0.36rem;
          span {
            width: 0.26rem;
            height: 0.26rem;
            line-height: 0.26rem;
            padding: 0.05rem;
            color: #999;
            background-color: #ddd;
            border-radius: 0.2rem;
            margin-right: 0.4rem;
            font-size: 0.18rem;
            text-align: center;
          }
          .cover {
            display: inline-block;
            width: 0.56rem;
            color: #fff;
            margin-right: 0.1rem;
            background-color: #4eb958;
            border-radius: 0.2rem;
          }
          div {
            position: relative;
            width: 3.86rem;
            height: 5.19rem;
            background-size: contain;
            margin-top: -3px;
            display: flex;
            justify-content: center;
            align-content: center;
            img {
              width: 90%;
              height: 90%;
              box-shadow: 0 2px 10px 1px #E8B5C5;
            }
            .upload_img{
              position: relative;
              width: 80%;
              height: 70%;
              top: -90%;
              left: 5%;
            }
            .warning_icon{
              display: inline-block;
              position: absolute;
              width: 0.64rem;
              height: 0.64rem;
              top:0;
              right: 14px;
              background: url(../../images/warning.png) no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .iconcontainer,
      .iconcontainershow {
        position: fixed;
        bottom: 1rem;
        padding: 0 0.6rem;
        box-sizing: border-box;
        .preview_icon,
        .onload_icon,
        .save_icon {
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 0.3rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .onload_icon {
          position: relative;
          .mark {
            position: absolute;
            top: 0.15rem;
            right: 0.1rem;
            width: 0.36rem;
            background: #ff4747;
            border-radius: 50%;
            color: white;
          }
        }
        .fileImage {
          position: absolute;
          height: 1.2rem;
          width: 1.2rem;
          z-index: 999;
          opacity: 0;
        }
      }
      .iconcontainershow {
        width: 70%;
      }
    }
  }
  .imgnofit_container,.imgnosucce_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    padding: 1.6rem 0.6rem;
    box-sizing: border-box;
    .img_container {
      position: relative;
      width: 100%;
      height: 100%;
      background: white;
      padding: 0.3rem;
      box-sizing: border-box;
      h4 {
        span {
          font-size: 0.28rem;
        }
      }
      ul {
        width: 100%;
        height: 80%;
        margin-top: 0.3rem;
        overflow: hidden;
        overflow-y: scroll;
        li {
          display: inline-block;
          width: 1.6rem;
          height: 1.6rem;
          margin: 0.11rem;
          background: #ccc;
          /*border: 1px solid #000000;*/
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .img_operate {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid #f2f2f2;
        background: white;
        .w100 {
          width: 100%;
        }

        .fileImage{
            position: absolute;
            display: block;
            width: 50%;
            height: 100%;
            background: red;
            top: 0;
            opacity: 0;
          }
      }
      .ft14{
        font-size: 14px;
      }
    }
  }
  .imgnosucce_container{
    .tip_container{
      position: absolute;
      top: 50%;
      left: 0;
      margin:0 10%;
      margin-top: -25%;
      width: 80%;
      height: 24%;
      h4{
        font-size: 0.30rem;
        margin-bottom: 0.1rem;
      }
      p{
        font-size: 0.28rem;
      }
    }
  }


}
</style>
