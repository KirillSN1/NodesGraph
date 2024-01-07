<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="text-property">
        <span>{{ property.title }}: </span>
        <AutosizeInput ref="input" v-if="editing"
            ctxmenu="system"
            v-model="property.text" 
            @blur="onInputBlur" 
            @keydown.enter="editing = false" />
        <div class="text" v-else
            ctxmenu="system"
            @dblclick="onDoubleClick">
            <span v-if="property.text" >{{ property.text }}</span>
            <span class="placeholder" v-else-if="property.placeholder">{{ property.placeholder }}</span>
        </div>
        <!-- <slot name="socket" :socket="property.socket"></slot> -->
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import TextProperty from './TextProperty';
import AutosizeInput from '../../ui/AutosizeInput.vue';
defineProps<{
    property:TextProperty
}>();
const editing = ref(false);
const input = ref<InstanceType<typeof AutosizeInput>>();
function onDoubleClick(){
    editing.value = true;
    nextTick(()=>input.value?.$el.focus())
}
function onInputBlur(){
    editing.value = false;
}
</script>
<style lang="scss">
.text-property{
    &>input{
        color: white;
        font-size: unset;
        outline: none;
        border-bottom: 2px solid #0e96ff;
    }
    &>.text{
        cursor: text;
        user-select: text;
        border: 1px solid transparent;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        display: inline-block;
        min-height: 1em;
        padding: 2px 8px;
        &>.placeholder{
            filter: contrast(0.1);
        }
    }
    &>input,&>.text{
        max-width: 150px;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: #414141;
        color: white;
    }
}
</style> 