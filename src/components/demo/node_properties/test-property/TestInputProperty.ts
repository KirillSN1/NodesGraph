import { markRaw } from "vue";
import { InputSocket, InputSocketStyle } from "@/components/core/node/gnode/GraphSocket";
import TestInputPropertyVue from "./TestInputProperty.vue";
import { InputProperty } from "@/components/core/node/gnode/PropertyWithSocket";

export class DefaultInputSocketStyle extends InputSocketStyle{
    readonly color = "red";
}
export class DefaultInputSocket extends InputSocket{
    readonly style: DefaultInputSocketStyle = new DefaultInputSocketStyle();
}
export default class TestInputProperty extends InputProperty{
    public socket: DefaultInputSocket = new DefaultInputSocket();
    readonly component = markRaw(TestInputPropertyVue);
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