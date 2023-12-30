// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PropertyWithSocket } from "./PropertyWithSocket";
import VirtualNode from "../virtual/VirtualNode";
import GraphRef from "./GraphRef";
export abstract class GraphSocketStyle{
    readonly abstract color:string;
}
export class GraphSocket extends VirtualNode{
    readonly type:SocketType;
    readonly style:GraphSocketStyle;
    private _refs:GraphRef[] = [];
    get refs():GraphRef[] { return [...this._refs] }

    constructor({ style = new DefaultSocketStyle(), type }: { style:GraphSocketStyle, type:SocketType }){
        super();
        this.style = style;
        this.type = type;
    }
    static input(style:GraphSocketStyle = new DefaultSocketStyle()){
        return new GraphSocket({ type:SocketType.InputSocket, style });
    }
    static output(style:GraphSocketStyle = new DefaultSocketStyle()){
        return new GraphSocket({ type:SocketType.OutputSocket, style });
    }

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
export class DefaultSocketStyle extends GraphSocketStyle{
    color = "black";
}
export enum SocketType{
    InputSocket = "InputSocket",
    OutputSocket = "OutputSocket",
}
// export class OutputSocket extends GraphSocket{
//     readonly style: GraphSocketStyle;
//     constructor(data:{ style:GraphSocketStyle } = { style:new DefaultSocketStyle()}){
//         super();
//         this.style = data.style;
//     }
// }
// export class InputSocket extends GraphSocket{
//     readonly style: GraphSocketStyle;
//     constructor(data:{ style:GraphSocketStyle } = { style:new DefaultSocketStyle()}){
//         super();
//         this.style = data.style;
//     }
// }