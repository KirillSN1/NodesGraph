import GraphProperty from "./GraphProperty";
import VirtualNode from "../virtual/VirtualNode";
import Transform from "../../transform/Transform";
import { OutputProperty } from "./OutputSocket";

export default class GraphNode extends VirtualNode{
    readonly title:string = "";
    readonly properties:GraphProperty[] = [];
    get outputProperties():OutputProperty[] {
        return <OutputProperty[]>this.properties.filter((p)=>(p instanceof OutputProperty));
    }
    //TODO:events

    constructor(title:string ,data?:{ properties?:GraphProperty[], transform?:Transform }){
        super();
        this.title = title;
        this.setProperties(data?.properties ?? this.properties);
        this.transform = data?.transform ?? this.transform;
    }
    setProperties(propertys:GraphProperty[]){
        if(this.properties == propertys) return;
        this.properties.length = 0;
        this.addProperties(propertys);
    }
    addProperties(propertys:GraphProperty[]){
        if(this.properties == propertys) return;
        propertys.forEach((item)=>this.addProperty(item));
    }
    addProperty(property:GraphProperty){
        if(property.node != this) property.attachTo(this);
        else if(!this.properties.includes(property)) this.properties.push(property);
    }
    removeProperty(property:GraphProperty){
        const index = this.properties.indexOf(property);
        if(index>=0) this.properties.splice(index,1);
        if(property.node == this) property.detach();
    }
}