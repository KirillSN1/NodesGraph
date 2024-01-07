import TextProperty from "../components/properies/text-property/TextProperty";
import GraphNode from "../node/gnode/GraphNode";

export default class PhrazeNode extends GraphNode{
    title = "Фраза";
    constructor(){
        super({
            properties:[
                new TextProperty("","dd"),
            ]
        })
    }
}