<script setup lang="ts">
import { onMounted } from 'vue';
import { useDragonStore } from '@/stores/dragon';
import { useAuthStore } from '@/stores/auth';
import Loader from '@/components/Loader.vue';
import DragonCard from '@/components/DragonCard.vue';

const dragonStore = useDragonStore();
const authStore = useAuthStore();

const removeUserDragon = async (dragonId: number) => {
    if (!authStore.user?.id) {
        console.error("User not authenticated");
        return;
    }

    await dragonStore.removeUserDragon({ userId: authStore.user.id, dragonId });
};

onMounted(async () => {
    await dragonStore.fetchDragonsByUserId(authStore.user?.id.toString() || '');
});
</script>

<template>
    <div class="p-4" v-if="!dragonStore.isLoading">
        <h2 class="text-xl font-semibold mb-4">Mes dragons</h2>

        <div v-if="!dragonStore.isError">
            <div v-if="dragonStore.userDragons && dragonStore.userDragons.length"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <div v-for="dragon in dragonStore.userDragons" :key="dragon.id" class="relative">
                    <DragonCard :dragon="dragon" />
                    <button
                        class="absolute bottom-2 right-2 px-[5px] bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                        @click="removeUserDragon(dragon.id)" title="Supprimer ce dragon">
                        <i class="fa-solid fa-minus"></i>
                    </button>
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