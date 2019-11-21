<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <div class="slider-item" v-for="item in imgList" :key="item.id">
                <a :href="item.linkUrl">
                    <img :src="item.picUrl">
                </a>
            </div>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active:currentIndex==index}"></span>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
export default{
    props:['imgList'],
    data(){
        return {
            dots:[],
            currentIndex:0,
            timer:null,
            slider:null
        }
    },
    mounted(){
        setTimeout(()=>{
            this.initSlider();
            this.dots=new Array(this.$refs.sliderGroup.children.length-2);
        },20)
    },
    methods:{
        initSlider(){
            this.slider=new BScroll(this.$refs.slider,{
                scrollX:true,
                momentum:false,
                snap:{
                    loop:true,      
                    threshold:.3  
                }
            })
        
            var sliderGroup = this.$refs.sliderGroup;
            var width = this.$refs.slider.clientWidth;
            var children = sliderGroup.children.length;
            sliderGroup.style.width = children*width+'px';
      
            this.slider.on('scrollEnd',()=>{
                var pageIndex=this.slider.getCurrentPage().pageX;
                this.currentIndex=pageIndex;
            })
            this.autoPlay();
            this.clearTimer();
        },
        autoPlay(){
            this.timer=setInterval(()=>{
                this.slider.next();
            },3000)
        },
        clearTimer(){
            this.slider.on('beforeScrollStart',()=>{
                clearInterval(this.timer);
            })
            this.slider.on('touchEnd',this.autoPlay);
        }
    }
}
</script>

<style>
.slider{
    overflow: hidden;
    position: relative;
}
.slider-group{
    overflow: hidden;
    display: flex;
    width: 500%;
}
      
.slider-group .slider-item{
    flex: 1;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
}

 .slider-group .slider-item a{
    display: block;
    overflow: hidden;
    text-decoration: none;
    width: 100%;
 }
 .slider-group .slider-item a img{
    display: block;
    width: 100%;
 }
 .dots{
    position: absolute;
    left: 0;
    bottom: 12px;
    text-align: center;
    z-index: 100;
    width: 100%;
 }    
 .dot{
    display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5)
 }  
.dot.active{
    width: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8) 
}  
</style>