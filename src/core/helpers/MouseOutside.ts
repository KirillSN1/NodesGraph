const mouseOutside = (target:Element,event:MouseEvent)=>{
    return !target.contains(event.target as Element);
}
export { mouseOutside };