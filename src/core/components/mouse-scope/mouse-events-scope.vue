<template>
    <slot></slot>
</template>
<script setup lang="ts">
import { onBeforeUnmount, provide, shallowReactive } from 'vue';
import mouseScopeSymbol from './mouseScopeSymbol';
import { EventsMap } from './EventsMap';
const props = defineProps<{
    events:string[],
}>();
const emit = defineEmits<{ provide:[map:EventsMap] }>()
const map:EventsMap = shallowReactive({});
provide(mouseScopeSymbol,map);
emit("provide",map);
props.events.forEach(eventName=>{
    if(eventName in map) throw new Error(`Dublicate key ${eventName}`);
    document.addEventListener(eventName,eventListener);
})
onBeforeUnmount(()=>{
    Object.keys(map).forEach((eventName)=>document.removeEventListener(eventName,eventListener))
})
function eventListener(e:Event){ 
    map[e.type] = e;
}
</script>