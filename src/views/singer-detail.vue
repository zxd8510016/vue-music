<template>
	<MusicList :name="name" :bgImage="bgImage" :songs="songs"/>
</template>

<script>
import { getSingerDetail } from "@/assets/js/singer";
import { createSong } from "@/assets/js/song";
import { processSongsUrl } from "@/assets/js/song";
import {mapState} from 'vuex'
export default {
	data(){
		return {
			id: this.$route.params.id,
			songs: []
		}
	},
	computed:{
		...mapState(['singer']),
		name(){
			return this.singer.name
		},
		bgImage(){
			return this.singer.avatar
		}
	},
	created() {
		if(!this.name){
			this.$router.go(-1);
			return
		}
		getSingerDetail(this.id).then(res => {
			processSongsUrl(this.normalizeSongs(res.data.list)).then(songs => {
				this.songs = songs;
			});
		});
	},
	methods:{
		normalizeSongs(list) {
			var ret = [];
			list.forEach(item => {
				var { musicData } = item;
				ret.push(createSong(musicData));
			});
			return ret;
		}
	}
}
</script>

<style scoped>
</style>