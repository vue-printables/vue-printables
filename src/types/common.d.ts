import type { ShallowRef } from "vue";
export type TemplateRefType<T> = Readonly<ShallowRef<T | null>>;

export type Size = {
  width: number;
  height: number;
};

export type TextConfigs = {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "" | "normal" | "italic" | "oblique";
  underline: boolean;
  fill: string;
  stroke: string;
};
