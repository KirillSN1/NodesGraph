import GraphNode from "../../node/gnode/GraphNode";
import GraphProperty from "../../node/gnode/GraphProperty";
// import { InputProperty, OutputProperty, PropertyWithSocket } from "../../node/gnode/PropertyWithSocket";
import { PropertyWithSocket } from "../../node/gnode/PropertyWithSocket";
import Vector2 from "../../vector/Vector2";
import { GNodeTransformChange, GRefChange, GRefCreate } from "./GNodeTypes";
import { GraphDrawer } from "./GraphDrawer";


const getObservableArray = <T>(value:T[], onChange:()=>void)=>{
    return new Proxy(new Array<T>(...value),{
        set(){
            onChange();
            return true;
        }
    });
}
export default class GraphDriver {
    private readonly drawer:GraphDrawer = new GraphDrawer();
    private _nodes:GraphNode[] = this.getObservableNodes([]);
    private linkPropertyBuffer?:{ property:PropertyWithSocket, target:Vector2 };
    /** Observable array of nodes. Driver redraws canvas when nodes changes. */
    public get nodes() { 
        return this._nodes;
    }
    public set nodes(value) {
        this.drawer.redraw();
        this._nodes = this.getObservableNodes(value);
    }
    constructor(nodes?:GraphNode[]){
        if(nodes) this._nodes = this.getObservableNodes(nodes);
    }
    private getObservableNodes(nodes:GraphNode[]){
        return getObservableArray(nodes,()=>this.drawer.redraw())
    }
    attach(canvas:HTMLCanvasElement){
        this.drawer.attach(canvas);
        this.drawer.onRedraw = ()=>{
            this._nodes.forEach((node)=>this.drawer.drawTreeLinks(node));
            if(this.linkPropertyBuffer)
                this.drawer.drawLine(this.linkPropertyBuffer.property.socket.transform.getCenter(), this.linkPropertyBuffer.target);
        }
        if(this._nodes) this.drawer.redraw();
    }
    detach(){
        this.drawer.onRedraw = undefined;
        this.drawer.detach();
    }
    onNodeMove = (event:GNodeTransformChange)=>{
        event.node.transform.position = event.transform.position;
        event.socketTransforms.forEach((change)=>{
            change.property.socket.transform = change.transform;
        });
        this.drawer.redraw();
    }
    onNodeResize = (event:GNodeTransformChange)=>{
        event.node.transform.rect = event.transform.rect;
        event.socketTransforms.forEach((change)=>{
            change.property.socket.transform = change.transform;
        });
        this.drawer.redraw();
    }
    onScrimMove = (e:Vector2)=>{//TODO:
        this.drawer.offset = e;
        console.log(e);
    }
    onStartLink = (property:GraphProperty,e:GRefCreate)=>{
        console.log('start',property);
        if(property instanceof PropertyWithSocket){
            this.linkPropertyBuffer = { property, target:e.target };
        }
        //this.drawer.redraw(); May not call redrow
    }
    onMoveLink = (property:GraphProperty,e:GRefChange)=>{
        if(!this.linkPropertyBuffer) throw new Error("linkPropertyBuffer is undefined!");
        this.linkPropertyBuffer.target = e.target;
        this.drawer.redraw();
    }
    onEndLink = (property:GraphProperty)=>{
        this.linkPropertyBuffer = undefined;
        this.drawer.redraw();
    }
    onLink = (property:GraphProperty)=>{
        if(property instanceof PropertyWithSocket)
            this.linkPropertyBuffer?.property.linkTo(property);
    }
}