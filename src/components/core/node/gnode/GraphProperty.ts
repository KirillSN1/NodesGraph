import GraphNode from "./GraphNode";

import type { Raw } from "vue";
import type { BaseComponent } from "../../canvas/GNodeTypes"
import { GraphSocket } from "./GraphSocket";

export default abstract class GraphProperty{
    // public abstract readonly socket?:GraphSocket;
    public node?:GraphNode;
    public abstract readonly component:Raw<BaseComponent>;

    attachTo(node:GraphNode){
        if(this.node?.properties.includes(this)){
            if(this.node == node) return;
            this.node.removeProperty(this);
        }
        this.node = node;
        this.node.addProperty(this);
    }
    detach(){
        if(this.node?.properties.includes(this)) 
            return this.node?.removeProperty(this);
        this.node = undefined;
    }
}
export abstract class PropertyWithSocket extends GraphProperty{
    abstract readonly socket:GraphSocket;
}