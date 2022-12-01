<template>
  <div>
    <b-container id="form-container" class="px-4 pt-2">
      <b-row>
          <b-col>
            <label for="username" class="form-text">Username:</label>
            <b-form-input
                type="text"
                id="username"
                class="input"
                v-model="username"
            ></b-form-input>
          </b-col>
      </b-row>
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
      <b-row>
        <b-col style="text-align: center">
          <b-form-checkbox
              id="checkbox-1"
              v-model="createNew"
              name="checkbox-1"
              :value="true"
              :unchecked-value="false"
              class="form-control-lg m-5"
          >
            Create new account
          </b-form-checkbox>
        </b-col>
        <b-col style="text-align: center;">
          <b-button
              variant="success"
              class="m-5"
              @click="newUser"
              v-if="createNew"
          >Create New User</b-button>
          <b-button
              variant="info"
              class="m-5"
              @click="login"
              v-else
          >Login</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col style="text-align: center">
          <h2 v-if="status === 'success!'" style="color: green">{{status}}</h2>
          <h2 v-else-if="status.at(0) === 'U'" style="color: red">{{status}}</h2>
          <h2 v-else>{{status}}</h2>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script setup>
import {ref, inject} from 'vue'
import {router} from '@/main'
import {delay} from '../../../server/data'

const username = ref('')
const password = ref('')
const createNew = ref(true)
const status = ref("")

const {composerId, updateComposerId} = inject("composerId")
const {melodyId, updateMelodyId} = inject("melodyId")

async function newUser() {
  status.value = "working..."
  let foundUsername = await (await fetch("/api/user-exists/" + username.value)).json()
  if (foundUsername.status === "ok") {
    status.value = `Username ${username.value} is already taken`
    return
  }

  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  }
  let response = await fetch("/api/create-user", requestOptions)
  let json = await response.json()
  console.log(json)
  await login()
  await createMelody()
  status.value = "success!"
  await delay(2000)
  await router.push({path: '/phrase-structure'})
}

async function login() {
  status.value = "working..."
  let userExists = await (await fetch("/api/find-user-info/" + username.value)).json()
  if (userExists.status === "not found") {
    alert(`Username ${username.value} does not exist`)
    return
  }
  let login = await (await fetch(`/api/login-info/${encodeURIComponent(username.value)}/${encodeURIComponent(password.value)}`)).json()
  console.log(login)
  updateComposerId(login["composerId"])
  updateMelodyId("1")
  status.value = "success!"
  await delay(2000)
  await router.push({path: '/phrase-structure'})
}

async function createMelody() {
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

.btn {
  font-size: 32px;
}
</style>