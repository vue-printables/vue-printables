import { shallowRef } from "vue";
import {
  Canvas,
  FabricImage,
  FabricObject,
  InteractiveFabricObject,
  Rect,
} from "fabric";
import type { CanvasEditorOptions, TemplateRefType } from "~/types/common";

export default function useCanvas(
  canvasRef: TemplateRefType<HTMLCanvasElement | null>,
) {
  const canvasInstance = shallowRef<Canvas | null>(null);
  const clipPath = shallowRef<Rect | null>(null);
  const designArea = shallowRef<Rect | null>(null);
  const activeObj = shallowRef<FabricObject | null>(null);

  const initCanvas = async (options: CanvasEditorOptions) => {
    const { productImageUrl, canvasSize, clipPathSize } = options;

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

    try {
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

      // Initialize the main Fabric Canvas
      canvasInstance.value = new Canvas(canvasRef.value, {
        ...size,
        backgroundColor: "transparent",
        selection: true,
        preserveObjectStacking: true,
        uniformScaling: false,
        enableRetinaScaling: true,
      });

      // Load and add the product image as a background image
      const productImage = await FabricImage.fromURL(productImageUrl);

      // Keep original size but scale to fit canvas if needed
      const imageScale = Math.min(
        size.width / (productImage.width ?? 1),
        size.height / (productImage.height ?? 1),
      );

      productImage.set({
        scaleX: imageScale,
        scaleY: imageScale,
        selectable: false,
        evented: false,
      });

      canvasInstance.value.backgroundImage = productImage;

      // Create design area visual indicator
      designArea.value = new Rect({
        ...designAreaSize,
        fill: "transparent",
        stroke: "#ff6600",
        strokeWidth: 3,
        selectable: true,
        evented: true,
        hasControls: true,
        lockRotation: true,
      });

      canvasInstance.value.add(designArea.value);
      canvasInstance.value.centerObject(designArea.value);
      canvasInstance.value.bringObjectToFront(designArea.value);

      // Set up event handlers
      designArea.value.on("moving", updateClipPath);
      designArea.value.on("scaling", updateClipPath);
      designArea.value.on("resizing", updateClipPath);

      canvasInstance.value.on("mouse:down", () => {
        const obj = canvasInstance.value?.getActiveObject();

        if (obj) {
          activeObj.value = obj;
        } else {
          activeObj.value = null;
        }
      });

      // Initial clip path sync
      updateClipPath();
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
      throw new Error(`Failed to initialize canvas: ${error}`);
    }
  };

  // Create and Sync the Clip Path for all objects on the canvas
  const updateClipPath = () => {
    if (!canvasInstance.value || !designArea.value) return;

    // Create a clip path that matches the design area's dimensions and position
    clipPath.value = new Rect({
      left: designArea.value.left,
      top: designArea.value.top,
      width: designArea.value.getScaledWidth(),
      height: designArea.value.getScaledHeight(),
      absolutePositioned: true,
    });

    // Iterate over all objects on the canvas and apply the same clip path
    canvasInstance.value.forEachObject((obj) => {
      // Do not apply the clip path to the design area rect itself
      if (obj !== designArea.value && clipPath.value) {
        obj.clipPath = clipPath.value;
      }
    });
    canvasInstance.value.requestRenderAll();
  };

  const cleanup = async () => {
    if (canvasInstance.value) {
      await canvasInstance.value?.dispose();
      canvasInstance.value = null;
      clipPath.value = null;
      designArea.value = null;
      activeObj.value = null;
    }
  };

  return {
    canvasInstance,
    designArea,
    clipPath,
    activeObj,
    initCanvas,
    cleanup,
  };
}
