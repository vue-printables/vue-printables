import type { ShallowRef } from "vue";
export type TemplateRefType<T> = Readonly<ShallowRef<T | null>>;

export type Size = {
  width: number;
  height: number;
};

export type TextConfigs = {
  [key: string];
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle?: "" | "normal" | "italic" | "oblique";
  underline: boolean;
  fill?: string;
  stroke?: string;
};

export type ImgConfigs = {
  [key: string];
  width: number;
  height: number;
  opacity?: number;
  angle?: number;
};

export type CanvasTemplateRef = TemplateRefType<{
  canvasInstance: Canvas | null;
  activeObj: FabricObject | null;
}>;

export interface CanvasEditorOptions {
  productImageUrl: string;
  canvasSize?: Partial<Size>;
  clipPathSize?: Partial<Size>;
}
