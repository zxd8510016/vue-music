<template>
    <div class="singer" ref="singer">
        <list-view :data="singerList" @select="selectHandle"></list-view>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import {getSingerList} from '@/assets/js/singer'
import listView from '@/components/list-view'
import {playListMixin} from '@/assets/js/mixin'
export default {
    mixins:[playListMixin],
    data(){
        return {
            singerList:[]
        }
    },
    created(){
        getSingerList().then(res=>{
            this.singerList=this.normalizeSinger(res.data.list);
        })
    },
    components:{
        listView
    },
    methods:{
        handlePlayList(playList){
            const bottom=playList.length>0 ? 60 : 0;
			this.$refs.singer.style.bottom=bottom+'px';
        },
        selectHandle(singer){
            this.$store.commit('getSingerItem',singer)
            this.$router.push({
                path:`/singer/${singer.id}`
            })
        },
        normalizeSinger(list){
            var map={
                hot:{
                    title:'热门',
                    items:[]
                }
            }
            list.forEach((item,index) => {
                if(index<10){
                    map.hot.items.push({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                        avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })
                }
                const key=item.Findex
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name,
                    avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                })
            })
            var hot=[];
            var ret=[];

            for(var attr in map){
                var val=map[attr]
                if(val.title.match(/[a-zA-Z]/)){
                    ret.push(val)
                }else if(val.title=='热门'){
                    hot.push(val)
                }
            }
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0)-b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        }
    }
}
</script>

<style>
.singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
}
.slide-enter-active, .slide-leave-active{
    transition: .3s
}   

.slide-enter, .slide-leave-to{
    transform: translateX(100%)
}
</style>