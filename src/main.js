// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import '@/assets/css/reset.css'
import '@/assets/css/icon.css'
import VueLazyload from 'vue-lazyload'
import store from './store'

Vue.use(VueLazyload, {
  loading:require('@/assets/img/logo@2x.png')
})
import Loading from '@/components/loading'
import Scroll from '@/components/scroll'
import MusicList from '@/components/music-list'
import SearchBox from '@/components/search-box'

Vue.component('Loading', Loading)
Vue.component('Scroll', Scroll)
Vue.component('MusicList', MusicList)
Vue.component('SearchBox',SearchBox)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
