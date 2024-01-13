import { OutputNode } from "../node/gnode/GraphNode";
import { PropertyWithSocket } from "../node/gnode/PropertyWithSocket";

export default class JsonOutputNode extends OutputNode{
    title = "Json Output";
    private input = PropertyWithSocket.input("Any",{
        getValue(){ this.socket.refs[0]?.to.value },
        socketStyle: { color:"white" }
    })
    constructor(){
        super();
        this.addProperty(this.input);
    }
    calculate(): unknown {
        return this.input.value;
    }
}