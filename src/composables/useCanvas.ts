import { onMounted, onUnmounted, shallowRef } from "vue";
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
  options: CanvasEditorOptions,
) {
  const canvasInstance = shallowRef<Canvas | null>(null);
  const clipPath = shallowRef<Rect | null>(null);
  const designArea = shallowRef<Rect | null>(null);
  const activeObj = shallowRef<FabricObject | null>(null);

  onMounted(async () => {
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

      // Create design area visual indicator/control for canvas clippath
      designArea.value = new Rect({
        ...designAreaSize,
        fill: "transparent",
        stroke: "#ff6600",
        strokeWidth: 3,
        selectable: true,
        evented: true,
        hasControls: true,
        // FIXME: if you are going to lock rotation remove it form id
        lockRotation: true,
      });

      canvasInstance.value.add(designArea.value);
      // FIXME: design Area won't be centered always. you should pass printable area position as an argument.
      // TODO: we will end up making or own centerObject function that centers object which centers the object relative to printable area.
      canvasInstance.value.centerObject(designArea.value);
      canvasInstance.value.bringObjectToFront(designArea.value);

      canvasInstance.value.on("mouse:down", () => {
        const obj = canvasInstance.value?.getActiveObject();

        if (obj) {
          activeObj.value = obj;
        } else {
          activeObj.value = null;
        }
      });

      // Create clippath from design area while taking in consideration stroke of 3px
      clipPath.value = (await designArea.value.clone()).set({
        left: designArea.value.left + 3,
        top: designArea.value.top + 3,
        width: designAreaSize.width - 6,
        height: designAreaSize.height - 6,
        absolutePositioned: true,
      });
      // Update clippath when moving design area
      designArea.value.on("moving", async (e) => {
        clipPath.value?.set({
          left: e.transform.target.left + 3,
          top: e.transform.target.top + 3,
          width: designAreaSize.width - 6,
          height: designAreaSize.height - 6,
          absolutePositioned: true,
        });
      });
    } catch (error) {
      throw new Error(`Failed to initialize canvas: ${error}`);
    }
  });

  onUnmounted(async () => {
    canvasInstance.value?.dispose();
    canvasInstance.value = null;
    clipPath.value = null;
    designArea.value = null;
    activeObj.value = null;
  });

  return {
    canvasInstance,
    designArea,
    clipPath,
    activeObj,
  };
}
