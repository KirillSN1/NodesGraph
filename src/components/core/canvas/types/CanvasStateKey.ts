import { InjectionKey, Ref } from "vue";
import Position from "../../transform/Position";

const CanvasStateKey = Symbol() as InjectionKey<{
    canvas:Ref<HTMLCanvasElement | undefined>,
    getCanvasPosition:()=>Position,
    // startLink:()=>
}>
export default CanvasStateKey;