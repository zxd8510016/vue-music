<template>
	<MusicList :name="name" :bgImage="bgImage" :songs="songs" :rank="isRank" />
</template>

<script>
import { mapState } from "vuex";
import { getMusicList } from "@/assets/js/rank";
import { createSong, processSongsUrl } from "@/assets/js/song";
export default {
	computed: {
		...mapState(["rank"]),
		name() {
			return this.rank.topTitle;
		},
		bgImage() {
            if(this.songs.length){
                return this.songs[0].image
            }else{
                return ''
            }
		}
    },
    data(){
        return {
            songs:[],
            isRank:true
        }
    },
	created() {
        if(!this.rank.id){
            this.$router.go(-1)
            return
        }
		getMusicList(this.rank.id).then(res => {
			processSongsUrl(this.normalizeSongs(res.songlist)).then(songs => {
				this.songs = songs;
			});
		});
	},
	methods: {
		normalizeSongs(list) {
			let ret = [];
			list.forEach(item => {
				const musicData = item.data;
				ret.push(createSong(musicData));
			});
			return ret;
		}
	}
};
</script>

<style scoped>
</style>