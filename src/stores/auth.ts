import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '@/services/api';
import type { AuthResponse, ErrorResponse, User } from '@/model/types';
import { clearCryptoSession, performHandshake } from '@/utils/cryptoSession';

export const useAuthStore = defineStore('auth', () => {
    const AUTH_TOKEN_KEY = 'userToken';

    const router = useRouter();
    const userData = localStorage.getItem('user');
    const user = ref<User | null>(userData ? JSON.parse(userData) : null);
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

    function setUser(newUser: User | null) {
        user.value = newUser;

        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('user');
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
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function login(username: string, password: string) {
        isLoading.value = true;
        error.value = null;

        try {
            await performHandshake(apiService);
            const data: AuthResponse = await apiService.post('/auth/login', { nickname: username, mdp: password });
            setToken(data.access_token);
            setUser(data.user);
        } catch (e: any) {
            error.value = e?.response?.data || null;
            throw error.value;
        } finally {
            isLoading.value = false;
            router.push('/');
        }
    }

    function logout() {
        setToken(null);
        user.value = null;
        clearCryptoSession();
        router.push('/login');
    }

    return { user, token, error, isLoading, isAuthenticated, isAdmin, initialize, register, login, logout };
})