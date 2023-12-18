import GraphNode from "@/components/core/node/gnode/GraphNode";
import GraphProperty from "@/components/core/node/gnode/GraphProperty";
import Transform from "@/components/core/transform/Transform";

export class TestNode extends GraphNode{
    readonly title = "Test";
    constructor(data?:{ properties?:GraphProperty[], transform?:Transform }){
        super(data);
    }
}