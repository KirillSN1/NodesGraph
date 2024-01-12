<template>
    <div ref="controlsParent">
        <slot 
            :onFocus="onFocus"
            :onBlur="onBlur"
            :focus="focus"
            :blur="blur"
            :buttonAttrs="buttonAttrs">
        </slot>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTabNavigation } from './TabNavigation'
const props = withDefaults(defineProps<{
    selectors: string
}>(),{
    selectors:"button"
});
const { 
    controlsParent,
    focus, 
    blur,
    handleArrows,  
    onFocus,
    onBlur,
    isActive
} = useTabNavigation(props.selectors);
const emit = defineEmits<{
    focus:[data:{ event:Event, index:number }]
    blur:[data:{ event:Event, index:number }]
}>()
onMounted(()=>{
    window.addEventListener('keydown',onKeydown);
});
onBeforeUnmount(()=>{
    window.removeEventListener('keydown',onKeydown);
});
function onKeydown(e:Event){
    if(!(e instanceof KeyboardEvent)) return;
    if(!isActive()) return;
    if(handleArrows(e)) {
        e.preventDefault();
        focusedByMouse.value = false;
    }
}
const focusedByMouse = ref(false);
function buttonAttrs(index:number){
    return {
        onMouseenter(){ focus(index); focusedByMouse.value = true; },
        onMouseleave(){ if(focusedByMouse.value) blur() },
        onFocus(event:Event) { 
            onFocus(index);
            emit('focus', { event, index });
            focusedByMouse.value = false;
        },
        onBlur(event:Event){
            onBlur();
            emit('blur', { event, index });
        }
    }
}
</script>