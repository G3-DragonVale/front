<script setup lang="ts">
const props = defineProps({
    message: String,
    color: { type: String, default: "light" },
});

function getColor(color: string): string {
    return `border-${color}`;
}
</script>

<template>
    <div>
        <div class="flex flex-col items-center justify-center">
            <div class="loader-spinner h-16 w-16 border-4 border-t-transparent rounded-full mb-2"
                :class="'border-blue-700'"></div>
        </div>
        <div :class="`text-center text-xs text-${props.color}`">{{ props.message }}</div>
    </div>
</template>

<style scoped>
.loader-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>