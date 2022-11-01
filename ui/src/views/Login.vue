<template>
  <div>
    <b-container id="form-container" class="px-4 pt-2">
      <b-row>
          <b-col>
            <label for="username" class="form-text">Username:</label>
            <b-form-input type="text" id="username" class="input"></b-form-input>
          </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <label for="password" class="form-text">Password:</label>
          <b-form-input type="password" id="password" class="input"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col style="text-align: center;">
          <b-button variant="success" class="m-5">Login</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">

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