import { Control, FabricText } from "fabric";
import type { CanvasTemplateRef, TextConfigs } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useText(canvasRef: CanvasTemplateRef) {
  const addText = (textConfig: TextConfigs) => {
    if (!canvasRef.value?.canvasInstance) return;
    const textObj = new FabricText(textConfig.text, {
      ...textConfig,
    });
    textObj.controls.dd = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: "pointer",
      render: renderDeleteControl,
      mouseDownHandler: () => {
        canvasRef.value?.canvasInstance?.remove(textObj);
      },
    });
    canvasRef.value.canvasInstance.add(textObj);
    canvasRef.value.canvasInstance.centerObject(textObj);
  };

  const updateText = (textConfig: TextConfigs) => {
    const activeObj = canvasRef.value?.activeObj;
    if (activeObj && activeObj?.type === "text") {
      activeObj.set(textConfig);
      canvasRef.value?.canvasInstance?.renderAll();
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
