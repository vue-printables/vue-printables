<template>
  <div class="container">
    <button @click="handleAddText">Add Text</button>

    <div class="canvas-wrapper">
      <canvas ref="mainCanvas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import useCanvas from "~/composables/useCanvas";
import { useText } from "~/index";

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

const { addText } = useText({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
});

const handleAddText = () => {
  addText({
    fontFamily: "Arial",
    fontSize: 32,
    fontWeight: "normal",
    fontStyle: "normal",
    text: "Example Text",
    underline: false,
    fill: "black",
  });
};

onMounted(async () => {
  await initCanvas();

  handleAddText();
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
