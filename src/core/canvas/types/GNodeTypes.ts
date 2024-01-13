import { Component } from "vue";
import GraphNode from "../../node/gnode/GraphNode";
import GraphProperty from "../../node/gnode/GraphProperty";
import Transform from "../../transform/Transform";
import { PropertyWithSocket } from "../../node/gnode/PropertyWithSocket";
import Position from "../../transform/Position";

export abstract class GNodeEvent{
    readonly abstract node:GraphNode
    readonly abstract transform:Transform;
}
export class SocketTransformChangeEvent {
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
    readonly socketTransforms:SocketTransformChangeEvent[];
    constructor(node:GraphNode,data:{transform:Transform, socketTransforms:SocketTransformChangeEvent[]}){
        super();
        this.node = node
        this.transform = data.transform;
        this.socketTransforms = data.socketTransforms;
    }
}
export abstract class GRefEvent{
    abstract target:Position;
}
export class GRefCreate extends GRefEvent {
    target:Position;
    constructor(data:{ target:Position }){
        super();
        this.target = data.target;
    }
}
export class GRefChange extends GRefEvent {
    target:Position;
    constructor(data:{ traget:Position }){
        super();
        this.target = data.traget;
    }
}
export type PropertyBaseComponent = Component<{ property:GraphProperty }>;