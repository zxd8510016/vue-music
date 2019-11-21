<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song,index) in songs" :key="song.id" @click="selectItem(index)">
                <div class="rank" v-show="rank">
                    <span :class="setRankClass(index)">{{setRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{song|getDesc}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:['songs','rank'],
    filters:{
        getDesc(song){
            return song.singer+'·'+song.album
        }
    },
    methods:{
        selectItem(index){
            this.$emit('select',index);
        },
        setRankClass(index){
            if(index<=2){
                return `icon icon${index}`
            }else{
                return 'text'
            }
        },
        setRankText(index){
            if(index>2){
                return index+1
            }
        }
    }
}

</script>
<style scoped>
.song-list{
    padding: 20px 30px;
}
.song-list .item{
    display: flex;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
    overflow: hidden;
    align-items: center
}
.song-list .item .rank{
    width: 25px;
    margin-right: 30px;
    text-align: center;
    flex: 0 0 25px;
}
.song-list .item .rank .icon{
    display: inline-block;
    width: 25px;
    height: 24px;
    background-size: 25px 24px;
}
.song-list .item .rank .icon.icon0{
    background-image: url(../assets/img/first@2x.png)
}
.song-list .item .rank .icon.icon1{
    background-image: url(../assets/img/second@2x.png)
}
.song-list .item .rank .icon.icon2{
    background-image: url(../assets/img/third@2x.png)
}
.song-list .item .rank .text{
    color: #ffcd32;
    font-size: 18px;
}
.song-list .item .content{
    flex: 1;
    line-height: 20px;
}
.song-list .item .name{
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}  
.song-list .item .desc{
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.3);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}     
</style>