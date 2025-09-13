# useText Composable

## Overview

The `useText` composable provides text manipulation capabilities for your canvas. It allows you to add new text elements and update existing ones with full typography control including fonts, sizes, colors, and styling options.

## Demo

<script setup lang="ts">
import Text from "../code/Text.vue"
</script>

<Text />

## Basic Usage

```vue
<template>
  <div>
    <canvas ref="canvasRef" />
    <div class="text-controls">
      <input v-model="textContent" placeholder="Enter text" />
      <button @click="addNewText">Add Text</button>
      <button @click="updateSelectedText" :disabled="!isTextSelected">
        Update Text
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { useCanvas, useText } from "vue-printables";

const canvasRef = useTemplateRef("canvasRef");
const textContent = ref("Hello World");

// Initialize canvas
const canvasState = useCanvas(canvasRef, {
  bgImg: {
    url: "/t-shirt.jpg",
  },
});

// Initialize text operations
const { addText, updateText } = useText(canvasState);

const isTextSelected = computed(
  () => canvasState.activeObj.value?.type === "text",
);

const addNewText = () => {
  addText({
    text: textContent.value,
    fontFamily: "Arial",
    fontSize: 24,
    fontWeight: "normal",
    underline: false,
  });
};

const updateSelectedText = () => {
  if (isTextSelected.value) {
    updateText({
      text: textContent.value,
      fontSize: 28,
      fill: "#ff0000",
    });
  }
};
</script>
```

## Parameters

### canvasRef

- **Type**: `CanvasTemplateRef`
- **Description**: Object containing canvas state from `useCanvas`

```ts
type CanvasTemplateRef = {
  canvasInstance: ShallowRef<Canvas | null>;
  designArea: ShallowRef<Rect | null>;
  clipPath: ShallowRef<Rect | null>;
  activeObj: ShallowRef<FabricObject | null>;
};
```

## Return Values

The composable returns an object with the following methods:

### `addText(textConfig)`

- **Type**: `(textConfig: TextConfigs) => void`
- **Description**: Adds a new text element to the canvas with the specified configuration. The text is automatically centered within the clip path and includes a delete control.

**Example:**

```ts
addText({
  text: "Custom Text",
  fontFamily: "Helvetica",
  fontSize: 32,
  fontWeight: "bold",
  fontStyle: "italic",
  underline: true,
  fill: "#3366cc",
});
```

### `updateText(textConfig)`

- **Type**: `(textConfig: TextConfigs) => void`
- **Description**: Updates the currently selected text element with new properties.

**Example:**

```ts
updateText({
  fontSize: 36,
  fill: "#ff6600",
});
```

**Throws Error:**

- If no object is selected
- If selected object is not a text element

## TextConfigs Interface

```ts
interface TextConfigs {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle?: "" | "normal" | "italic" | "oblique";
  underline: boolean;
  fill?: string;
  stroke?: string;
  [key: string]: any; // Allows additional Fabric.js text properties
}
```

### Properties

| Property     | Type                 | Required | Default     | Description                                   |
| ------------ | -------------------- | -------- | ----------- | --------------------------------------------- |
| `text`       | `string`             | Yes      | -           | The text content to display                   |
| `fontFamily` | `string`             | Yes      | -           | Font family name (e.g., 'Arial', 'Helvetica') |
| `fontSize`   | `number`             | Yes      | -           | Font size in pixels                           |
| `fontWeight` | `'normal' \| 'bold'` | Yes      | -           | Font weight                                   |
| `underline`  | `boolean`            | Yes      | -           | Whether text is underlined                    |
| `fontStyle`  | `string`             | No       | `'normal'`  | Font style (italic, oblique)                  |
| `fill`       | `string`             | No       | `'#000000'` | Text fill color                               |
| `stroke`     | `string`             | No       | -           | Text stroke color                             |
