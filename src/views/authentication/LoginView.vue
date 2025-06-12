<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Loader from '@/components/Loader.vue';

const authStore = useAuthStore();

const username = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');

async function login() {
    try {
        await authStore.login(username.value, password.value);
        console.log('Envoi des données au serveur', {
            username: username.value,
            password: password.value
        });
        console.log('Connexion avec succès');
    } catch (e: any) {
        error.value = 'Nom d’utilisateur et/ou mot de passe incorrect';
        console.error(e);
    }
}
</script>

<template>
    <div class="flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>
            <Loader message="" color="blue-600" v-if="authStore.isLoading" />
            <form @submit.prevent="login" v-else>
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input v-model="username" type="text" id="username" autocomplete="username"
                        class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="[error ? 'border-red-600' : 'border-gray-300']" required />
                </div>
                <div class="mb-2">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input v-model="password" type="password" id="password" autocomplete="current-password"
                        class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        :class="[error ? 'border-red-600' : 'border-gray-300']" required />
                    <p v-if="error" class="text-xs text-red-600 mt-1">
                        {{ error }}
                    </p>
                </div>
                <div class="mb-6">
                    <p class="text-sm text-gray-600">
                        Pas de compte ?
                        <RouterLink to="/signin" class="text-blue-600 hover:text-blue-700">Créer un compte</RouterLink>
                    </p>
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition duration-200">
                    Se connecter
                </button>
            </form>
        </div>
        <!-- <div v-if="authStore.isLoading"
            class="fixed top-0 right-0 h-screen w-screen bg-black/75 flex items-center justify-center">
            <Loader message="Chargement..." color="blue-600" />
        </div> -->
    </div>

</template>