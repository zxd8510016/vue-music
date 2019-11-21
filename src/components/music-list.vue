<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title">{{name}}</h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="filter" ref="filter"></div>
			<div class="play-wrap">
				<div class="play-btn" v-show="songs.length>0" ref="playBtn">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
		</div>
		<div class="layer" ref="layer"></div>
		<scroll class="list" ref="songList" :listen-scroll="listenScroll" @scroll="scroll">
			<songList :songs="songs" @select="selectHandle" :rank="rank"/>
			<div class="loadwrap">
				<Loading v-if="!songs.length" />
			</div>	
		</scroll>
	</div>
</template>

<script>
import SongList from "@/components/song-list";
import { random } from '@/assets/js/random'
import { playListMixin } from '@/assets/js/mixin'

const minH = 40;
export default {
    mixins:[playListMixin],
    props:['name','bgImage','songs','rank'],
	data() {
		return {
			listenScroll: true
		}
	},
	computed: {
		bgStyle() {
			return `background-image:url(${this.bgImage})`;
		}
	},
	components: {
		SongList
	},
	mounted() {
		this.height = this.$refs.bgImage.clientHeight;
		this.$refs.songList.$el.style.top = this.height + "px";
	},
	methods: {
		handlePlayList(playList){
			const bottom=playList.length>0 ? 60 : 0;
			this.$refs.songList.$el.style.bottom=bottom+'px';
		},
		back() {
			this.$router.go(-1);
		},
		selectHandle(index) {
			this.$store.commit("selectPlayList", {
				songs: this.songs,
				index
			});
		},
		scroll(pos) {
			var y = pos.y;
			var scale = 1;
			var blur = 0;
			var percent = Math.abs(y / this.height);

			if (y > 0) {
				scale += percent;
			} else {
				blur = Math.min(20 * percent, 20);
			}
			var zIndex = 0;
			if (y < -this.height + minH) {
				y = -this.height + minH;
				zIndex = 10;
				this.$refs.bgImage.style.paddingTop = 0;
				this.$refs.bgImage.style.height = minH + "px";
				this.$refs.playBtn.style.display = "none";
			} else {
				this.$refs.bgImage.style.paddingTop = "70%";
				this.$refs.bgImage.style.height = 0;
				this.$refs.playBtn.style.display = "block";
			}
			this.$refs.bgImage.style.zIndex = zIndex;

			this.$refs.layer.style.transform = `translate3d(0,${y}px,0)`;
			this.$refs.layer.style.WebkitTransform = `translate3d(0,${y}px,0)`;

			this.$refs.bgImage.style.transform = `scale(${scale})`;
			this.$refs.bgImage.style.WebkitTransform = `scale(${scale})`;

			this.$refs.filter.style.backdropFilter = `blur(${blur}px)`;
			this.$refs.filter.style.WebkitBackdropFilter = `blur(${blur}px)`;
		}
	}
};
</script>

<style scoped>
.music-list {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 100;
	background: #222;
}
.music-list .back {
	position: absolute;
	top: 0;
	left: 6px;
	z-index: 50;
}
.music-list .back .icon-back {
	display: block;
	padding: 10px;
	font-size: 22px;
	color: #ffcd32;
}
.music-list .title {
	position: absolute;
	top: 0;
	left: 10%;
	width: 80%;
	text-align: center;
	line-height: 40px;
	font-size: 18px;
	color: #fff;
	z-index: 50;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.bg-image {
	padding-top: 70%;
	background-size: cover;
	position: relative;
}
.bg-image .filter {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(7, 17, 27, 0.4);
}
.list {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	background: #222;
}
.layer {
	height: 100%;
	background: #222;
}
.play-wrap {
	position: absolute;
	bottom: 20px;
	z-index: 50;
	width: 100%;
}
.play-btn {
	box-sizing: border-box;
	width: 135px;
	padding: 7px 0;
	margin: 0 auto;
	text-align: center;
	border: 1px solid #ffcd32;
	color: #ffcd32;
	border-radius: 100px;
	font-size: 0;
}
.play-wrap .icon-play {
	vertical-align: middle;
	font-size: 16px;
	margin-right: 6px;
}
.play-wrap .text {
	vertical-align: middle;
	font-size: 12px;
}
</style>