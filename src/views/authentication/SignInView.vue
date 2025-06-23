<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { ErrorResponse } from '@/model/types';
import Loader from '@/components/Loader.vue';

const authStore = useAuthStore();

const username = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const usernameError = ref<string>('');
const passwordError = ref<string>('');

async function register() {
    if (password.value !== confirmPassword.value) {
        passwordError.value = 'Les mots de passe doivent correspondre';
        return;
    }

    try {
        await authStore.register(username.value, password.value);
    } catch (e: ErrorResponse | any) {
        if (e.statusCode === 409) {
            usernameError.value = e.message;
        }
        console.error(e);
    }
}

watch(confirmPassword, () => {
    if (confirmPassword.value !== password.value) {
        passwordError.value = 'Les mots de passe doivent correspondre';
    } else {
        passwordError.value = '';
    }
});
</script>

<template>
    <div class="flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h1 class="text-2xl font-bold mb-6 text-center">Création de compte</h1>
            <Loader message="" color="blue-600" v-if="authStore.isLoading" />
            <form @submit.prevent="register" v-else>
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">
                        Nom d'utilisateur *
                    </label>
                    <input v-model="username" type="text" id="username" autocomplete="username"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="[usernameError ? 'border-red-600' : 'border-gray-300']" required />
                    <p v-if="usernameError" class="text-xs text-red-600 mt-1">
                        {{ usernameError }}
                    </p>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Mot de passe *
                    </label>
                    <input v-model="password" type="password" id="password" autocomplete="new-password"
                        class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="[passwordError ? 'border-red-600' : 'border-gray-300']" required />
                </div>
                <div class="mb-2">
                    <label for="verify-password" class="block text-sm font-medium text-gray-700">
                        Confirmer mot de passe *
                    </label>
                    <input v-model="confirmPassword" type="password" id="verify-password" autocomplete="new-password"
                        class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="[passwordError ? 'border-red-600' : 'border-gray-300']" required />
                    <p v-if="passwordError" class="text-xs text-red-600 mt-1">
                        {{ passwordError }}
                    </p>
                </div>
                <div class="mb-6">
                    <p class="text-sm text-gray-600">
                        Déjà un compte ?
                        <RouterLink to="/login" class="text-blue-600 hover:text-blue-700">Se connecter</RouterLink>
                    </p>
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition duration-200">
                    Créer un compte
                </button>
            </form>
        </div>
    </div>
</template>