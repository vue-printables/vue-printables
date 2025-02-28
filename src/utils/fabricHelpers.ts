import {
  Canvas,
  Control,
  FabricObject,
  FabricImage as FImage,
  FabricText as FText,
  Point,
  type TPointerEvent,
} from "fabric";
import type { FabricImage } from "../types/fabric";
import { generateUniqueId } from "./common";
import type { TextConfig } from "../components/TextEditor.vue";

/**
 * Adds a delete control button to a Fabric object
 */
export const addDeleteControl = (obj: FabricObject, canvas: Canvas) => {
  // Initialize controls if needed
  if (!obj.controls) {
    obj.controls = {};
  }

  // Create delete control with fabric v6 API
  obj.controls.deleteControl = new Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: "pointer",
    // Make control visible
    withConnection: false,

    mouseUpHandler: function (_: TPointerEvent, transformData: any) {
      const target = transformData.target;
      if (target) {
        canvas.remove(target);
        canvas.requestRenderAll();
      }
      return true;
    },

    // Properly render the control
    render: (ctx, left, top) => {
      // Draw the delete button (X)
      const size = 16;
      ctx.save();

      // Draw the circle
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(left, top, size / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Draw the X
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("X", left, top);

      ctx.restore();
    },

    // This ensures the control is visible and clickable
    positionHandler: function (dim, finalMatrix, fabricObject) {
      const x =
        (this.x || 0) * dim.x + (this.offsetX || 0) * fabricObject.scaleX;
      const y =
        (this.y || 0) * dim.y + (this.offsetY || 0) * fabricObject.scaleY;

      return new Point(x, y).transform(finalMatrix);
    },
  });

  // Ensure controls are visible
  obj.setControlsVisibility({
    mtr: true, // Rotation control
    deleteControl: true,
  });
};

/**
 * Creates a Fabric.js image from an uploaded image element
 */
export const createFabricImage = async (
  imgElement: HTMLImageElement,
  canvas: Canvas,
  callback?: (image: FabricImage) => void,
): Promise<void> => {
  const id = generateUniqueId();

  try {
    // In v6, fromURL returns a Promise
    const img = (await FImage.fromURL(imgElement.src, {
      crossOrigin: "anonymous",
    })) as FabricImage;

    img.id = id;

    // Set a reasonable initial size and position
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Get image dimensions
    const imgWidth = img.width ?? 0;
    const imgHeight = img.height ?? 0;

    // Scale the image to fit the canvas (80% of canvas size)
    const scale = Math.min(
      (canvasWidth * 0.8) / imgWidth,
      (canvasHeight * 0.8) / imgHeight,
    );

    img.scale(scale);

    // Center the image on the canvas
    img.set({
      left: (canvasWidth - imgWidth * scale) / 2,
      top: (canvasHeight - imgHeight * scale) / 2,
      cornerSize: 10,
      cornerColor: "#0066ff",
      cornerStyle: "circle",
      transparentCorners: false,
      borderColor: "#0066ff",
      borderScaleFactor: 2,
      selectable: true,
      hasControls: true,
    });

    // Add the delete control to the image
    addDeleteControl(img, canvas);

    // Add the image to the canvas
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();

    if (callback) callback(img);
  } catch (error) {
    console.error("Error creating fabric image:", error);
  }
};

/**
 * Creates a Fabric.js text object with the provided configuration
 */
export const createFabricText = (
  textConfig: TextConfig,
  canvas: Canvas,
): void => {
  const id = generateUniqueId();

  // Create text object with fabric v6 API
  const text = new FText(textConfig.text, {
    fontFamily: textConfig.fontFamily,
    fontSize: textConfig.fontSize,
    fontWeight: textConfig.fontWeight,
    fontStyle: textConfig.fontStyle,
    underline: textConfig.underline,
    textAlign: textConfig.textAlign as any,
    fill: textConfig.color,
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    cornerSize: 10,
    cornerColor: "#0066ff",
    cornerStyle: "circle",
    transparentCorners: false,
    borderColor: "#0066ff",
    borderScaleFactor: 2,
    selectable: true,
    hasControls: true,
    editable: true, // Allow text editing on double click
  });

  // Add an ID to help with object management
  (text as any).id = id;

  // Add the delete control to the text object
  addDeleteControl(text, canvas);

  // Add the text to the canvas
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
};
