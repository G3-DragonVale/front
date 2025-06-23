<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Dragon } from "@/model/types.ts";
import DragonCard from "@/components/DragonCard.vue";
import { useDragonStore } from "@/stores/dragon";
import Loader from "@/components/Loader.vue";
import { useAuthStore } from "@/stores/auth";

const dragonStore = useDragonStore();
const authStore = useAuthStore();

const input = ref("");

const filteredList = computed(() => {
  return dragonStore.dragons?.filter((dragon: Dragon) =>
    dragon.nom.toLowerCase().startsWith(input.value.toLowerCase())
  );
});

const dragonsFound = computed(() => {
  if (!filteredList.value) return "Aucun dragon trouvé";
  return filteredList.value?.length > 1 ? `${filteredList.value.length} dragons trouvés` : `${filteredList.value.length} dragon trouvé`;
});

const addUserDragon = async (dragonId: number) => {
  if (!authStore.user?.id) {
    console.error("User not authenticated");
    return;
  }

  await dragonStore.addUserDragon({ userId: authStore.user.id, dragonId });
};

onMounted(async () => {
  await dragonStore.fetchDragons();
  await dragonStore.fetchDragonsByUserId(authStore.user?.id.toString() || '');
});
</script>

<template>
  <div class="p-4" v-if="!dragonStore.isLoading">
    <h2 class="text-xl font-semibold mb-4">Tous les dragons</h2>

    <div v-if="!dragonStore.isError">
      <input type="text" v-model="input" placeholder="Chercher un dragon..."
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />

      <div v-if="filteredList && filteredList.length">
        <h3 class="text-lg font-semibold my-4">{{ dragonsFound }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <div v-for="dragon in filteredList" :key="dragon.id" class="relative">
            <DragonCard :dragon="dragon" />
            <button v-if="!dragonStore.userDragons?.some(d => d.id === dragon.id)"
              class="absolute bottom-2 right-2 px-[5px] bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
              @click="addUserDragon(dragon.id)" title="Ajouter ce dragon">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="mt-4 text-center font-medium">
        <p>Aucun dragon trouvé</p>
      </div>
    </div>

    <div v-else class="mt-4 text-red-500 text-center">
      <p>Une erreur est survenue lors du chargement des dragons</p>
    </div>
  </div>

  <div v-else class="flex justify-center items-center">
    <Loader message="Chargement..." />
  </div>
</template>
