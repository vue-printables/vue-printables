import { Control, FabricImage } from "fabric";
import type { CanvasTemplateRef, ImgConfigs } from "~/types/common";
import { centerRelativeTo } from "~/utils/fabric";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useImage(canvasRef: CanvasTemplateRef) {
  const addImage = async (url: string, options?: ImgConfigs) => {
    if (
      !canvasRef.canvasInstance.value ||
      !canvasRef.designArea.value ||
      !canvasRef.clipPath.value
    )
      return;

    const image = await FabricImage.fromURL(url);

    const width = options?.width ?? canvasRef.designArea.value.getScaledWidth();
    const height =
      options?.height ?? canvasRef.designArea.value.getScaledHeight();

    const scale = Math.min(
      (width * 0.8) / image.width,
      (height * 0.8) / image.height,
    );

    image.set({
      clipPath: canvasRef.clipPath.value,
      top: options?.top,
      left: options?.left,
      scaleX: scale,
      scaleY: scale,
    });

    if (!options?.left && !options?.top)
      centerRelativeTo(image, canvasRef.designArea.value);

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
