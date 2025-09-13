# Full Editor Example

This example demonstrates a complete design editor interface using Vue Printables. It features tabbed tools for image and text editing, real-time property controls, and import/export functionality.

## Demo

<script setup lang="ts">
import FullEditor from "../code/examples/FullEditor.vue"
</script>

<FullEditor />

## Usage

### Key Concepts

1. **Tabbed Interface** - Organize tools into logical groups (Images/Text)
2. **Real-time Editing** - Live property updates for selected objects
3. **Import/Export** - Save and load designs as JSON files
4. **Object Management** - Handle selection states and property binding

### Template Structure

```vue
<template>
  <div class="editor-container">
    <!-- Header with Actions -->
    <header class="editor-header">
      <div class="header-content">
        <h1 class="editor-title">Vue Printables Editor</h1>
        <div class="action-buttons">
          <button @click="handleImport">📁 Import</button>
          <button @click="handleExport">💾 Export</button>
        </div>
      </div>
    </header>

    <main class="editor-main">
      <!-- Canvas Section -->
      <section class="canvas-section">
        <div class="canvas-header">
          <h3>Design Canvas</h3>
          <span class="info-badge" v-if="editingText">✏️ Editing Text</span>
        </div>
        <div class="canvas-wrapper">
          <canvas ref="mainCanvas" />
        </div>
      </section>

      <!-- Tools Sidebar -->
      <aside class="editor-sidebar">
        <Tabs v-model="activeTab" :tabs="tabs" />

        <ImageUploader
          v-show="activeTab === 'image'"
          :values="activeImageValues"
          :editing="editingImage"
          @image-uploaded="addImage"
          @update="handleImageUpdates"
        />

        <TextEditor
          v-show="activeTab === 'text'"
          :values="editingText ? activeTextValues : textProperties"
          :editing="editingText"
          @addText="addText(textProperties)"
          @update="handleTextUpdates"
        />
      </aside>
    </main>
  </div>
</template>
```

### State Management

```ts
const activeTab = ref<"image" | "text">("image");
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

// Reactive editing states
const editingText = computed(() => activeObj.value?.type === "text");
const editingImage = computed(() => activeObj.value?.type === "image");

// Active object properties
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
```

### Canvas Configuration

```ts
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
    url: "https://example.com/product-image.jpg",
  },
  clipPathOption: {
    movable: true,
  },
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
```

### Import/Export Functionality

```ts
const handleExport = () => {
  const canvasJson = exportAsJson();
  const jsonString = JSON.stringify(canvasJson, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `design-${Date.now()}.json`;
  link.click();

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
        const json = e.target?.result as string;
        loadAsJson(json);
      };
      reader.readAsText(file);
    }
  };

  input.click();
};
```

Check the [Source](https://github.com/vue-printables/vue-printables/blob/main/docs/code/examples/FullEditor.vue) file for full code preview.
