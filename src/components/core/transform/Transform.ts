import Vector2 from "../vector/Vector2";
import Position from "./Position"
import Rect from "./Rect";
export default class Transform{
    public position:Position = new Position();
    public rect:Rect = new Rect();
    constructor(data?:{ position?:Position,  rect?:Rect }){
        this.position = data?.position??this.position;
        this.rect = data?.rect??this.rect;
    }
    getCenter():Vector2{
        return new Vector2({
            x:this.position.x+this.rect.width/2,
            y:this.position.y+this.rect.height/2
        })
    }
}