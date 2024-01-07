import GraphNode from "../node/gnode/GraphNode";
import GraphProperty from "../node/gnode/GraphProperty";
import Transform from "../transform/Transform";

export default class OutputNode extends GraphNode{
    title = "Вывод";
    constructor(data?:{ properties?:GraphProperty[], transform?:Transform }){
        super(data);
    }
}