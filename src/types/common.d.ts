export type TemplateRefType<T> = Readonly<ShallowRef<T | null>>;

export type Size = {
  width: number;
  height: number;
};
