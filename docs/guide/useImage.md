# useImage Composable

## Overview

The `useImage` composable handles all image-related operations on your canvas. It provides functionality to add images from URLs, update image properties, and automatically handles scaling and positioning within the design area.

## Demo

<script setup lang="ts">
import Image from "../code/Image.vue"
</script>

<Image />

## Basic Usage

```vue
<template>
  <div>
    <canvas ref="canvasRef" />
    <div class="image-controls">
      <input v-model="imageUrl" placeholder="Enter image URL" />
      <button @click="addNewImage">Add Image</button>

      <div v-if="isImageSelected" class="image-properties">
        <label>Opacity: {{ imageOpacity }}</label>
        <input
          type="range"
          v-model.number="imageOpacity"
          min="0"
          max="1"
          step="0.1"
          @input="updateImageOpacity"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { useCanvas, useImage } from "vue-printables";

const canvasRef = useTemplateRef("canvasRef");
const imageUrl = ref("/logo.png");
const imageOpacity = ref(1);

// Initialize canvas
const canvasState = useCanvas(canvasRef, {
  bgImg: {
    url: "/t-shirt.jpg",
  },
});

// Initialize image operations
const { addImage, updateImage } = useImage(canvasState);

const isImageSelected = computed(
  () => canvasState.activeObj.value?.type === "image",
);

const addNewImage = async () => {
  await addImage(imageUrl.value);
};

const updateImageOpacity = () => {
  if (isImageSelected.value) {
    updateImage({ opacity: imageOpacity.value });
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

### `addImage(url, options?)`

- **Type**: `(url: string, options?: ImgConfigs) => Promise<void>`
- **Description**: Adds a new image to the canvas from a URL. The image is automatically scaled to fit 80% of the design area, centered, and includes a delete control.

**Example:**

```ts
// Add image with default positioning
await addImage("/logo.png");

// Add image with custom positioning
await addImage("/logo.png", {
  top: 100,
  left: 150,
  width: 200,
  height: 200,
});
```

### `updateImage(imgConfig)`

- **Type**: `(imgConfig: ImgConfigs) => void`
- **Description**: Updates properties of the currently selected image.

**Example:**

```ts
// Update multiple properties
updateImage({
  opacity: 0.8,
  scaleX: 1.2,
  scaleY: 1.2,
});
```

**Throws Error:**

- If no object is selected
- If selected object is not an image

## ImgConfigs Interface

```ts
interface ImgConfigs {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
  [key: string]: any; // Allows additional Fabric.js image properties
}
```

### Properties

| Property  | Type     | Required | Default | Description             |
| --------- | -------- | -------- | ------- | ----------------------- |
| `width`   | `number` | No       | -       | Image width in pixels   |
| `height`  | `number` | No       | -       | Image height in pixels  |
| `top`     | `number` | No       | -       | Top position in pixels  |
| `left`    | `number` | No       | -       | Left position in pixels |
| `opacity` | `number` | No       | `1`     | Image opacity (0-1)     |
| `scaleX`  | `number` | No       | -       | Horizontal scale factor |
| `scaleY`  | `number` | No       | -       | Vertical scale factor   |
