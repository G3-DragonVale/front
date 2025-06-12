import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiService } from '@/services/api';
import type { ErrorResponse, User } from '@/model/types';

export const useAuthStore = defineStore('auth', () => {
    const AUTH_TOKEN_KEY = 'userToken';

    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY) || null);
    const error = ref<ErrorResponse | null>(null);
    const isLoading = ref(false);

    const isAuthenticated = computed(() => !!token.value);

    const isAdmin = computed(() => {
        return user.value?.role === 'ADMIN';
    })

    function initialize() {
        token.value = localStorage.getItem(AUTH_TOKEN_KEY);
    }

    function setToken(newToken: string | null) {
        token.value = newToken;

        if (newToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, newToken);
        } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    }

    async function register(username: string, password: string) {
        isLoading.value = true;
        error.value = null;

        try {
            await apiService.post('/auth/register', { nickname: username, mdp: password });
            await login(username, password);
        } catch (e: any) {
            error.value = e?.response?.data || null;
            console.log(error.value);
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function login(username: string, password: string) {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await apiService.post('/auth/login', { nickname: username, mdp: password });
            console.log(data);
            // setToken(data.token);
            // user.value = data.user || null;
        } catch (e: any) {
            error.value = e?.response?.data?.message || 'Erreur lors de la connexion.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    function logout() {
        setToken(null);
        user.value = null;
    }

    return { user, token, error, isLoading, isAuthenticated, isAdmin, initialize, register, login, logout };
})