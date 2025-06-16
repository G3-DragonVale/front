import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api';
import type { Dragon } from '@/model/types';

export const useDragonStore = defineStore('dragon', () => {
    const dragons = ref<Dragon[] | null>(null);
    const myDragons = ref<Dragon[] | null>(null);
    const isLoading = ref(false);

    async function fetchDragons() {
        isLoading.value = true;

        try {
            const response = await apiService.get<Dragon[]>('/dragons');
            dragons.value = response;
        } catch (error) {
            console.error('Error fetching dragons:', error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchDragonsByUserId(userId: string) {
        isLoading.value = true;

        try {
            const response = await apiService.get<Dragon[]>(`/dragons/user/${userId}`);
            myDragons.value = response;
        } catch (error) {
            console.error('Error fetching dragons by user ID:', error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    return { fetchDragons, fetchDragonsByUserId, isLoading, dragons };
})