<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" class="text" v-model="query" :placeholder="placeholder">
        <i class="icon-dismiss" v-show="query" @click="delQuery"></i>
    </div>
</template>

<script>
export default {
    props:{
        placeholder:{
            type:String,
            default:'搜索歌曲、歌手'
        }
    },
    data(){
        return {
            query:''
        }
    },
    methods:{
        delQuery(){
            this.query=''
        },
        setQuery(query){
            this.query=query;
        }
    },
    watch:{
        query(){
            this.$emit('query',this.query)
        }
    }
}
</script>

<style scoped>
.search-box{
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333;
    border-radius: 6px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}
.icon-search{
    font-size: 24px;
    color: #222;
}
.search-box .text{
    margin: 0 5px;
    line-height: 18px;
    background: #333;
    color: #fff;
    font-size: 14px;
    outline: 0;
    flex: 1;
}
.search-box .icon-dismiss{
    font-size: 16px;
    color: #222;
}
</style>