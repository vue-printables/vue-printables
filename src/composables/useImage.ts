import { Control, FabricImage } from "fabric";
import type { CanvasTemplateRef, ImgConfigs } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useImage(canvasRef: CanvasTemplateRef) {
  const addImage = (imgElement: HTMLImageElement) => {
    const image = new FabricImage(imgElement);
    image.controls.dd = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -12,
      offsetX: 12,
      cursorStyle: "pointer",
      render: renderDeleteControl,
      mouseDownHandler: () => {
        canvasRef.value?.canvasInstance?.remove(image);
      },
    });
    canvasRef.value?.canvasInstance?.add(image);
    canvasRef.value?.canvasInstance?.centerObject(image);
  };

  const updateImage = (imgConfig: ImgConfigs) => {
    const activeObj = canvasRef.value?.activeObj;
    if (activeObj && activeObj?.type === "image") {
      activeObj.set(imgConfig);
      canvasRef.value?.canvasInstance?.renderAll();
    } else {
      if (activeObj && activeObj?.type !== "image") {
        throw new Error(
          `Active object select not of type "Image" is of type "${activeObj?.type}"`,
        );
      } else {
        throw new Error("No active object selected");
      }
    }
  };

  return { addImage, updateImage };
}
