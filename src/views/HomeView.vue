<script setup lang="ts">
import { ref } from "vue";
import type {Dragon} from "@/model/types.ts";
import DragonCard from "@/views/dragonCard.vue";

let input = ref("");


const dragons:Dragon[] = [
    {
      id: 1,
      nom: "plouf",
      rarete: "standard",
      img_url: "str"
    },
  {
    id: 2,
    nom: "plaf",
    rarete: "rare",
    img_url: "https://dvboxcdn.com/dragons/Abraxas.webp"
  },
  {
    id: 3,
    nom: "plif",
    rarete: "legendary",
    img_url: "https://dvboxcdn.com/dragons/Iceberg.webp"
  },
  {
    id: 4,
    nom: "plouc",
    rarete: "epic",
    img_url: "https://dvboxcdn.com/dragons/Mud.webp"
  }
]; // modifier pour ajouter les dragons du serveur

function filteredList() {
  return dragons.filter((dragon) =>
      dragon.nom.toLowerCase().includes(input.value.toLowerCase())
  );
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <input
        type="text"
        v-model="input"
        placeholder="Search dragons..."
        class="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 shadow-sm"
    />

    <div v-if="filteredList().length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
          v-for="dragon in filteredList()"
          :key="dragon.id"
      >
      <dragon-card :dragon="dragon" />
      </div>
    </div>

    <div v-else-if="input" class="mt-4 text-center text-red-500 font-medium">
      <p>No dragon found !</p>
    </div>
  </div>
</template>




