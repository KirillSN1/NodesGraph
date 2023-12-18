import { markRaw } from "vue";
import { OutputSocket, OutputSocketStyle } from "@/components/core/node/gnode/GraphSocket";
import TestOutputPropertyVue from "./TestOutputProperty.vue";
import { OutputProperty } from "@/components/core/node/gnode/PropertyWithSocket";

export class DefaultOutputSocketStyle extends OutputSocketStyle{
    readonly color = "blue";
}
export class DefaultOutputSocket extends OutputSocket{
    readonly style: DefaultOutputSocketStyle = new DefaultOutputSocketStyle();
}
export default class TestOutputProperty extends OutputProperty<string>{
    calculate() { return this.text }
    public socket: DefaultOutputSocket = new DefaultOutputSocket();
    readonly component = markRaw(TestOutputPropertyVue);
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super();
        this.text = text;
        this.placeholder = placeholder
    }
    setText(text = ""):void{
        this.text=text; 
    }
}