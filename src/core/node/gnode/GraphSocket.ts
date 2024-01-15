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

    constructor({ style, type }: { style?:GraphSocketStyle, type:SocketType }){
        super();
        this.style = style ?? new DefaultSocketStyle();
        this.type = type;
    }
    static input(style:GraphSocketStyle = new DefaultSocketStyle()){
        return new GraphSocket({ type:SocketType.InputSocket, style });
    }
    static output(style:GraphSocketStyle = new DefaultSocketStyle()){
        return new GraphSocket({ type:SocketType.OutputSocket, style });
    }
    /**
     * Checks ref is able to attach to this socket.
     * 
     * Note: {@link attach} attaches ref to both nodes of ref.
     * Use {@link GraphRef.canAttach} to fully check ref to be able to attach
     * @returns true if {@link GraphSocket} can adds spesified {@link ref}
     */
    canAttach(ref:GraphRef){
        return !this.isRef(ref) && this.checkRefsLimit();
    }
    /**
     * Checks {@link GraphSocket} of specified {@link property} is able to attach to this socket.
     */
    canAttachTo(property:PropertyWithSocket){
        return !this.isRefTo(property) && this.checkRefsLimit();
    }
    /**
     * 
     * @returns Returns false if refs count is maximum.
     */
    checkRefsLimit(){
        return this.type != SocketType.InputSocket || !this._refs.length
    }
    /**
     * Adds {@link ref} to refs list.
     * @param ref Ref, that must have one property with this socket.
     * @throws {SocketRefsLimitError} if refs count limit exceed. 
     * (for {@link SocketType.InputSocket} this limit is 1). See {@link canAttach}
     */
    attach(ref: GraphRef):void {
        console.log(ref);
        if(this.type == SocketType.InputSocket && this._refs.length) 
            throw new SocketRefsLimitError(this.type)
        this.assertRef(ref);
        const tryAttachRefTo = (socket:GraphSocket, ref:GraphRef)=>{
            if(!socket.isRef(ref))
                if(socket == this) this._refs.push(ref);
                else socket.attach(ref);
        }
        tryAttachRefTo(ref.from.socket,ref);
        tryAttachRefTo(ref.to.socket,ref);
    }
    /**
     * 
     * @param ref Ref, that must have one property with this socket.
     * @returns Removes {@link ref} from refs list (if {@link ref} is not undefined).
     * Removes all refs if {@link ref} is undefined
     */
    detach(ref?: GraphRef){
        if(!ref){
            const refs = [...this._refs];
            refs.forEach((ref)=>{
                const socket = ref.from.socket == this?ref.to.socket:ref.from.socket;
                socket.detach(ref);
            })
            return;
        }
        this.assertRef(ref);
        const tryDetachRef = (socket:GraphSocket, ref:GraphRef)=>{
            if(socket.isRef(ref))
                if(socket == this) this._refs.splice(this._refs.findIndex(sref=>sref.match(ref)));
                else socket.detach(ref);
        }
        tryDetachRef(ref.from.socket,ref);
        tryDetachRef(ref.to.socket,ref);
    }
    private assertRef(ref: GraphRef){
        if(!ref.to || !ref.from) throw new Error("Ref must have both nodes.");
        if(ref.from.socket != this && ref.to.socket != this) throw new Error("Ref havn`t this socket!");
    }
    isRef(ref:GraphRef):boolean{
        return this._refs.find(r=>r.match(ref)) != null
    }
    isRefTo(property:PropertyWithSocket){
        return this._refs.find(r=>property == r.from || property == r.to) != null;
    }
}
export class DefaultSocketStyle extends GraphSocketStyle{
    color = "black";
}
export enum SocketType{
    InputSocket = "InputSocket",
    OutputSocket = "OutputSocket",
}
export default class SocketRefsLimitError extends Error{
    constructor(type:SocketType, limit = 1){
        super(`This ${type} has refs limit - ${limit}`);
    }
}