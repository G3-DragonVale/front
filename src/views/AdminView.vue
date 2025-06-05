<script setup lang="ts">
import { ref } from 'vue';
import { Log } from '@/model/types.ts';
import dayjs from 'dayjs';

const logs: Log[] = [
    {
        id: 1,
        userId: 1,
        method: 'oui',
        route: 'oui',
        date: new Date()
    },
    {
        id: 2,
        userId: 1,
        method: 'oui',
        route: 'non',
        date: new Date()
    },
]
</script>

<template>
    <h1>Admin</h1>

    <div class="log-list">
        <div v-for="log in logs" :key="log.id" class="log-card">
            <p>{{ log.method }}</p>
            <p>{{ log.route }}</p>
            <p>{{ dayjs(log.date).format('DD/MM/YYYY') }} à {{ dayjs(log.date).format('HH:mm:ss') }}</p>
        </div>
    </div>
</template>

<style scoped>
.log-list {
    flex: auto;
    flex-direction: column;
}

.log-card {
    color: white;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    margin: 5px 15px;
    padding: 10px 0;
}

p {
    margin: 0;
}
</style>