<template>
  <div class="text-editor">
    <div class="text-input-section">
      <label class="input-label"> Enter Text </label>
      <textarea
        class="form-input text-area"
        :value="values.text"
        placeholder="Enter your text here..."
        @input="
          updateConfig('text', ($event.target as HTMLInputElement)?.value)
        "
      />
    </div>

    <div class="formatting-controls">
      <!-- Font Family -->
      <div class="form-group">
        <label class="input-label">Font</label>
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
      <div class="form-group">
        <label class="input-label">Size</label>
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
      <div class="style-controls">
        <button
          class="style-btn"
          title="Bold"
          :class="{ active: values.fontWeight === 'bold' }"
          @click="toggleBold"
        >
          <span class="bold-text">B</span>
        </button>

        <button
          class="style-btn"
          title="Italic"
          :class="{ active: values.fontStyle === 'italic' }"
          @click="toggleItalic"
        >
          <span class="italic-text">I</span>
        </button>

        <button
          class="style-btn"
          title="Underline"
          :class="{ active: values.underline }"
          @click="updateConfig('underline', !values.underline)"
        >
          <span class="underline-text">U</span>
        </button>

        <input
          class="color-input"
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
    <div class="text-preview">
      <p class="preview-label">Preview:</p>
      <div :style="textPreviewStyle" class="preview-text">
        {{ values.text || "Your text will appear here" }}
      </div>
    </div>

    <!-- Add Text Button -->
    <button v-if="!editing" class="add-text-btn" @click="addText">
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
.text-editor {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.5rem;
}

.text-input-section {
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1rem;
}

.input-label {
  margin-bottom: 0.75rem;
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.form-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e0;
  padding: 0.75rem;
  transition: all 0.2s;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.text-area {
  height: 4rem;
  resize: vertical;
  font-family: inherit;
}

.formatting-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.style-controls {
  grid-column: span 2;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}

.style-btn {
  border-radius: 0.5rem;
  border: 1px solid #cbd5e0;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.style-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.style-btn:hover:not(.active) {
  background: #e2e8f0;
  border-color: #a0aec0;
}

.bold-text {
  font-weight: bold;
}

.italic-text {
  font-style: italic;
}

.underline-text {
  text-decoration: underline;
}

.color-input {
  margin: 0;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e0;
  cursor: pointer;
  transition: all 0.2s;
}

.color-input:hover {
  transform: scale(1.05);
}

.text-preview {
  min-height: 80px;
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1rem;
}

.preview-label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0;
  font-weight: 600;
}

.preview-text {
  word-break: break-words;
  min-height: 2rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #cbd5e0;
}

.add-text-btn {
  width: 100%;
  border-radius: 0.75rem;
  background: var(--vp-c-brand-2);
  padding: 0.75rem 1rem;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-text-btn:hover {
  transform: translateY(-2px);
}
</style>
