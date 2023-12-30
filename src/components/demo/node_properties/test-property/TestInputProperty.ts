import { markRaw } from "vue";
import TestInputPropertyVue from "./TestInputProperty.vue";
import { InputProperty } from "@/components/core/node/gnode/PropertyWithSocket";
import { GraphSocket } from "@/components/core/node/gnode/GraphSocket";

export default class TestInputProperty extends InputProperty{
    public socket = GraphSocket.input({ color:"red" });
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