<template>
  <b-container id="form-container" class="px-4 pt-2">
    <b-row>
      <h1>Login or Create New User</h1>
    </b-row>
    <b-row>
      <h4 v-if="username">Currently logged in as <span style="color: green">{{username}}</span></h4>
    </b-row>
<!--      USERNAME FORM-->
    <b-row>
        <b-col>
          <label for="username" class="form-text">Username:</label>
          <b-form-input
              type="text"
              id="username"
              class="input"
              v-model="usernameLocal"
          ></b-form-input>
        </b-col>
    </b-row>
<!--      PASSWORD FORM-->
    <b-row class="mt-3">
      <b-col>
        <label for="password" class="form-text">Password:</label>
        <b-form-input
            type="password"
            id="password"
            class="input"
            v-model="password"
        ></b-form-input>
      </b-col>
    </b-row>
<!--      CREATE NEW VS LOGIN-->
    <b-row>
      <b-col>
        <b-button
            variant="info"
            class="m-5"
            @click="returnToCurrPage"
        >Return to Melody</b-button>
      </b-col>
      <b-col class="center-text">
        <b-form-checkbox
            id="checkbox-1"
            v-model="createNew"
            name="checkbox-1"
            :value="true"
            :unchecked-value="false"
            class="form-control-lg m-5"
        >
          Create new user
        </b-form-checkbox>
      </b-col>
      <b-col class="center-text">
        <b-button
            variant="success"
            class="m-5"
            @click="newUser"
            v-if="createNew"
        >Create New User</b-button>
        <b-button
            variant="success"
            class="m-5"
            @click="login"
            v-else
        >Login</b-button>
      </b-col>
    </b-row>
<!--      STATUS UPDATE-->
    <b-row>
      <b-col style="text-align: center">
        <h2 v-if="status === 'Success!'" style="color: green">{{status}}</h2>
        <h2 v-else-if="status.at(0) === 'U'" style="color: red">{{status}}</h2>
        <h2 v-else>{{status}}</h2>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>
import {ref, inject} from 'vue'
import {delay} from '../../../server/data'
import {pushRouter} from "@/data";


const usernameLocal = ref('')
const password = ref('')
const createNew = ref(false)
const status = ref("")

const {composerId, updateComposerId} = inject("composerId")
const {melodyId, updateMelodyId} = inject("melodyId")
const {username, updateUsername} = inject("username")
let {currPage, updateCurrPage} = inject("currPage")

async function returnToCurrPage() {
  await pushRouter(currPage.value)
}

// Create new user
async function newUser() {
  status.value = "working..."
  // If username already exists, fail to create
  let foundUsername = await (await fetch("/api/user-exists/" + usernameLocal.value)).json()
  if (foundUsername.status === "ok") {
    status.value = `Username ${usernameLocal.value} is already taken`
    return
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameLocal.value,
      password: password.value
    })
  }
  let response = await fetch("/api/create-user", requestOptions)
  let json = await response.json()
  console.log(json)
  await delay(1000)
  await login()
  await createMelody()
}

// Login to existing user
async function login() {
  status.value = "working..."
  // Ensure given user exists
  let userExists = await (await fetch("/api/user-exists/" + usernameLocal.value)).json()
  console.log(userExists.status)
  if (userExists.status === "not found") {
    status.value = `Username ${usernameLocal.value} does not exist`
    return
  }
  // Retrieve existing users information
  let login = await (await fetch(`/api/login-info/${encodeURIComponent(usernameLocal.value)}/${encodeURIComponent(password.value)}`)).json()
  if (login.status === "unauthorized") {
    status.value = 'Username and password do not match'
    return
  }
  // Update composer information
  updateComposerId(login["composerId"])
  updateMelodyId("1")
  updateUsername(usernameLocal.value)
  status.value = "Success!"
  updateCurrPage("/phrase-structure")
}

// Create new melody with current composer info
async function createMelody() {
  let mel = {
    _id: composerId.value + melodyId.value,
    composerId: composerId.value,
    melodyId: melodyId.value,
    composer: usernameLocal.value
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mel)
  }
  let response = await (await fetch("/api/create-melody", requestOptions)).json()
  console.log(response)
  updateCurrPage("/phrase-structure")
}
</script>

<style scoped>
#form-container {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  font-size: 32px;
  color: black;
}

.form-text {
  color: black;
}

.input {
  height: 50px;
  font-size: 28px;
}

.center-text {
  text-align: center;
}

.btn {
  font-size: 32px;
}
</style>