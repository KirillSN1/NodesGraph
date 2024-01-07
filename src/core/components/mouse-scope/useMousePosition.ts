import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useMousePosition() {
  const x = ref(0);
  const y = ref(0);
  function update(event:Event) {
    if(event instanceof MouseEvent){
        x.value = event.pageX
        y.value = event.pageY
    }
  }
  onMounted(() => window.addEventListener('mousemove', update))
  onBeforeUnmount(() => window.removeEventListener('mousemove', update))
  return { x, y }
}