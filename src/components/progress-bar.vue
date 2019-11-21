<template>
    <div class="progress-bar-wrap" @click="progressClick">
        <div class="bar-inner" ref="bar">
            <div class="progress-line" ref="progressLine"></div>
            <div class="progress-btn-wrap" ref="progressBtn" @touchstart.prevent="progressStart" @touchmove.prevent="progressMove" @touchend="progressEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['percent'],
    watch:{
        percent(newPercent){
            if(!this.touch.initState){
                var barWidth=this.$refs.bar.clientWidth-16;
                var width=newPercent*barWidth;
                this.progressWidth(width)
            }
        }
    },
    created(){
        this.touch={}
    },
    methods:{
        progressStart(e){
            this.touch.initState=true;
            this.touch.startX=e.changedTouches[0].pageX-this.$refs.progressLine.clientWidth;
        },
        progressMove(e){
            var disX=e.changedTouches[0].pageX-this.touch.startX;
            if(disX >= this.$refs.bar.offsetWidth-16){
                disX=this.$refs.bar.offsetWidth-16
            }else if(disX < 0){
                disX=0;
            }
            this.progressWidth(disX);
        },
        progressEnd(){
            this.touch.initState=false;
            this.triggerPercent();
        },
        progressClick(e){
            this.progressWidth(e.offsetX-8);
            this.triggerPercent();
        },
        progressWidth(w){
            this.$refs.progressLine.style.width=w+'px';
            this.$refs.progressBtn.style.transform='translateX('+w+'px)';
            this.$refs.progressBtn.style.WebkitTransfrom='translateX('+w+'px)';
        },
        triggerPercent(){
            var barWidth=this.$refs.bar.clientWidth-16;
            var percent=this.$refs.progressLine.clientWidth/barWidth;
            this.$emit('changePercent',percent)
        }
    }
}

</script>
<style scoped>
.progress-bar-wrap {
	height: 30px;
    flex: 1;
}
.progress-bar-wrap .bar-inner {
	height: 4px;
	background: rgba(0, 0, 0, 0.3);
	position: relative;
	top: 13px;
}
.progress-btn-wrap{
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
}
.progress-btn {
	box-sizing: border-box;
	width: 16px;
	height: 16px;
	border: 3px solid #fff;
	border-radius: 50%;
	background: #ffcd32;
	position: relative;
    top: 7px;
    left: 7px;
}
.progress-line{
    height: 100%;
    width: 0;
    background: #ffcd32;
    position: absolute;
    left: 0;
    top: 0;
}
</style>