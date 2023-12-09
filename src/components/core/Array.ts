export function cleanMap<T,R>(array:T[], callback:(item:T,index:number,array:T[])=>R|undefined){
    const result:R[] = [];
    for(let i = 0; i<array.length; i++){
        const item = callback(array[i],i,array);
        if(item) result.push(item);
    }
    return result;
}