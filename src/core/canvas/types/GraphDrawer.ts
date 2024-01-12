import { PropertyWithSocket } from "@/core/node";
import GraphNode from "../../node/gnode/GraphNode";
import GraphRef from "../../node/gnode/GraphRef";
// import { InputProperty, OutputProperty, PropertyWithSocket } from "../../node/gnode/PropertyWithSocket";
// import Position from "../../transform/Position";
import Transform from "../../transform/Transform";
import Vector2 from "../../vector/Vector2";

export class GraphDrawer{
    private context?:CanvasRenderingContext2D;
    private canvasResizeObserver?:ResizeObserver 
    public onRedraw?:(()=>void);
    public offset:Vector2 = new Vector2();
    public get attached(){ return this.context != undefined; }
    attach(canvas:HTMLCanvasElement):void{
        this.context = canvas.getContext("2d") ?? undefined;
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.canvasResizeObserver = new ResizeObserver(()=>this.redraw());
        this.canvasResizeObserver.observe(canvas);
        if(!this.context) throw Error("Can not get context from canvas!");
    }
    detach():void{
        this.context = undefined;
        this.canvasResizeObserver?.disconnect();
        this.canvasResizeObserver = undefined;
    }
    drawTreeLinks(root:GraphNode):void{
        for(const propertie of root.outputProperties){
            for(const ref of propertie.socket.refs){
                this.drawRef(ref);
            }
        }
    }
    drawRef(ref:GraphRef):void{
        this.drawLink(ref.from,ref.to);
    }
    drawLink(startProperty:PropertyWithSocket | Vector2,endProperty:PropertyWithSocket | Vector2){
        const getPosition = (prop:PropertyWithSocket | Vector2)=>prop instanceof PropertyWithSocket?
            prop.socket.transform.getCenter().add(this.offset):
            prop;
        const getPropertiyColor = (prop:PropertyWithSocket | Vector2)=>prop instanceof PropertyWithSocket?
            prop.socket.style.color:"gray"
        const start = getPosition(startProperty);
        const end = getPosition(endProperty);
        this.draw((context)=>{
            context.beginPath();
            context.moveTo(start.x,start.y);
            // context.lineTo(end.x, end.y);
            const xc = (start.x + end.x) / 2;
            const yc = (start.y + end.y) / 2;
            context.quadraticCurveTo((start.x+xc)/2, start.y, xc, yc);
            context.quadraticCurveTo((end.x+xc)/2, end.y, end.x, end.y);
            // context.quadraticCurveTo(end.y, yc , xc, yc);
            const gradient = context.createLinearGradient(start.x,start.y,end.x, end.y);
            gradient.addColorStop(0, getPropertiyColor(startProperty));
            gradient.addColorStop(1, getPropertiyColor(endProperty));
            context.strokeStyle = gradient;
            context.lineWidth = 2;
            context.lineCap = "round";
            context.stroke();
        })
    }
    public redraw(){
        this.draw((context)=>{
            const canvas = context.canvas;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            this.onRedraw?.();
        });
    }
    private draw(callback:(context:CanvasRenderingContext2D)=>void){
        if(!this.context) throw new Error("You must set canvas before.");
        callback(this.context);
        // this.context.save();
    }
}