import type { Canvas, FabricObject, Rect } from "fabric";
import type { Ref, ShallowRef } from "vue";
export type TemplateRefType<T> = Readonly<ShallowRef<T | null>>;

export type Size = {
  width: number;
  height: number;
};

export type Position = {
  left: number;
  top: number;
};

export type TextConfigs = {
  [key: string]: any;
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
  [key: string]: any;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  opacity?: number;
  angle?: number;
};

export type CanvasTemplateRef = {
  canvasInstance: Ref<Canvas | null>;
  designArea: Ref<Rect | null>;
  clipPath: Ref<Rect | null>;
  activeObj: Ref<FabricObject | null>;
};

export interface CanvasOptions {
  initOnMount?: boolean;
  size?: Size;
  clipPathOption?: {
    size?: Size;
    position?: Position;
    movable?: boolean;
  };
  bgImg?: {
    url: string;
    position?: Position;
    size?: Size;
  };
}
