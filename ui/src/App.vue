<template>
  <div class="background">
<!--    NAVBAR-->
    <b-navbar class="white-background" toggleable="lg">
      <b-navbar-brand @click="router.push({path: '/'})">
        <img
            src="@/static/schenkcomposer_logo.svg"
            alt="SchenkComposer"
            class="d-inline-block align-top"
            style="height: 90px; width: auto;"
        >
      </b-navbar-brand>
      <b-navbar-brand>
        <b-button
            variant="success"
            @click="createNewMelody"
            class="m-1"
        >
          Create New Melody Skeleton
        </b-button>
        <b-button
            v-b-toggle.collapse-tutorial
            variant="light"
            v-if="!tutorialOpen"
            @click="tutorialOpen = true"
            class="m-1"
        >Show Tutorial</b-button>
        <b-button
            v-b-toggle.collapse-tutorial
            variant="light"
            v-if="tutorialOpen"
            @click="tutorialOpen = false"
            class="m-1"
        >Hide Tutorial</b-button>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="router.push({path: '/login'})">Login</b-nav-item>
          <b-nav-item @click="router.push({path: '/my-melodies'})">{{username}}'s Melodies</b-nav-item>
          <b-nav-item @click="router.push({path: '/flowchart'})">Flowchart</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row class="mx-4 mt-5 p-3 black-background radius-30">
      <b-row>
        <h1 class="mx-4">Track Your Progress</h1>
      </b-row>
      <b-row>
        <vue-step-progress-indicator
            style="width: 100%"
            :steps="progressSteps"
            :active-step="currentStep"
            :colors="progressColors"
            :styles="progressStyles"
        ></vue-step-progress-indicator>
      </b-row>
    </b-row>
<!--      ROUTER VIEW-->
    <b-row class="m-4 p-3 black-background radius-30">
      <b-col>
        <router-view/>
      </b-col>
    </b-row>
    <b-row class="m-2">
<!--      TUTORIAL-->
      <b-col class="">
        <b-container class="overflow-auto" style="height: 500px;">
          <b-collapse id="collapse-tutorial">
            <b-container class="p-5 black-background radius-30">
              <h1>Tutorial</h1>
              <router-view
                  name="tutorial"
              />
            </b-container>
          </b-collapse>
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";
import {ref, provide, onMounted, computed} from 'vue'
import {router} from '@/main'
import {_makeid, delay} from "../../server/data"
import MusicGeneration from "@/views/MusicGeneration.vue";
import {pushRouter} from "@/data";
import QuestionHover from "@/components/QuestionHover.vue"
import VueStepProgressIndicator from "vue-step-progress-indicator"

// Info to access and update particular melodies
let username = ref("Anonymous")
let composerId = ref("")
let melodyId = ref("")
let currPage = ref("/")

function updateUsername(newUsername) {
  username.value = newUsername
}
function updateComposerId(newComposerId) {
  composerId.value = newComposerId
}
function updateMelodyId(newMelodyId) {
  melodyId.value = newMelodyId
}
function updateCurrPage(newPage) {
  currPage.value = newPage
}

provide("username", {username, updateUsername})
provide("composerId", {composerId, updateComposerId})
provide("melodyId", {melodyId, updateMelodyId})
provide("currPage", {currPage, updateCurrPage})

let tutorialOpen = ref(false)

let progressSteps = ref([
    "Phrase Structure",
    "Meter & Hypermeter",
    "Harmonic Rhythm",
    "Harmonic Progression",
    "Generate Melody!"
])
let currentStep = computed(() => {
  switch (currPage.value) {
    case "/": return 0;
    case "/phrase-structure": return 0;
    case "/meter-hypermeter": return 1;
    case "/harmonic-rhythm": return 2;
    case "/harmonic-progression": return 3;
    case "/generate-melody": return 4;
  }
})
let progressColors = {
  progress__bubble: {
    active: {
      color: "#fff",
      backgroundColor: "rgba(240, 80, 60, 0.5)",
      borderColor: "#e74c3c",
    },
    inactive: {
      color: "#fff",
      backgroundColor: "rgba(90, 100, 110, 0.5)",
      borderColor: "#54697e",
    },
    completed: {
      color: "#fff",
      borderColor: "rgba(30, 150, 70, 0.3)",
      backgroundColor: "#27ae60",
    },
  },
  progress__label: {
    active: {
      color: "#e74c3c",
    },
    inactive: {
      color: "#54697e",
    },
    completed: {
      color: "#27ae60",
    },
  },
  progress__bridge: {
    active: {
      backgroundColor: "#e74c3c",
    },
    inactive: {
      backgroundColor: "#54697e",
    },
    completed: {
      backgroundColor: "#27ae60",
    },
  },
}
let progressStyles = {
  progress__wrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: "1rem 1rem",
  },
  progress__block: {
    display: "flex",
    alignItems: "center",
  },
  progress__bridge: {
    backgroundColor: "grey",
    height: "2px",
    flexGrow: "1",
    width: "1em",
  },
  progress__bubble: {
    margin: "10px",
    padding: "0",
    lineHeight: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50px",
    width: "50px",
    borderRadius: "100%",
    backgroundColor: "transparent",
    border: "2px grey solid",
    textAlign: "center",
    fontSize: "24px"
  },
  progress__label: {
    margin: "0 0.8rem",
    fontSize: "28px"
  },
}

// Create anonymous melody upon opening the page
onMounted(async () => {
  document.title = "SchenkComposer"
  let link = document.createElement('link')
  link.type = "image/png"
  link.rel = "shortcut icon"
  link.href = "src/static/favicon/android-chrome-512x512.png"
  document.head.appendChild(link)
  await putMelody()
})

async function putMelody() {
  await delay(500)
  let mel = {
    _id: composerId.value + melodyId.value,
    composerId: composerId.value,
    melodyId: melodyId.value,
    composer: username.value
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mel)
  }
  let response = await (await fetch("/api/create-melody", requestOptions)).json()
  console.log(response)
}

async function createNewMelody() {
  let result = await (await fetch("/api/composer/" + composerId.value)).json()
  let max = 0
  for (let mel of result) {
    if (parseInt(mel["melodyId"]) > max) {
      max = parseInt(mel["melodyId"])
    }
  }
  melodyId.value = (max + 1).toString()
  await putMelody()
  await pushRouter("/phrase-structure")
}

updateComposerId(_makeid(32))
updateMelodyId("1")
</script>

<style scoped>
h1 {
  color: white
}

.overflow-auto {
  overflow: auto;
}

.black-background {
  background-color: rgba(0, 0, 0, 0.6);
}

.white-background {
  background-color: rgba(255, 255, 255, 0.2);
}

.radius-30 {
  border-radius: 30px;
}

.background {
  position: relative;
}

.background::before {
  background-image: url("static/background_blue.jpg");
  margin: 0;
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;

  display: block;
  background-size:cover;
  width: 100%;
  height: 100%;

  -webkit-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
</style>