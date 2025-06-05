<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <nav class="bg-gray-800 p-4">
        <ul class="flex space-x-4">
            <li>
                <RouterLink to="/" class="text-white hover:text-gray-300">Mes dragons</RouterLink>
            </li>
            <li>
                <RouterLink to="/monitoring" class="text-white hover:text-gray-300">Monitoring</RouterLink>
            </li>
        </ul>
    </nav>
</template>