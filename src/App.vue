<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Navigation from '@/components/Navigation.vue';

const route = useRoute();

const authenticationRoute = ref(['/login', '/signin']);

const isAuthenticated = ref(!authenticationRoute.value.includes(route.path));

watch((route), () => {
  isAuthenticated.value = !authenticationRoute.value.includes(route.path);
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navigation v-if="isAuthenticated" />

    <div class="flex flex-grow bg-white">
      <RouterView class="flex-grow" />
    </div>

    <!-- <Footer /> -->
  </div>
</template>