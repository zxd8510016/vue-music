<template>
  <div id="app">
    <Vheader/>
    <HeaderTab/> 
    <router-view></router-view>
    <Player/>
  </div>
</template>

<script>
import Vheader from '@/components/v-header';
import HeaderTab from '@/components/header-tab';
import Player from '@/components/player';
export default {
  name: 'App',
  components:{
    Vheader,
    HeaderTab,
    Player
  }
}
</script>

<style>

</style>
