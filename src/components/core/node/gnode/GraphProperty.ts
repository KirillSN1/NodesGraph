import GraphNode from "./GraphNode";

import type { Raw } from "vue";
import type { BaseComponent } from "../../canvas/types/GNodeTypes"

export default abstract class GraphProperty{
    public node?:GraphNode;
    public abstract readonly component:Raw<BaseComponent>;

    attachTo(node:GraphNode):void{
        if(this.node?.properties.includes(this)){
            if(this.node == node) return;
            this.node.removeProperty(this);
        }
        this.node = node;
        this.node.addProperty(this);
    }
    detach():void{
        if(this.node?.properties.includes(this)) 
            return this.node?.removeProperty(this);
        this.node = undefined;
    }
}