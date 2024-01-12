<template>
    <Teleport to="body">
        <div class="modal" :show="value">
            <div class="content">
                <slot :close="()=>toggle(false)"></slot>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    enabled:boolean,
    escape:boolean
}>(),{
  enabled:false,
  escape:true
});
const emit = defineEmits<{
    escape:[e:KeyboardEvent]
    close:[]
}>()
const value = ref(props.enabled);
watch(value,()=>emit('close'))
function toggle(enabled = !value.value){
    value.value = enabled;
}
onMounted(()=>{
    window.addEventListener("keydown",onKeydown);
});
onBeforeUnmount(()=>{
    window.removeEventListener("keydown",onKeydown);
});
function onKeydown(e:Event){
    if(!(e instanceof KeyboardEvent)) return;
    if(isOpened() && e.key == "Escape") {
        if(props.escape) value.value = false;
        emit("escape",e);
    }
}
function isOpened(){
    return value.value;
}
defineExpose({
    toggle,
    isOpened
});
</script>
<style scoped lang="scss">
@import '../../../theme/float-panel.scss';
.modal{
    &>.content{
        @extend .float-panel;
    }
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: #80808073;
    // background: ;
    // background: ;
    opacity: 0;
    pointer-events: none;
    &,.content{
        transition: 0.15s ease-in-out;
    }
    .content{
        transform: translateY(15px);
    }
    &:not([show=false]){
        &[show=true],[show]{
            opacity: 1;
            pointer-events: revert;
            .content{
                transform: none;
            }
        }
    }
}
</style>