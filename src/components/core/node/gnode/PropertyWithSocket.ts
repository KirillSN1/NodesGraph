import GraphProperty from "./GraphProperty";
import GraphRef from "./GraphRef";
import { GraphSocket, InputSocket, OutputSocket } from "./GraphSocket";

export abstract class PropertyWithSocket extends GraphProperty{
    abstract readonly socket:GraphSocket;
    abstract linkTo(property:PropertyWithSocket):void;
}
export abstract class InputProperty extends PropertyWithSocket{
    abstract readonly socket:InputSocket;
    linkTo(property:OutputProperty){
        const ref = new GraphRef(property,this,{ target:property.socket.transform.position });
        if(!this.socket.isRef(ref)) this.socket.attach(ref);
    }
}
export abstract class OutputProperty<T = void> extends PropertyWithSocket{
    abstract readonly socket:OutputSocket;
    abstract calculate():T;
    linkTo(property:InputProperty){
        const ref = new GraphRef(this,property,{ target:property.socket.transform.position });
        if(!this.socket.isRef(ref)) this.socket.attach(ref);
    }
}