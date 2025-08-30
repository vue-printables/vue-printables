<template>
  <div class="container">
    <button @click="handleAddImage">Add Image</button>

    <div class="canvas-wrapper">
      <canvas ref="mainCanvas" />
    </div>
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
    clipPathOption: {
      size: { width: 450, height: 600 },
      position: { left: 50, top: -2 },
    },
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

const handleAddImage = () => {
  addImage(logoSrc, {
    width: 300,
    height: 300,
  });
};

onMounted(async () => {
  await initCanvas();
  handleAddImage();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

button {
  background-color: var(--vp-c-brand-3);
  padding: 4px 8px;
  border-radius: 4px;
  align-self: self-start;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
