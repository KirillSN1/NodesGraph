import GraphNode from "../../node/gnode/GraphNode";
import { PropertyWithSocket } from "../../node/gnode/PropertyWithSocket";
import Vector2 from "../../vector/Vector2";
import { GNodeTransformChange, GRefChange, GRefCreate } from "./GNodeTypes";
import { GraphDrawer } from "./GraphDrawer";

const getObservableArray = <T>(value:T[], onChange:()=>void)=>{
    return new Proxy(value,{
        get(...params){ return Reflect.get(...params); },
        set(...params){
            const result = Reflect.set(...params);
            onChange();
            return result;
        }
    });
}
type LinkContext = { property:PropertyWithSocket, target:Vector2, magnet?:Vector2 };
type GNodeEventsMap = { [K in keyof HTMLElementEventMap]:(node:GraphNode,ev:HTMLElementEventMap[K])=>unknown }
export default class GraphDriver {
    private readonly _drawer:GraphDrawer = new GraphDrawer();
    private _nodes:GraphNode[] = this.getObservableNodes([]);
    private _linkContext?:LinkContext;
    private _selected?:GraphNode
    public get selected(){ return this._selected }
    public readonly nodeEventHandlers:GNodeEventsMap = {} as GNodeEventsMap
    /** Observable array of nodes. Driver redraws canvas when nodes changes. */
    public get nodes() {
        return this._nodes;
    }
    public set nodes(value) {
        this._drawer.redraw();
        this._nodes = this.getObservableNodes(value);
    }
    constructor(nodes?:GraphNode[]){
        if(nodes) this.add(...nodes);
    }
    private getObservableNodes(nodes:GraphNode[]){
        return getObservableArray(nodes,()=>{
            if(this._drawer.attached) this._drawer.redraw();
        })
    }
    attach(canvas:HTMLCanvasElement){
        this._drawer.attach(canvas);
        this._drawer.onRedraw = ()=>{
            this.onStateChange();
            this._nodes.forEach(node=>this._drawer.drawTreeLinks(node));
            if(this._linkContext)
                this._drawer.drawLink(this._linkContext.property, this._linkContext.magnet ?? this._linkContext.target);
        }
        if(this._nodes) this._drawer.redraw();
    }
    detach(){
        this._drawer.onRedraw = undefined;
        this._drawer.detach();
    }
    select(node:GraphNode){
        this._selected = node;
    }
    deselect(){
        this._selected = undefined;
    }
    add<T extends GraphNode>(...nodes:T[]){
        return this.insert(this._nodes.length-1,...nodes);
    }
    insert<T extends GraphNode>(after:number = this._nodes.length-1,...nodes:T[]){
        nodes.forEach(node=>node.attachDriver(this));
        return this._nodes.splice(after,0,...nodes);
    }
    remove<T extends GraphNode>(node:T){
        return this.removeAt(this._nodes.indexOf(node),1);
    }
    removeAt(start: number, deleteCount = 0){
        for(let i = start; i<start+deleteCount; i++)
            this._nodes[i].delete();
        return this._nodes.splice(start,deleteCount);
    }
    onStateChange:()=>void = ()=>null;
    onNodeContextMenu:(node:GraphNode, event:MouseEvent)=>void = ()=>null;
    onNodeMove = (event:GNodeTransformChange)=>{
        event.node.transform.position = event.transform.position;
        event.socketTransforms.forEach((change)=>{
            change.property.socket.transform = change.transform;
        });
        this._drawer.redraw();
    }
    onNodeResize = (event:GNodeTransformChange)=>{
        event.node.transform.rect = event.transform.rect;
        event.socketTransforms.forEach((change)=>{
            change.property.socket.transform = change.transform;
        });
        this._drawer.redraw();
    }
    onScrimMove = (e:Vector2)=>{//TODO: Scrim
        this._drawer.offset = e;
        console.log(e);
    }
    onStartLink = (property:PropertyWithSocket,e:GRefCreate)=>{
        if(property instanceof PropertyWithSocket)
            this._linkContext = { property, target:e.target };
        //this.drawer.redraw(); May not call redrow
    }
    onMoveLink = (property:PropertyWithSocket,e:GRefChange)=>{
        if(!this._linkContext) throw new Error("linkPropertyBuffer is undefined!");
        this._linkContext.target = e.target;
        this._drawer.redraw();
    }
    onMagnetize = (property:PropertyWithSocket)=>{
        if(!this._linkContext) return;
        this._linkContext.magnet = property.socket.transform.getCenter()
    }
    onUnmagnetize = (property:PropertyWithSocket)=>{
        if(!this._linkContext) return;
        this._linkContext.magnet = undefined;
    }
    onEndLink = (property:PropertyWithSocket)=>{
        this._linkContext = undefined;
        this._drawer.redraw();
    }
    onLink = (property:PropertyWithSocket)=>{
        if(property instanceof PropertyWithSocket && 
            this._linkContext?.property.type != property.type)
            this._linkContext?.property.linkTo(property);
    }
}