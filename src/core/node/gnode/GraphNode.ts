import GraphProperty from "./GraphProperty";
import VirtualNode from "../virtual/VirtualNode";
import Transform from "../../transform/Transform";
import { PropertyType, PropertyWithSocket } from "./PropertyWithSocket";
import GraphDriver from "@/core/canvas/types/GraphDriver";

export class NodeDriver{
    private readonly node:GraphNode;
    private readonly graphDriver:GraphDriver;
    constructor(node:GraphNode, driver:GraphDriver){
        this.graphDriver = driver;
        this.node = node;
    }
    get selected(){
        return this.graphDriver.selected == this.node;
    }
    select(){
        this.graphDriver.select(this.node);
    }
    deselect(){
        this.graphDriver.deselect();
    }
    /** Removes node from {@link GraphDriver} and calls {@link detachDriver} */
    delete(){
        this.node.detachDriver();
        this.graphDriver.remove(this.node);
    }
}

export default abstract class GraphNode extends VirtualNode{
    abstract readonly title:string;
    private _properties:GraphProperty[] = [];
    private _driver?:NodeDriver

    get properties():GraphProperty[] {
        return this._properties.slice();
    }
    get outputProperties():PropertyWithSocket[] { return this.getPropertiesOfType(PropertyType.OutputProperty); }
    get inputProperties():PropertyWithSocket[] { return this.getPropertiesOfType(PropertyType.InputProperty); }
    get propertiesWithSocket():PropertyWithSocket[] { return this.getPropertiesOfType(PropertyType.InputProperty,PropertyType.OutputProperty); }
    getPropertiesOfType(...types:PropertyType[]): PropertyWithSocket[]{
        return this._properties.filter(p=>p instanceof PropertyWithSocket && types.includes(p.type)) as PropertyWithSocket[];
    }

    get selected(){ return this._driver?.selected }
    
    constructor(data?:{ properties?:GraphProperty[], transform?:Transform }){
        super();
        this.setProperties(data?.properties ?? this._properties);
        this.transform = data?.transform ?? this.transform;
    }
    attachDriver(driver:GraphDriver){
        this._driver = new NodeDriver(this, driver);
    }
    detachDriver(){
        this._driver = undefined;
    }
    select(){
        if(!this._driver) return false;
            this._driver.select();
        return true;
    }
    deselect(){
        if(!this._driver) return false;
            this._driver.deselect();
        return true;
    }
    /** Removes node from {@link GraphDriver} and calls {@link detachDriver} */
    delete(){
        if(!this._driver) return false;
        this._driver.delete();
        this.propertiesWithSocket.forEach((propertie)=>propertie.socket.detach());
        return true;
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
    /**
     * Attaches property to node.
     * Calls {@link GraphProperty.attachTo}
     * @param property Property to attach (Must be not attached yet)
     */
    addProperty(property:GraphProperty):void{
        if(property.node != this) property.attachTo(this);
        else if(!this._properties.includes(property)) this._properties.push(property);
    }
    /**
     * Detaches property from node.
     * Calls {@link GraphProperty.detach}
     * @param property Property to attach (Must be not attached yet)
     */
    removeProperty(property:GraphProperty):void{
        const index = this._properties.indexOf(property);
        if(index>=0) this._properties.splice(index,1);
        if(property.node == this) property.detach();
    }
}