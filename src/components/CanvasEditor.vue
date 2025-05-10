<template>
  <div
    class="custom-design relative flex h-[600px] w-[800px] flex-col overflow-hidden rounded border border-gray-300"
  >
    <img
      class="h-full w-full object-contain"
      alt="product-image"
      :src="imageUrl"
    />
    <canvas
      ref="mainCanvas"
      :style="{
        width: size.width + 'px',
        height: size.height + 'px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from "vue";
import { Canvas, Rect } from "fabric";
import imageUrl from "~/assets/t-shirt.jpg";
import type { Size } from "~/types/common";
import { InteractiveFabricObject } from "fabric";

const props = withDefaults(
  defineProps<{
    size?: Size;
    printableAreaSize?: Size;
  }>(),
  {
    size: () => ({
      width: 800,
      height: 600,
    }),
    printableAreaSize: () => ({
      width: 200,
      height: 300,
    }),
  },
);

const canvasInstance = shallowRef<Canvas | null>(null);
const mainCanvasRef = useTemplateRef("mainCanvas");

onMounted(async () => {
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

  if (mainCanvasRef.value) {
    // Create a "design area" rect that visually indicates the printable region
    const printableArea = new Rect({
      ...props.printableAreaSize,
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

    canvasInstance.value = new Canvas(mainCanvasRef.value, {
      ...props.size,
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

    canvasInstance.value.add(printableArea);
    canvasInstance.value.centerObject(printableArea);
    canvasInstance.value.centerObject(mainClipPath);
  } else {
    throw new Error(
      `Couldn't get canvas element with id:${mainCanvasRef.value}`,
    );
  }
});

onUnmounted(async () => {
  if (canvasInstance.value) {
    await canvasInstance.value.dispose();
    canvasInstance.value = null;
  }
});

defineExpose({
  canvasInstance,
});
</script>

<style>
.custom-design {
  /* classes provided by fabric.js */
  .canvas-container {
    position: absolute !important;
    left: 0;
    top: 0;
  }
}
</style>
