<template>
  <div class="flex min-h-screen flex-col gap-10 bg-white p-4 sm:p-8">
    <header class="flex flex-col items-center gap-2.5 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Canvas Editor</h1>
      <p class="text-gray-600">
        Upload, resize and position images or text on a canvas
      </p>

      <div class="flex gap-4">
        <button
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 hover:shadow-md"
          @click="handleExport"
        >
          <img
            class="h-5 w-5"
            src="https://img.icons8.com/ios-filled/50/save--v1.png"
            alt="save--v1"
          />
          <span class="font-medium">Export</span>
        </button>

        <button
          class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-green-700 hover:shadow-md"
          @click="handleImport"
        >
          <img
            class="h-5 w-5"
            src="https://img.icons8.com/material-outlined/24/import.png"
            alt="import"
          />
          <span class="font-medium">Import</span>
        </button>
      </div>
    </header>

    <main class="flex justify-center gap-5">
      <div class="toolbar max-w-[590px] grow rounded bg-gray-100 p-4">
        <div class="flex p-2">
          <button
            class="mr-2 px-4 py-2"
            :class="
              activeTab === 'image'
                ? 'border-b-2 border-blue-500 font-bold'
                : ''
            "
            @click="activeTab = 'image'"
          >
            Image Upload
          </button>
          <button
            class="px-4 py-2"
            :class="
              activeTab === 'text' ? 'border-b-2 border-blue-500 font-bold' : ''
            "
            @click="activeTab = 'text'"
          >
            Text Editor
          </button>
        </div>

        <!-- Tab Content -->
        <div v-show="activeTab === 'image'" class="tab-panel">
          <ImageUploader
            :values="editingImage ? activeImageValues : imageProperties"
            :editing="editingImage"
            @image-uploaded="addImage"
            @update="handleImageUpdates"
          />
        </div>
        <div v-show="activeTab === 'text'" class="tab-panel">
          <TextEditor
            :values="editingText ? activeTextValues : textProperties"
            :editing="editingText"
            @addText="addText(textProperties)"
            @update="handleTextUpdates"
          />
        </div>
      </div>

      <div
        class="custom-design relative flex h-[600px] w-[550px] flex-col overflow-hidden rounded border border-gray-300"
      >
        <canvas ref="mainCanvas" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from "vue";
import ImageUploader from "~/components/ImageUploader.vue";
import TextEditor from "~/components/Editor.vue";
import useText from "~/composables/useText";
import useImage from "~/composables/useImage";
import type { ImgConfigs, TextConfigs } from "~/types/common";
import type { FabricImage, FabricText } from "fabric";
import useCanvas from "~/composables/useCanvas";
import imageUrl from "~/assets/t-shirt.jpg";

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
  productImageUrl: imageUrl,
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 },
  movableClipPath: true,
});

// FIXME: remove this state it serves no purpose other than cleaning up composables calls
const canvasStates = shallowRef({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
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

const imageProperties = ref<ImgConfigs>({
  width: 200,
  height: 200,
  opacity: 1,
  angle: 0,
});

const { addText, updateText } = useText(canvasStates.value);
const { addImage, updateImage } = useImage(canvasStates.value);

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
  const activeObject = activeObj.value as FabricImage;
  return {
    width: activeObject.width,
    height: activeObject.height,
    opacity: activeObject.opacity,
    angle: activeObject.angle,
  };
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
  } else {
    imageProperties.value[key] = value;
  }
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
.custom-design {
  /* classes provided by fabric.js */
  .canvas-container {
    position: absolute !important;
    left: 0;
    top: 0;
  }
}
</style>
