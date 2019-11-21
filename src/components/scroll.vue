<template>
    <div ref="scroll">
        <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
    props:['listen-scroll','pullup'],
    mounted(){
        this.scroll=new BScroll(this.$refs.scroll,{
            probeType:3,
            click:true
        });
        if(this.listenScroll){
            this.scroll.on('scroll',(e)=>{
                //子组件派发自定义事件，把e传递给父组件
                this.$emit('scroll',e)
            })
        }
        if(this.pullup){
            this.scroll.on('scrollEnd',()=>{
                if(this.scroll.y <= this.scroll.maxScrollY+50){
                    this.$emit('scrollToEnd')
                }
            })
        }
    },
    methods:{
        scrollToElement(...elems){
            this.scroll.scrollToElement(...elems)
        },
        scrollTo(...elems){
            this.scroll.scrollTo(...elems)
        }
    },
    beforeDestroy(){
        this.scroll.destroy()
    }
}

</script>
<style>
</style>