<template>
  <VScrim @move="driver.onScrimMove">
    <div class="gcanvas">
      <canvas ref="canvas"></canvas>
      <div ref="nodesCanvas" class="nodes-canvas">
        <GNode v-for="node, index in driver.nodes" :node="node" :canvas="canvas" :key="index"
          @move="driver.onNodeMove"
          @resize="driver.onNodeResize"
          @start-link="driver.onStartLink"
          @move-link="driver.onMoveLink"
          @end-link="driver.onEndLink"
          @link="driver.onLink">
        </GNode>
      </div>
    </div>
  </VScrim>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
import GNode from './GNode.vue';
import VScrim from './VScrim.vue';
import Position from '../transform/Position';
import CanvasStateKey from './types/CanvasStateKey';
import GraphDriver from './types/CanvasDriver';

const canvas = ref<HTMLCanvasElement>();
provide(CanvasStateKey,{
  canvas,
  getCanvasPosition(){
    if(!canvas.value) throw Error(`Canvas is ${canvas.value}`);
    const canvasHtmlRect = canvas.value.getBoundingClientRect();
    return new Position({ x:canvasHtmlRect.x, y:canvasHtmlRect.y });
  }
});
const nodesCanvas = ref<HTMLDivElement>();
const props = withDefaults(defineProps<{
  driver?:GraphDriver,
}>(),{
  driver: ()=>new GraphDriver(),
});
watch(()=>props.driver, setDriver);
onMounted(attachCanvas);
onUnmounted(()=>props.driver.detach());
function setDriver(driver:GraphDriver, oldDriver?:GraphDriver){
  oldDriver?.detach();
  attachCanvas();
}
function attachCanvas(){
  if(!canvas.value) throw new Error("Can not find canvas ref");
  props.driver.attach(canvas.value);
}
</script>
<style lang="scss" scoped>
.gcanvas{
  position: relative;
  height: 100vh;
  &>canvas{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1000;
    pointer-events: none;
  }
  .nodes-canvas{
    overflow: auto;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>./GraphDrawer./types/CanvasStateKey./types/GNodeTypes./types/GraphDrawer