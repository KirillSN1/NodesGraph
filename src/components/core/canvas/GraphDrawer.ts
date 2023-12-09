import GraphNode from "../node/gnode/GraphNode";
import { InputProperty } from "../node/gnode/InputProperty";
import { OutputProperty } from "../node/gnode/OutputSocket";

export class GraphDrawer{
    private context?:CanvasRenderingContext2D;
    private canvasResizeObserver?:ResizeObserver 
    public onRedraw?:(()=>void);
    attach(canvas:HTMLCanvasElement){
        this.context = canvas.getContext("2d") ?? undefined;
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.canvasResizeObserver = new ResizeObserver(()=>this.redraw());
        this.canvasResizeObserver.observe(canvas);
        if(!this.context) throw Error("Can not get context from canvas!");
    }
    detach(){
        this.context = undefined;
        this.canvasResizeObserver?.disconnect();
        this.canvasResizeObserver = undefined;
    }
    drawTreeLinks(root:GraphNode){
        for(const propertie of root.outputProperties){
            for(const ref of propertie.refs){
                if(ref.to instanceof InputProperty) this.drawLink(propertie,ref.to);
                else console.warn("Ref without target exists!");
            }
        }
    }
    drawLink(from:OutputProperty,to:InputProperty){
        this.draw((context)=>{
            context.moveTo(
                from.socket.transform.position.x+from.socket.transform.rect.width/2,
                from.socket.transform.position.y+from.socket.transform.rect.height/2
            );
            context.lineTo(
                to.socket.transform.position.x+to.socket.transform.rect.width/2,
                to.socket.transform.position.y+to.socket.transform.rect.height/2
            );
            context.strokeStyle = "red"
            context.stroke();
        });
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
export class GraphContext{

}
export class Graph{
    private nodes:GraphNode[]; 
    private context:GraphContext = new GraphContext();
    constructor(nodes:GraphNode[]){
        this.nodes = nodes;
    }
}