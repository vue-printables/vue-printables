import { Control, FabricImage } from "fabric";
import type { CanvasTemplateRef, ImgConfigs } from "~/types/common";
import { centerRelativeTo } from "~/utils/fabric";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useImage(canvasRef: CanvasTemplateRef) {
  const addImage = async (url: string) => {
    if (
      !canvasRef.canvasInstance.value ||
      !canvasRef.designArea.value ||
      !canvasRef.clipPath.value
    )
      return;

    const image = await FabricImage.fromURL(url);
    image.set({
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

    centerRelativeTo(image, canvasRef.designArea.value);
    canvasRef.canvasInstance.value.add(image);
    canvasRef.canvasInstance.value.setActiveObject(image);
    canvasRef.activeObj.value = image;
    canvasRef.canvasInstance.value.requestRenderAll();
  };

  const updateImage = (imgConfig: ImgConfigs) => {
    const activeObj = canvasRef.activeObj.value;
    if (activeObj && activeObj?.type === "image") {
      activeObj.set(imgConfig);
      activeObj.setCoords();
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
