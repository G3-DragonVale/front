<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- <Navigation /> -->

    <div class="flex flex-grow bg-white">
      <RouterView class="flex-grow" />
    </div>

    <!-- <Footer /> -->
  </div>
</template>