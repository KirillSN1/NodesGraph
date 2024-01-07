import TestInputPropertyVue from "./TestInputProperty.vue";
import { PropertyType, PropertyWithSocket } from "@/core/node/gnode/PropertyWithSocket";
import { GraphSocket } from "@/core/node/gnode/GraphSocket";

export default class TestInputProperty extends PropertyWithSocket{
    title?: string = "Test Input";
    type = PropertyType.InputProperty;
    public socket = GraphSocket.input({ color:"red" });
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super(TestInputPropertyVue);
        this.text = text;
        this.placeholder = placeholder
    }
    setText(text = ""):void{
        this.text=text; 
    }
}