export default class Rect{
    public width = 0;
    public height = 0;
    constructor(data?:{ width?:number, height?:number }){
        this.width = data?.width ?? 0;
        this.height = data?.height ?? 0;
    }
    static add(...rects:Rect[]):Rect{
        if(!rects.length) throw new Error(`Expected 2 arguments with type ${Rect}`);
        if(rects.length==1) return rects[0];
        const v1 = rects[0];
        const v2 = rects[1];
        return Rect.add(new Rect({ width:v1.width+v2.width, height:v1.height+v2.height }),...rects.slice(2));
    }
    add(...rects:Rect[]){ return Rect.add(this,...rects); }
    negative(){
        return new Rect({ width:-this.width, height:-this.height });
    }
}