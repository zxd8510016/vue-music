<template>
    <div class="header-tab">
        <router-link to="/recommend" class="item">
            <span>推荐</span>
        </router-link>
        <router-link to="/singer" class="item">
            <span>歌手</span>
        </router-link>
        <router-link to="/rank" class="item">
            <span>排行</span>
        </router-link>
        <router-link to="/search" class="item">
            <span>搜索</span>
        </router-link>
    </div>
</template>

<script>
export default {

}

</script>
<style scoped>
.header-tab{
    position: relative;
    background: #222;
    display: flex;
}
.header-tab .item{
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    flex: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
}
.header-tab .item span{
    padding-bottom: 2px
}
.header-tab .router-link-active span{
    color: #ffcd32;
    border-bottom: 2px solid #ffcd32;
}
</style>