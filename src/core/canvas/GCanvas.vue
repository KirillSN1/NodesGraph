<template>
  <VScrim @move="driver.onScrimMove">
    <div class="gcanvas">
      <canvas ref="canvas"></canvas>
      <div ref="nodesCanvas" class="nodes-canvas">
        <GNode v-for="node, index in driver.nodes" :node="node" :key="index"
          v-on="getEventsHandlers(node)"
          @move="driver.onNodeMove"
          @resize="driver.onNodeResize"
          @start-link="driver.onStartLink"
          @move-link="driver.onMoveLink"
          @end-link="driver.onEndLink"
          @link="driver.onLink"
          @context.prevent="driver.onNodeContextMenu">
        </GNode>
      </div>
    </div>
  </VScrim>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue';
import GNode from './GNode.vue';
import VScrim from './VScrim.vue';
import Position from '../transform/Position';
import CanvasStateKey from './types/CanvasStateKey';
import GraphDriver from './types/GraphDriver';
import GraphNode from '../node/gnode/GraphNode';
import MapObject from '../utils/MapObject'

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
const rd = reactive(props);
// watch(()=>rd.driver,console.log);
// watch(()=>rd.driver,console.log,{deep:true });
const getEventsHandlers = (node:GraphNode)=>
  MapObject(props.driver.nodeEventHandlers, 
    ([key,listener])=>[
      key,
      (ev:Event)=>{ listener(node, ev); }
    ]
  )
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
</style>./GraphDrawer./types/CanvasStateKey./types/GNodeTypes./types/GraphDrawer./types/GraphDriver