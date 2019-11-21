import { getUid } from './uid'
import { commonParams, ERR_OK } from './config'
import axios from 'axios'
import { Base64 } from 'js-base64'

const debug = process.env.NODE_ENV !== 'production'

function getSongsUrl(songs) {
    const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl'
    let mids = []
    let types = []

    songs.forEach((song) => {
        mids.push(song.mid)
        types.push(0)
    })

    const urlMid = genUrlMid(mids, types)

    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        format: 'json',
        platform: 'h5',
        needNewCode: 1,
        uin: 0
    })

    return new Promise((resolve, reject) => {
        let tryTime = 3

        function request() {
            return axios.post(url, {
                comm: data,
                req_0: urlMid
            }).then((response) => {
                const res = response.data
                if (res.code === ERR_OK) {
                    let urlMid = res.req_0
                    if (urlMid && urlMid.code === ERR_OK) {
                        const purlMap = {}
                        urlMid.data.midurlinfo.forEach((item) => {
                            if (item.purl) {
                                purlMap[item.songmid] = item.purl
                            }
                        })
                        if (Object.keys(purlMap).length > 0) {
                            resolve(purlMap)
                        } else {
                            retry()
                        }
                    } else {
                        retry()
                    }
                } else {
                    retry()
                }
            })
        }

        function retry() {
            if (--tryTime >= 0) {
                request()
            } else {
                reject(new Error('Can not get the songs url'))
            }
        }

        request()
    })
}

export function getLyric(mid) {
    const url = debug ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

function genUrlMid(mids, types) {
    const guid = getUid()
    return {
        module: 'vkey.GetVkeyServer',
        method: "CgiGetVkey",
        param: {
            guid,
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
        }
    }
}

class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.filename = `C400${this.mid}.m4a`
        this.url = url
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
}

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: musicData.url
    })
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}
export function processSongsUrl(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return getSongsUrl(songs).then((purlMap) => {
        songs = songs.filter((song) => {
            const purl = purlMap[song.mid]
            if (purl) {
                song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
                return true
            }
            return false
        })
        return songs
    })
}
