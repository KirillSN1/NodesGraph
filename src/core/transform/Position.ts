import Vector2 from "../vector/Vector2";
export default class Position extends Vector2{
    constructor(pos?:{ x?:number, y?:number }){
        super(pos);
    }
}