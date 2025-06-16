<script setup lang="ts">
import { RouterLink } from 'vue-router';
import {
    Menu,
    MenuButton,
    MenuItems
} from '@headlessui/vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <nav class="bg-gray-800 p-4 flex justify-between items-center">
        <ul class="flex space-x-4">
            <li>
                <RouterLink to="/" class="text-white hover:text-gray-300">Accueil</RouterLink>
            </li>
            <li>
                <RouterLink to="/dragons" class="text-white hover:text-gray-300">Mes dragons</RouterLink>
            </li>
            <li v-if="authStore.isAdmin">
                <RouterLink to="/monitoring" class="text-white hover:text-gray-300">Monitoring</RouterLink>
            </li>
        </ul>

        <Menu as="div" class="relative ml-3">
            <div>
                <MenuButton
                    class="relative flex max-w-xs items-center rounded-full focus:outline-none hover:cursor-pointer">
                    <span class="absolute -inset-1.5"></span>

                    <span class="sr-only"></span>

                    <div class="pl-2 font-medium leading-none text-white">
                        {{ authStore.user?.nickname || 'Utilisateur inconnu' }}
                    </div>

                    <svg class="-mr-1 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd" />
                    </svg>
                </MenuButton>
            </div>
            <MenuItems
                class="absolute divide-y divide-gray-100 right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div>
                    <div class="relative mb-0 py-1 align-middle text-sm">
                        <div class="text-center">
                            <button
                                class="text-gray-700 hover:text-gray-500 hover:cursor-pointer text-sm font-medium focus:outline-none"
                                @click="authStore.logout">
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </MenuItems>
        </Menu>
    </nav>
</template>