<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="text-property">
        <span>test</span>
        <slot name="socket" :socket="property.socket"></slot>
    </div>
</template>
<script setup lang="ts">
import TestInputProperty from './TestInputProperty';
defineProps<{
    property:TestInputProperty
}>();
</script>
<style lang="scss">
.text-property{
    .text{
        min-height: 1em;
        &>.placeholder{
            filter: contrast(0.1);
        }
    }
}
</style>