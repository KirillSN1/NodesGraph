import Vector2 from "../../vector/Vector2";
import VirtualRef from "../virtual/VirtualRef";
import { PropertyWithSocket } from "./PropertyWithSocket";

export default class GraphRef extends VirtualRef<PropertyWithSocket, PropertyWithSocket>{
    override readonly from: PropertyWithSocket;
    override readonly to: PropertyWithSocket;
    // public target:Vector2 = new Vector2();
    constructor(from:PropertyWithSocket, to:PropertyWithSocket, data?:{ target?:Vector2 }){
        if(from == to) throw new Error("Can not link self!");
        if(from.type == to.type) throw new Error("Can not link properties with same types!");
        super();
        this.from = from;
        this.to = to;
        // this.target = data?.target ?? new Vector2();
    }
    /**
     * TODO:
     */
    // isValid(){
    //     return this.from.socket.canAttach() && this.to.socket
    // }
    match(ref:GraphRef):boolean;
    match(from?:PropertyWithSocket,to?:PropertyWithSocket):boolean;
    match(refOrProp?:PropertyWithSocket | GraphRef,to?:PropertyWithSocket):boolean{
        if(refOrProp instanceof GraphRef) return (refOrProp == this) || this.match(refOrProp.from,refOrProp.to);
        return this.from == refOrProp && this.to == to;
    }
}