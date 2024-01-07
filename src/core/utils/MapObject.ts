// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapObject = (o:object,f:(value: [string, any], index: number, array: [string, any][]) => readonly [PropertyKey, any])=>Object.fromEntries(Object.entries(o).map(f));
export default MapObject;