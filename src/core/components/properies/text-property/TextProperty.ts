import TextPropertyVue from "./TextProperty.vue";
import { GraphSocket, PropertyWithSocket } from "@/core/node";

export default class TextProperty extends PropertyWithSocket<string>{
    get value() { return this.text; }
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