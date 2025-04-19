<template>
  <div class="text-editor-container">
    <div class="mb-4 rounded border p-3">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Enter Text
      </label>
      <textarea
        v-model="textContent"
        class="h-20 w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Enter your text here..."
      ></textarea>
    </div>

    <div class="formatting-controls mb-4 grid grid-cols-2 gap-3">
      <!-- Font Family -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Font</label>
        <select
          v-model="fontFamily"
          class="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option v-for="font in fontOptions" :key="font" :value="font">
            {{ font }}
          </option>
        </select>
      </div>

      <!-- Font Size -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Size</label>
        <input
          v-model.number="fontSize"
          type="number"
          min="10"
          max="72"
          class="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- Style Controls -->
      <div class="col-span-2 flex space-x-2">
        <button
          @click="isBold = !isBold"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': isBold }"
          title="Bold"
        >
          <span class="font-bold">B</span>
        </button>
        <button
          @click="isItalic = !isItalic"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': isItalic }"
          title="Italic"
        >
          <span class="italic">I</span>
        </button>
        <button
          @click="isUnderlined = !isUnderlined"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': isUnderlined }"
          title="Underline"
        >
          <span class="underline">U</span>
        </button>
        <input
          v-model="textColor"
          type="color"
          class="h-8 w-10 border-0"
          title="Text Color"
        />

        <!-- Text Alignment -->
        <button
          @click="textAlign = 'left'"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': textAlign === 'left' }"
          title="Align Left"
        >
          ←
        </button>
        <button
          @click="textAlign = 'center'"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': textAlign === 'center' }"
          title="Align Center"
        >
          ↔
        </button>
        <button
          @click="textAlign = 'right'"
          class="rounded border px-3 py-1"
          :class="{ 'bg-gray-200': textAlign === 'right' }"
          title="Align Right"
        >
          →
        </button>
      </div>
    </div>

    <!-- Text Preview -->
    <div class="mb-4 min-h-[60px] rounded border bg-white p-3">
      <p class="mb-1 text-sm text-gray-500">Preview:</p>
      <div :style="textPreviewStyle" class="break-words">
        {{ textContent || "Your text will appear here" }}
      </div>
    </div>

    <!-- Add Text Button -->
    <button
      @click="addText"
      class="w-full rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
    >
      Add Text to Canvas
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  onTextAdded: (textConfig: TextConfig) => void;
}>();

export interface TextConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  underline: boolean;
  textAlign: string;
  fill: string;
}

// Text content
const textContent = ref("");

// Font settings
const fontFamily = ref("Arial");
const fontSize = ref(24);
const isBold = ref(false);
const isItalic = ref(false);
const isUnderlined = ref(false);
const textAlign = ref("left");
const textColor = ref("#000000");

// Available font options
const fontOptions = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Helvetica",
];

// Create formatted text object
const addText = () => {
  if (!textContent.value.trim()) {
    alert("Please enter some text");
    return;
  }

  const textConfig: TextConfig = {
    text: textContent.value,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fontWeight: isBold.value ? "bold" : "normal",
    fontStyle: isItalic.value ? "italic" : "normal",
    underline: isUnderlined.value,
    textAlign: textAlign.value,
    fill: textColor.value,
  };

  props.onTextAdded(textConfig);

  // Reset the text field after adding
  textContent.value = "";
};

// Computed style for the preview
const textPreviewStyle = computed(() => {
  return {
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value}px`,
    fontWeight: isBold.value ? "bold" : "normal",
    fontStyle: isItalic.value ? "italic" : "normal",
    textDecoration: isUnderlined.value ? "underline" : "none",
    textAlign: textAlign.value,
    color: textColor.value,
  };
});
</script>

<style scoped>
.text-editor-container {
  width: 100%;
}
</style>
