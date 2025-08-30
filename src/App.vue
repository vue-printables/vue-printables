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
          <span class="i-mdi-export h-5 w-5" />
          <span class="font-medium">Export</span>
        </button>

        <button
          class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-green-700 hover:shadow-md"
          @click="handleImport"
        >
          <span class="i-mdi-import h-5 w-5" />

          <span class="font-medium">Import</span>
        </button>
      </div>
    </header>

    <main class="flex justify-center gap-5">
      <div class="toolbar max-w-[590px] grow rounded bg-gray-100 p-4">
        <!-- Add toggle switch -->
        <div class="flex items-center gap-2">
          <span class="text-gray-700">Front</span>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="isBackSide"
              type="checkbox"
              class="peer sr-only"
              @change="handleChangeSide"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
            ></div>
          </label>
          <span class="text-gray-700">Back</span>
        </div>

        <Tabs
          v-model="activeTab"
          :tabs="[
            { key: 'image', label: 'Image Upload' },
            { key: 'text', label: 'Text Editor' },
          ]"
        />

        <ImageUploader
          v-show="activeTab === 'image'"
          class="tab-panel"
          :values="activeImageValues"
          :editing="editingImage"
          @image-uploaded="addImage"
          @update="handleImageUpdates"
          @delete="handleImageDelete"
        />

        <TextEditor
          v-show="activeTab === 'text'"
          class="tab-panel"
          :values="editingText ? activeTextValues : textProperties"
          :editing="editingText"
          @addText="addText(textProperties)"
          @update="handleTextUpdates"
        />
      </div>

      <div
        class="custom-design relative flex h-[600px] w-[550px] flex-col overflow-hidden rounded border border-gray-300"
      >
        <canvas ref="frontCanvas" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import type { ImgConfigs, TextConfigs } from "~/types/common";
import type { FabricImage, FabricText } from "fabric";
import useText from "~/composables/useText";
import useImage from "~/composables/useImage";
import useCanvas from "~/composables/useCanvas";
import Tabs from "~/components/Common/Tabs.vue";
import ImageUploader from "~/components/ImageUploader/index.vue";
import TextEditor from "~/components/Editor.vue";

const frontImage =
  "https://ih1.redbubble.net/image.660499737.3682/sn,x600-pad,600x600,f8f8f8.jpg";
const backImage =
  "https://img.thecdn.in/63984/61b6XtR08NL_SL1100_-1741341527201.jpeg?width=600&format=webp";

const activeTab = ref<"image" | "text">("image");
const isBackSide = ref(false);
const inactiveCanvasJson = shallowRef();

const frontCanvasRef = useTemplateRef("frontCanvas");

const {
  activeObj,
  canvasInstance,
  clipPath,
  designArea,
  initCanvas,
  loadAsJson,
  updateBgImage,
} = useCanvas(frontCanvasRef, {
  bgImg: {
    url: frontImage,
  },
  clipPathOption: {
    movable: true,
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

const editingText = computed(
  () => !isBackSide.value && activeObj.value?.type === "text",
);
const editingImage = computed(
  () => !isBackSide.value && activeObj.value?.type === "image",
);

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
  // const frontCanvasJson = frontExportAsJson();
  // const backCanvasJson = backExportAsJson();
  // const today = new Date();
  // const name = today.toUTCString();
  // const frontJsonString = JSON.stringify(frontCanvasJson, null, 2);
  // const backJsonString = JSON.stringify(backCanvasJson, null, 2);
  // const frontBlob = new Blob([frontJsonString], { type: "application/json" });
  // const backBlob = new Blob([backJsonString], { type: "application/json" });
  // const frontUrl = URL.createObjectURL(frontBlob);
  // const backUrl = URL.createObjectURL(backBlob);
  // const frontLink = document.createElement("a");
  // frontLink.href = frontUrl;
  // frontLink.download = `${name}_front.json`;
  // document.body.appendChild(frontLink);
  // frontLink.click();
  // document.body.removeChild(frontLink);
  // URL.revokeObjectURL(frontUrl);
  // const backLink = document.createElement("a");
  // backLink.href = backUrl;
  // backLink.download = `${name}_back.json`;
  // document.body.appendChild(backLink);
  // backLink.click();
  // document.body.removeChild(backLink);
  // URL.revokeObjectURL(backUrl);
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

const handleChangeSide = async () => {
  if (!canvasInstance.value) return;

  const activeCanvasJson = canvasInstance.value?.toJSON();
  await loadAsJson(inactiveCanvasJson.value);
  inactiveCanvasJson.value = { ...activeCanvasJson };

  if (
    canvasInstance.value.toJSON().backgroundImage.src ===
    inactiveCanvasJson.value.backgroundImage.src
  ) {
    await updateBgImage({ url: isBackSide.value ? backImage : frontImage });
  }
};

onMounted(async () => {
  await initCanvas();
  inactiveCanvasJson.value = canvasInstance.value?.toJSON();
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
