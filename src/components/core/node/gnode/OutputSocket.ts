import { PropertyWithSocket } from "./GraphProperty";
import GraphRef from "./GraphRef";
import { OutputSocket } from "./GraphSocket";
import { InputProperty } from "./InputProperty";

export abstract class OutputProperty extends PropertyWithSocket{
    abstract readonly socket:OutputSocket;
    public refs:GraphRef[] = [];
    linkTo(property:InputProperty){
        const ref = new GraphRef();
        ref.to = property;
        this.refs.push(ref);
    }
}