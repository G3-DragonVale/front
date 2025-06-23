import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api';
import type { Log } from '@/model/types';

export const useLogStore = defineStore('log', () => {
    const logs = ref<Log[] | null>(null);
    const isLoading = ref(false);
    const isError = ref(false);

    async function fetchLogs() {
        isLoading.value = true;
        isError.value = false;

        try {
            const response = await apiService.get<Log[]>('/logs');
            logs.value = response;
        } catch (error) {
            console.error('Error fetching dragons:', error);
            isError.value = true;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    return { logs, isLoading, isError, fetchLogs };
})