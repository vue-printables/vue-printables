import { Control, FabricImage } from "fabric";
import type { CanvasTemplateRef, ImgConfigs } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useImage(canvasRef: CanvasTemplateRef) {
  const addImage = (imgElement: HTMLImageElement) => {
    if (
      !canvasRef.canvasInstance.value ||
      !canvasRef.designArea.value ||
      !canvasRef.clipPath.value
    )
      return;

    const image = new FabricImage(imgElement, {
      clipPath: canvasRef.clipPath.value,
    });

    const scale = Math.min(
      (canvasRef.designArea.value.getScaledWidth() * 0.8) / image.width,
      (canvasRef.designArea.value.getScaledHeight() * 0.8) / image.height,
    );

    image.set({ scaleX: scale, scaleY: scale });

    image.controls.dd = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -12,
      offsetX: 12,
      cursorStyle: "pointer",
      render: renderDeleteControl,
      mouseDownHandler: () => {
        canvasRef.canvasInstance.value?.remove(image);
      },
    });
    canvasRef.canvasInstance.value.add(image);
    canvasRef.canvasInstance.value.centerObject(image);
    canvasRef.canvasInstance.value.setActiveObject(image);
    canvasRef.canvasInstance.value.requestRenderAll();
  };

  const updateImage = (imgConfig: ImgConfigs) => {
    const activeObj = canvasRef.activeObj.value;
    if (activeObj && activeObj?.type === "image") {
      activeObj.set(imgConfig);
      canvasRef.canvasInstance.value?.requestRenderAll();
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
