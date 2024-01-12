<template>
    <button 
        filled 
        style="background-color: #7d7d7d;" 
        v-bind="$attrs">
        <slot>
            <PenSvg width="15" height="15"/>
        </slot>
    </button>
</template>
<script setup lang="ts">
import PenSvg from './svg/PenSvg.vue';
</script>
<style scoped>
button{
    width: max-content;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>