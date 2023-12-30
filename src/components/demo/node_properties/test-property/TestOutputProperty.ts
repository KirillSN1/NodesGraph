import { markRaw } from "vue";
import TestOutputPropertyVue from "./TestOutputProperty.vue";
import { OutputProperty } from "@/components/core/node/gnode/PropertyWithSocket";
import { GraphSocket } from "@/components/core/node/gnode/GraphSocket";

export default class TestOutputProperty extends OutputProperty<string>{
    calculate() { return this.text }
    public socket = GraphSocket.output({ color:"black" });
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