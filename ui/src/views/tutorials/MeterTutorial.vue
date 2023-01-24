<template>
  <div>
    <h2>Phrase Structure</h2>
    <b-tabs
        content-class="mt-3"
        fill
        pills
        style="font-size: 32px"
    >
      <!--      WEBSITE-->
      <b-tab title="Website">
        <b-row style="overflow: auto">
          <b-list-group>
            <b-list-group-item variant="info">In the "Meter" box, choose a numerator and denominator for your time signature. 4/4 is the most common.</b-list-group-item>
            <b-list-group-item variant="info">At the bottom of the "Hypermeter" box, fill in the blanks with the number of measures you want in each subphrase</b-list-group-item>
            <b-list-group-item variant="success">The "Save and Continue" button saves the current input for when you return to the page. <span style="color: red">This is necessary to move on to the next section</span>.</b-list-group-item>
            <b-list-group-item variant="warning">The save button will not work until you have properly filled in all blanks with a number</b-list-group-item>
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