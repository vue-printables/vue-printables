<template>
  <div class="editor-container">
    <header class="editor-header">
      <button class="btn btn-secondary" @click="handleImport">Import</button>
      <button class="btn btn-primary" @click="handleExport">Export</button>
    </header>

    <main class="editor-main">
      <div class="editor-sidebar">
        <Tabs
          v-model="activeTab"
          :tabs="[
            { key: 'image', label: 'Images' },
            { key: 'text', label: 'Text' },
          ]"
        />

        <div class="tool-panel">
          <ImageUploader
            v-show="activeTab === 'image'"
            :values="activeImageValues"
            :editing="editingImage"
            @image-uploaded="addImage"
            @update="handleImageUpdates"
            @delete="handleImageDelete"
          />

          <TextEditor
            v-show="activeTab === 'text'"
            :values="editingText ? activeTextValues : textProperties"
            :editing="editingText"
            @addText="addText(textProperties)"
            @update="handleTextUpdates"
          />
        </div>
      </div>

      <div class="canvas-wrapper">
        <canvas ref="mainCanvas" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import "~/style.css";
import type { ImgConfigs, TextConfigs } from "~/types/common";
import type { FabricImage, FabricText } from "fabric";
import ImageUploader from "../components/ImageUploader/index.vue";
import TextEditor from "../components/TextEditor.vue";
import useText from "~/composables/useText";
import useImage from "~/composables/useImage";
import useCanvas from "~/composables/useCanvas";
import Tabs from "../components/Tabs.vue";

const activeTab = ref<"image" | "text">("image");

const canvasRef = useTemplateRef("mainCanvas");

const {
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
  exportAsJson,
  loadAsJson,
} = useCanvas(canvasRef, {
  initOnMount: true,
  bgImg: {
    url: "https://rlv.zcache.co.uk/create_your_own_notebook-rc3a15e21d2a34d75978fc07f918d60b5_ambg4_8byvr_306.jpg",
  },
});

const textProperties = ref<TextConfigs>({
  fontFamily: "Arial",
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  stroke: "",
  text: "",
  underline: false,
  fill: "#000000",
});

const { addText, updateText } = useText({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
});
const { addImage, updateImage } = useImage({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
});

const editingText = computed(() => activeObj.value?.type === "text");
const editingImage = computed(() => activeObj.value?.type === "image");

const activeTextValues = computed((): TextConfigs => {
  const activeObject = activeObj.value as FabricText;
  return {
    fontFamily: activeObject.fontFamily,
    fontSize: activeObject.fontSize,
    fontWeight: activeObject.fontWeight as any,
    fontStyle: activeObject.fontStyle as any,
    stroke: activeObject.stroke?.toString(),
    text: activeObject.text,
    underline: activeObject.underline,
    fill: activeObject.fill?.toString(),
  };
});

const activeImageValues = computed(() => {
  const imageObj = activeObj.value as FabricImage;
  if (imageObj && imageObj.type === "image") {
    return {
      src: imageObj?.getSrc(),
      width: imageObj.width,
      height: imageObj.height,
      opacity: imageObj.opacity,
      angle: imageObj.angle,
    };
  }
});

const handleTextUpdates = (key: string, value: string) => {
  if (editingText.value) {
    updateText({ [key]: value } as TextConfigs);
  } else {
    textProperties.value[key] = value;
  }
};

const handleImageUpdates = (key: string, value: number) => {
  if (editingImage.value) {
    updateImage({ [key]: value } as ImgConfigs);
  }
};

const handleImageDelete = () => {
  if (activeObj.value) canvasInstance.value?.remove(activeObj.value);
  activeObj.value = null;
};

const handleExport = () => {
  const canvasJson = exportAsJson();
  const today = new Date();
  const name = today.toUTCString();
  const jsonString = JSON.stringify(canvasJson, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.json`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleImport = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          loadAsJson(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  input.click();
};
</script>

<style>
.editor-container {
  max-width: 688px;
  margin: 0 auto;
  background: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.editor-header {
  background: whitesmoke;
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--vp-c-brand-3);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--vp-c-brand-1);
}

.btn-secondary {
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.editor-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.canvas-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  order: 1;
}

.canvas-header {
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.canvas-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.canvas-info {
  display: flex;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: white;
  min-height: 400px;
}

.canvas-wrapper canvas {
  border-radius: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.editor-sidebar {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  order: 2;
}

.tool-panel {
  padding: 1rem;
}

/* Fabric.js canvas container */
.canvas-wrapper .canvas-container {
  position: relative !important;
}

/* Mobile optimization */
@media (max-width: 480px) {
  .editor-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .header-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .canvas-wrapper {
    min-height: 300px;
    padding: 0.75rem;
  }
}
</style>
