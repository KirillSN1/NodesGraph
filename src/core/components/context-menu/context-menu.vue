<template>
    <div ref="el">
        <Teleport to="body">
            <div ref="popup" 
                class="context-menu" 
                :class="{ opened }" 
                :style="{top:top+'px', left:left+'px'}"
                @contextmenu.prevent>
                <div class="title" v-if="innerTitle">{{innerTitle}}</div>
                <div ref="controlsParent" class="context-actions">
                    <div class="button" v-for="{id, action},index in groupActions" :key="id"
                            @mouseenter="focus(index);"
                            @click.stop.left="onClickAction(action,$event)">
                        <button @focus="onFocus(index)">
                            <div class="content">
                                {{ action.title }}
                                <span v-if="action.group" class="arrow"></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, nextTick, onMounted, onBeforeUnmount, computed } from "vue";
import ContextAction from './ContextAction';
import { mouseOutside } from '../../helpers/MouseOutside';
import useMousePosition from "../mouse-scope/useMousePosition";
import { attributePrefix, elementProperty } from "./constants";
import { useTabNavigation } from "../TabNavigator/TabNavigation";
//Props
const props = withDefaults(defineProps<{
    title:string,
    shortcuts:string[],
    actions:ContextAction[],
    debug:boolean
}>(),{
    title:"Контекстное меню",
    debug:false,
    shortcuts:()=>[],
});
//Emits
const emit = defineEmits<{
    'shortcut':[shortcut:string,e:KeyboardEvent],
    'opened':[{originalEvent:MouseEvent|KeyboardEvent,target:EventTarget, data:any }]
}>();
//Elements Refs
const el = ref<Element>();
const popup = ref<Element>();
const { 
    controlsParent,
    focus, 
    handleArrows, 
    blur, 
    onFocus
} = useTabNavigation();
//UI Logic
const opened = ref(false);
const top = ref(0);
const left = ref(0);
const group = ref('default');
const innerTitle = ref(props.title);
const indexedActions = computed(()=>props.actions.map((action,index)=>({ id:index, action })));
const groupActions = computed(()=>{
    return indexedActions.value.filter(({ action })=>action.title != undefined && group.value == action.parentGroup)
});
const context:{ target:EventTarget | null, data:unknown } = { target:null, data:undefined }//контекст(элемент и данные, привязанные к нему)
onBeforeMount(()=>{
    document.addEventListener("mousewheel",close);
    document.addEventListener('click',onDocumentClick);
});
onMounted(()=>{
    el.value?.parentElement?.addEventListener("contextmenu",onContextmenu);
    if(!props.debug) window.addEventListener("blur",close);
    window.addEventListener('keydown',onKeydown)
})
onBeforeUnmount(()=>{
    el.value?.parentElement?.removeEventListener("contextmenu",onContextmenu);
    window.removeEventListener("blur",close);
    window.removeEventListener('keydown',onKeydown)
    document.removeEventListener('click',onDocumentClick);
})
const { x:mouseX, y:mouseY } = useMousePosition();
function onDocumentClick(e:MouseEvent){
    if(!popup.value) return;
    if(mouseOutside(popup.value,e)) close();

}
function onClickAction(action:ContextAction, e:MouseEvent){
    action.handler({ originalEvent:e, data:context.data, target:context.target ?? e.target });
    close();
    if(action.group) {
        reopen(action.title,action.group);
        nextTick(()=>focus(0))
    }
}

//dont works
function onKeydown(e:Event){
    if(!(e instanceof KeyboardEvent)) return;
    if(opened.value){
        if(!handleArrows(e))
            if(e.key == "Escape") close()
            else return;
        e.preventDefault();
    }
    handleShortcuts(e);
}
function handleShortcuts(e:KeyboardEvent){
    const checkShortcut = (shortcut:string)=>{
        const keys = shortcut.toLowerCase().split("+").map(s=>s.trim());
        if(keys.includes("ctrl") && !e.ctrlKey) return false;
        if(keys.includes("alt") && !e.altKey) return false;
        if((keys.includes("Meta") || keys.includes("Win") || keys.includes("Cmd")) && !e.metaKey) return false;
        if((keys.includes("shift") || keys.includes("lshift") || keys.includes("rshift")) && !e.shiftKey) return false;
        if(!keys.includes(e.key)) return false;
        return true;
    }
    for(const shortcut of props.shortcuts){
        if(checkShortcut(shortcut)) {
            open(e);
            return;
        }
    }
}
function onContextmenu(e:Event){
    if(e instanceof PointerEvent) open(e);
}
/**
 * Finds attribute up the DOM tree
 */
function findGroupAttribute<N extends string,F extends readonly string[]>(element:HTMLElement, attributeName:N, ...fields:[...F]){
    type KeysFromArray<T extends readonly string[]> = { [Key in T[number] | N]?: string; };
    const attrNames = element.getAttributeNames();
    const hasGroupAttribute = attrNames.find(name=>
        name == attributeName || 
        (name.includes(attributeName+":") && fields.includes(name.split(":")[1]))//name like "name:field"
    ) !== undefined
    if(hasGroupAttribute) {
        console.log("has")
        const result:KeysFromArray<F> = { [attributeName]:element.getAttribute(attributeName) } as KeysFromArray<F>;
        if(!fields.length) return { element, data:result };
        fields.forEach((i)=>result[i] = element.getAttribute(`${attributeName}:${i}`) ?? undefined);
        console.log(result);
        return { element, data:result };
    }
    if(element.parentElement) return findGroupAttribute(element.parentElement as HTMLElement,attributeName, ...fields)
    return { element:undefined, data:{} as KeysFromArray<F> };
}
function open(e:KeyboardEvent | PointerEvent){
    const space = (e.currentTarget as HTMLElement | Window);
    const spaceSize = {
        width:space instanceof HTMLElement?space.clientWidth:space.innerWidth,
        height:space instanceof HTMLElement?space.clientHeight:space.innerHeight
    }
    const popupRect = popup.value?.getBoundingClientRect();
    const maxX = spaceSize.width-(popupRect?.width??0);
    const maxY = spaceSize.height-(popupRect?.height??0);
    const { element, attributesData, data } = updateContext(e.target as HTMLElement);
    if(attributesData.ctxmenu == "system") return;
    e.preventDefault();
    const position = e instanceof PointerEvent?{ x:e.x, y:e.y }:{ x:mouseX.value,y:mouseY.value }
    openAt([Math.min(position.x,maxX),Math.min(position.y,maxY)], attributesData.group ?? attributesData.ctxmenu, attributesData.title);
    emit("opened",{ originalEvent:e, target:element as EventTarget ?? e.target, data });
}
function updateContext(el:HTMLElement){
    const { element, data:attributesData } = findGroupAttribute(el as HTMLElement,attributePrefix,"title","group", "data");
    context.data = attributesData.data;
    if(element && elementProperty in element) 
        context.data = element[elementProperty];
    context.target = element ?? null;
    return { element, attributesData, data:context.data }
}
function openAt(position:[left:number ,top:number],groupName = "default", title?:string){
    opened.value = true;
    top.value = position[1];
    left.value = position[0];
    innerTitle.value = title ?? props.actions.find(a=>a.group == groupName)?.title ?? props.title;
    group.value = groupName;
}
function close(){
    opened.value = false;
    innerTitle.value = props.title;
    group.value = "default";
    blur()
}
function reopen(title = innerTitle.value, groupName = group.value){
    innerTitle.value = title;
    openAt([left.value,top.value], groupName);
}
defineExpose({
    openAt: openAt,
    close,
    reopen
})
</script>

<style lang="scss">
@import '../../../assets/styles/theme/float-panel.scss';
.context-menu{
    @extend .float-panel;
    &:not(.opened){
        visibility: hidden;
        pointer-events: none;
        user-select: none;
    }
    position: fixed;
    z-index: 99999999;
    &>.title{
        padding: 5px;
        text-align: center;
        user-select: none;
        color: white;
    }
    .button{
        padding: 5px;
    }
}
</style>