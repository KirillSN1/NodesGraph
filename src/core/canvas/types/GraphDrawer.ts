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
                this.drawLink(ref);
            }
        }
    }
    drawLink(ref:GraphRef):void{
        const fromTransform = ref.from.socket.transform;
        const toTransform = ref.to
            ?ref.to.socket.transform
            :new Transform({ position:ref?.target });
            
        // const start = new Vector2({
        //     x:fromTransform.position.x+fromTransform.rect.width/2+this.offset.x,
        //     y:fromTransform.position.y+fromTransform.rect.height/2+this.offset.y
        // })
        // const end = new Vector2({
        //     x:toTransform.position.x+toTransform.rect.width/2+this.offset.x,
        //     y:toTransform.position.y+toTransform.rect.height/2+this.offset.y
        // })
        const start = fromTransform.getCenter().add(this.offset);
        const end = toTransform.getCenter().add(this.offset);
        this.drawLine(start,end);
    }
    drawLine(start:Vector2,end:Vector2){
        this.draw((context)=>{
            context.moveTo(start.x,start.y);
            context.lineTo(end.x, end.y);
            // const gradient = context.createLinearGradient(start.x,start.y,end.x, end.y);
            // gradient.addColorStop(0,property.socket.style.color);
            // gradient.addColorStop(1,ref.to?ref.to.socket.style.color:"white");
            context.strokeStyle = "gray";
            context.lineWidth = 2;
            context.lineCap = "round";
            context.stroke();
            context.closePath();
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
        this.context.save();
    }
}