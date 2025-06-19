<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useLogStore } from '@/stores/logs';
import type { Log } from '@/model/types';
import Loader from '@/components/Loader.vue';

const logStore = useLogStore();

const showFilter = ref(false)
const selectedMethod = ref<string | null>(null)

function selectMethod(method: string | null) {
    selectedMethod.value = method
    showFilter.value = false
}

const availableMethods = ref<string[]>([
    'GET',
    'POST',
    'PUT',
    'DELETE',
]);

const filteredLogs = computed(() => {
    return logStore.logs?.filter((log: Log) =>
        log.method.toLowerCase() === selectedMethod.value?.toLowerCase() || selectedMethod.value === null
    );
});

function methodColor(method: string) {
    switch (method) {
        case 'GET':
            return 'bg-blue-500';
        case 'POST':
            return 'bg-green-500';
        case 'PUT':
            return 'bg-yellow-500';
        case 'DELETE':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}

onMounted(async () => {
    await logStore.fetchLogs();
});
</script>

<template>
    <div class="p-4" v-if="!logStore.isLoading">
        <h2 class="text-xl font-semibold mb-4">Historique des actions</h2>

        <div v-if="!logStore.isError" class="mb-4">
            <p class="text-sm text-gray-600">Nombre d'actions : {{ logStore.logs?.length }}</p>
            <div class="overflow-visible">
                <table class="min-w-full text-sm text-left">
                    <thead class="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th class="px-4 py-2 w-1/5">Utilisateur</th>
                            <th class="px-4 py-2 w-1/5 relative">
                                Méthode
                                <i class="fa-solid fa-filter hover:cursor-pointer"
                                    @click="showFilter = !showFilter"></i>

                                <div v-if="showFilter"
                                    class="absolute top-full left-0 mt-2 bg-white border rounded shadow z-10">
                                    <ul class="text-sm w-32">
                                        <li>
                                            <button class="w-full text-left px-3 py-2 hover:bg-gray-100"
                                                :class="{ 'bg-gray-100': selectedMethod === null }"
                                                @click="selectMethod(null)">
                                                Toutes
                                            </button>
                                        </li>
                                        <li v-for="method in availableMethods" :key="method">
                                            <button class="w-full text-left px-3 py-2 hover:bg-gray-100"
                                                :class="{ 'bg-gray-100': selectedMethod === method }"
                                                @click="selectMethod(method)">
                                                {{ method }}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </th>
                            <th class="px-4 py-2 max-w-1/5">Route</th>
                            <th class="px-4 py-2 max-w-1/5">Body</th>
                            <th class="px-4 py-2 max-w-1/5">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, index) in filteredLogs" :key="index" class="border-b hover:bg-gray-50">
                            <td class="px-4 py-4 w-1/5 break-all whitespace-normal">
                                {{ log.userId ? log.userId : 'Utilisateur inconnu' }}
                            </td>
                            <td class="px-4 py-4 w-1/5 break-all whitespace-normal">
                                <span :class="methodColor(log.method)"
                                    class="px-2 py-1 rounded text-xs font-medium text-white">
                                    {{ log.method }}
                                </span>
                            </td>
                            <td class="px-4 py-4 w-1/5 break-all whitespace-normal">
                                {{ log.route }}
                            </td>
                            <td class="px-4 py-4 w-1/5 break-all whitespace-normal text-xs">
                                {{ log.body ? JSON.stringify(log.body) : 'Aucune donnée' }}
                            </td>
                            <td class="px-4 py-4 w-1/5 break-all whitespace-normal">
                                {{ dayjs(log.date).format('DD/MM/YYYY HH:mm:ss') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class="mt-4 text-red-500 text-center">
            <p>Une erreur est survenue lors du chargement des logs</p>
        </div>
    </div>

    <div v-else class="flex justify-center items-center">
        <Loader message="Chargement..." />
    </div>
</template>