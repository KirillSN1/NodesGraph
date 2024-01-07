import GraphNode from "../node/gnode/GraphNode";
import GraphProperty from "../node/gnode/GraphProperty";
import Transform from "../transform/Transform";

export class TestNode extends GraphNode{
    readonly title = "Test";
    constructor(data?:{ properties?:GraphProperty[], transform?:Transform }){
        super(data);
    }
}