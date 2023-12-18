<template>
    <div style="border-bottom: 1px solid;">
        <button @click="add">Add</button>
    </div>
    <GCanvas :driver="driver"></GCanvas>
</template>
<script setup lang="ts">
import GraphNode from "../core/node/gnode/GraphNode"
import { makeReactive } from "../core/GraphComposables"
import { TextNode } from "./nodes/TextNode"
import { TestNode } from "./nodes/DefaultNode";
import TestInputProperty from "./node_properties/test-property/TestInputProperty"
import TestOutputProperty from "./node_properties/test-property/TestOutputProperty"
import GCanvas from "../core/canvas/GCanvas.vue";
import GraphDriver from "../core/canvas/types/CanvasDriver";
const nodes:GraphNode[] = [
    new TextNode("Ojoaijfij","Пусто"),
    new TestNode({ properties:[new TestOutputProperty()] }),
    new TestNode({ properties:[new TestInputProperty()] }),
];
const driver:GraphDriver = makeReactive(new GraphDriver(nodes));
function add(){
    nodes.push(new TestNode({ properties:[new TestOutputProperty()] }));
}
</script>../core/GraphComposables