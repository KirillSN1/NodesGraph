export default class Vector2{
    public x = 0;
    public y = 0;
    constructor(pos?:{ x?:number, y?:number }){
        this.x = pos?.x ?? 0;
        this.y = pos?.y ?? 0;
    }
    copyWith(pos?:{ x?:number, y?:number }){
        return new Vector2({
            x: pos?.x ?? this.x,
            y: pos?.y ?? this.y
        });
    }
    static add(...vectors:Vector2[]):Vector2{
        if(!vectors.length) throw new Error(`Expected 2 arguments with type ${Vector2}`);
        if(vectors.length==1) return vectors[0];
        const v1 = vectors[0];
        const v2 = vectors[1];
        return Vector2.add(new Vector2({ x:v1.x+v2.x, y:v1.y+v2.y }),...vectors.slice(2));
    }
    add(...vectors:Vector2[]):Vector2{ return Vector2.add(this,...vectors); }
    negative(){
        return new Vector2({ x:-this.x, y:-this.y });
    }
}