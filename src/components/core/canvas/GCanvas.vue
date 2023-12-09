<template>
  <div class="gcanvas">
    <canvas ref="canvas"></canvas>
    <div ref="nodesCanvas" class="nodes-canvas">
      <GNode v-for="node, index in nodes" :node="node" :canvas="canvas" :key="index"
        @move="emit('node-move',$event)"
        @resize="emit('node-resize',$event)">
        <!-- <template #property="{ component, property }">
          <component :is="component" :property="property">
            <template #socket>
              <div class="socket"></div>
            </template>
          </component>
        </template> -->
      </GNode>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { GraphDrawer } from './GraphDrawer';
import GraphNode from '../node/gnode/GraphNode';
import GNode from './GNode.vue';
import { GNodeTransformChange } from './GNodeTypes';

const emit = defineEmits<{
	'node-move':[GNodeTransformChange],
	'node-resize':[GNodeTransformChange]
}>();

const canvas = ref<HTMLCanvasElement>();
provide("canvas",canvas);
const nodesCanvas = ref<HTMLDivElement>();
const props = defineProps<{ nodes:GraphNode[] }>();
const drawer = new GraphDrawer();
onMounted(()=>{
  if(!canvas.value) throw new Error("Can not find canvas ref");
  drawer.attach(canvas.value);
  drawer.onRedraw = ()=>{
    props.nodes.forEach((node)=>drawer.drawTreeLinks(node));
  }
});
onUnmounted(()=>{
  drawer.onRedraw = undefined;
  drawer.detach();
})
watch(()=>props.nodes,()=>drawer.redraw(),{ deep:true });
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
</style>./GraphDrawer