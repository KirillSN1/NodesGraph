<template>
    <div class="scrim" @mousedown.middle="onMousedown">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import Position from '../transform/Position';
import Vector2 from '../vector/Vector2';

const emit = defineEmits<{
    move:[Vector2]
}>()
const data = reactive({
    position:new Position()
})
onMounted(()=>{
	window.addEventListener("mousemove",onMousemove);
	window.addEventListener("mouseup",onMouseup);
});
let lastPosition:Position | null;
let mousedownPosition:Vector2 | null;
// const grabbing = computed(()=>Boolean(lastPosition  && mousedownPosition))
function onMousedown(event:MouseEvent){
	lastPosition = data.position.copyWith();
	mousedownPosition = new Vector2({ x:event.clientX, y:event.clientY });
}
function onMousemove(event:MouseEvent){
	if(!lastPosition || !mousedownPosition) return;
	const cursorPosition = new Vector2({ x:event.clientX, y:event.clientY });
	emit("move",lastPosition.add(cursorPosition, mousedownPosition.negative()));
}
function onMouseup(event:MouseEvent){
	onMousemove(event);
	lastPosition = null;
	mousedownPosition = null;
}
</script>
<style scoped lang="scss">
.scrim{
    position: relative;
    overflow: hidden;
    .platform{
        position: absolute;
        min-width: 100%;
        min-height: 100%;
        width: max-content;
        height: max-content;
    }
}
</style>