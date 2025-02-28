<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Canvas } from "fabric";
import ImageUploader from "./ImageUploader.vue";
import TextEditor from "./TextEditor.vue";
import { createFabricImage, createFabricText } from "../utils/fabricHelpers";
import type { TextConfig } from "./TextEditor.vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const fabricCanvas = ref<Canvas | null>(null);
const activeTab = ref<"image" | "text">("image");

// Initialize the canvas when the component is mounted
onMounted(() => {
  if (canvasRef.value) {
    // Create canvas with fabric v6 API
    fabricCanvas.value = new Canvas(canvasRef.value, {
      width: 800,
      height: 600,
      backgroundColor: "#f8f9fa",
      selection: true,
      preserveObjectStacking: true,
      // Disable uniform scaling for independent width/height adjustment
      uniformScaling: false,
      enableRetinaScaling: true,
    });

    // Setup event listeners
    setupCanvasEvents();
  }
});

const setupCanvasEvents = () => {
  if (!fabricCanvas.value) return;

  // Ensure mouse:down doesn't deselect when clicking controls
  fabricCanvas.value.on("mouse:down", (opt) => {
    if (opt.target && (opt.target.controls || opt.target.cornerStyle)) {
      opt.e.stopPropagation();
    }
  });

  // Fix selection issues
  fabricCanvas.value.on("selection:created", () => {
    fabricCanvas.value?.requestRenderAll();
  });

  fabricCanvas.value.on("selection:updated", () => {
    fabricCanvas.value?.requestRenderAll();
  });

  // Ensure controls remain visible during manipulation
  fabricCanvas.value.on("object:scaling", () => {
    fabricCanvas.value?.requestRenderAll();
  });

  fabricCanvas.value.on("object:moving", () => {
    fabricCanvas.value?.requestRenderAll();
  });

  fabricCanvas.value.on("object:rotating", () => {
    fabricCanvas.value?.requestRenderAll();
  });

  // Additional events for maintaining control visibility
  fabricCanvas.value.on("mouse:over", (opt) => {
    if (opt.target) {
      opt.target.set({
        borderColor: "#0099ff",
        cornerColor: "#0066ff",
      });
      fabricCanvas.value?.requestRenderAll();
    }
  });

  fabricCanvas.value.on("mouse:out", (opt) => {
    if (opt.target) {
      opt.target.set({
        borderColor: "#0066ff",
      });
      fabricCanvas.value?.requestRenderAll();
    }
  });
};

// Clean up when the component is unmounted
onUnmounted(async () => {
  // In v6, dispose is async
  if (fabricCanvas.value) {
    await fabricCanvas.value.dispose();
    fabricCanvas.value = null;
  }
});

// Handle image upload
const handleImageUploaded = (imgElement: HTMLImageElement) => {
  if (!fabricCanvas.value) return;
  createFabricImage(imgElement, fabricCanvas.value);
};

// Handle text addition
const handleTextAdded = (textConfig: TextConfig) => {
  if (!fabricCanvas.value) return;
  createFabricText(textConfig, fabricCanvas.value);
};
</script>

<template>
  <div class="image-editor-container">
    <div class="toolbar mb-4 rounded bg-gray-100 p-4">
      <!-- Tab Navigation -->
      <div class="tabs mb-4 flex border-b">
        <button
          @click="activeTab = 'image'"
          class="mr-2 px-4 py-2"
          :class="
            activeTab === 'image' ? 'border-b-2 border-blue-500 font-bold' : ''
          "
        >
          Image Upload
        </button>
        <button
          @click="activeTab = 'text'"
          class="px-4 py-2"
          :class="
            activeTab === 'text' ? 'border-b-2 border-blue-500 font-bold' : ''
          "
        >
          Text Editor
        </button>
      </div>

      <!-- Tab Content -->
      <div v-show="activeTab === 'image'" class="tab-panel">
        <ImageUploader :onImageUploaded="handleImageUploaded" />
      </div>
      <div v-show="activeTab === 'text'" class="tab-panel">
        <TextEditor :onTextAdded="handleTextAdded" />
      </div>
    </div>

    <div
      class="canvas-container overflow-hidden rounded border border-gray-300"
    >
      <canvas ref="canvasRef" id="fabric-canvas"></canvas>
    </div>
    <div class="mt-2 text-sm text-gray-500">
      Click and drag to move, use corner handles to resize
    </div>
  </div>
</template>

<style scoped>
.image-editor-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.canvas-container {
  display: inline-block;
  position: relative;
  width: 800px;
  height: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
