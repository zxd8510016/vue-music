<template>
    <div class="search">
        <div class="search-wrap">
            <SearchBox ref="searchBox" @query="queryHandle"/>
        </div>
        <div class="key-wrap" v-show="!query">
            <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                    <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">{{item.k}}</li>
                </ul>
            </div>
        </div>
        <Suggest :query="query" v-show="query"/>
    </div>
</template>

<script>
import {getHotKey} from '@/assets/js/search'
import Suggest from '@/components/suggest'
export default {
    data(){
        return {
            hotKey:[],
            query:''
        }
    },
    components:{
        Suggest
    },
    created(){
        getHotKey().then(res=>{
            this.hotKey=res.data.hotkey.slice(0,10);
        })
    },
    methods:{
        addQuery(k){
            this.$refs.searchBox.setQuery(k)
        },
        queryHandle(q){
            this.query=q;
        }
    }
}

</script>
<style scoped>
.search-wrap{
    margin: 20px;
}
.key-wrap{
    position: absolute;
    top: 178px;
    bottom: 0;
    width: 100%;
    z-index: 50;
}
.hot-key{
    margin: 0 20px 20px;
}
.hot-key .title{
    margin-bottom: 20px;
    font-size: 14px;
    color: hsla(0,0%,100%,.5);
}
.hot-key .item{
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: #333;
    font-size: 14px;
    color: hsla(0,0%,100%,.3);
}
</style>