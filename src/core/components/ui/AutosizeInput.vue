<template>
    <input v-model="modelValue" :style="style" v-bind="$attrs" />
</template>
<script lang="ts" setup>
import { computed, defineModel } from 'vue';
const modelValue = defineModel({ default:"" });
const style = computed(()=>{
    return {
        width:`${modelValue.value.length}ch`
    }
})
</script>
<style scoped>
input{
    /* font-family: monospace; */
    padding: 1px 8px;
    border-width: 1px;
}
</style>