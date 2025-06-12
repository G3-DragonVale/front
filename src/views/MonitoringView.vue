<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import type { Log } from '@/model/types';

const logs = ref<Log[]>([
    {
        id: 1,
        user: 'Michel',
        method: 'POST',
        route: '/api/create',
        date: new Date('2025-06-03T16:55:35'),
    },
    {
        id: 2,
        user: 'Jeanne',
        method: 'DELETE',
        route: '/api/delete/1',
        date: new Date('2025-06-03T17:12:41'),
    },
    {
        id: 3,
        user: 'Cess',
        method: 'GET',
        route: '/api/get/1',
        date: new Date(),
    },
    {
        id: 4,
        user: 'Cess',
        method: 'PUT',
        route: '/api/delete/1',
        date: new Date(),
    },
]);

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
    let result = logs.value

    if (selectedMethod.value) {
        result = result.filter((a) => a.method === selectedMethod.value)
    }

    return result
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
</script>

<template>
    <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Historique des actions</h2>
        <div class="overflow-visible">
            <table class="min-w-full text-sm text-left">
                <thead class="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                        <th class="px-4 py-2 w-1/4">Utilisateur</th>
                        <th class="px-4 py-2 w-1/4 relative">
                            Méthode
                            <i class="fa-solid fa-filter hover:cursor-pointer" @click="showFilter = !showFilter"></i>

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
                        <th class="px-4 py-2 max-w-1/4">Route</th>
                        <th class="px-4 py-2 max-w-1/4">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log, index) in filteredLogs" :key="index" class="border-b hover:bg-gray-50">
                        <td class="px-4 py-4 w-1/4 break-all whitespace-normal">
                            {{ log.user }}
                        </td>
                        <td class="px-4 py-4 w-1/4 break-all whitespace-normal">
                            <span :class="methodColor(log.method)"
                                class="px-2 py-1 rounded text-xs font-medium text-white">
                                {{ log.method }}
                            </span>
                        </td>
                        <td class="px-4 py-4 w-1/4 break-all whitespace-normal">
                            {{ log.route }}
                        </td>
                        <td class="px-4 py-4 w-1/4 break-all whitespace-normal">
                            {{ dayjs(log.date).format('DD/MM/YYYY HH:mm:ss') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>