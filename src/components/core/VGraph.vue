<template>
  <div class="graph">
    <g-canvas :nodes="nodes" 
      @node-move="onNodeMove" 
      @node-resize="onNodeResize">
    </g-canvas>
  </div>
</template>

<script setup lang="ts">
import GCanvas from '@/components/core/canvas/GCanvas.vue';
import GraphNode from './node/gnode/GraphNode';
import { GNodeTransformChange } from './canvas/GNodeTypes';
defineProps<{
  nodes:GraphNode[]
}>();
function onNodeMove(event:GNodeTransformChange){
  event.node.transform.position = event.transform.position;
  event.socketTransforms.forEach((change)=>{
    change.property.socket.transform = change.transform;
  });
}
function onNodeResize(event:GNodeTransformChange){
  event.node.transform.rect = event.transform.rect;
  event.socketTransforms.forEach((change)=>{
    change.property.socket.transform = change.transform;
  });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>