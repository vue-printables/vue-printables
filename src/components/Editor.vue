<template>
  <div class="w-full">
    <div class="mb-4 rounded border p-3">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Enter Text
      </label>
      <textarea
        class="form-input h-20"
        :value="values.text"
        placeholder="Enter your text here..."
        @input="
          updateConfig('text', ($event.target as HTMLInputElement)?.value)
        "
      />
    </div>

    <div class="formatting-controls mb-4 grid grid-cols-2 gap-3">
      <!-- Font Family -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Font</label>
        <select
          class="form-input"
          :value="values.fontFamily"
          @change="
            updateConfig(
              'fontFamily',
              ($event.target as HTMLInputElement)?.value,
            )
          "
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
          class="form-input"
          type="number"
          min="10"
          max="72"
          :value="values.fontSize"
          @input="
            updateConfig(
              'fontSize',
              parseInt(($event.target as HTMLInputElement)?.value) || 16,
            )
          "
        />
      </div>

      <!-- Style Controls -->
      <div class="col-span-2 flex space-x-2">
        <button
          class="rounded border px-3 py-1"
          title="Bold"
          :class="{ 'bg-gray-200': values.fontWeight === 'bold' }"
          @click="toggleBold"
        >
          <span class="font-bold">B</span>
        </button>

        <button
          class="rounded border px-3 py-1"
          title="Italic"
          :class="{ 'bg-gray-200': values.fontStyle === 'italic' }"
          @click="toggleItalic"
        >
          <span class="italic">I</span>
        </button>

        <button
          class="rounded border px-3 py-1"
          title="Underline"
          :class="{ 'bg-gray-200': values.underline }"
          @click="updateConfig('underline', !values.underline)"
        >
          <span class="underline">U</span>
        </button>

        <input
          class="m-0 h-10 w-10 rounded border"
          type="color"
          title="Text Color"
          :value="values.fill"
          @input="
            updateConfig('fill', ($event.target as HTMLInputElement)?.value)
          "
        />
      </div>
    </div>

    <!-- Text Preview -->
    <div class="mb-4 min-h-[60px] rounded border bg-white p-3">
      <p class="mb-1 text-sm text-gray-500">Preview:</p>
      <div :style="textPreviewStyle" class="break-words">
        {{ values.text || "Your text will appear here" }}
      </div>
    </div>

    <!-- Add Text Button -->
    <button
      v-if="!editing"
      class="w-full rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
      @click="addText"
    >
      Add Text to Canvas
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TextConfigs } from "~/types/common";
import { computed } from "vue";

const emit = defineEmits<{
  update: [field: string, value: any];
  addText: [];
}>();

const props = defineProps<{
  values: TextConfigs;
  editing?: boolean;
}>();

const fontOptions = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Helvetica",
];

const textPreviewStyle = computed(() => {
  return {
    fontFamily: props.values.fontFamily,
    fontSize: `${props.values.fontSize}px`,
    fontWeight: props.values.fontWeight,
    fontStyle: props.values.fontStyle,
    textDecoration: props.values.underline ? "underline" : "none",
    color: props.values.fill,
    // Only add stroke if it's set
    ...(props.values.stroke
      ? {
          WebkitTextStroke: `1px ${props.values.stroke}`,
          textStroke: `1px ${props.values.stroke}`,
        }
      : {}),
  };
});

const updateConfig = (field: string, value: any) => {
  emit("update", field, value);
};

const toggleBold = () => {
  const newWeight = props.values.fontWeight === "bold" ? "normal" : "bold";
  updateConfig("fontWeight", newWeight);
};

const toggleItalic = () => {
  const newStyle = props.values.fontStyle === "italic" ? "normal" : "italic";
  updateConfig("fontStyle", newStyle);
};

const addText = () => {
  if (!props.values.text.trim()) {
    alert("Please enter some text");
    return;
  }
  emit("addText");
};
</script>

<style scoped>
.form-input {
  width: 100%;
  border-radius: 0.25rem;
  border-width: 1px;
  padding: 0.5rem;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5); /* blue-500 with 50% opacity */
}
</style>
