<template>
  <div class="container">
    <div class="controls">
      <div style="display: flex; align-items: center; gap: 8px">
        <button
          class="actions"
          @click="
            isBackSide
              ? backCanvasImage.addImage(logoSrc, {
                  width: 200,
                  height: 200,
                })
              : frontCanvasImage.addImage(logoSrc, {
                  width: 200,
                  height: 200,
                })
          "
        >
          Add Image
        </button>
        <button
          class="actions"
          @click="
            isBackSide
              ? backCanvasText.addText(textProperties)
              : frontCanvasText.addText(textProperties)
          "
        >
          Add Text
        </button>
      </div>

      <div class="toggle-wrapper">
        <span class="label">Front</span>
        <label class="switch">
          <input v-model="isBackSide" type="checkbox" class="switch-input" />
          <div class="switch-slider"></div>
        </label>
        <span class="label">Back</span>
      </div>
    </div>

    <div v-show="!isBackSide" class="canvas-wrapper">
      <canvas ref="frontCanvas" />
    </div>

    <div v-show="isBackSide" class="canvas-wrapper">
      <canvas ref="backCanvas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import useText from "~/composables/useText";
import useImage from "~/composables/useImage";
import useCanvas from "~/composables/useCanvas";
import logoSrc from "../../assets/hulk.png";
import type { TextConfigs } from "~/types/common";

const frontImage =
  "https://ih1.redbubble.net/image.660499737.3682/sn,x600-pad,600x600,f8f8f8.jpg";
const backImage =
  "https://img.thecdn.in/63984/61b6XtR08NL_SL1100_-1741341527201.jpeg?width=600&format=webp";

const isBackSide = ref(false);

const frontCanvasRef = useTemplateRef("frontCanvas");
const backCanvasRef = useTemplateRef("backCanvas");

const textProperties = ref<TextConfigs>({
  fontFamily: "Arial",
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  stroke: "",
  text: "Example Text",
  underline: false,
  fill: "green",
});

const {
  activeObj: frontActiveObj,
  canvasInstance: frontCanvasInstance,
  clipPath: frontClipPath,
  designArea: frontDesignArea,
} = useCanvas(frontCanvasRef, {
  initOnMount: true,
  bgImg: {
    url: frontImage,
  },
  clipPathOption: {
    movable: true,
  },
  size: { height: 400, width: 400 },
});

const {
  activeObj: backActiveObj,
  canvasInstance: backCanvasInstance,
  clipPath: backClipPath,
  designArea: backDesignArea,
} = useCanvas(backCanvasRef, {
  initOnMount: true,
  bgImg: {
    url: backImage,
  },
  clipPathOption: {
    movable: true,
  },
  size: { height: 400, width: 400 },
});

const frontCanvasText = useText({
  canvasInstance: frontCanvasInstance,
  designArea: frontDesignArea,
  clipPath: frontClipPath,
  activeObj: frontActiveObj,
});

const backCanvasText = useText({
  canvasInstance: backCanvasInstance,
  designArea: backDesignArea,
  clipPath: backClipPath,
  activeObj: backActiveObj,
});

const frontCanvasImage = useImage({
  canvasInstance: frontCanvasInstance,
  designArea: frontDesignArea,
  clipPath: frontClipPath,
  activeObj: frontActiveObj,
});

const backCanvasImage = useImage({
  canvasInstance: backCanvasInstance,
  designArea: backDesignArea,
  clipPath: backClipPath,
  activeObj: backActiveObj,
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.controls {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #374151;
}

.switch {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  align-items: center;
}

.switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switch-slider {
  height: 24px;
  width: 44px;
  border-radius: 9999px;
  background-color: #e5e7eb;
  position: relative;
}

.switch-slider::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  height: 20px;
  width: 20px;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background-color: white;
  transition: all 0.15s;
}

.switch-input:checked + .switch-slider {
  background-color: var(--vp-c-brand-1);
}

.switch-input:checked + .switch-slider::after {
  transform: translateX(20px);
  border-color: white;
}

.actions {
  background-color: var(--vp-c-brand-3);
  padding: 4px;
  border-radius: 4px;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  align-self: center;
  width: 400px;
  height: 400px;
}
</style>
