<template>
  <div
    class="custom-design relative flex h-[600px] w-[800px] flex-col overflow-hidden rounded border border-gray-300"
  >
    <img
      class="h-full w-full object-contain"
      alt="product-image"
      :src="imageUrl"
    />
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Canvas, Rect, FabricImage } from "fabric";
import imageUrl from "~/assets/t-shirt.jpg";

const canvasRef = ref<HTMLCanvasElement | null>(null);
let mainCanvas: Canvas | null = null;

type Size = {
  width: number;
  height: number;
};

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

// Initialize the canvas as the printable area
onMounted(async () => {
  if (canvasRef.value) {
    // Create a "design area" rect that visually indicates the printable region
    const designAreaRect = new Rect({
      ...props.printableAreaSize,
      strokeWidth: 3,
      strokeUniform: true,
      fill: "transparent",
      stroke: "#ff6600",
      borderDashArray: [5, 2],
      borderScaleFactor: 2,
      selectable: true,
      hasControls: true,
      cornerSize: 24,
      cornerCursor: "pointer",
      cornerStrokeColor: "#0066cc",
      cornerColor: "#99ccff",
      cornerStyle: "circle",
      transparentCorners: false,
      cornerDashArray: null,
      centeredScaling: true,
      centeredRotation: true,
      setControlsVisibility: {
        mtr: false, // Hide rotation control if not needed
      },
    });

    const mainClipPath = (await designAreaRect.clone()).set({
      width: designAreaRect.width + 30,
      height: designAreaRect.height + 30,
    });

    designAreaRect.on("scaling", async () => {
      mainClipPath.set({
        width: designAreaRect.width + 30,
        height: designAreaRect.height + 30,
        left: designAreaRect.left - 15,
        top: designAreaRect.top - 15,
        scaleX: designAreaRect.scaleX,
        scaleY: designAreaRect.scaleY,
      });
    });

    designAreaRect.on("moving", async () => {
      mainClipPath.set({
        width: designAreaRect.width + 30,
        height: designAreaRect.height + 30,
        left: designAreaRect.left - 15,
        top: designAreaRect.top - 15,
        scaleX: designAreaRect.scaleX,
        scaleY: designAreaRect.scaleY,
      });
    });

    mainCanvas = new Canvas(canvasRef.value, {
      ...props.size,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
      uniformScaling: false,
      enableRetinaScaling: true,
      clipPath: mainClipPath,
    });

    mainCanvas.add(designAreaRect);
    mainCanvas.centerObject(designAreaRect);
    mainCanvas.centerObject(mainClipPath);
  }
});

onUnmounted(async () => {
  if (mainCanvas) {
    await mainCanvas.dispose();
    mainCanvas = null;
  }
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
