import { Control, FabricText } from "fabric";
import type { CanvasTemplateRef, TextConfigs } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useText(canvasRef: CanvasTemplateRef) {
  const addText = (textConfig: TextConfigs) => {
    if (
      !canvasRef.canvasInstance.value ||
      !canvasRef.designArea.value ||
      !canvasRef.clipPath.value
    )
      return;

    const textObj = new FabricText(textConfig.text, {
      ...textConfig,
      clipPath: canvasRef.clipPath.value,
      left:
        canvasRef.designArea.value.left +
        canvasRef.designArea.value.getScaledWidth() * 0.1,
      top:
        canvasRef.designArea.value.top +
        canvasRef.designArea.value.getScaledHeight() * 0.4,
    });
    textObj.controls.dd = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -12,
      offsetX: 12,
      cursorStyle: "pointer",
      render: renderDeleteControl,
      mouseDownHandler: () => {
        canvasRef.canvasInstance.value?.remove(textObj);
      },
    });
    canvasRef.canvasInstance.value.add(textObj);
    canvasRef.canvasInstance.value.setActiveObject(textObj);
    canvasRef.canvasInstance.value.requestRenderAll();
  };

  const updateText = (textConfig: TextConfigs) => {
    const activeObj = canvasRef.activeObj.value;
    if (activeObj && activeObj?.type === "text") {
      activeObj.set(textConfig);
      canvasRef.canvasInstance.value?.requestRenderAll();
    } else {
      if (activeObj && activeObj?.type !== "text") {
        throw new Error(
          `Active object select not of type "Text" is of type "${activeObj?.type}"`,
        );
      } else {
        throw new Error("No active object selected");
      }
    }
  };

  return { addText, updateText };
}
