import { PropertyType, PropertyWithSocket } from "@/core/node/gnode/PropertyWithSocket";
import TestOutputPropertyVue from "./TestOutputProperty.vue";
import { GraphSocket } from "@/core/node/gnode/GraphSocket";

export default class TestOutputProperty extends PropertyWithSocket{
    title?: string = "TestOutput";
    type = PropertyType.OutputProperty;
    calculate() { return this.text }
    public socket = GraphSocket.output({ color:"black" });
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super(TestOutputPropertyVue);
        this.text = text;
        this.placeholder = placeholder
    }
    setText(text = ""):void{
        this.text=text; 
    }
}