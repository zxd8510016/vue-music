<template>
    <scroll class="rank" ref="rank">
        <ul>
            <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
                <div class="img-wrap">
                    <img v-lazy="item.picUrl">
                </div>
                <ul class="songlist">
                    <li class="song" v-for="(song,index) in item.songList" :key="index">
                        <span>{{index+1}}</span>
                        <span>{{song.songname}}-{{song.singername}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <Loading v-if="!topList.length"/>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </scroll>
</template>

<script>
import {getTopList} from '@/assets/js/rank';
import {playListMixin} from '@/assets/js/mixin'
export default {
    mixins:[playListMixin],
    data(){
        return {
            topList:[]
        }
    },
    created(){
        getTopList().then(res=>{
            this.topList=res.data.topList;
        })
    },
    methods:{
        handlePlayList(playlist){
            var bottom = playlist.length > 0 ? 60 : 0;
            this.$refs.rank.$el.style.bottom=bottom+'px';
        },
        selectItem(item){
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.$store.commit('setRank',item)
        }
    }
}
</script>
<style scoped>
.rank{
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: hidden;
}
.rank .item{
    display: flex;
    margin: 0 20px;
    padding-top: 20px;
    height: 100px;
}
.rank .item:last-child{
    padding-bottom: 20px
}
.rank .item .img-wrap, .rank .item .img-wrap img{
    width: 100px;
    height: 100px;
}
.rank .item .songlist{
    flex: 1;
    height: 100px;
    overflow: hidden;
    background: #333;
    color: hsla(0,0%,100%,.3);
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
}
.rank .item .songlist .song{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 26px;
}
.slide-enter-active, .slide-leave-active{
    transition: .3s
}   

.slide-enter, .slide-leave-to{
    transform: translateX(100%)
}
</style>