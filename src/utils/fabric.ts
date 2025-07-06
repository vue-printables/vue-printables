import type { FabricObject } from "fabric";

export function centerRelativeTo(
  obj: FabricObject,
  relative_obj: FabricObject,
) {
  const left =
    relative_obj.left +
    (relative_obj.getScaledWidth() - obj.getScaledWidth()) / 2;
  const top =
    relative_obj.top +
    (relative_obj.getScaledHeight() - obj.getScaledHeight()) / 2;

  obj.set({
    left,
    top,
  });
}
