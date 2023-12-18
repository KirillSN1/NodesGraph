import Vector2 from "../../vector/Vector2";
import VirtualRef from "../virtual/VirtualRef";
import { InputProperty, OutputProperty } from "./PropertyWithSocket";

export default class GraphRef extends VirtualRef<InputProperty, OutputProperty>{
    override readonly from: OutputProperty;
    override readonly to: InputProperty;
    public target:Vector2 = new Vector2();
    constructor(from:OutputProperty, to:InputProperty, data?:{ target?:Vector2 }){
        if(from == to) throw new Error("Can not link self!");
        super();
        this.from = from;
        this.to = to;
        this.target = data?.target ?? new Vector2();
    }
    match(ref:GraphRef):boolean;
    match(from?:OutputProperty,to?:InputProperty):boolean;
    match(refOrProp?:OutputProperty | GraphRef,to?:InputProperty):boolean{
        if(refOrProp instanceof GraphRef) return (refOrProp == this) || this.match(refOrProp.from,refOrProp.to);
        return this.from == refOrProp && this.to == to;
    }
}