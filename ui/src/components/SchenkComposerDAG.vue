<template>
  <div>
    <b-container class="text-center">
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col>
          <b-button
              variant="success"
              id="ps"
              @click="redirect('/phrase-structure')"
          >
            Phrase<br>Structure
          </b-button>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col>
          <b-button
              variant="danger"
              id="mh"
              @click="redirect('/meter-hypermeter')"
          >
            Meter and <br>Hypermeter
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="danger"
              id="mghr"
              @click="redirect('/mg-harmonic-dagRhythm')"
          >
            Harmonic<br>Rhythm
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="info"
              id="mghp"
              @click="redirect('/harmonic-progression')"
          >
            Harmonic Progression
          </b-button>
        </b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col></b-col>
        <b-col>
          <b-button
              variant="warning"
              id="mgm"
              @click="redirect('/middleground-melody')"
          >Middleground Melody</b-button>
        </b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col>
          <b-button
              variant="danger"
              id="fgmr"
              @click="redirect('/foreground-rhythm')"
          >Melodic<br>Rhythm</b-button>
        </b-col>
        <b-col>
          <b-button
              variant="warning"
              id="fgm"
              @click="redirect('/foreground-melody')"
          >Foreground Melody</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import LeaderLine from "leader-line-new"

import {router} from '@/main'
import {onMounted, onUpdated, Ref, ref, watch} from "vue";

let ps_mh: LeaderLine;
let ps_mghr: LeaderLine;
let ps_mghp: LeaderLine;
let mh_mghr: LeaderLine;
let mh_fgmr: LeaderLine;
let mghr_fgmr: LeaderLine;
let mghr_mghp: LeaderLine;
let mghr_mgm: LeaderLine;
let mghp_mgm: LeaderLine;
let mgm_fgm: LeaderLine;
let fgmr_fgm: LeaderLine;

interface Props {
  phraseAnim?: boolean,
  meterAnim?: boolean,
  mgrhythmAnim?: boolean,
  mgharmonyAnim?: boolean,
  mgmelodyAnim?: boolean,
  fgrhythmAnim?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  phraseAnim: false,
  meterAnim: false,
  mgrhythmAnim: false,
  mgharmonyAnim: false,
  mgmelodyAnim: false,
  fgrhythmAnim: false
})

watch(() => props.phraseAnim, () => {
  activateAnimation(['psMh', 'psMghr', 'psMghp'], props.phraseAnim)
})
watch(() => props.meterAnim, () => {
  activateAnimation(['mhMghr', 'mhFgmr'], props.meterAnim)
})
watch(() => props.mgrhythmAnim, () => {
  activateAnimation(['mghrFgmr', 'mghrMghp', 'mghrMgm'], props.mgrhythmAnim)
})
watch(() => props.mgharmonyAnim, () => {
  activateAnimation(['mghpMgm'], props.mgharmonyAnim)
})
watch(() => props.mgmelodyAnim, () => {
  activateAnimation(['mgmFgm'], props.mgmelodyAnim)
})
watch(() => props.fgrhythmAnim, () => {
  activateAnimation(['fgmrFgm'], props.fgrhythmAnim)
})

let psMh = ref(false);
let psMghr = ref(false);
let psMghp = ref(false);
let mhMghr = ref(false);
let mhFgmr = ref(false);
let mghrFgmr = ref(false);
let mghrMghp = ref(false);
let mghrMgm = ref(false);
let mghpMgm = ref(false);
let mgmFgm = ref(false);
let fgmrFgm = ref(false);

let psDiv: Element;
let mhDiv: Element;
let mghrDiv: Element;
let mgmDiv: Element;
let mghpDiv: Element;
let fgmDiv: Element;
let fgmrDiv: Element;

function redirect(path:string) {
  router.push({path: path})
}

onMounted(() => {
  psDiv = document.getElementById("ps") as Element
  mhDiv = document.getElementById("mh") as Element
  mghrDiv = document.getElementById("mghr") as Element
  mgmDiv = document.getElementById("mgm") as Element
  mghpDiv = document.getElementById("mghp") as Element
  fgmDiv = document.getElementById("fgm") as Element
  fgmrDiv = document.getElementById("fgmr") as Element
  drawLines()
})

function drawLines() {
  //From phrase structure
  ps_mh = new LeaderLine(
      psDiv,
      mhDiv,
      {
        path: 'magnet',
        startSocket: 'left',
        endSocket: 'top',
        startSocketGravity: [-150, 0],
        dash: {animation: psMh.value},
        size: 3,
        color: psMh.value ? 'green': 'red'
      }
  )
  ps_mghr = new LeaderLine(
      psDiv,
      mghrDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'top',
        startSocketGravity: [0, 0],
        dash: {animation: psMghr.value},
        size: 3,
        color: psMghr.value ? 'green': 'red'
      }
  )
  ps_mghp = new LeaderLine(
      psDiv,
      mghpDiv,
      {
        path: 'magnet',
        startSocket: 'right',
        endSocket: 'top',
        startSocketGravity: [150, 0],
        dash: {animation: psMghp.value},
        size: 3,
        color: psMghp.value ? 'green': 'red'
      }
  )
  //From Meter and Hypermeter
  mh_mghr = new LeaderLine(
      mhDiv,
      mghrDiv,
      {
        path: 'magnet',
        startSocket: 'right',
        endSocket: 'left',
        startSocketGravity: [0, 0],
        dash: {animation: mhMghr.value},
        size: 3,
        color: mhMghr.value ? 'green': 'red'
      }
  )
  mh_fgmr = new LeaderLine(
      mhDiv,
      fgmrDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'left',
        startSocketGravity: [0, 190],
        dash: {animation: mhFgmr.value},
        size: 3,
        color: mhFgmr.value ? 'green': 'red'
      }
  )
  //From Middleground Harmonic Rhythm
  mghr_fgmr = new LeaderLine(
      mghrDiv,
      fgmrDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'top',
        startSocketGravity: [0, 0],
        dash: {animation: mghrFgmr.value},
        size: 3,
        color: mghrFgmr.value ? 'green': 'red'
      }
  )
  mghr_mghp = new LeaderLine(
      mghrDiv,
      mghpDiv,
      {
        path: 'magnet',
        startSocket: 'right',
        endSocket: 'left',
        startSocketGravity: [0, 0],
        dash: {animation: mghrMghp.value},
        size: 3,
        color: mghrMghp.value ? 'green': 'red'
      }
  )
  mghr_mgm = new LeaderLine(
      mghrDiv,
      mgmDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'left',
        startSocketGravity: [50, 70],
        dash: {animation: mghrMgm.value},
        size: 3,
        color: mghrMgm.value ? 'green': 'red'
      }
  )
  //From Middleground Harmonic Progression
  mghp_mgm = new LeaderLine(
      mghpDiv,
      mgmDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'top',
        startSocketGravity: [0, 0],
        dash: {animation: mghpMgm.value},
        size: 3,
        color: mghpMgm.value ? 'green': 'red'
      }
  )
  //From Middleground Melody
  mgm_fgm = new LeaderLine(
      mgmDiv,
      fgmDiv,
      {
        path: 'magnet',
        startSocket: 'bottom',
        endSocket: 'top',
        startSocketGravity: [0, 0],
        dash: {animation: mgmFgm.value},
        size: 3,
        color: mgmFgm.value ? 'green': 'red'
      }
  )
  //From Foreground Melodic Rhythm
  fgmr_fgm = new LeaderLine(
      fgmrDiv,
      fgmDiv,
      {
        path: 'magnet',
        startSocket: 'right',
        endSocket: 'left',
        startSocketGravity: [0, 0],
        dash: {animation: fgmrFgm.value},
        size: 3,
        color: fgmrFgm.value ? 'green': 'red'
      }
  )
}

function activateAnimation(refNames: string[], activate: boolean = true) {
  for (let refName of refNames) {
    let reference: Ref<boolean>;
    let line: LeaderLine;
    switch (refName) {
      case 'psMh': reference = psMh; line = ps_mh; break;
      case 'psMghr': reference = psMghr; line = ps_mghr; break;
      case 'psMghp': reference = psMghp; line = ps_mghp; break;
      case 'mhMghr': reference = mhMghr; line = mh_mghr; break;
      case 'mhFgmr': reference = mhFgmr; line = mh_fgmr; break;
      case 'mghrMghp': reference = mghrMghp; line = mghr_mghp; break;
      case 'mghrMgm': reference = mghrMgm; line = mghr_mgm; break;
      case 'mghrFgmr': reference = mghrFgmr; line = mghr_fgmr; break;
      case 'mghpMgm': reference = mghpMgm; line = mghp_mgm; break;
      case 'mgmFgm': reference = mgmFgm; line = mgm_fgm; break;
      case 'fgmrFgm': reference = fgmrFgm; line = fgmr_fgm; break;
      default: return
    }
    reference.value = activate
    line.color = reference.value ? 'green': 'red'
    line.setOptions({dash: {animation: reference.value}})
  }
}

</script>

<style scoped>
.btn {
  border-color: rgba(0,0,0,0);
  font-size: 24px;
}

.myRow {
  width: 600px;
}
</style>