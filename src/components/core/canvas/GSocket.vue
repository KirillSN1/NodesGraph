<template>
    <div ref="el"
        class="socket" 
        :class="socket.type"
        :style="{ '--socket-color':socket.style.color }"
        @mousedown.left="grabbing.onMousedown"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
        @mouseup="onMouseup">
    </div>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { GraphSocket } from '../node/gnode/GraphSocket';
import { useGrabbing } from '../GraphComposables';
import { GRefChange, GRefCreate } from './types/GNodeTypes';
import CanvasStateKey from './types/CanvasStateKey';
import Position from '../transform/Position';


const emit = defineEmits<{
    'start-link':[GRefCreate],
    'move-link':[GRefChange],
    'end-link':[]
    'link':[]
}>();
defineProps<{
    socket:GraphSocket
}>();
const el = ref<HTMLDivElement>();
const canvasState = inject(CanvasStateKey);
const getCanvasState = ()=>{
	if(!canvasState) throw new Error("canvasState is not provided!");
	return canvasState;
}
let newRefTargetPosition = ref<Position | undefined>();
const grabbing = useGrabbing({
    elementPosition(cursorPosition){
        return newRefTargetPosition.value ?? cursorPosition;
    },
    onMousedown({ startPosition }){
        const canvasPosition = getCanvasState().getCanvasPosition();
        newRefTargetPosition.value = startPosition.add(canvasPosition.negative());
        emit("start-link", { target:newRefTargetPosition.value });
    },
    onMousemove({ newPosition }){
        if(!newRefTargetPosition.value) return;
        const canvasPosition = getCanvasState().getCanvasPosition();
        emit("move-link", { target:newPosition.add(canvasPosition.negative()) });
    },
    onMouseup(){
        if(!newRefTargetPosition.value) return;
        emit("end-link");
        newRefTargetPosition.value = undefined;
    }
});
onMounted(()=>{
    window.addEventListener("mousemove",grabbing.onMousemove);
    window.addEventListener("mouseup",grabbing.onMouseup);
})
onUnmounted(()=>{
    window.addEventListener("mousemove",grabbing.onMousemove);
    window.addEventListener("mouseup",grabbing.onMouseup);
})
function onMouseenter(e:MouseEvent){
    if(e.buttons != 1) return;
    e.target?.addEventListener("mouseup",()=>emit("link"));
}
function onMouseleave(e:MouseEvent){
    console.log("leave",e);
}
function onMouseup(e:MouseEvent){
    console.log("up",e);
}
defineExpose({
    getRect(){
        if(!el.value) throw new Error("Can not get element!");
        return el.value.getBoundingClientRect();
    }
});
</script>
<style scoped lang="scss">
.socket{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: white;
    --socket-width: 4px;
    --socket-shadow: 0px 0px 2px 0px black;
    --socket-inset-shadow: inset 0px 0px 2px var(--socket-width) var(--socket-color);
    box-shadow: inset 0px 0px 0px var(--socket-width) var(--socket-color), var(--socket-inset-shadow), var(--socket-shadow);
    position: absolute;
    top: 50%;
    transform-origin: top left;
    transform: translate(-50%,-50%);
    transition: 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
    transition-property: scale, --socket-width;
    &.InputSocket{
        left: 0%;
    }
    &.OutputSocket{
        left: 100%;
    }
    &.input,&.output{
        &:hover{
            scale: 1.5;
            --socket-width: 2px;
        }
    }
}
</style>./types/CanvasStateKey./types/GNodeTypes