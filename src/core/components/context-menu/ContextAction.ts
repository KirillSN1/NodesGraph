export type CtxActionHandler<T> = (ev:{ originalEvent:MouseEvent, target:EventTarget | null, data:T }) => void;
export default class ContextAction<T = any>{
    group?: string;
    parentGroup: string;
    handler: CtxActionHandler<T>;
    title?: string;
    constructor(title?:string, handler:CtxActionHandler<T> = ()=>null, parentGroup = 'default'){
        this.title = title;
        this.parentGroup = parentGroup;
        this.handler = handler;
    }
    withHandler(handler:CtxActionHandler<T> = ()=>null){
        this.handler = handler;
        return this;
    }
    withParentGroup(groupName:string){
        this.parentGroup = groupName;
        return this;
    }
    static group<T>(name:string, title?:string, handler:CtxActionHandler<T> = ()=>null, parentGroup = 'default'){
        const action = new ContextAction(title, handler, parentGroup);
        action.group = name;
        return action;
    }
}