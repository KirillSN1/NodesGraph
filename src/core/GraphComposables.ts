import { ComponentPublicInstance, computed, onBeforeUpdate, reactive, ref } from "vue";
import Position from "./transform/Position";
import Vector2 from "./vector/Vector2";
type RefFunctionRef = Element | ComponentPublicInstance | null;
const makeReactive = <T extends object>(data:T)=>reactive(data) as T;
function forRef<T extends RefFunctionRef>(value:T[] = []){
    const itemRefs = ref<T[]>(value);
    onBeforeUpdate(() => {
        itemRefs.value = [];
        console.log("clear",itemRefs);
    });
    return itemRefs;
}
function useGrabbing(data: { 
    elementPosition:((cursorPosition:Position)=>Position), 
    ignoreChildCallback?:(el:EventTarget, index: number, obj: EventTarget[])=>boolean,
    onMousedown?:(data:{ original:MouseEvent, startPosition:Position, mousedownPosition:Position })=>void,
    onMousemove?:(data:{ original:MouseEvent, newPosition:Position })=>void,
    onMouseup?:(data:{ original:MouseEvent })=>void,
}){
    const elementPosition = data.elementPosition ?? ((c:Position)=>c);
    let startPosition:Position | null = null;
    let mousedownPosition:Position | null = null;
    const grabbing = computed(()=>Boolean(startPosition  && mousedownPosition))
    function onMousedown(event:MouseEvent){
        if(data.ignoreChildCallback && (event.composedPath().findIndex(data.ignoreChildCallback)>=0)) return;
        const cursorPosition = new Vector2({ x:event.clientX, y:event.clientY });
        startPosition = elementPosition(cursorPosition).copyWith();
        mousedownPosition = cursorPosition;
        data.onMousedown?.({ original:event, startPosition:startPosition, mousedownPosition:mousedownPosition });
    }
    function onMousemove(event:MouseEvent){
        if(!startPosition || !mousedownPosition) return;
        const cursorPosition = new Vector2({ x:event.clientX, y:event.clientY });
        const newPosition = startPosition.add(cursorPosition, mousedownPosition.negative());
        data.onMousemove?.({ original:event, newPosition });
    }
    function onMouseup(event:MouseEvent){
        onMousemove(event);
        startPosition = null;
        mousedownPosition = null;
        data.onMouseup?.({ original:event })
    }
    return {
        onMousedown,
        onMousemove,
        onMouseup,
        grabbing
    }
}
export {
    makeReactive,
    forRef,
    useGrabbing,
};