<template>
  <div>
    <b-container fluid class="text-center align-middle">
      <b-row class="m-4 center-text">
        <b-col>

        </b-col>
        <b-col>
          <b-button class="phrase" id="ps">Phrase Structure</b-button>
        </b-col>
        <b-col>

        </b-col>
      </b-row>
      <b-row class="m-4">
        <b-col>
          <b-button class="rhythm" id="mh">Meter and <br>Hypermeter</b-button>
        </b-col>
        <b-col>
          <b-button class="rhythm" id="mghr">Middleground Harmonic Rhythm</b-button>
        </b-col>
        <b-col>
          <b-button class="harmony" id="mghp">Middleground Harmonic Progression</b-button>
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
          <b-button class="rhythm" id="fgmr">Foreground Melodic Rhythm</b-button>
        </b-col>
        <b-col>
          <b-button class="melody" id="fgm"><b>RESULT:</b><br>Foreground Melody</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LeaderLine from "leader-line-vue"

export default {
  name: "SchenkComposerDAG",
  props: {
    psMh: Boolean,
    psMghr: Boolean,
    psMghp: Boolean,
    mhMghr: Boolean,
    mhFgmr: Boolean,
    mghrFgmr: Boolean,
    mghrMghp: Boolean,
    mghrMgm: Boolean,
    mghpMgm: Boolean,
    mgmFgm: Boolean,
    fgmrFgm: Boolean,

  },
  mounted() {
    //From phrase structure
    this.ps_mh = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mh"),
        {
          path: 'magnet',
          startSocket: 'left',
          endSocket: 'top',
          startSocketGravity: [-170, 0],
          dash: {animation: this.psMh},
          size: 3,
          color: this.psMh ? 'green': 'red'
        }
    )
    this.ps_mghr = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mghr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: this.psMghr},
          size: 3,
          color: this.psMghr ? 'green': 'red'
        }
    )
    this.ps_mghp = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mghp"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'top',
          startSocketGravity: [170, 0],
          dash: {animation: this.psMghp},
          size: 3,
          color: this.psMghp ? 'green': 'red'
        }
    )
    //From Meter and Hypermeter
    this.mh_mghr = LeaderLine.setLine(
        document.getElementById("mh"),
        document.getElementById("mghr"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: this.mhMghr},
          size: 3,
          color: this.mhMghr ? 'green': 'red'
        }
    )
    this.mh_fgmr = LeaderLine.setLine(
        document.getElementById("mh"),
        document.getElementById("fgmr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [0, 130],
          dash: {animation: this.mhFgmr},
          size: 3,
          color: this.mhFgmr ? 'green': 'red'
        }
    )
    //From Middleground Harmonic Rhythm
    this.mghr_fgmr = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("fgmr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: this.mghrFgmr},
          size: 3,
          color: this.mghrFgmr ? 'green': 'red'
        }
    )
    this.mghr_mghp = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("mghp"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: this.mghrMghp},
          size: 3,
          color: this.mghrMghp ? 'green': 'red'
        }
    )
    this.mghr_mgm = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("mgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [50, 50],
          dash: {animation: this.mghrMgm},
          size: 3,
          color: this.mghrMgm ? 'green': 'red'
        }
    )
    //From Middleground Harmonic Progression
    this.mghp_mgm = LeaderLine.setLine(
        document.getElementById("mghp"),
        document.getElementById("mgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: this.mghpMgm},
          size: 3,
          color: this.mghpMgm ? 'green': 'red'
        }
    )
    //From Middleground Melody
    this.mgm_fgm = LeaderLine.setLine(
        document.getElementById("mgm"),
        document.getElementById("fgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: this.mgmFgm},
          size: 3,
          color: this.mgmFgm ? 'green': 'red'
        }
    )
    //From Foreground Melodic Rhythm
    this.fgmr_fgm = LeaderLine.setLine(
        document.getElementById("fgmr"),
        document.getElementById("fgm"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: this.fgmrFgm},
          size: 3,
          color: this.fgmrFgm ? 'green': 'red'
        }
    )
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
}
</style>