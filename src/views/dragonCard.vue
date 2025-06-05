<script setup lang="ts">
import type {Dragon} from "@/model/types.ts";
import type {PropType} from "vue";

const props = defineProps({
  dragon: Object as PropType<Dragon>,
});

function dragon_color(rarete:string) {
  switch (rarete) {
    case "standard": return "bg-grey-500/40";
    case "rare": return "bg-blue-500/40";
    case "epic": return "bg-purple-500/40";
    case "legendary": return "bg-yellow-500/60";
  }
}
</script>

<template>
  <!-- Placeholder for image -->
  <div :class="dragon_color(dragon.rarete)" class="rounded-4xl shadow-md overflow-hidden hover:shadow-lg transition-shadow" v-if="dragon">
    <div class="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
      <img :src="dragon.img_url" alt=""  class="h-32">
    </div>

    <div class="p-4">
      <p class="text-lg font-semibold capitalize text-gray-800">{{ dragon.nom }}</p>
    </div>
  </div>

</template>

<style scoped>

</style>