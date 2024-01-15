import { PropertyBaseComponent } from "@/core/canvas/types/GNodeTypes";
import GraphProperty from "./GraphProperty";
import GraphRef from "./GraphRef";
import { GraphSocket, GraphSocketStyle, SocketType } from "./GraphSocket";
import DefaultPropertyVue from "@/core/components/properies/DefaultProperty.vue";

type PropertyOptions<T> = { getValue(this:PropertyWithSocket<T>):T, socketStyle?:GraphSocketStyle, component?:PropertyBaseComponent }
export abstract class PropertyWithSocket<T = unknown> extends GraphProperty{
    abstract get value():T;
    get type(){
        switch(this.socket.type){
            case SocketType.InputSocket: return PropertyType.InputProperty;
            case SocketType.OutputSocket: return PropertyType.OutputProperty;
        }
    }
    abstract readonly socket:GraphSocket;
    constructor(component?:PropertyBaseComponent){
        super(component??DefaultPropertyVue)
    }
    static create<T>(title:string, options:PropertyOptions<T>, type:SocketType){
        const AnonymousPropertyWithSocket = class extends PropertyWithSocket<T>{
            title = title;
            get value(): T { return options.getValue.call(this); }
            socket: GraphSocket = new GraphSocket({ type, style:options.socketStyle });
        }
        return new AnonymousPropertyWithSocket(options.component);
    }
    static input<T>(title:string, options:PropertyOptions<T>){
        return PropertyWithSocket.create<T>(title, options, SocketType.InputSocket);
    }
    static output<T>(title:string, options:PropertyOptions<T>){
        return PropertyWithSocket.create<T>(title, options, SocketType.OutputSocket);
    }
    /**
     * Checks specified {@link property} is able to link with this property.
     * See {@link GraphSocket.canAttachTo}
     */
    canLinkWith(property:PropertyWithSocket):boolean{
        return property.socket.canAttachTo(this) && this.socket.canAttachTo(property);
    }
    linkTo(property:PropertyWithSocket):void{
        const ref = new GraphRef(property,this,{ target:property.socket.transform.position });
        if(ref.canAttach()) this.socket.attach(ref);
    }
    unlink(property?:PropertyWithSocket):void{
        if(property){
            const ref = new GraphRef(property,this,{ target:property.socket.transform.position });
            if(this.socket.isRef(ref)) this.socket.detach(ref);
        }
        this.socket.detach();
    }
}
export enum PropertyType{
    InputProperty,
    OutputProperty
}