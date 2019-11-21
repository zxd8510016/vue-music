import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playing: false,
        singer: {},
        disc: {},
        rank: {},
        fullScreen: false,
        playList: [],
        randomList: [],
        playIndex: -1,      //这个索引用来找到当前播放的歌曲，是不随着随机播放改变的
        currentIndex: -1    //这个索引用来找到当前随机播放后的歌曲的索引
    },
    getters: {
        currentSong(state) {
            return state.randomList[state.currentIndex] || {};
        },
        playListSong(state) {
            return state.playList[state.playIndex] || {}
        }
    },
    mutations: {
        getSingerItem(state,singer) {
            state.singer = singer;
        },
        selectPlayList(state,list) {
            state.playList = [...list.songs];
            state.randomList = [...list.songs];
            state.playIndex = list.index;
            state.currentIndex = list.index;
            state.fullScreen = true;
            state.playing = true;
        },
        togglePlaying(state) {
            state.playing = !state.playing;
        },
        setPlaying(state) {
            state.playing = true;
        },
        closeFullScreen(state) {
            state.fullScreen = false;
        },
        openFullScreen(state) {
            state.fullScreen = true;
        },
        setCurrentIndex(state, index) {
            state.currentIndex=index
        },
        tabPlayIndex(state, index) {
            state.playIndex = index;
        },
        setRandomList(state,list) {
            state.randomList = list;
        },
        setPlayList(state, list) {
            state.playList = [...list];
        },
        setDisc(state, disc) {
            state.disc = disc;
        },
        setRank(state, rank) {
            state.rank = rank;
        }
    }
})