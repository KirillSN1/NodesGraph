import { onBeforeUnmount, ref } from "vue";

export function useTabNavigation(selectors = "button", lockTab = true){
    const controlsParent = ref<HTMLDivElement>();
    const getParent = ()=>{
        if(!controlsParent.value) throw new Error("Can not get buttons");
        return controlsParent.value;
    }
    const getElements = ()=>{
        const buttons = getParent().querySelectorAll(selectors);
        return [...buttons] as HTMLButtonElement[];
    }
    const focusedIndex = ref(-1);
    function focus(index:number){
        const buttons = getElements();
        if(!buttons[index]) return buttons[0]?.focus();
        return buttons[index].focus();
    }
    function onFocus(index:number){
        focusedIndex.value = index;
    }
    function onBlur(){
        focusedIndex.value = -1;
    }
    function focusPrev(){
        const buttons = getElements();
        const prevButton = buttons[focusedIndex.value-1];
        if(!prevButton) return buttons[buttons.length-1]?.focus();
        return prevButton.focus();
    }
    function focusNext(){
        const buttons = getElements();
        const nextButton = buttons[focusedIndex.value+1];
        if(!nextButton) return buttons[0]?.focus();
        return nextButton.focus();
    }
    /**
     * 
     * @returns true if sucessfuly handles (if arrow pressed)
     */
    function handleArrows(e:KeyboardEvent){
        if(lockTab && e.key == "Tab") {
            if(e.shiftKey){
                if(focusedIndex.value<=0) return false
                else focusPrev();
            } else focusNext();
        }
        else if(["ArrowDown","ArrowRight"].includes(e.key)) focusNext()
        else if(["ArrowUp","ArrowLeft"].includes(e.key)) focusPrev()
        else return false;
        return true;
    }
    function blur(){
        if(focusedIndex.value == -1) return;
        getElements()[focusedIndex.value]?.blur();
        focusedIndex.value = -1;
    }
    onBeforeUnmount(()=>blur());
    return {
        controlsParent,
        focus,
        handleArrows,
        blur,
        onFocus,
        onBlur,
        focusedIndex,
        isActive(){
            return focusedIndex.value>=0 && focusedIndex.value<getElements().length
        }
    }
}