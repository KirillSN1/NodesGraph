import GraphProperty from "@/components/core/node/gnode/GraphProperty";
import TextPropertyVue from "./TextProperty.vue";
import { markRaw } from "vue";
import { GraphSocket } from "@/components/core/node/gnode/GraphSocket";

export default class TextProperty extends GraphProperty{
    public socket?: GraphSocket = undefined;
    readonly component = markRaw(TextPropertyVue);
    public text:string;
    public placeholder:string;
    constructor(text = "", placeholder = ""){
        super();
        this.text = text;
        this.socket = undefined;
        this.placeholder = placeholder
    }
    setText(text = ""){
        this.text=text; 
    }
}