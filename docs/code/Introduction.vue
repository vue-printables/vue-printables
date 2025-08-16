<template>
  <div class="canvas-wrapper">
    <canvas ref="mainCanvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import useCanvas from "~/composables/useCanvas";
import useImage from "~/composables/useImage";
import logoSrc from "../assets/guts.png";
const canvasRef = useTemplateRef("mainCanvas");

const { canvasInstance, designArea, clipPath, activeObj, initCanvas } =
  useCanvas(canvasRef, {
    size: { width: 600, height: 600 },
    bgImg: {
      url: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/E13882s4.jpg?im=Resize,width=750",
      position: {
        top: 0,
        left: 50,
      },
    },
  });

const { addImage } = useImage({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
});

onMounted(async () => {
  await initCanvas();
  addImage(logoSrc, {
    width: 200,
    height: 600,
    top: 175,
    left: 195,
  });
});
</script>

<style>
.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 688px;
  height: 688px;
}
</style>
