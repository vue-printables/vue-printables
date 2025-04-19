import { Control, FabricImage, type Canvas } from "fabric";
import type { TemplateRefType } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useImage(
  canvasRef: TemplateRefType<{
    canvasInstance: Canvas | null;
  }>,
) {
  const addImage = (imgElement: HTMLImageElement) => {
    const image = new FabricImage(imgElement);
    image.controls.dd = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: "pointer",
      render: renderDeleteControl,
      mouseDownHandler: () => {
        canvasRef.value?.canvasInstance?.remove(image);
      },
    });
    canvasRef.value?.canvasInstance?.add(image);
    canvasRef.value?.canvasInstance?.centerObject(image);
  };

  return { addImage };
}
