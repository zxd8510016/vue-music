<template>
	<div class="player" v-show="playList.length>0">
		<transition
			name="normal"
			@enter="enter"
			@after-enter="afterEnter"
			@leave="leave"
			@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="bg">
					<img :src="currentSong.image" width="100%" height="100%" />
				</div>
				<div class="top">
					<div class="back" @click="closeFullScreen">
						<i class="icon-back"></i>
					</div>
					<h1 class="title">{{currentSong.name}}</h1>
					<h2 class="subtitle">{{currentSong.singer}}</h2>
				</div>
				<div
					class="middle"
					@touchstart.prevent="middleTouchStart"
					@touchmove.prevent="middleTouchMove"
					@touchend="middleTouchEnd"
				>
					<div class="middle-l" ref="cd">
						<div class="cd-wrap" ref="cdWrap">
							<img :src="currentSong.image" :class="cdClass" />
						</div>
						<div class="playing-lyric-wrap">
							<div class="playing-lyric">{{playingLyric}}</div>
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList">
						<!-- 歌词列表 -->
						<div>
							<div class="lyric-wrap" v-if="currentLyric">
								<p
									class="text"
									v-for="(item,index) in currentLyric.lines"
									:key="index"
									:class="{current:currentLineNum==index}"
									ref="lyricLine"
								>{{item.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrap">
						<span :class="{active:currentShow=='cd'}"></span>
						<span :class="{active:currentShow=='lyric'}"></span>
					</div>
					<div class="progress-wrap">
						<span class="time time-l">{{format(currentTime)}}</span>
						<!-- 播放器滚动条组件 -->
						<ProgressBar :percent="percent" @changePercent="onChangePercent" />
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="control-btns">
						<div class="left">
							<i :class="iconMode" @click="changeMode"></i>
						</div>
						<div class="left">
							<i class="icon-prev" @click="prevPlay"></i>
						</div>
						<div class="center">
							<i @click="togglePlaying" :class="iconPlay"></i>
						</div>
						<div class="right">
							<i class="icon-next" @click="nextPlay"></i>
						</div>
						<div class="right">
							<i class="icon icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
				<div class="icon">
					<img :src="currentSong.image" :class="cdClass" />
				</div>
				<div class="text">
					<h3 class="name">{{currentSong.name}}</h3>
					<p class="desc">{{currentSong.singer}}</p>
				</div>
				<div class="control1">
					<i :class="miniPlay" @click.stop="togglePlaying"></i>
				</div>
				<div class="control2">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<audio
			:src="currentSong.url"
			ref="audio"
			@timeupdate="timeupdate"
			@canplay="canplay"
			@error="error"
			@ended="end"
		></audio>
	</div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import ProgressBar from "@/components/progress-bar";
import { random } from "@/assets/js/random";
import Lyric from "lyric-parser";

const playMode = {
	sequence: 0,
	loop: 1,
	random: 2
};

export default {
	data() {
		return {
			index: 0,
			currentTime: 0,
			songReady: false,
			mode: playMode.sequence,
			currentLyric: null,
			currentLineNum: 0,
			currentShow: "cd",
			playingLyric: ""
		};
	},
	created() {
		this.touch = {};
	},
	computed: {
		...mapState([
			"playList",
			"fullScreen",
			"currentIndex",
			"randomList",
			"playing"
		]),
		...mapGetters(["currentSong", "playListSong"]),
		iconPlay() {
			return this.playing ? "icon-pause" : "icon-play";
		},
		miniPlay() {
			return this.playing ? "icon-pause-mini" : "icon-play-mini";
		},
		cdClass() {
			return this.playing ? "play" : "play pause";
		},
		percent() {
			return this.currentTime / this.currentSong.duration;
		},
		iconMode() {
			switch (this.mode) {
				case playMode.sequence:
					return "icon-sequence";

				case playMode.loop:
					return "icon-loop";

				default:
					return "icon-random";
			}
		}
	},
	watch: {
		currentSong(newSong, oldSong) {
			if (newSong.id === oldSong.id) return;
			if (this.currentLyric) {
				this.currentLyric.stop();
			}
			this.$nextTick(() => {
				this.$refs.audio.play();
				this.getLyric();
			});
		}
	},
	components: {
		ProgressBar
	},
	methods: {
		...mapMutations(["closeFullScreen", "openFullScreen"]),
		onChangePercent(percent) {
			var currentTime = this.currentSong.duration * percent;
			this.$refs.audio.currentTime = currentTime;
			this.$refs.audio.play();
			this.$store.commit("setPlaying");
			this.currentLyric.seek(currentTime * 1000);
		},
		getLyric() {
			this.currentSong
				.getLyric()
				.then(lyric => {
					this.currentLyric = new Lyric(lyric, this.handleLyric);
					if (this.playing) {
						this.currentLyric.play();
					}
				})
				.catch(() => {
					this.currentLyric = null;
					this.playingLyric = "";
					this.currentLineNum = 0;
				});
		},
		handleLyric({ txt, lineNum }) {
			this.currentLineNum = lineNum;
			if (lineNum > 5) {
				var lineEl = this.$refs.lyricLine[lineNum - 5];
				this.$refs.lyricList.scrollToElement(lineEl, 1000);
			}
			this.playingLyric = txt;
		},
		middleTouchStart(e) {
			this.touch.startX = e.changedTouches[0].pageX;
			this.touch.startY = e.changedTouches[0].pageY;
			this.$refs.lyricList.$el.style.transition = "none";
			this.$refs.cd.style.transition = "none";
		},
		middleTouchMove(e) {
			var disX = e.changedTouches[0].pageX - this.touch.startX;
			var disY = e.changedTouches[0].pageY - this.touch.startY;
			var left = this.currentShow == "cd" ? 0 : -window.innerWidth;
			var width = left + disX;
			if (width < -window.innerWidth) {
				width = -window.innerWidth;
			} else if (width > 0) {
				width = 0;
			}
			if (Math.abs(disY) > Math.abs(disX)) return;

			this.touch.percent = Math.abs(width / window.innerWidth);
			this.$refs.cd.style.opacity = 1 - this.touch.percent;
			this.$refs.lyricList.$el.style.transform =
				"translateX(" + width + "px)";
			this.$refs.lyricList.$el.style.WebkitTransform =
				"translateX(" + width + "px)";
		},
		middleTouchEnd() {
			var width;
			if (this.currentShow == "cd") {
				if (this.touch.percent > 0.1) {
					width = -window.innerWidth;
					this.$refs.cd.style.opacity = 0;
					this.currentShow = "lyric";
				} else {
					width = 0;
					this.$refs.cd.style.opacity = 1;
				}
			} else {
				if (this.touch.percent < 0.9) {
					width = 0;
					this.$refs.cd.style.opacity = 1;
					this.currentShow = "cd";
				} else {
					width = -window.innerWidth;
					this.$refs.cd.style.opacity = 0;
				}
			}
			this.$refs.cd.style.transition = "0.3s";
			this.$refs.lyricList.$el.style.transition = "0.3s";
			this.$refs.lyricList.$el.style.transform =
				"translateX(" + width + "px)";
			this.$refs.lyricList.$el.style.WebkitTransform =
				"translateX(" + width + "px)";
		},
		togglePlaying() {
			const audio = this.$refs.audio;
			this.$store.commit("togglePlaying");
			if (this.playing) {
				audio.play();
			} else {
				audio.pause();
			}
			this.currentLyric.togglePlay();
		},
		nextPlay() {
			if (!this.songReady) return;
			this.index = this.currentIndex;
			this.index++;
			if (this.index > this.playList.length - 1) {
				this.index = 0;
			}
			this.$store.commit("setCurrentIndex", this.index);
			this.$store.commit("setPlayList", this.randomList);
			this.$store.commit("tabPlayIndex", this.index);
			this.$store.commit("setPlaying");
			this.songReady = false;
		},
		prevPlay() {
			if (!this.songReady) return;
			this.index = this.currentIndex;
			this.index--;
			if (this.index < 0) {
				this.index = this.playList.length - 1;
			}
			this.$store.commit("setCurrentIndex", this.index);
			this.$store.commit("setPlayList", this.randomList);
			this.$store.commit("tabPlayIndex", this.index);
			this.$store.commit("setPlaying");
			this.songReady = false;
		},
		timeupdate(e) {
			this.currentTime = Math.floor(e.target.currentTime);
		},
		format(times) {
			var minute = Math.floor(times / 60);
			var seconds = this.toZero(times % 60);
			return minute + ":" + seconds;
		},
		toZero(n) {
			return n < 10 ? "0" + n : n;
		},
		canplay() {
			this.songReady = true;
		},
		error() {
			this.songReady = true;
		},
		end() {
			if (this.mode == playMode.loop) {
				this.loop();
			} else {
				this.nextPlay();
			}
		},
		loop() {
			this.$refs.audio.currentTime = 0;
			this.$refs.audio.play();
			this.currentLyric.seek(0);
		},
		changeMode() {
			var mode = (this.mode + 1) % 3;
			this.mode = mode;
			var list = null;
			if (this.mode == playMode.random) {
				list = random(this.randomList);
				this.$store.commit("setRandomList", list);
				this.setCurrentIndex(list);
			} else {
				list = this.randomList;
			}
		},
		setCurrentIndex(list) {
			var index = list.findIndex(item => {
				return item.id == this.playListSong.id;
			});
			this.$store.commit("setCurrentIndex", index);
		},
		enter(el, done) {
			var { x, y, scale } = this.getPosAndScale();
			var animation = {
				0: {
					transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0,0,0) scale(1.2)`
				},
				100: {
					transform: `translate3d(0,0,0) scale(1)`
				}
			};
			animations.registerAnimation({
				name: "move",
				animation,
				presets: {
					duration: 400,
					easing: "linear"
				}
			});
			animations.runAnimation(this.$refs.cdWrap, "move", done);
		},
		afterEnter() {
			animations.unregisterAnimation("move");
			this.$refs.cdWrap.style.animation = "";
		},
		leave(el, done) {
			this.$refs.cdWrap.style.transition = "all 0.4s";
			var { x, y, scale } = this.getPosAndScale();
			this.$refs.cdWrap.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
			this.$refs.cdWrap.style.WebkitTransform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
			this.$refs.cdWrap.addEventListener("transitionend", done);
		},
		afterLeave() {
			this.$refs.cdWrap.style.transition = "";
			this.$refs.cdWrap.style.transform = "";
			this.$refs.cdWrap.style.WebkitTransform = "";
		},
		getPosAndScale() {
			var targetWidth = 40;
			var paddingLeft = 40;
			var paddingBottom = 30;
			var paddingTop = 80;
			var width = window.innerWidth * 0.8;
			var scale = targetWidth / width;
			var x = -(window.innerWidth / 2 - paddingLeft);
			var y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

			return { x, y, scale };
		}
	}
};
</script>

<style scoped>
.normal-player {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #222;
	z-index: 100;
}
.normal-player .bg {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0.6;
	filter: blur(20px);
}
.normal-player .top {
	position: relative;
	margin-bottom: 25px;
}
.normal-player .top .back {
	position: absolute;
	top: 0;
	left: 6px;
}
.normal-player .top .icon-back {
	display: block;
	padding: 9px;
	font-size: 22px;
	color: #ffcd32;
	transform: rotate(-90deg);
}
.normal-player .top .title {
	width: 70%;
	margin: 0 auto;
	line-height: 40px;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	font-size: 18px;
	color: #fff;
}
.normal-player .top .subtitle {
	line-height: 20px;
	text-align: center;
	font-size: 14px;
	color: #fff;
}
.normal-player .middle {
	position: fixed;
	width: 100%;
	top: 80px;
	bottom: 170px;
	white-space: nowrap;
	font-size: 0;
}
.normal-player .middle-l {
	position: relative;
	width: 100%;
	height: 0;
	padding-top: 80%;
	display: inline-block;
	vertical-align: top;
}
.normal-player .middle-l .cd-wrap {
	position: absolute;
	left: 10%;
	top: 0;
	width: 80%;
	box-sizing: border-box;
	height: 100%;
}
.normal-player .middle-l .cd-wrap img.play,
.mini-player .icon img.play {
	animation: rotate 20s linear infinite;
}
.normal-player .middle-l .cd-wrap img.pause,
.mini-player .icon img.pause {
	animation-play-state: paused;
}
@keyframes rotate {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}
.normal-player .middle-l .cd-wrap img {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	box-sizing: border-box;
	border-radius: 50%;
	border: 10px solid hsla(0, 0%, 100%, 0.1);
}
.normal-player .bottom {
	position: fixed;
	bottom: 50px;
	width: 100%;
}
.normal-player .bottom .dot-wrap {
	text-align: center;
	font-size: 0;
}
.normal-player .bottom .dot-wrap span {
	display: inline-block;
	margin: 0 4px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: hsla(0, 0%, 100%, 0.5);
}
.normal-player .bottom .dot-wrap span.active {
	width: 20px;
	border-radius: 5px;
	background: hsla(0, 0%, 100%, 0.8);
}
.normal-player .bottom .progress-wrap {
	width: 80%;
	margin: 0 auto;
	padding: 10px 0;
	display: flex;
}
.normal-player .bottom .progress-wrap .time {
	color: #fff;
	font-size: 12px;
	line-height: 30px;
	width: 30px;
}
.normal-player .bottom .progress-wrap .time-l {
	text-align: left;
}
.normal-player .bottom .progress-wrap .time-r {
	text-align: right;
}

.control-btns {
	display: flex;
	align-items: center;
}
.control-btns div {
	flex: 1;
	color: #ffcd32;
}
.control-btns div i {
	font-size: 30px;
}
.control-btns div.left {
	text-align: right;
}
.control-btns div.right {
	text-align: left;
}
.control-btns div.center {
	padding: 0 20px;
	text-align: center;
}
.control-btns div.center i {
	font-size: 40px;
}
.mini-player {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 60px;
	background: #333;
	display: flex;
	align-items: center;
	z-index: 100;
}
.mini-player .icon {
	width: 40px;
	height: 40px;
	padding: 0 10px 0 20px;
}
.mini-player .icon img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.mini-player .text {
	display: flex;
	flex-direction: column;
	flex: 1;
	line-height: 20px;
}
.mini-player .text .name,
.mini-player .text .desc {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.mini-player .text .name {
	margin-bottom: 2px;
	font-size: 14px;
	color: #fff;
}
.mini-player .text .desc {
	font-size: 12px;
	color: hsla(0, 0%, 100%, 0.3);
}
.mini-player .control1,
.mini-player .control2 {
	width: 30px;
	margin: 0 10px;
	position: relative;
	height: auto;
}
.mini-player .control1 {
	height: 34px;
}
.mini-player .control2 {
	height: 30px;
}
.mini-player .control1 i,
.mini-player .control2 i {
	font-size: 32px;
	position: absolute;
	left: 0;
	top: 0;
	color: rgba(255, 205, 49, 0.5);
}
.middle-r {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: inline-block;
}
.lyric-wrap {
	width: 80%;
	margin: 0 auto;
	text-align: center;
}
.lyric-wrap .text {
	line-height: 32px;
	color: hsla(0, 0%, 100%, 0.5);
	font-size: 14px;
}
.lyric-wrap .text.current {
	color: #fff;
}
.playing-lyric-wrap {
	width: 80%;
	margin: 30px auto 0;
	overflow: hidden;
	text-align: center;
}
.playing-lyric {
	height: 20px;
	line-height: 20px;
	font-size: 14px;
	color: hsla(0, 0%, 100%, 0.5);
}

/* 实现动画效果 */
.normal-enter-active,
.normal-leave-active {
	transition: all 0.4s;
}
.normal-enter-active .top,
.normal-leave-active .top,
.normal-enter-active .bottom,
.normal-leave-active .bottom {
	transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-enter,
.normal-leave-to {
	opacity: 0;
}

.normal-enter .top,
.normal-leave-to .top {
	transform: translate3d(0, -100px, 0);
}
.normal-enter .bottom,
.normal-leave-to .bottom {
	transform: translate3d(0, 100px, 0);
}
.mini-enter-active,
.mini-leave-active {
	transition: all 0.4s;
}
.mini-enter,
.mini-leave-to {
	opacity: 0;
}
</style>