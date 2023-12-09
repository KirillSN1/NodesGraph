import { PropertyWithSocket } from "./GraphProperty";
import { InputSocket } from "./GraphSocket";

export abstract class InputProperty extends PropertyWithSocket{
    abstract readonly socket:InputSocket;
}