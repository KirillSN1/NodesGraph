<template>
    <div>
        <span>{{ property.title }}</span>
        <slot name="socket" :socket="property.socket"></slot>
    </div>
</template>
<script setup lang="ts">
import { PropertyWithSocket } from '@/core/node/gnode/PropertyWithSocket';
defineProps<{ property:PropertyWithSocket }>();
</script>