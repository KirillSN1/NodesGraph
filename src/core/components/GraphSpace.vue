<template>
    <div ref="el" class="graph-space">
        <GCanvas :driver="driver"></GCanvas>
        <ContextMenu ref="ctxMenu"
            :shortcuts="['ctrl+a']"
            :actions="[
                ContextAction.group('global:add','Добавить').withParentGroup('default'),
                    new ContextAction('Фразу',()=>add(new PhrazeNode()),'global:add'),
                    new ContextAction('Текст',()=>add(new TextNode()),'global:add'),
                    new ContextAction('Тест',()=>add(new TextNode()),'global:add'),
                    new ContextAction('Input',()=>add(new OutputNode({ properties:[new TestOutputProperty('text')] })),'global:add'),
                    new ContextAction('Output',()=>add(new OutputNode({ properties:[new TestInputProperty('text')] })),'global:add'),
                ContextAction.group('node'),
                    new ContextAction<GraphNode>('Удалить',e=>e.data.delete(),'node')
            ]">
        </ContextMenu>
    </div>
</template>
<script setup lang="ts">
import GraphNode from "../node/gnode/GraphNode"
import { makeReactive } from "../GraphComposables"
import { TextNode } from "../nodes/TextNode"
import GCanvas from "../canvas/GCanvas.vue";
import GraphDriver from "../canvas/types/GraphDriver";
import PhrazeNode from "../nodes/PhrazeNode";
import ContextMenu from './context-menu/context-menu.vue'
import { reactive, ref } from "vue";
import ContextAction from "./context-menu/ContextAction";
import Vector2 from "../vector/Vector2";
import OutputNode from "../nodes/OutputNode";
import TestOutputProperty from "./properies/test-property/TestOutputProperty";
import TestInputProperty from "./properies/test-property/TestInputProperty";
import useMousePosition from "./mouse-scope/useMousePosition";

const ctxMenu = ref<InstanceType<typeof ContextMenu>>();
const el = ref<Element>();

const defaultNodes:GraphNode[] = [
    new TextNode("Ojoaijfij","Пусто")
];
const driver = makeReactive(new GraphDriver(defaultNodes));
const { x:mouseX, y:mouseY } = useMousePosition();
function add(node:GraphNode){
    const rect = el.value?.getBoundingClientRect();
    const localOffset = new Vector2({ x:rect?.x,y:rect?.y });
    const offset = new Vector2({ x:-10, y:-10 });
    const position = new Vector2({ x:mouseX.value, y:mouseY.value }).add(localOffset.negative()).add(offset);
    node.transform.position = position;
    driver.add(reactive(node) as GraphNode);
    node.select();
}
</script>
<style>
.graph-space{
    height: 100%;
}
</style>