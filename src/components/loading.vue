<template>
    <div class="loading">
        <img width="24" height="24" src="../assets/img/loading.gif">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            default:'正在加载中...',
            type:String
        }
    }
}

</script>

<style scoped>
.loading{
    width: 100%;
    text-align: center;
}
.desc{
    line-height: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}
      
</style>