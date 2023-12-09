<template>
    <div style="border-bottom: 1px solid;">
        <button @click="add">Add</button>
    </div>
    <VGraph :nodes="nodes"/>
</template>
<script setup lang="ts">
import VGraph from "../core/VGraph.vue"
import GraphNode from "../core/node/gnode/GraphNode"
import Transform from "../core/transform/Transform"
import Position from "../core/transform/Position"
import Rect from "../core/transform/Rect"
import { reactive } from "vue"
import TextProperty from "./node_properties/text-property/TextProperty"
// const reactiveCollection = <T extends object>(collection:T)=>reactive(collection) as T;
const nodes:GraphNode[] = reactive([
    new GraphNode("d",{
        transform:new Transform({
            position:new Position({ x:50, y:100 }),
            rect:new Rect({ width:10, height:10 })
        }),
        properties:[
            // new TextProperty()
        ]
    })
]);
const first = nodes[0];
const second =  nodes[1];
// first.properties[0].linkTo(second.properties[0]);
function add(){
    nodes.push(new GraphNode("f",{
        transform:new Transform({
            position:new Position({ x:0, y:0 }),
            rect:new Rect({ width:10, height:10 })
        }),
        properties:[
            new TextProperty()
        ]
    }));
}
</script>