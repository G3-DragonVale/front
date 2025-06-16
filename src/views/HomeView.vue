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
      class="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 shadow-sm" />

    <div v-if="filteredList && filteredList.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
