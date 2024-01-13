<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="text-property">
        <span :title="property.title">{{ property.title }}</span>
        <ModalDialog 
            ref="dialog" 
            :escape="false" 
            @escape="onModalEscape" 
            @close="onModalClose"
            :style="`z-index:${(property.node?.maxZIndex??0)+1}`"
            >
            <div class="text-property-dialog">
                <div class="title" text-stroke>{{ property.title }}</div>
                <textarea style="width: 600px; height: 350px;" ref="textarea"
                    ctxmenu="system"
                    v-model="newValue">
                </textarea>
            </div>
            <TabNavigator style="display: flex;" #default="{ buttonAttrs }">
                <button v-bind="buttonAttrs(0)" @click="modalApply">Применить</button>
                <button v-bind="buttonAttrs(1)" @click="modalCancel">Отмена</button>
            </TabNavigator>
        </ModalDialog>
        <div ref="text" class="text"
            ctxmenu="system"
            :title="property.text">
            <span v-if="property.text" >{{ property.text }}</span>
            <span class="placeholder" v-else-if="property.placeholder">{{ property.placeholder }}</span>
        </div>
        <EditButton @click="openModal"/>
        <slot name="socket" :socket="property.socket"></slot>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import TextProperty from './TextProperty';
import ModalDialog from '../../ui/modal-dialog.vue';
import TabNavigator from '../../TabNavigator/TabNavigator.vue';
import EditButton from '../../ui/EditButton.vue';
// import AutosizeInput from '../../ui/AutosizeInput.vue';
const props = defineProps<{
    property:TextProperty
}>();
const newValue = ref(props.property.text);
const editing = ref(false);
const dialog = ref<InstanceType<typeof ModalDialog>>();
const textarea = ref<HTMLTextAreaElement>();
function modalApply(){
    props.property.setText(newValue.value);
    dialog.value?.toggle(false);
}
function modalCancel(){
    dialog.value?.toggle(false);
}
function openModal(){
    dialog.value?.toggle(true);
    nextTick(()=>{
        textarea.value?.focus({ preventScroll:true });
    })
}
function onModalEscape(){
    if(props.property.text == newValue.value || confirm("Отменить изменения?"))
    dialog.value?.toggle(false);
}
function onModalClose(){
    newValue.value = props.property.text;
}
</script>
<style lang="scss">
.text-property{
    &.selected{
        box-shadow: 0px 0px 0px 2px green;
    }
    display: flex;
    gap: 5px;
    &>.title{
        color: white;
    }
    &>.text{
        background-color: #414141;
        color: white;
        cursor: text;
        user-select: text;
        border: 1px solid transparent;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        max-width: 150px;
        &>.placeholder{
            filter: contrast(0.1);
        }
    }
}
.text-property-dialog{
    padding: 10px;
    .title{
        color: white;
        padding-bottom: 10px;
        font-size: larger;
    }
}
</style> 