<template>
  <div>
    <h2>Harmonic Rhythm</h2>
    <b-tabs
        content-class="mt-3"
        fill
        pills
        style="font-size: 32px"
    >
      <b-tab title="Walkthrough">
        <b-col class="text-center">
          <iframe
              width="840"
              height="415"
              src="https://www.youtube.com/embed/yGLVII7hcjU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              style="border:none;"
          >
          </iframe>
        </b-col>
      </b-tab>
      <!--      WEBSITE-->
      <b-tab title="Website">
        <b-row style="overflow: auto">
          <b-list-group>
            <b-list-group-item variant="success">The "Save and Continue" button saves the current input for when you return to the page. <span style="color: red">This is necessary to move on to the next section</span>.</b-list-group-item>
            <b-list-group-item variant="warning">The save button will not work until you have selected an option</b-list-group-item>
          </b-list-group>
        </b-row>
      </b-tab>
      <b-tab title="Music">
        <b-row>
          <b-list-group>

          </b-list-group>
        </b-row>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
h2, p {
  color: white;
}

img {
  max-width: 100%;
}

.list-group-item {
  font-size: 18px;
}

.rounded {
  border-radius: 10px;
}
</style>