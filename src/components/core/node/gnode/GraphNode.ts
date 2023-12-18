import GraphProperty from "./GraphProperty";
import VirtualNode from "../virtual/VirtualNode";
import Transform from "../../transform/Transform";
import { InputProperty, OutputProperty, PropertyWithSocket } from "./PropertyWithSocket";

export default abstract class GraphNode extends VirtualNode{
    abstract readonly title:string;
    private _properties:GraphProperty[] = [];

    get properties():GraphProperty[] {
        return this._properties.slice();
    }
    get propertiesWithSocket():PropertyWithSocket[] { return this.getPropertiesOfType(PropertyWithSocket); }
    get outputProperties():OutputProperty[] { return this.getPropertiesOfType(OutputProperty); }
    get inputProperties():InputProperty[] { return this.getPropertiesOfType(InputProperty); }
    getPropertiesOfType<T extends typeof GraphProperty>(type:T): InstanceType<T>[]{
        return this._properties.filter(p=>p instanceof type) as InstanceType<T>[];
    }
    //TODO:events

    constructor(data?:{ properties?:GraphProperty[], transform?:Transform }){
        super();
        this.setProperties(data?.properties ?? this._properties);
        this.transform = data?.transform ?? this.transform;
    }
    setProperties(propertys:GraphProperty[]):void{
        if(this._properties == propertys) return;
        this._properties.length = 0;
        this.addProperties(propertys);
    }
    addProperties(propertys:GraphProperty[]):void{
        if(this._properties == propertys) return;
        propertys.forEach((item)=>this.addProperty(item));
    }
    addProperty(property:GraphProperty):void{
        if(property.node != this) property.attachTo(this);
        else if(!this._properties.includes(property)) this._properties.push(property);
    }
    removeProperty(property:GraphProperty):void{
        const index = this._properties.indexOf(property);
        if(index>=0) this._properties.splice(index,1);
        if(property.node == this) property.detach();
    }
}