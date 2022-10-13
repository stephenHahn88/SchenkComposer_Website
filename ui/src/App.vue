<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#">
        <img
            src="@/static/schenkcomposer_logo.svg"
            alt="SchenkComposer"
            class="d-inline-block align-top"
            style="height: 90px; width: auto;"
        >
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>yo</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="width: 750px;">
      <SchenkComposerDAG></SchenkComposerDAG>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";
</script>

