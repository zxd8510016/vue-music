<template>
    <MusicList :name="name" :bgImage="bgImage" :songs="songs"/>
</template>

<script>
import {mapState} from 'vuex'
import {getSongList} from '@/assets/js/recommend'
import {createSong,processSongsUrl} from '@/assets/js/song'
export default {
    computed:{
        ...mapState(['disc']),
        name(){
            return this.disc.dissname
        },
        bgImage(){
            return this.disc.imgurl
        }
    },
    data(){
        return {
            songs:[]
        }
    },
    created(){
        if(!this.disc.dissid){
            this.$router.go(-1)
            return;
        }
        getSongList(this.disc.dissid).then(res=>{
            processSongsUrl(this.normalizeSong(res.cdlist[0].songlist)).then((songs)=>{
                this.songs=songs;
            })
        })
    },
    methods:{
        normalizeSong(list){
            var ret=[];
            list.forEach(musicData=>{
                if(musicData.songid && musicData.albumid){
                    ret.push(createSong(musicData))
                }
            })
            return ret;
        }
    }
}
</script>

<style>
</style>