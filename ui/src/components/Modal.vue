<!-- BASED ON THE VUE2 COMPONENT https://v2.vuejs.org/v2/examples/modal.html -->

<template>
    <transition name="modal">
        <div v-if="!closed" :class="props.proptype">
            <div class = "modal-container">
                <div class = "title">
                    <h3> {{props.title}} </h3>
                    <h6> {{props.body}} </h6>
                    <a v-if="props.url!=null" class="btn btn-primary" :href="props.url" role="button">{{props.urlstring}}</a>
                    <b-button variant="btn btn-link" @click="closed=true"> Close </b-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">

import {ref, Ref} from 'vue'

const props = defineProps(['proptype', 'title', 'body', 'url', 'urlstring'])
let closed: Ref<boolean> = ref(false)

</script>

<style scoped>

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-popup {
    position: fixed;
    z-index: 9998;
    top: 70%;
    left: 35%;
    width: 100%;
    height: 100%;
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
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