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
          <b-button class="melody" id="fgm">Result:<br>Foreground Melody</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LeaderLine from "leader-line-vue"

export default {
  name: "SchenkComposerDAG",
  mounted() {
    //From phrase structure
    let ps_mh = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mh"),
        {
          path: 'magnet',
          startSocket: 'left',
          endSocket: 'top',
          startSocketGravity: [-170, 0],
          dash: {animation: true},
          size: 3
        }
    )
    let ps_mghr = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mghr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    let ps_mghp = LeaderLine.setLine(
        document.getElementById("ps"),
        document.getElementById("mghp"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'top',
          startSocketGravity: [170, 0],
          dash: {animation: true},
          size: 3
        }
    )
    //From Meter and Hypermeter
    let mh_mghr = LeaderLine.setLine(
        document.getElementById("mh"),
        document.getElementById("mghr"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    let mh_fgmr = LeaderLine.setLine(
        document.getElementById("mh"),
        document.getElementById("fgmr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [0, 130],
          dash: {animation: true},
          size: 3
        }
    )
    //From Middleground Harmonic Rhythm
    let mghr_fgmr = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("fgmr"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    let mghr_mghp = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("mghp"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    let mghr_mgm = LeaderLine.setLine(
        document.getElementById("mghr"),
        document.getElementById("mgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'left',
          startSocketGravity: [50, 50],
          dash: {animation: true},
          size: 3
        }
    )
    //From Middleground Harmonic Progression
    let mghp_mgm = LeaderLine.setLine(
        document.getElementById("mghp"),
        document.getElementById("mgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    //From Middleground Melody
    let mgm_fgm = LeaderLine.setLine(
        document.getElementById("mgm"),
        document.getElementById("fgm"),
        {
          path: 'magnet',
          startSocket: 'bottom',
          endSocket: 'top',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
    //From Foreground Melodic Rhythm
    let fgmr_fgm = LeaderLine.setLine(
        document.getElementById("fgmr"),
        document.getElementById("fgm"),
        {
          path: 'magnet',
          startSocket: 'right',
          endSocket: 'left',
          startSocketGravity: [0, 0],
          dash: {animation: true},
          size: 3
        }
    )
  }
}
</script>

<style scoped>
.phrase {
  background-color: rgb(100, 150, 100)
}

.rhythm {
  background-color: rgb(150, 100, 100)
}

.harmony {
  background-color: rgb(50, 100, 150)
}

.melody {
  background-color: rgb(200, 180, 50)
}

.btn {
  border-color: rgba(0,0,0,0);
}
</style>