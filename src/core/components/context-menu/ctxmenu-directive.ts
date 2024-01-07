import { Directive, DirectiveBinding } from "vue";
import { attributePrefix, elementProperty } from "./constants";
const dataArg = "data";
class ElementWithCTXMenuData extends Element{
    [elementProperty]:unknown
}
const updateCtxData = (el:ElementWithCTXMenuData,binding:DirectiveBinding)=>{
    if(binding.arg && binding.arg!=dataArg) return el.setAttribute(`${attributePrefix}:${binding.arg}`,binding.value);
    if(!(elementProperty in el))
        Object.defineProperty(el,elementProperty,{ writable:true, configurable:true, enumerable:false });
    if(elementProperty in el) el[elementProperty] = binding.value;
}
export default {
    beforeMount(el,binding){ updateCtxData(el,binding); },
    updated(el,binding){ updateCtxData(el,binding); },
    beforeUnmount(el, binding){
        if(binding.arg && binding.arg!=dataArg) return el.removeAttribute(`${attributePrefix}:${binding.arg}`);
        if(elementProperty in el) delete el[elementProperty];
    },
} as Directive<ElementWithCTXMenuData,unknown>;