import TextPropertyVue from "./TextProperty.vue";
import { GraphSocket, GraphProperty } from "@/core/node";

export default class TextProperty extends GraphProperty{
    // title?: string = "Text";
    public socket?: GraphSocket = undefined;
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super(TextPropertyVue);
        this.text = text;
        this.socket = undefined;
        this.placeholder = placeholder
    }
    setText(text = ""){
        this.text=text; 
    }
}