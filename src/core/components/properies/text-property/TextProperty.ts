import { PropertyType } from "@/core/node/gnode/PropertyWithSocket";
import TextPropertyVue from "./TextProperty.vue";
import { GraphSocket, PropertyWithSocket } from "@/core/node";

export default class TextProperty extends PropertyWithSocket{
    type: PropertyType = PropertyType.OutputProperty;
    // title?: string = "Text";
    public socket: GraphSocket = GraphSocket.output({ color:"green" });
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super(TextPropertyVue);
        this.text = text;
        this.placeholder = placeholder
    }
    setText(text = ""){
        this.text=text; 
    }
}