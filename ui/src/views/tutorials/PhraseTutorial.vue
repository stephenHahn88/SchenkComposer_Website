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
            <b-list-group-item variant="info">Press "Sentence" or "Period" to choose your phrase type.</b-list-group-item>
            <b-list-group-item variant="danger">The red X button clears your phrase choice.</b-list-group-item>
<!--            <b-list-group-item variant="warning">The yellow back arrow removes the last phrase unit.</b-list-group-item>-->
<!--            <b-list-group-item variant="primary">The Generate button asks SchenkComposer to generate the phrase structure for you. This replaces whatever is currently typed in.</b-list-group-item>-->
            <b-list-group-item variant="success">The "Save and Continue" button saves the current input for when you return to the page. <span style="color: red">This is necessary to move on to the next section</span>.</b-list-group-item>
            <b-list-group-item variant="warning">The save button will not work until you have selected an option</b-list-group-item>
          </b-list-group>
        </b-row>
      </b-tab>
      <b-tab title="Music">
        <b-row>
          <img src="../../static/tutorial/form_and_schenker.PNG" class="my-2 rounded">
          <b-list-group>
            <b-list-group-item variant="success">Form analysis is a field of study that breaks a musical piece into constituent sections based on similarities in rhythm, melody, and harmony.</b-list-group-item>
            <b-list-group-item variant="info">Generally, sections are broken into phrases, which may be broken further into subphrases (or motifs).</b-list-group-item>
            <b-list-group-item variant="info">Sections, phrases, and subphrases are most commonly labelled using lowercase and uppercase letters, where relatively larger structures use uppercase letters.</b-list-group-item>
            <b-list-group-item variant="info">In the Figure above, we show the subphrase structure of a single phrase in a Beethoven piano sonata in <span style="color: red;">red</span>, based mainly on related rhythms and melodic contours.</b-list-group-item>
            <b-list-group-item variant="info">Subphrase a is repeated with variation a′ (2 measures each), followed by b and b′ (1 measure each), and c and c′ (half a measure each).  d (1 measure) ends the phrase.</b-list-group-item>
            <b-list-group-item variant="success">Laitz (2012) describes two main categories of common phrase structures in Western classical music, the sentence and the period.</b-list-group-item>
            <b-list-group-item variant="info">The simplest implementation of a sentence takes the form of a−a′ −b, where the proportional length of each subphrase is 1 : 1 : 2 and b ends with a cadence, is often divided into a sentence structure itself. In fact, the Figure above shows an example of a sentence within a sentence within a sentence.</b-list-group-item>
            <b-list-group-item variant="info">A period consists of two phrases, an antecedent (A) and a consequent (B or A′), each ending with a cadence, where the first cadence is “weaker” than the second.</b-list-group-item>
            <b-list-group-item variant="info">Cadences ending on an “open” harmony such as V are considered weakest, while “closed” cadences such as those ending on I are stronger.</b-list-group-item>
            <b-list-group-item variant="info">Phrases that make up a period may be sentences themselves or made of less organized subphrases.</b-list-group-item>

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