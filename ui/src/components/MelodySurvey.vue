<template>
    <transition name="modal">
        <div v-if="!closed" class = "survey-popup">
            <div class = "survey-container">
                <h3> How would you rate your melody? </h3>
                <b-row class = "justify-content-start">
                    <b-col class="col-2"> <b-button variant="btn" @click="saveMelodySurveyResponse(0);"> <span style="font-size:30px;"> &#128544; </span> </b-button> </b-col>
                    <b-col class="col-2"> <b-button variant="btn" @click="saveMelodySurveyResponse(1);"> <span style="font-size:30px;"> &#128577; </span> </b-button> </b-col>
                    <b-col class="col-2"> <b-button variant="btn" @click="saveMelodySurveyResponse(2);"> <span style="font-size:30px;"> &#128528; </span> </b-button> </b-col>
                    <b-col class="col-2"> <b-button variant="btn" @click="saveMelodySurveyResponse(3);"> <span style="font-size:30px;"> &#128578; </span> </b-button> </b-col>
                    <b-col class="col-2"> <b-button variant="btn" @click="saveMelodySurveyResponse(4);"> <span style="font-size:30px;"> &#128512; </span> </b-button> </b-col>
                </b-row>
            </div>
        </div>
    </transition>
</template>


<script setup>

import {inject, ref} from 'vue'

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")

let closed = ref(true)

async function saveMelodySurveyResponse(rating) {
    // Hide the survey popup UI
    closed.value = true
    // Retrieve current melody from server
    let melody = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/notes-harmonies-tempo")).json()
    const requestOptions = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "rating": rating,
          "melody": melody.melody,
          "harmonies": melody.harmonies
        })
    }
    let response = await fetch("/api/surveys", requestOptions)

    response = await response.json()
    console.log(response)
    // Close the survey component
    closed = true
}

function openSurvey() {
    closed.value = false
}

function closeSurvey() {
    closed.value = true
}

defineExpose({ openSurvey, closeSurvey });

</script>

<style scoped>

.survey-popup {
    position: fixed;
    z-index: 9998;
    top: 75%;
    left: 28%;
    width: 100%;
    height: 100%;
    display: table;
    transition: opacity 0.3s ease;
}
.survey-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.survey-container {
    width: 500px;
    margin: 0px auto;
    padding: 30px 0px 20px 40px;
    background-color: #fff;
    color: black;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

 .modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
}

</style>