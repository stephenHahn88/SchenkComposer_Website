import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import Home from "@/views/Home.vue"
import HomeTutorial from "@/tutorials/HomeTutorial.vue"
import Login from "@/views/Login.vue"
import PhraseStructure from "@/views/dagOther/PhraseStructure.vue"
import PhraseTutorial from "@/tutorials/PhraseTutorial.vue"
import MeterAndHypermeter from "@/views/dagRhythm/MeterAndHypermeter.vue"
import MiddlegroundHarmonicRhythm from "@/views/dagRhythm/MiddlegroundHarmonicRhythm.vue"
import HarmonicProgression from "@/views/dagOther/HarmonicProgression.vue"
import ForegroundMelody from "@/views/dagOther/ForegroundMelody.vue"
import MyMelodies from "@/views/MyMelodies.vue"
import MiddlegroundMelody from "@/views/dagOther/MiddlegroundMelody.vue"
import ForegroundRhythm from "@/views/dagRhythm/ForegroundRhythm.vue"

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
      components: {default: Home, tutorial: HomeTutorial}
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/my-melodies",
      component: MyMelodies
    },
    {
      path: "/phrase-structure",
      components: {default: PhraseStructure, tutorial: PhraseTutorial}
    },
    {
      path: "/meter-hypermeter",
      component: MeterAndHypermeter
    },
    {
      path: "/mg-harmonic-dagRhythm",
      component: MiddlegroundHarmonicRhythm
    },
    {
      path: "/harmonic-progression",
      component: HarmonicProgression
    },
    {
      path: "/middleground-melody",
      component: MiddlegroundMelody
    },
    {
      path: "/foreground-rhythm",
      component: ForegroundRhythm
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
