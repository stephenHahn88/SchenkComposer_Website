<template>
  <div>
    <b-container class="text-center">
      <b-row class="mb-4 center-text">
        <b-col></b-col>
        <b-col>
          <b-button
              class="phrase"
              id="ps"
              @click="redirect('/phrase-structure')"
          >
            Phrase<br>Structure
          </b-button>
        </b-col>
        <b-col>

        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>
          <b-button
              class="rhythm"
              id="mh"
              @click="redirect('/meter-hypermeter')"
          >
            Meter and <br>Hypermeter
          </b-button>
        </b-col>
        <b-col>
          <b-button
              class="rhythm"
              id="mghr"
              @click="redirect('/mg-harmonic-rhythm')"
          >
            Harmonic<br>Rhythm
          </b-button>
        </b-col>
        <b-col>
          <b-button
              class="harmony"
              id="mghp"
              @click="redirect('/harmonic-progression')"
          >
            Harmonic Progression
          </b-button>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>

        </b-col>
        <b-col>

        </b-col>
        <b-col>
          <b-button class="melody" id="mgm">Middleground Melody</b-button>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>

        </b-col>
        <b-col>
          <b-button class="rhythm" id="fgmr">Melodic<br>Rhythm</b-button>
        </b-col>
        <b-col>
          <b-button class="melody" id="fgm">Foreground Melody</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import LeaderLine from "leader-line-new"

import {router} from '@/main'
import {onMounted, Ref, ref, watch} from "vue";

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
  toggleAnimation(['psMh', 'psMghr', 'psMghp'])
})
watch(() => props.meterAnim, () => {
  toggleAnimation(['mhMghr', 'mhFgmr'])
})
watch(() => props.mgrhythmAnim, () => {
  toggleAnimation(['mghrFgmr', 'mghrMghp', 'mghrMgm'])
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


function redirect(path:string) {
  router.push({path: path})
}

onMounted(() => {
  //From phrase structure
  ps_mh = new LeaderLine(
        document.getElementById("ps") as any,
        document.getElementById("mh") as any,
        {
          path: 'magnet',
          startSocket: 'left',
          endSocket: 'top',
          startSocketGravity: [-170, 0],
          dash: {animation: psMh.value},
          size: 3,
          color: psMh.value ? 'green': 'red'
        }
    )
    ps_mghr = new LeaderLine(
        document.getElementById("ps") as any,
        document.getElementById("mghr") as any,
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
        document.getElementById("ps") as any,
        document.getElementById("mghp") as any,
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'top',
          startSocketGravity: [170, 0],
          dash: {animation: psMghp.value},
          size: 3,
          color: psMghp.value ? 'green': 'red'
        }
    )
    //From Meter and Hypermeter
    mh_mghr = new LeaderLine(
        document.getElementById("mh") as any,
        document.getElementById("mghr") as any,
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
        document.getElementById("mh") as any,
        document.getElementById("fgmr") as any,
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [0, 130],
          dash: {animation: mhFgmr.value},
          size: 3,
          color: mhFgmr.value ? 'green': 'red'
        }
    )
    //From Middleground Harmonic Rhythm
    mghr_fgmr = new LeaderLine(
        document.getElementById("mghr") as any,
        document.getElementById("fgmr") as any,
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
        document.getElementById("mghr") as any,
        document.getElementById("mghp") as any,
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
        document.getElementById("mghr") as any,
        document.getElementById("mgm") as any,
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [50, 50],
          dash: {animation: mghrMgm.value},
          size: 3,
          color: mghrMgm.value ? 'green': 'red'
        }
    )
    //From Middleground Harmonic Progression
    mghp_mgm = new LeaderLine(
        document.getElementById("mghp") as any,
        document.getElementById("mgm") as any,
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
        document.getElementById("mgm") as any,
        document.getElementById("fgm") as any,
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
        document.getElementById("fgmr") as any,
        document.getElementById("fgm") as any,
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
})

function toggleAnimation(refNames: string[]) {
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
    reference.value = !reference.value
    line.color = reference.value ? 'green': 'red'
    line.setOptions({dash: {animation: reference.value}})
  }
}

</script>

<style scoped>
.phrase {
  background-color: rgb(100, 150, 100)
}
.phrase:hover, .phrase:active, .phrase:focus {
  background-color: rgb(80, 130, 80)
}


.rhythm {
  background-color: rgb(150, 100, 100)
}
.rhythm:hover, .rhythm:active, .rhythm:focus {
  background-color: rgb(130, 80, 80)
}

.harmony {
  background-color: rgb(50, 100, 150)
}
.harmony:hover, .harmony:active, .harmony:focus {
  background-color: rgb(30, 80, 130);
}

.melody {
  background-color: rgb(200, 180, 50)
}
.melody:hover, .melody:active, .melody:focus {
  background-color: rgb(180, 160, 30)
}

.btn {
  border-color: rgba(0,0,0,0);
  font-size: 24px;
}
</style>