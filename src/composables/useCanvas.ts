import { onMounted, onUnmounted, shallowRef } from "vue";
import { changeDpiDataUrl } from "changedpi";
import {
  Canvas,
  FabricImage,
  FabricObject,
  InteractiveFabricObject,
  Rect,
  type ImageFormat,
} from "fabric";

import type {
  CanvasEditorOptions,
  Position,
  Size,
  TemplateRefType,
} from "~/types/common";

export default function useCanvas(
  canvasRef: TemplateRefType<HTMLCanvasElement | null>,
  options: CanvasEditorOptions,
) {
  const canvasInstance = shallowRef<Canvas | null>(null);
  const clipPath = shallowRef<Rect | null>(null);
  const designArea = shallowRef<Rect | null>(null);
  const activeObj = shallowRef<FabricObject | null>(null);

  const { productImageUrl, canvasSize, clipPathSize, clipPathPos } = options;

  const size = canvasSize ?? {
    width: 550,
    height: 600,
  };

  const designAreaSize = clipPathSize ?? {
    width: 200,
    height: 300,
  };

  onMounted(async () => {
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
        ...clipPathPos,
        fill: "transparent",
        stroke: "#ff6600",
        strokeWidth: 3,
        selectable: true,
        evented: true,
        hasControls: true,
        strokeUniform: true,
        objectCaching: false,
      });

      designArea.value.setControlVisible("mtr", false);

      canvasInstance.value.add(designArea.value);
      if (!clipPathPos) canvasInstance.value.centerObject(designArea.value);
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
        width: designArea.value.getScaledWidth() - 6,
        height: designArea.value.getScaledHeight() - 6,
        strokeWidth: 0,
        absolutePositioned: true,
      });

      // Update clippath when moving design area
      designArea.value.on("moving", async () => {
        if (designArea.value)
          clipPath.value?.set({
            left: designArea.value.left + 3,
            top: designArea.value.top + 3,
            width: designArea.value.getScaledWidth() - 6,
            height: designArea.value.getScaledHeight() - 6,
            absolutePositioned: true,
          });
      });

      designArea.value.on("scaling", async () => {
        if (designArea.value) {
          clipPath.value?.set({
            left: designArea.value.left + 3,
            top: designArea.value.top + 3,
            width: designArea.value.getScaledWidth() - 6,
            height: designArea.value.getScaledHeight() - 6,
            absolutePositioned: true,
          });
        }
      });
    } catch (error) {
      throw new Error(`Failed to initialize canvas: ${error}`);
    }
  });

  const exportAsImg = async (
    size: Size,
    designOption: {
      size?: Size;
      position?: Position;
      dpi?: number;
    } = {},
    format: ImageFormat = "jpeg",
  ) => {
    if (!clipPath.value || !canvasInstance.value) return;

    // Set default values if not provided
    const dpi = designOption.dpi || 150;
    const designSize = designOption.size ?? size;

    const xScale = designSize.width / clipPath.value.getScaledWidth();
    const yScale = designSize.height / clipPath.value.getScaledHeight();

    const outputCanvas = new Canvas("", {
      width: size.width,
      height: size.height,
    });

    const centerClipPathPos = {
      left: (size.width - designSize.width) / 2,
      top: (size.height - designSize.height) / 2,
    };

    const scaledClipPathNewPosition =
      designOption.position ?? centerClipPathPos;

    const scaledClipPath = await clipPath.value.clone();

    scaledClipPath.set({
      left: scaledClipPathNewPosition.left,
      top: scaledClipPathNewPosition.top,
      scaleX: clipPath.value.scaleX * xScale,
      scaleY: clipPath.value.scaleY * yScale,
    });

    outputCanvas.clipPath = scaledClipPath;

    const offsetX =
      scaledClipPathNewPosition.left - clipPath.value.left * xScale;
    const offsetY = scaledClipPathNewPosition.top - clipPath.value.top * yScale;

    const objects = canvasInstance.value.getObjects() || [];

    for (const _obj of objects) {
      if (_obj.type === "image") {
        const obj = _obj as FabricImage;
        const image = await FabricImage.fromURL(obj.getSrc());

        image.set({
          noScaleCache: true,
          objectCaching: false,
          left: obj.left * xScale + offsetX,
          top: obj.top * yScale + offsetY,
          scaleX: obj.scaleX * xScale,
          scaleY: obj.scaleY * yScale,
          clipPath: null,
        });

        outputCanvas.add(image);
      } else if (_obj.type === "text") {
        const clonedObj = await _obj.clone();
        clonedObj.set({
          noScaleCache: true,
          objectCaching: false,
          left: _obj.left * xScale + offsetX,
          top: _obj.top * yScale + offsetY,
          scaleX: _obj.scaleX * xScale,
          scaleY: _obj.scaleY * yScale,
          clipPath: null,
        });

        outputCanvas.add(clonedObj);
      }
    }

    const dataURL = outputCanvas.toDataURL({
      format,
      quality: 1,
      multiplier: 1,
    });

    const dataURLDpi = changeDpiDataUrl(dataURL, dpi);

    outputCanvas.dispose();
    return dataURLDpi;
  };

  const exportAsJson = () => {
    return canvasInstance.value?.toJSON();
  };

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
    exportAsImg,
    exportAsJson,
  };
}
