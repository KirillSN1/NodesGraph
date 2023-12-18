// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PropertyWithSocket } from "./PropertyWithSocket";
import VirtualNode from "../virtual/VirtualNode";
import GraphRef from "./GraphRef";
export abstract class GraphSocketStyle{
    readonly abstract color:string;
}
export abstract class GraphSocket extends VirtualNode{
    readonly abstract style:GraphSocketStyle;
    private _refs:GraphRef[] = [];
    get refs():GraphRef[] { return [...this._refs] }
    /**
     * Adds ref to refs list. Calls {@link PropertyWithSocket.linkTo} to link ref 
     * @param ref Ref, that must have one property with this socket.
     */
    attach(ref: GraphRef):void {
        if(!ref.to || !ref.from) throw new Error("Can not attach ref without both nodes.");
        if(ref.from.socket != this && ref.to.socket != this) throw new Error("Can not attach ref. It`s havn`t this socket!");
        const tryAttachRefTo = (socket:GraphSocket, ref:GraphRef)=>{
            if(!socket.isRef(ref))
                if(socket == this) this._refs.push(ref);
                else socket.attach(ref);
        }
        tryAttachRefTo(ref.from.socket,ref);
        tryAttachRefTo(ref.to.socket,ref);
    }
    isRef(ref:GraphRef):boolean{
        return this._refs.find(r=>r.match(ref)) != null
    }
}
export abstract class InputSocketStyle extends GraphSocketStyle{}
export abstract class OutputSocketStyle extends GraphSocketStyle{}
export abstract class OutputSocket extends GraphSocket{
    readonly abstract style: OutputSocketStyle;
}
export abstract class InputSocket extends GraphSocket{
    readonly abstract style: InputSocketStyle;
}