import { InjectionKey } from "vue";

const mouseScopeSymbol = Symbol("d") as InjectionKey<{ [key:string]:Event | undefined }>;
export default mouseScopeSymbol;