<template>
  <div class="aboutus_container">
    <h1 class="tc" style="font-size: 26px; font-weight:bold">关于我们</h1>
    <p class="tl">
      &ensp;&ensp;&ensp;&ensp;章鱼书是一个有温度，有情怀，追求品质，帮您定制出版精美图书的平台。<br>
      &ensp;&ensp;&ensp;&ensp;人生就像一本书，或厚或薄，或通俗或经典，或精美或平装，每个人都在撰写着属于自己独一无二的书。<br>
      &ensp;&ensp;&ensp;&ensp;章鱼书正是可以帮您定制出版一本专属您的图书。您可根据自己的喜好选择封面、模板、封装规格，自定义书名、作者名等，上传照片，智能生成精美图书。<br>
      &ensp;&ensp;&ensp;&ensp;目前我们有三个系列的图书模板供您选择。<br>
      &ensp;&ensp;&ensp;&ensp;<strong style="font-size: 20px; font-weight:bold">绘本系：</strong>
      主要针对儿童画集、绘本等。上传小朋友创作的绘画照片，为她/他出版一本专属自己的绘画集。<a href="#" @click="jumptoMake(1)">→点我制作绘本集</a><br>
      &ensp;&ensp;&ensp;&ensp;<strong style="font-size: 20px; font-weight:bold">成长系：</strong>
      主要针对儿童成长记。用照片来记录宝贝成长过程中的点点滴滴，将它们作成一本值得回忆和珍藏的书。<a href="#" @click="jumptoMake(2)">→点我制作成长记</a><br>
      &ensp;&ensp;&ensp;&ensp;<strong style="font-size: 20px; font-weight:bold">梦想系：</strong>
      主要针对旅行记。不论您是亲子游，毕业游，团建游，情侣游，还是独自游，人生中总有一些旅行是值得珍藏和纪念的。这些值得珍藏的旅行，用书来记录才更有意义。<a  href="#" @click="jumptoMake(3)">→点我制作旅行记</a><br>
      <br>
      &ensp;&ensp;&ensp;&ensp;章鱼书定制出版，自己收藏是精美精品，赠送亲朋是品质礼品。精美好品质，你值得拥有！<br>
      &ensp;&ensp;&ensp;&ensp;值得珍藏的章鱼书定制图书只需三步就能完成：<br>
      &ensp;&ensp;&ensp;&ensp;第一步，选择您喜欢的模板；<br>
      &ensp;&ensp;&ensp;&ensp;第二步，上传您精美的照片，一键智能生成图书；<br>
      &ensp;&ensp;&ensp;&ensp;第三步，下单，等待精装有品质的定制图书送到您手中。<br>
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
      jumptoMake(index){
        var this_ = this;
        console.log(index);
        this_.changeModelTypeId(index);
        this.$router.push({
          path: '/index',
          name: 'INDEX'
        });
      },
      ...mapMutations([
        "changeModelTypeId"
      ])
    },
    mounted(){
      var this_ = this;
      document.title = '关于我们';

    },
    computed:{
      ...mapState([])
    }
  }
</script>

<style scoped lang="scss" type="text/css">
.aboutus_container{
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