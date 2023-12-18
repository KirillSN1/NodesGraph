import GraphNode from "@/components/core/node/gnode/GraphNode";
import TextProperty from "../node_properties/text-property/TextProperty";

export class TextNode extends GraphNode{
    readonly title = "Текст";
    public textProperty:TextProperty;
    constructor(text = "",placeholder = ""){
        const textProperty = new TextProperty(text,placeholder);
        super({
            properties:[textProperty]
        });
        this.textProperty = textProperty;
    }
}