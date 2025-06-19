<script setup lang="ts">
import type { Dragon } from "@/model/types.ts";
import type { PropType } from "vue";

const props = defineProps({
  dragon: Object as PropType<Dragon>,
});

function dragonColor(rarete: string) {
  switch (rarete) {
    case "COMMUN": return "bg-grey-500/40";
    case "RARE": return "bg-blue-500/40";
    case "EPIQUE": return "bg-purple-500/40";
    case "LEGENDARY": return "bg-yellow-500/60";
    case "MYTHIQUE": return "bg-red-500/60";
    default: return "bg-gray-500/40";
  }
}
</script>

<template>
  <div v-if="props.dragon" :class="dragonColor(props.dragon.rarete)"
    class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
      <img :src="props.dragon.lien" :alt="props.dragon.nom" class="h-32">
    </div>

    <div class="flex items-center justify-center h-16">
      <p class="text-md font-semibold uppercase text-gray-800">{{ props.dragon.nom }}</p>
    </div>
  </div>

</template>

<style scoped></style>