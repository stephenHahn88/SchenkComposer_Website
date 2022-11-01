import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import PhraseStructure from "@/views/PhraseStructure.vue"
import MeterAndHypermeter from "@/views/MeterAndHypermeter.vue"
import MiddlegroundHarmonicRhythm from "@/views/MiddlegroundHarmonicRhythm.vue"
import HarmonicProgression from "@/views/HarmonicProgression.vue"
import ForegroundMelody from "@/views/ForegroundMelody.vue"

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)


export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/phrase-structure",
      component: PhraseStructure
    },
    {
      path: "/meter-hypermeter",
      component: MeterAndHypermeter
    },
    {
      path: "/mg-harmonic-rhythm",
      component: MiddlegroundHarmonicRhythm
    },
    {
      path: "/harmonic-progression",
      component: HarmonicProgression
    },
    {
      path: "/foreground-melody",
      component: ForegroundMelody
    }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
