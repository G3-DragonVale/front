<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Dragon } from "@/model/types.ts";
import DragonCard from "@/components/DragonCard.vue";
import { useDragonStore } from "@/stores/dragon";
import Loader from "@/components/Loader.vue";

const dragonStore = useDragonStore();

const input = ref("");

const filteredList = computed(() => {
  return dragonStore.dragons?.filter((dragon: Dragon) =>
    dragon.nom.toLowerCase().includes(input.value.toLowerCase())
  );
});

onMounted(async () => {
  await dragonStore.fetchDragons();
});
</script>

<template>
  <div class="p-4" v-if="!dragonStore.isLoading">
    <input type="text" v-model="input" placeholder="Search dragons..."
      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />

    <div v-if="filteredList && filteredList.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      <div v-for="dragon in filteredList" :key="dragon.id">
        <DragonCard :dragon="dragon" />
      </div>
    </div>

    <div v-else class="mt-4 text-center font-medium">
      <p>Aucun dragon trouvé !</p>
    </div>
  </div>

  <div v-else class="flex justify-center items-center">
    <Loader message="Chargement..." />
  </div>
</template>
