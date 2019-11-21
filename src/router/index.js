import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/views/rank'
import Recommend from '@/views/recommend'
import Search from '@/views/search'
import Singer from '@/views/singer'
import SingerDetail from '@/views/singer-detail'
import Disc from '@/views/disc'
import RankList from '@/views/rank-list'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})

export default router
