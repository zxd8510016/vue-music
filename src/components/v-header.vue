<template>
    <div class="header">
        <div class="icon"></div>
        <h1 class="title">Chicken Music</h1>
    </div>
</template>

<script>
export default {

}

</script>

<style scoped>
.header{
    height: 44px;
    text-align: center;
    color: #ffcd32;
    position: relative;
    background: #222;
}
.header .icon{
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background: url(../assets/img/logo@2x.png);
    background-size: 30px 32px;
}
.header .title{
    display: inline-block;
    line-height: 44px;
    font-size: 18px;
}
</style>