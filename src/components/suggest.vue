<template>
    <scroll class="suggest" :pullup="pullUp" @scrollToEnd="searchMore" ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item,index) in result" :key="index"> 
                <i :class="getIconCls(item)" class="icon"></i>
                <p class="name">{{getMusicName(item)}}</p>
            </li>
            <loading v-show="hasMore" title=''></loading>
        </ul>
    </scroll>
</template>

<script>
import {search} from '@/assets/js/search'
import {createSong} from '@/assets/js/song'
 
const TYPE_SINGER='singer'
const perpage = 20

export default {
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            page:1,
            result:[],
            hasMore:true,
            pullUp:true
        }
    },
    watch:{
        query(){
            this.search()
        }
    },
    methods:{
        searchMore(){
            if(!this.hasMore)return;
            this.page++;
            search(this.query, this.page, this.showSinger, perpage).then(res=>{
                this.result=this.result.concat(this.getResult(res.data))
                this.checkMore(res.data)
            })
        },
        search(){
            this.hasMore=true;
            this.page=1;
            this.$refs.suggest.scrollTo(0,0)
            search(this.query, this.page, this.showSinger, perpage).then(res=>{
                this.result=this.getResult(res.data)
                this.checkMore(res.data)
            })
        },
        checkMore(data){
            const song=data.song;
            if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum){
                this.hasMore=false;
            }
        },
        getResult(data){
            var ret=[];
            if(data.zhida && data.zhida.singerid){
                ret.push({...data.zhida, ...{type:TYPE_SINGER}})
            }
            if(data.song){
                ret=ret.concat(this.normalizeSongs(data.song.list))
            }
            return ret
        },
        normalizeSongs(list){
            var ret = [];
            list.forEach(item=>{
                if(item.songid && item.albumid){
                    ret.push(createSong(item))
                }
            })
            return ret
        },
        getIconCls(item){
            if(item.type==TYPE_SINGER){
                return 'icon-mine'
            }else{
                return 'icon-music'
            }
        },
        getMusicName(item){
            if(item.type==TYPE_SINGER){
                return item.singername
            }else{
                return `${item.name}-${item.singer}`
            }
        }
    }
}
</script>

<style scoped>
.suggest{
    position: absolute;
    width: 100%;
    top: 178px;
    bottom: 0;
    overflow: hidden;
}
.suggest .suggest-list{
    padding: 0 30px;
}
.suggest-item{
    display: flex;
    align-items: center;
    padding-bottom: 20px;
}
.suggest-item .icon{
    width: 30px;
    font-size: 14px;
    color: hsla(0,0%,100%,.3);
}
.suggest-item .name{
    flex: 1;
    font-size: 14px;
    color: hsla(0,0%,100%,.3);
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>