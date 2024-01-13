import GraphNode from "./GraphNode";

import { markRaw, type Raw } from "vue";
import type { PropertyBaseComponent } from "../../canvas/types/GNodeTypes"

export default class GraphProperty{
    /**
     * Node`s title that can be shows user.
     * PS: Use only in UI
     */
    readonly title?:string = this.constructor.name.replace(RegExp("Property", 'gi'),"");
    /**
     * Node, that contains this property.
     */
    public node?:GraphNode;
    /**
     * Vue component, that uses for drawing this property
     */
    public readonly component:Raw<PropertyBaseComponent>;

    constructor(component: PropertyBaseComponent){
        this.component = markRaw(component);
    }
    /**
     * Attaches property to node.
     * Calls {@link GraphNode.addProperty}.
     * @param node {@link GraphProperty.component}
     * 
     */
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