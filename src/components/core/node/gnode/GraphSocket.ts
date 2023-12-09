import VirtualNode from "../virtual/VirtualNode";
export abstract class GraphSocketStyle{
    protected abstract color:string;
}
export abstract class GraphSocket extends VirtualNode{
    protected abstract style:GraphSocketStyle
}
export abstract class InputSocketStyle extends GraphSocketStyle{}
export abstract class OutputSocketStyle extends GraphSocketStyle{}
export abstract class OutputSocket extends GraphSocket{
    protected abstract style: OutputSocketStyle;
}
export abstract class InputSocket extends GraphSocket{
    protected abstract style: InputSocketStyle;
}