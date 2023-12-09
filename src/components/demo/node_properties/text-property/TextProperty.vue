<template>
    <div class="text-property">
        {{ property.content }}
        <div>
            <slot name="socket" :socket="socket"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Socket } from '@/components/core/canvas/GNodeTypes';
import TextProperty from './TextProperty';
defineProps<{
    property:TextProperty
}>();
const socket = new Socket({
    color:"red"
});
</script>
<style lang="scss">
.text-property{

}
</style>