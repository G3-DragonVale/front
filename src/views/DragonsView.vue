<script setup lang="ts">
import { onMounted } from 'vue';
import Loader from '@/components/Loader.vue';
import { useDragonStore } from '@/stores/dragon';
import { useAuthStore } from '@/stores/auth';

const dragonStore = useDragonStore();
const authStore = useAuthStore();

onMounted(async () => {
    await dragonStore.fetchDragonsByUserId(authStore.user?.id.toString() || '');
});
</script>

<template>
    <div class="p-4" v-if="!dragonStore.isLoading">
        <h2 class="text-xl font-semibold mb-4">Mes dragons</h2>
        <p>Bienvenue dans la section dédiée à vos dragons !</p>
    </div>

    <div v-else class="flex items-center justify-center">
        <Loader message="Chargement..." />
    </div>
</template>