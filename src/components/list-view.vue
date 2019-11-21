<template>
    <scroll class="listview" ref="listview" :listen-scroll="listenScroll" @scroll="scrollHandler">
        <ul>
            <li class="list-group" v-for="(group,index) in data" :key="index" ref="listgroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li
                        class="list-group-item"  
                        v-for="(option,index) in group.items"  
                        :key="index"
                        @click="clickHandle(option)"
                    >
                        <img class="avatar" v-lazy="option.avatar">
                        <span class="name">{{option.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" ref="listShortcut" @touchstart="touchstartHandel" @touchmove="touchmoveHandel">
            <ul>
                <li 
                    v-for="(item,index) in shortcut" 
                    :key="index" 
                    :class="{'active':currentIndex==index}"   
                    ref="shortcutLis"
                >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="listFixedShow">{{listFixedTitle}}</div>
        <div class="loadwrap">
            <Loading v-if="!data.length"/>
        </div>
    </scroll>
</template>

<script>
export default {
    props:['data'],
    data(){
        return {
            currentIndex:0,
            listenScroll:true,
            listFixedShow:false,
            listFixedTitle:'热门'
        }
    },
    computed:{
        shortcut(){
            return this.data.map(item=>{
                return item.title.substr(0,1)
            })
        }
    },
    methods:{
        clickHandle(options){
            this.$emit('select',options)
        },
        touchstartHandel(e){
            this.setIndex(e.changedTouches[0].clientY)
        },
        touchmoveHandel(e){
            this.setIndex(e.changedTouches[0].clientY)
        },
        setIndex(y){
            var shortcutT=this.$refs.listShortcut.getBoundingClientRect().top;
            this.currentIndex=parseInt((y-shortcutT-20)/18);
            this.$refs.listview.scrollToElement(this.$refs.listgroup[this.currentIndex],0)
        },
        scrollHandler(e){
            var y=-e.y;
            var listgroups=this.$refs.listgroup;
            if(y>=listgroups[0].offsetTop){
                this.listFixedShow=true;
            }else{
                this.listFixedShow=false;
            }

            for(var i=0;i<listgroups.length;i++){
                if(y>=listgroups[i].offsetTop){
                    this.setActive(i);
                    this.listFixedTitle=listgroups[i].children[0].innerHTML;
                }
            }
        },
        setActive(index){
            this.$refs.shortcutLis.forEach(item=>{
                item.classList.remove('active');
            })
            this.$refs.shortcutLis[index].classList.add('active');
        }
    }
}

</script>
<style scoped>
.listview{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.list-group{
    padding-bottom: 30px;
}
.list-group-title{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    background: #333
}
.list-group-item{
    padding: 20px 0 0 30px;
    display: block;
    display:flex;
    align-items: center
}
.avatar{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.name{
    margin-left: 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px
}
.list-shortcut{
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-family: Helvetica;
}
.list-shortcut li{
    padding: 3px;
    line-height: 1;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}
.list-shortcut li.active{
    color: #ffcd32
}
.list-fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    background: #333;
}
</style>