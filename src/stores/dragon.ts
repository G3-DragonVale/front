import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api';
import type { Dragon, UserDragon } from '@/model/types';

export const useDragonStore = defineStore('dragon', () => {
    const dragons = ref<Dragon[] | null>(null);
    const userDragons = ref<Dragon[] | null>(null);
    const isLoading = ref(false);
    const isError = ref(false);

    async function fetchDragons() {
        isLoading.value = true;
        isError.value = false;

        try {
            const response = await apiService.get<Dragon[]>('/dragons');
            dragons.value = orderByDragonName(response);
        } catch (error) {
            console.error('Error fetching dragons:', error);
            isError.value = true;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchDragonsByUserId(userId: string) {
        isLoading.value = true;
        isError.value = false;

        try {
            const response = await apiService.get<Dragon[]>(`/dragons/ByUserId/${userId}`);
            userDragons.value = orderByDragonName(response);
        } catch (error) {
            console.error('Error fetching dragons by user ID:', error);
            isError.value = true;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function addUserDragon(userDragon: UserDragon) {
        isLoading.value = true;
        isError.value = false;
        try {
            const response = await apiService.post('/dragons/userDragon', userDragon);
            if (response) {
                await fetchDragonsByUserId(userDragon.userId.toString());
            }
        } catch (error) {
            console.error('Error adding user dragon:', error);
            isError.value = true;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function removeUserDragon(userDragon: UserDragon) {
        isLoading.value = true;
        isError.value = false;
        try {
            const response = await apiService.delete(
                `/dragons/userDragon?userId=${userDragon.userId}&dragonId=${userDragon.dragonId}`
            );
            if (response) {
                await fetchDragonsByUserId(userDragon.userId.toString());
            }
        } catch (error) {
            console.error('Error removing user dragon:', error);
            isError.value = true;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    function orderByDragonName(dragonsList: Dragon[] | null) {
        if (!dragonsList) return [];
        return [...dragonsList].sort((a, b) => a.nom.localeCompare(b.nom));
    }

    return { dragons, userDragons, isLoading, isError, fetchDragons, fetchDragonsByUserId, addUserDragon, removeUserDragon };
})