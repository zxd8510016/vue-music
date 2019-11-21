<template>
    <scroll class="recommend" ref="recommend">
        <div class="recommend-content">
            <Slider v-if="imgList.length" :imgList="imgList"></Slider>
            <div class="recommend-list">
                <h1>热门歌单推荐</h1>
                <ul>
                    <li class="item" v-for="item in discList" :key="item.dissid" @click="selectItem(item)">
                        <div class="icon">
                            <img width="60" height="60" v-lazy="item.imgurl">
                        </div>
                        <div class="text">
                            <h2 class="name">{{item.creator.name}}</h2>
                            <p class="desc">{{item.dissname}}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="loadwrap">
            <Loading v-if="!discList.length"/>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </scroll>
</template>

<script>
import {getRecommend,getDiscList} from '@/assets/js/recommend'
import Slider from '@/components/slider'
import {playListMixin} from '@/assets/js/mixin'
export default {
    mixins:[playListMixin],
    data(){
        return {
            imgList:[],
            discList:[]
        }
    },
    created(){
        getRecommend().then(res=>{
            if(res.code==0){
                this.imgList=res.data.slider;
            }
        })
        getDiscList().then(res=>{
            if(res.code==0){
                this.discList=res.data.list;
            }
        })
    },
    methods:{
        handlePlayList(playList){
            const bottom=playList.length>0 ? 60 : 0;
			this.$refs.recommend.$el.style.bottom=bottom+'px';
        },
        selectItem(item){
            this.$router.push({
                path:`/recommend/${item.dissid}`
            })
            this.$store.commit('setDisc',item)
        }
    },
    components:{
        Slider
    }
}

</script>
<style scoped>
.recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: hidden;
}
.recommend-list h1{
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: 14px;
    color: #ffcd32;
}
.recommend-list .item{
    display: flex;
    box-sizing: border-box;
    padding: 0 20px 20px 20px;
}
.recommend-list .item .icon{
    width: 60px;
    padding-right: 20px;
}
.recommend-list .text{
    line-height: 20px;
    overflow: hidden;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center
}
.recommend-list .text h2{
    padding-bottom: 10px;
    color: #fff
}
.recommend-list .text p{
    color: hsla(0,0%,100%,.3);
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.slide-enter-active, .slide-leave-active{
    transition: .3s
}   
.slide-enter, .slide-leave-to{
    transform: translateX(100%)
}
</style>