import { shallowRef } from "vue";
import { Canvas, FabricObject, InteractiveFabricObject, Rect } from "fabric";
import type { CanvasEditorOptions, TemplateRefType } from "~/types/common";

export default function useCanvas(
  canvasRef: TemplateRefType<HTMLCanvasElement | null>,
) {
  const canvasInstance = shallowRef<Canvas | null>(null);
  const activeObj = shallowRef<FabricObject | null>(null);

  const initCanvas = async (options: CanvasEditorOptions) => {
    const { canvasSize, clipPathSize } = options;

    const size = {
      width: canvasSize?.width ?? 550,
      height: canvasSize?.height ?? 600,
    };

    const designAreaSize = {
      width: clipPathSize?.width ?? 200,
      height: clipPathSize?.height ?? 300,
    };

    if (!canvasRef.value) {
      throw new Error("Canvas element ref is not available");
    }

    InteractiveFabricObject.ownDefaults = {
      ...InteractiveFabricObject.ownDefaults,
      hasControls: true,
      cornerSize: 10,
      cornerStrokeColor: "#0066cc",
      cornerColor: "#99ccff",
      cornerStyle: "circle",
      transparentCorners: false,
      cornerDashArray: null,
      centeredScaling: true,
      centeredRotation: true,
      borderDashArray: [5, 2],
    };

    // Create a "design area" rect that visually indicates the printable region
    const printableArea = new Rect({
      ...designAreaSize,
      strokeWidth: 3,
      strokeUniform: true,
      fill: "transparent",
      stroke: "#ff6600",
      borderScaleFactor: 2,
      selectable: true,
      setControlsVisibility: {
        mtr: false, // Hide rotation control if not needed
      },
    });

    const mainClipPath = await printableArea.clone();

    mainClipPath.set({
      width: printableArea.width + 30,
      height: printableArea.height + 30,
    });

    canvasInstance.value = new Canvas(canvasRef.value, {
      ...size,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
      uniformScaling: false,
      enableRetinaScaling: true,
      clipPath: mainClipPath,
    });

    printableArea.on("scaling", async () => {
      mainClipPath.set({
        width: printableArea.width + 30,
        height: printableArea.height + 30,
        left: printableArea.left - 15,
        top: printableArea.top - 15,
        scaleX: printableArea.scaleX,
        scaleY: printableArea.scaleY,
      });
    });

    printableArea.on("moving", async () => {
      mainClipPath.set({
        width: printableArea.width + 30,
        height: printableArea.height + 30,
        left: printableArea.left - 15,
        top: printableArea.top - 15,
        scaleX: printableArea.scaleX,
        scaleY: printableArea.scaleY,
      });
    });

    canvasInstance.value.on("mouse:down", () => {
      const obj = canvasInstance.value?.getActiveObject();

      if (obj) {
        activeObj.value = obj;
      } else {
        activeObj.value = null;
      }
    });

    canvasInstance.value.add(printableArea);
    canvasInstance.value.centerObject(printableArea);
    canvasInstance.value.centerObject(mainClipPath);
  };

  const cleanup = async () => {
    if (canvasInstance.value) {
      await canvasInstance.value?.dispose();
      canvasInstance.value = null;
      activeObj.value = null;
    }
  };

  return {
    fabricCanvas: canvasInstance,
    activeObj,
    initCanvas,
    cleanup,
  };
}
