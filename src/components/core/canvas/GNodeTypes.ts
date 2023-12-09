import { Component } from "vue";
import GraphNode from "../node/gnode/GraphNode";
import GraphProperty, { PropertyWithSocket } from "../node/gnode/GraphProperty";
import Transform from "../transform/Transform";

export abstract class GNodeEvent{
    readonly abstract node:GraphNode
    readonly abstract transform:Transform;
}
export class SocketTransformChange {
    readonly property:PropertyWithSocket;
    readonly transform:Transform;
    constructor(property:PropertyWithSocket, data:{transform:Transform}){
        this.property = property;
        this.transform = data.transform;
    }
}
export class GNodeTransformChange extends GNodeEvent{
    readonly node: GraphNode;
    readonly transform: Transform;
    readonly socketTransforms:SocketTransformChange[];
    constructor(node:GraphNode,data:{transform:Transform, socketTransforms:SocketTransformChange[]}){
        super();
        this.node = node
        this.transform = data.transform;
        this.socketTransforms = data.socketTransforms;
    }
}
export type BaseComponent = Component<{ property:GraphProperty }>;
export class Socket{
    public color = ""
    constructor(data?:{ color?:string }){
        this.color = data?.color ?? "";
    }
}