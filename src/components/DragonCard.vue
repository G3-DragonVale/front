<script setup lang="ts">
import type { Dragon } from "@/model/types.ts";
import type { PropType } from "vue";

const props = defineProps({
  dragon: Object as PropType<Dragon>,
});

function dragon_color(rarete: string) {
  switch (rarete) {
    case "standard": return "bg-grey-500/40";
    case "rare": return "bg-blue-500/40";
    case "epic": return "bg-purple-500/40";
    case "legendary": return "bg-yellow-500/60";
  }
}
</script>

<template>
  <div v-if="props.dragon" :class="dragon_color(props.dragon.rarete)"
    class="rounded-4xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
      <img :src="props.dragon.lien" :alt="props.dragon.nom" class="h-32">
    </div>

    <div class="p-4">
      <p class="text-lg font-semibold capitalize text-gray-800">{{ props.dragon.nom }}</p>
    </div>
  </div>

</template>

<style scoped></style>