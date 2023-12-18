<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="text-property">
        <input ref="input" v-if="editing" v-model="property.text" @blur="onInputBlur">
        <div class="text" v-else @dblclick="onDoubleClick">
            <template v-if="property.text" >{{ property.text }}</template>
            <span class="placeholder" v-else-if="property.placeholder">{{ property.placeholder }}</span>
        </div>
        <slot name="socket" :socket="property.socket"></slot>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import TextProperty from './TextProperty';
defineProps<{
    property:TextProperty
}>();
const editing = ref(false);
const input = ref<HTMLInputElement>();
function onDoubleClick(){
    editing.value = true;
    nextTick(()=>input.value?.focus())
}
function onInputBlur(){
    editing.value = false;
}
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