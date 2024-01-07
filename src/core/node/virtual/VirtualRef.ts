import GraphProperty from "../gnode/GraphProperty";

export default abstract class VirtualRef<T extends GraphProperty, O extends GraphProperty>{
    readonly abstract from?: O | undefined;
    readonly abstract to?: T | undefined;
}