<template>
  <div class="contactus_container">
    <h1 class="tc" style="font-size: 26px; font-weight:bold">联系我们</h1>
    <p class="tl">
      &ensp;&ensp;&ensp;&ensp;章鱼书欢迎您~有问题想咨询吗？<br>
      &ensp;&ensp;&ensp;&ensp;您只需点击屏幕左下角“小键盘图标”，直接输入文字或表情，就可以和章鱼叔聊天了。或直接致电<a>400-666-8888</a>。客服工作时间：周一至周日9:00~21:00。<br>
      &ensp;&ensp;&ensp;&ensp;订单查询，请选择我的订单。<br>
      &ensp;&ensp;&ensp;&ensp;合作洽谈，您可发邮件到<a>zhangyushu@xxx.com</a>，邮件中注明联系人、联系电话、所属公司及合作意向，我们会尽快与您联系。<br>
    </p>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  export default {
    data(){
      return{

      }
    },
    methods:{

      ...mapMutations([
        "changeToken"
      ])
    },
    mounted(){
      var this_ = this;
      document.title = '联系我们';
      if(!this_.token){
        var str=window.location.href;
        var obj = UTILS.PARAMSREG.paramsregurl(str);
        this_.changeToken(obj["stoken"]);
        localStorage.setItem('token', obj['stoken']);
      };
    },
    computed:{
      ...mapState(["token"])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
.contactus_container{
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  p {
    font-size: 0.34rem;
    color: #1f1f1f;
    line-height: 0.6rem;
  }
  a {
    color: #0000ff;
  }
}
</style>