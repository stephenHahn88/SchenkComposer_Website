<template>
  <div>
    <h2>Home</h2>
    <b-row>
<!--      TEXT TUTORIAL-->
      <b-col  style="overflow: auto">
        <b-list-group>
          <b-list-group-item variant="info">You can log in using the login link located in the top navbar.</b-list-group-item>
          <b-list-group-item variant="info">Any melodies and parameters you have saved can be found in the navbar link - {your name}'s Melodies. There you can also switch between melodies.</b-list-group-item>
          <b-list-group-item variant="info">Create new melodies with the "Create New Melody" button in the navbar.</b-list-group-item>
          <b-list-group-item variant="danger">Warning! Until you log in, you are an "anonymous" user. Your melodies and parameters will only persist until you leave or refresh the page. Logging in will also lose your anonymous melodies.</b-list-group-item>
          <b-list-group-item variant="info">The flow chart in the upper-left panel follows the SchenkComposer algorithm. Each block is a button that leads to another page to fill out.</b-list-group-item>
          <b-list-group-item variant="info">Don't worry, tutorials are always right here in the upper-right panel if you need help!</b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
h2 {
  color: white;
}

.overflow {
  overflow: auto;
}

.list-group-item {
  font-size: 18px;
}
</style>