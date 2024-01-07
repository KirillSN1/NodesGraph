<template>
	<div ref="elRef" class="gnode" :class="{grabbing}" :style="styles"
		v-ctxmenu:group="'node'"
		v-ctxmenu:title="node.title"
		v-ctxmenu:data="node"
		@mousedown.left="onMousedown">
		<div class="gnode-title">{{ node.title }}</div>
		<div class="gnode-properties">
			<div :class="PROPERTY_CLASS" v-for="prop, index in node.properties" :key="index">
				<component :is="prop.component" :property="prop">
					<template #socket="{ socket }">
						<GSocket v-if="prop instanceof PropertyWithSocket && socket"
							ref="sockets" 
							:socket="socket" 
							@start-link="emit('start-link',prop, $event)"
							@move-link="emit('move-link',prop, $event)"
							@end-link="emit('end-link',prop)"
							@link="emit('link', prop)">
						</GSocket>
						<!-- компонент сокета + (добавлять z-index на клик) -->
					</template>
				</component>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import GraphNode from '../node/gnode/GraphNode';
import Position from '../transform/Position';
import Transform from '../transform/Transform';
import Rect from '../transform/Rect';
import { GNodeTransformChange, GRefCreate, GRefChange, SocketTransformChangeEvent } from './types/GNodeTypes';
import GraphProperty from '../node/gnode/GraphProperty';
import { cleanMap } from '../Array';
import GSocket from "./GSocket.vue";
import { useGrabbing } from '../GraphComposables';
import CanvasStateKey from './types/CanvasStateKey';
import { PropertyWithSocket } from '../node/gnode/PropertyWithSocket';
import vCtxmenu from '../components/context-menu/ctxmenu-directive';

//constants
const PROPERTY_CLASS = "gnode-property";
//Element Refs
const elRef = ref<Element>();
const el = ()=>{
	if(!elRef.value) throw new Error("Can not find el");
	return elRef.value;
}
const sockets = ref<InstanceType<typeof GSocket>[]>([]);
//Directives
//Canvas state
const canvasState = inject(CanvasStateKey);
const getCanvasState = ()=>{
	if(!canvasState) throw new Error("canvasState is not provided!");
	return canvasState;
}
//Props
const props = defineProps<{
	node:GraphNode
	transform?:Transform
}>();
watch(()=>props.node,console.log);
const styles = computed(()=>{
	const transform = props.node.transform;
	return {
		top:transform.position.y+'px',
		left:transform.position.x+'px',
	}
});
//Emits
const emit = defineEmits<{
	move:[GNodeTransformChange],
	resize:[GNodeTransformChange],
	'start-link':[GraphProperty, GRefCreate],
	'move-link':[GraphProperty, GRefChange],
	'end-link':[GraphProperty]
	'link':[GraphProperty]
}>();
let resizeObserver:ResizeObserver;
const { onMousedown, onMousemove, onMouseup, grabbing } = useGrabbing({
	elementPosition:()=>props.node.transform.position,
	ignoreChildCallback:el=>(el as Element).classList?.contains(PROPERTY_CLASS),
	onMousemove({newPosition}){ emit("move", getTransformChangeOf({ position:newPosition })); }
});
onMounted(()=>{
	resizeObserver = watchRect(el());
	window.addEventListener("mousemove",onMousemove);
	window.addEventListener("mouseup",onMouseup);
});
onUnmounted(()=>{
	resizeObserver.disconnect();
	window.removeEventListener("mousemove",onMousemove);
	window.removeEventListener("mouseup",onMouseup);
});
function watchRect(element:Element){
	const observer = new ResizeObserver(([entry])=>{
		const newRect = new Rect({ width:entry.contentRect.width, height:entry.contentRect.height })
		emit("resize", getTransformChangeOf({ rect:newRect }));
	});
	observer.observe(element,{ box:"border-box" });
	return observer;
}
function getTransformChangeOf(data?:{
	rect?:Rect,
	position?:Position
}){
	return new GNodeTransformChange(props.node,{
		transform: getActualNodeTransformWith({
			position:data?.position,
			rect:data?.rect
		}),
		socketTransforms: mapToSocketTransformChange(getActualSocketTransformsWith({
			position:data?.position,
			rect:data?.rect
		}))
	})
}
function mapToSocketTransformChange(transforms:Transform[]){
	return cleanMap(transforms,(transform, index)=>{
		const property = props.node.properties[index];
		if(!(property instanceof PropertyWithSocket)) return undefined;
		return new SocketTransformChangeEvent(property,{ transform });
	})
}
function getActualNodeTransformWith(data?:{
	rect?:Rect,
	position?:Position
}){
	const htmlRect = el().getBoundingClientRect();
	return new Transform({
		rect:data?.rect ?? new Rect({
			width:htmlRect.width,
			height:htmlRect.height
		}),
		position:data?.position ?? new Position({
			x:htmlRect.x,
			y:htmlRect.y
		})
	});
}
function getActualSocketTransformsWith(data?:{
	rect?:Rect,
	position?:Position
}){
	const canvasPosition = getCanvasState().getCanvasPosition();
	const actualTransform = getActualNodeTransformWith(data);
	return sockets.value.map((socketComponent)=>{
		return getActualSocketTransformWith(socketComponent,{
			actualNodeTransform:actualTransform,
			canvasPosition,
			position:data?.position,
			rect:data?.rect
		})
	});
}
function getActualSocketTransformWith(socket:InstanceType<typeof GSocket>,data?:{
	canvasPosition?:Position,
	actualNodeTransform?:Transform
	rect?:Rect,
	position?:Position
}){
	const canvasPosition = data?.canvasPosition ?? getCanvasState().getCanvasPosition();
	const actualNodeTransform = data?.actualNodeTransform ?? getActualNodeTransformWith(data);
	const socketHtmlRect = socket.getRect();
	const position = new Position({	x:socketHtmlRect.x,	y:socketHtmlRect.y });
	const rect = new Rect({	width:socketHtmlRect.width,	height:socketHtmlRect.height });
	return new Transform({
		position:position.add(canvasPosition.negative()),
		rect:data?.rect == undefined?rect:rect.add(actualNodeTransform.rect,data.rect.negative())
	})
}
</script>
<style scoped lang="scss">
.gnode{
	border-radius: 10px;
	
	position: absolute;
	box-shadow: -1px 1px 2px 0px #0000007e;
	transition: box-shadow 0.15s ease-out;
	--gnode-background: gray;
	// --gnode-border: 1px solid ;
	background: var(--gnode-background);
	cursor: grab;
	&>*:first-child{
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}
	&>*:last-child{
		border-bottom-left-radius: inherit;
		border-bottom-right-radius: inherit;
	}
	&>.gnode-title{
		background: #4b4b4b;
		color: white;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		border: 2px solid var(--gnode-background);
		text-align: center;
	}
	&>.gnode-properties{
		&>*:last-child{
			border-bottom-left-radius: inherit;
			border-bottom-right-radius: inherit;
		}
		&>.gnode-property{
			position: relative;
			cursor: default;
			background: #4b4b4b;
			padding: 4px;
			color: white;
		}
	}
	&:not(.grabbing){
		.gnode-property{ cursor: default; }
	}
	&:active{
		cursor: grabbing;
		box-shadow: -1px 1px 4px 1px #00000068;
	}
	&:not(:focus){
		user-select: none;
	}
}
</style>./types/CanvasStateKey./types/GNodeTypes