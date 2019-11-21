import { mapState } from 'vuex'

export const playListMixin = {
    computed: {
        ...mapState(['playList'])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList() {
            this.handlePlayList(this.playList)
        }
    },
    methods: {
        handlePlayList() {
            throw new Error('component must implement handlePlayList method')
        }
    }
}