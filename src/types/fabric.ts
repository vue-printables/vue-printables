import { FabricImage as FImage } from "fabric";

// Add our custom properties to Fabric's built-in FabricImage type
export interface FabricImage extends FImage {
  id?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
