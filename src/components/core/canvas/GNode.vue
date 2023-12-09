<template>
	<div ref="elRef" class="gnode" :class="{grabbing}" :style="styles"
		@mousedown="onMousedown">
		<div class="gnode-title">{{ node.title }}</div>
		<div class="gnode-properties">
			<div :class="PROPERTY_CLASS" v-for="prop, index in node.properties" :key="index">
				<component v-for="prop, index in node.properties" :key="index" 
					:is="prop.component" 
					:property="prop">
					<template #socket="{ socket }">
						<div ref="sockets" class="socket" :style="{ '--socket-color':socket.color }"></div>
						<!-- компонент сокета + (добавлять z-index на клик) -->
					</template>
				</component>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { Ref, computed, inject, onMounted, onUnmounted, ref } from 'vue';
import GraphNode from '../node/gnode/GraphNode';
import Position from '../transform/Position';
import Vector2 from '../vector/Vector2';
import Transform from '../transform/Transform';
import Rect from '../transform/Rect';
import { GNodeTransformChange, SocketTransformChange } from './GNodeTypes';
import { PropertyWithSocket } from '../node/gnode/GraphProperty';
import { cleanMap } from '../Array';

const PROPERTY_CLASS = "gnode-property";
const elRef = ref<Element>();
const el = ()=>{
	if(!elRef.value) throw new Error("Can not find el");
	return elRef.value;
}
const sockets = ref<Element[]>([]);
const canvas = inject("canvas") as Ref<HTMLCanvasElement>;
if(!canvas) throw Error("Canvas is not provied!");
const props = defineProps<{
	node:GraphNode
	transform?:Transform
}>();
const styles = computed(()=>{
	const transform = props.node.transform;
	return {
		top:transform.position.y+'px',
		left:transform.position.x+'px',
	}
});
const emit = defineEmits<{
	move:[GNodeTransformChange],
	resize:[GNodeTransformChange],
}>();
let resizeObserver:ResizeObserver;
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
let lastPosition:Position | null;
let mousedownPosition:Vector2 | null;
const grabbing = computed(()=>Boolean(lastPosition  && mousedownPosition))
function watchRect(element:Element){
	const observer = new ResizeObserver(([entry])=>{
		const newRect = new Rect({ width:entry.contentRect.width, height:entry.contentRect.height })
		emit("resize", getTransformChangeOf({ rect:newRect }));
	});
	observer.observe(element,{ box:"border-box" });
	return observer;
}
function onMousedown(event:MouseEvent){
	if((event.composedPath().findIndex((el)=>(el as Element).classList?.contains(PROPERTY_CLASS))>=0)) return;
	lastPosition = props.node.transform.position.copyWith();
	mousedownPosition = new Vector2({ x:event.clientX, y:event.clientY });
}
function onMousemove(event:MouseEvent){
	if(!lastPosition || !mousedownPosition) return;
	const cursorPosition = new Vector2({ x:event.clientX, y:event.clientY });
	const newPosition = lastPosition.add(cursorPosition, mousedownPosition.negative());
	emit("move", getTransformChangeOf({ position:newPosition }));
}
function onMouseup(event:MouseEvent){
	onMousemove(event);
	lastPosition = null;
	mousedownPosition = null;
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
		socketTransforms: getActualSocketTransformsWith({
			position:data?.position,
			rect:data?.rect
		})
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
	const canvasPosition = getCanvasPosition();
	const actualTransform = getActualNodeTransformWith(data);
	return cleanMap(sockets.value,(element,index)=>{
		const property = props.node.properties[index];
		if(!(property instanceof PropertyWithSocket)) return undefined;
		const socketHtmlRect = element.getBoundingClientRect();
		const position = new Position({	x:socketHtmlRect.x,	y:socketHtmlRect.y });
		const rect = new Rect({	width:socketHtmlRect.width,	height:socketHtmlRect.height });
		return new SocketTransformChange(property,{
			transform:new Transform({
				position:position.add(canvasPosition.negative()),
				rect:data?.rect == undefined?rect:rect.add(actualTransform.rect,data.rect.negative())
			})
		});
	});
}
function getCanvasPosition(){
	const canvasHtmlRect = canvas.value.getBoundingClientRect();
	return new Position({ x:canvasHtmlRect.x, y:canvasHtmlRect.y });
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
			.socket{
				position: absolute;
				top: 50%;
				left: 0%;
				transform: translate(-50%,-50%);
				background: var(--socket-color);
			}
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
	.socket{
		width: 5px;
		height: 5px;
		border-radius: 5px;
		background: #00000057;
		box-shadow: 0px 0px 2px 0px black;
	}
}
</style>