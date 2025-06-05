<script setup lang="ts">

</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>
            <form @submit.prevent>
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input type="text" id="username"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required />
                </div>
                <div class="mb-2">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" id="password"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required />
                </div>
                <div class="mb-6">
                    <p class="text-sm text-gray-600">
                        Pas de compte ?
                        <RouterLink to="/" class="text-blue-600">Créer un compte</RouterLink>
                    </p>
                </div>
                <button type="submit" @click="console.log('Connexion')"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition duration-200">
                    Se connecter
                </button>
            </form>
        </div>
    </div>
</template>