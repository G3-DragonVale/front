<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <main>
    <p class="text-red-500" @click="count++">{{ count }}</p>
  </main>
</template>
