<script setup lang="ts">
import { onMounted } from 'vue';
import { useDragonStore } from '@/stores/dragon';
import { useAuthStore } from '@/stores/auth';
import Loader from '@/components/Loader.vue';
import DragonCard from '@/components/DragonCard.vue';

const dragonStore = useDragonStore();
const authStore = useAuthStore();

onMounted(async () => {
    await dragonStore.fetchDragonsByUserId(authStore.user?.id.toString() || '');
});
</script>

<template>
    <div class="p-4" v-if="!dragonStore.isLoading">
        <h2 class="text-xl font-semibold mb-4">Mes dragons</h2>

        <div v-if="!dragonStore.isError">
            <div v-if="dragonStore.userDragons && dragonStore.userDragons.length">
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <div v-for="dragon in dragonStore.userDragons" :key="dragon.id">
                    <DragonCard :dragon="dragon" />
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

    <div v-else class="flex items-center justify-center">
        <Loader message="Chargement..." />
    </div>
</template>