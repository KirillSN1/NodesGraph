import Position from "./Position"
import Rect from "./Rect";
export default class Transform{
    public position:Position = new Position();
    public rect:Rect = new Rect();
    constructor(data?:{ position?:Position,  rect?:Rect }){
        this.position = data?.position??this.position;
        this.rect = data?.rect??this.rect;
    }
}