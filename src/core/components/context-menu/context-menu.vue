<template>
    <div ref="el">
        <Teleport to="body">
            <div ref="popup" 
                class="context-menu" 
                :class="{ opened }" 
                :style="{top:top+'px', left:left+'px'}"
                @contextmenu.prevent>
                <div class="title" v-if="innerTitle">{{innerTitle}}</div>
                <div ref="buttonsParent" class="context-actions">
                    <button v-for="{id, action},index in groupActions" :key="id"
                        @mouseenter="focusAction(index);"
                        @focus="onFocus(index)"
                        @click.stop.left="onClickAction(action,$event)">
                        <div class="content">
                            {{ action.title }}
                            <span v-if="action.group" class="arrow"></span>
                        </div>
                    </button>
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
const buttonsParent = ref<HTMLDivElement>();
const getButtonsParent = ()=>{
    if(!buttonsParent.value) throw new Error("Can not get buttons");
    return buttonsParent.value;
}
const buttonsArray = ()=>{
    const buttons = getButtonsParent();
    return [...buttons.children] as HTMLButtonElement[];
}
const getButton = (index:number)=>{
    const buttons = getButtonsParent();
    return buttons.children.item(index);
}
//UI Logic
var focusedIndex = -1;
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
        nextTick(()=>focusAction(0))
    }
}

//dont works
function onKeydown(e:Event){
    if(!(e instanceof KeyboardEvent)) return;
    if(opened.value){
        if(["ArrowDown","ArrowRight"].includes(e.key)) focusNext()
        else if(["ArrowUp","ArrowLeft"].includes(e.key)) focusPrev()
        else if(e.key == "Escape") close()
        else return;
        e.preventDefault();
    }
    handleShortcuts(e);
}
function onFocus(index:number){
    focusedIndex = index;
}
function focusPrev(){
    const buttons = buttonsArray();
    const prevButton = buttons[focusedIndex-1];
    if(!prevButton) return buttons[buttons.length-1]?.focus();
    return prevButton.focus();
}
function focusNext(){
    const buttons = buttonsArray();
    const nextButton = buttons[focusedIndex+1];
    if(!nextButton) return buttons[0]?.focus();
    return nextButton.focus();
}
function focusAction(index:number){
    const buttons = buttonsArray();
    if(!buttons[index]) return buttons[0]?.focus();
    return buttons[index].focus();
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
            // e.preventDefault();
            // emit('shortcut',shortcut, e);
            open(e);
            return;
        }
    }
}
function onContextmenu(e:Event){
    // const space = (e.currentTarget as HTMLElement);
    // const popupRect = popup.value?.getBoundingClientRect();
    // const maxX = space.clientWidth-(popupRect?.width??0);
    // const maxY = space.clientHeight-(popupRect?.height??0);
    // if(e instanceof PointerEvent){
    //     // const fields = ["title","group"];
    //     const ctxMenuData = findGroupAttribute(e.target as HTMLElement,"ctxmenu","title","group");
    //     if(ctxMenuData.ctxmenu == "system") return;
    //     e.preventDefault();
    //     openAt([Math.min(e.x,maxX),Math.min(e.y,maxY)], ctxMenuData.group ?? ctxMenuData.ctxmenu,ctxMenuData.title);
    // }
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
    // const { element, data } = findGroupAttribute(e.target as HTMLElement,attributePrefix,"title","group", "data");
    // context.data = data.data;
    // if(element && elementProperty in element) 
    //     context.data = element[elementProperty];
    // context.target = element ?? null;
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
    focusedIndex = -1;
}
function reopen(title = innerTitle.value, groupName = group.value){
    innerTitle.value = title;
    openAt([left.value,top.value], groupName);
}
defineExpose({
    openAt: openAt,
    close,
    reopen,
    getHTMLButton:getButton,
    getHTMLButtons:buttonsArray
})
</script>

<style lang="scss">
.context-menu{
    &:not(.opened){
        visibility: hidden;
        pointer-events: none;
        user-select: none;
    }
    border-radius: 8px;
    background: rgb(0 0 0 / 46%);
    position: fixed;
    z-index: 99999999;
    border: 1px solid #3b3b3b8c;
    backdrop-filter: blur(3px);
    box-shadow: 1px 1px 9px -2px black;
    &>.title{
        padding: 5px;
        text-align: center;
        user-select: none;
    }
    &>.context-actions{
        padding: 5px;
    }
    .context-actions>div{
        display: flex;
        align-items: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding: 3px 8px;
        color: darkslategray;
        &:hover{
            background: #90BFE4;
        }
    }
    button{
        // padding: 0px 5px;
        user-select: none;
        padding: 2px 0px;
        &:first-child{ padding-top: 0; }
        &:last-child{ padding-bottom: 0; }
        &>.content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 6px;
            border-radius: 4px;
        }
        .arrow{
            width: 5px;
            height: 5px;
            border: 2px solid;
            border-left: none;
            border-bottom: none;
            transform: rotate(45deg);
        }
        &:focus{
            .content{
                background: #269fff;
            }
        }
        outline: none;
        width: 100%;
        // background: #0000006e;
        // border: 1px solid #00000080;
        // border-radius: 4px;
        background: transparent;
        border: none;
        color: white;
        &:not(:disabled){ cursor: pointer; }
    }
}
</style>