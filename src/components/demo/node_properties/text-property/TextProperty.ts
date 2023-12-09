import GraphProperty from "@/components/core/node/gnode/GraphProperty";
import TextPropertyVue from "./TextProperty.vue";
import { markRaw } from "vue";
import { GraphSocket } from "@/components/core/node/gnode/GraphSocket";

export default class TextProperty extends GraphProperty{
    public socket?: GraphSocket = undefined;
    readonly component = markRaw(TextPropertyVue);
    public content = "ddd";
    constructor(){
        super();
        this.socket = undefined;
    }
}