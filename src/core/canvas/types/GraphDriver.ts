import GraphNode, { NodeDriver } from "../../node/gnode/GraphNode";
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
    private _nodeDrivers:NodeDriver[] = this.getObservableDrivers();
    private _linkContext?:LinkContext;
    private _selected?:NodeDriver;
    public get selected(){ return this._selected?.node }
    public readonly nodeEventHandlers:GNodeEventsMap = {} as GNodeEventsMap
    get nodes(){
        return this._nodeDrivers.map(driver=>driver.node);
    }
    /** Nodes length */
    get length(){ return this._nodeDrivers.length }
    constructor(nodes?:GraphNode[]){
        if(nodes) this.add(...nodes);
        this.resetOrder();
    }
    private getObservableDrivers<T>(){
        return getObservableArray(new Array<T>(),()=>{
            if(this._drawer.attached) this._drawer.redraw();
        })
    }
    resetOrder(){
        const drivers = [...this._nodeDrivers];
        for(let i = 0; i<drivers.length; i++){
            drivers[i].zIndex = i;
        }
    }
    attach(canvas:HTMLCanvasElement){
        this._drawer.attach(canvas);
        this._drawer.onRedraw = ()=>{
            this.onStateChange();
            this._nodeDrivers.forEach(driver=>this._drawer.drawTreeLinks(driver.node));
            if(this._linkContext)
                this._drawer.drawLink(this._linkContext.property, this._linkContext.magnet ?? this._linkContext.target);
        }
        if(this._nodeDrivers) this._drawer.redraw();
    }
    detach(){
        this._drawer.onRedraw = undefined;
        this._drawer.detach();
    }
    select(node:GraphNode){
        if(this._selected?.node == node) return;
        this._selected = this._nodeDrivers.find(driver=>driver.node == node);
        if(!this._selected) throw new Error("Can not select external node!");
        const oldIndex = this._selected.zIndex;
        this._selected.zIndex = this._nodeDrivers.length-1;//sets max index
        for(const driver of this._nodeDrivers)
            if(driver!=this._selected && driver.zIndex>oldIndex) driver.zIndex--;
    }
    deselect(){
        this._selected = undefined;
    }
    findIndex(predicate: (value: GraphNode, index: number, obj:typeof this)=>unknown){
        return this._nodeDrivers.findIndex((driver,index)=>predicate(driver.node,index, this));
    }
    indexOf(node:GraphNode){
        return this._nodeDrivers.findIndex(driver=>driver.node == node)
    }
    add<T extends GraphNode>(...nodes:T[]){
        return this.insert(this._nodeDrivers.length-1,...nodes);
    }
    insert<T extends GraphNode>(after:number = this._nodeDrivers.length-1,...nodes:T[]){
        const drivers = nodes.map((node,index)=>{
            const driver = node.attachDriver(this);
            driver.zIndex = this._nodeDrivers.length+index;
            return driver;
        });
        return this._nodeDrivers.splice(after,0,...drivers);
    }
    remove<T extends GraphNode>(node:T){
        return this.removeAt(this.indexOf(node), 1);
    }
    removeAt(start: number, deleteCount = 0){
        for(let i = start; i<start+deleteCount; i++)
            this._nodeDrivers[i].delete();
        const deleted = this._nodeDrivers.splice(start,deleteCount);
        if(this._selected && deleted.indexOf(this._selected)>=0)
            this._selected = undefined;
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