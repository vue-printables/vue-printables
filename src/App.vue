<template>
  <div class="min-h-screen bg-white p-4 sm:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Canvas Editor</h1>
      <p class="text-gray-600">
        Upload, resize and position images or text on a canvas
      </p>
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
          <ImageUploader @image-uploaded="addImage" />
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
      <CanvasEditor ref="canvasEditor" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import CanvasEditor from "~/components/CanvasEditor.vue";
import ImageUploader from "~/components/ImageUploader.vue";
import TextEditor from "~/components/Editor.vue";
import useText from "~/composables/useText";
import useImage from "~/composables/useImage";
import type { TextConfigs } from "~/types/common";
import type { FabricText } from "fabric";

const activeTab = ref<"image" | "text">("image");
const canvasRef = useTemplateRef("canvasEditor");
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

const { addText, updateText } = useText(canvasRef);
const { addImage } = useImage(canvasRef);

const editingText = computed(() => canvasRef.value?.activeObj?.type === "text");
const activeTextValues = computed((): TextConfigs => {
  const activeObj = canvasRef.value?.activeObj as FabricText;
  return {
    fontFamily: activeObj.fontFamily,
    fontSize: activeObj.fontSize,
    fontWeight: activeObj.fontWeight,
    fontStyle: activeObj.fontStyle,
    stroke: activeObj.stroke?.toString(),
    text: activeObj.text,
    underline: activeObj.underline,
    fill: activeObj.fill?.toString(),
  };
});

const handleTextUpdates = (key: string, value: string) => {
  if (editingText.value) {
    updateText({ [key]: value });
  } else {
    textProperties.value[key] = value;
  }
};
</script>
