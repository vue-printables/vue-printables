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
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import imageUrl from "~/assets/t-shirt.jpg";
import type { Size } from "~/types/common";
import useCanvas from "~/composables/useCanvas";

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

const mainCanvasRef = useTemplateRef("mainCanvas");

const { fabricCanvas, activeObj, initCanvas, cleanup } =
  useCanvas(mainCanvasRef);

onMounted(async () => {
  await initCanvas({
    productImageUrl: imageUrl,
    canvasSize: props.size,
    clipPathSize: props.printableAreaSize,
  });
});

onUnmounted(async () => {
  await cleanup();
});

defineExpose({
  canvasInstance: fabricCanvas,
  activeObj,
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
