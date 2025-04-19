import { Control, FabricText, type Canvas } from "fabric";
import type { TextConfig } from "~/components/Editor.vue";
import type { TemplateRefType } from "~/types/common";
import { renderDeleteControl } from "~/utils/fabricHelpers";

export default function useText(
  canvasRef: TemplateRefType<{
    canvasInstance: Canvas | null;
  }>,
) {
  const addText = (textConfig: TextConfig) => {
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

  return { addText };
}
