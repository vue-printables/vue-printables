# useImage Composable

## Overview

The `useImage` composable handles all image-related operations on your canvas. It provides functionality to add images from file uploads or URLs, update image properties like dimensions and opacity, and automatically handles scaling and positioning within the design area.

## Basic Usage

```vue
<template>
  <div>
    <canvas ref="canvasRef" />
    <div class="image-controls">
      <input
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        ref="fileInput"
      />
      <button @click="triggerUpload">Upload Image</button>

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
const fileInput = useTemplateRef("fileInput");
const imageOpacity = ref(1);

// Initialize canvas
const canvasState = useCanvas(canvasRef, {
  productImageUrl: "/t-shirt.jpg",
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 },
});

// Initialize image operations
const { addImage, updateImage } = useImage(canvasState);

const isImageSelected = computed(
  () => canvasState.activeObj.value?.type === "image",
);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      addImage(img);
    };
    img.src = URL.createObjectURL(file);
  }
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
  canvasInstance: Ref<Canvas | null>;
  designArea: Ref<Rect | null>;
  clipPath: Ref<Rect | null>;
  activeObj: Ref<FabricObject | null>;
};
```

## Methods

### addImage(imgElement)

Adds a new image to the canvas from an HTML Image element.

**Parameters:**

- `imgElement` - `HTMLImageElement` containing the loaded image

**Features:**

- Automatically scales image to fit 80% of the design area
- Applies clipping path to keep image within bounds
- Centers the image in the design area
- Adds delete control for easy removal

**Example:**

```ts
const loadAndAddImage = (imageUrl: string) => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // For CORS images
  img.onload = () => {
    addImage(img);
  };
  img.onerror = () => {
    console.error("Failed to load image:", imageUrl);
  };
  img.src = imageUrl;
};
```

### updateImage(imgConfig)

Updates properties of the currently selected image.

**Parameters:**

- `imgConfig` - Partial `ImgConfigs` object with properties to update

**Example:**

```ts
// Update multiple properties
updateImage({
  opacity: 0.8,
  angle: 45,
  width: 150,
  height: 150,
});
```

**Throws:**

- Error if no object is selected
- Error if selected object is not an image

## ImgConfigs Interface

```ts
interface ImgConfigs {
  width: number;
  height: number;
  opacity?: number;
  angle?: number;
  [key: string]: any; // Allows additional [Fabric.js](https://fabricjs.com/) image properties
}
```

### Properties

| Property  | Type     | Required | Default | Description               |
| --------- | -------- | -------- | ------- | ------------------------- |
| `width`   | `number` | Yes      | -       | Image width in pixels     |
| `height`  | `number` | Yes      | -       | Image height in pixels    |
| `opacity` | `number` | No       | `1`     | Image opacity (0-1)       |
| `angle`   | `number` | No       | `0`     | Rotation angle in degrees |

## Advanced Usage

### Image Upload with Preview

```vue
<template>
  <div class="image-uploader">
    <div class="upload-area" @drop="handleDrop" @dragover.prevent>
      <input
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        ref="fileInput"
        style="display: none"
      />
      <button @click="fileInput?.click()">Choose Image</button>
      <p>or drag and drop an image here</p>
    </div>

    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="Preview" />
      <button @click="addPreviewImage">Add to Canvas</button>
      <button @click="clearPreview">Clear</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const previewUrl = ref("");
const previewImage = ref<HTMLImageElement | null>(null);

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    processImageFile(file);
  }
};

const processImageFile = (file: File) => {
  // Create preview URL
  previewUrl.value = URL.createObjectURL(file);

  // Create image element
  const img = new Image();
  img.onload = () => {
    previewImage.value = img;
  };
  img.src = previewUrl.value;
};

const addPreviewImage = () => {
  if (previewImage.value) {
    addImage(previewImage.value);
    clearPreview();
  }
};

const clearPreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = "";
  previewImage.value = null;
};
</script>
```

### Image Property Controls

```vue
<template>
  <div v-if="selectedImage" class="image-controls">
    <div class="control-group">
      <label>Width: {{ imageProps.width }}px</label>
      <input
        type="range"
        v-model.number="imageProps.width"
        min="50"
        max="400"
        @input="updateImageProps"
      />
    </div>

    <div class="control-group">
      <label>Height: {{ imageProps.height }}px</label>
      <input
        type="range"
        v-model.number="imageProps.height"
        min="50"
        max="400"
        @input="updateImageProps"
      />
    </div>

    <div class="control-group">
      <label>Opacity: {{ Math.round(imageProps.opacity * 100) }}%</label>
      <input
        type="range"
        v-model.number="imageProps.opacity"
        min="0"
        max="1"
        step="0.05"
        @input="updateImageProps"
      />
    </div>

    <div class="control-group">
      <label>Rotation: {{ imageProps.angle }}°</label>
      <input
        type="range"
        v-model.number="imageProps.angle"
        min="0"
        max="360"
        @input="updateImageProps"
      />
    </div>

    <div class="control-group">
      <button @click="resetImageProps">Reset</button>
      <button @click="flipHorizontal">Flip H</button>
      <button @click="flipVertical">Flip V</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import type { FabricImage } from "fabric";

const selectedImage = computed(() => {
  const obj = canvasState.activeObj.value;
  return obj?.type === "image" ? (obj as FabricImage) : null;
});

const imageProps = reactive({
  width: 200,
  height: 200,
  opacity: 1,
  angle: 0,
});

// Update controls when selection changes
watch(selectedImage, (img) => {
  if (img) {
    imageProps.width = img.width || 200;
    imageProps.height = img.height || 200;
    imageProps.opacity = img.opacity || 1;
    imageProps.angle = img.angle || 0;
  }
});

const updateImageProps = () => {
  if (selectedImage.value) {
    updateImage(imageProps);
  }
};

const resetImageProps = () => {
  updateImage({
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    opacity: 1,
  });
};

const flipHorizontal = () => {
  if (selectedImage.value) {
    const currentScaleX = selectedImage.value.scaleX || 1;
    updateImage({ scaleX: -currentScaleX });
  }
};

const flipVertical = () => {
  if (selectedImage.value) {
    const currentScaleY = selectedImage.value.scaleY || 1;
    updateImage({ scaleY: -currentScaleY });
  }
};
</script>
```

### Image Filters

```ts
import { filters } from "fabric";

const applyImageFilter = (filterType: string) => {
  if (canvasState.activeObj.value?.type === "image") {
    const img = canvasState.activeObj.value as FabricImage;

    switch (filterType) {
      case "grayscale":
        img.filters = [new filters.Grayscale()];
        break;
      case "sepia":
        img.filters = [new filters.Sepia()];
        break;
      case "brightness":
        img.filters = [new filters.Brightness({ brightness: 0.2 })];
        break;
      case "contrast":
        img.filters = [new filters.Contrast({ contrast: 0.3 })];
        break;
      case "blur":
        img.filters = [new filters.Blur({ blur: 0.1 })];
        break;
      default:
        img.filters = [];
    }

    img.applyFilters();
    canvasState.canvasInstance.value?.requestRenderAll();
  }
};
```

## Image Loading Utilities

### Load from URL

```ts
const loadImageFromUrl = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// Usage
const addImageFromUrl = async (url: string) => {
  try {
    const img = await loadImageFromUrl(url);
    addImage(img);
  } catch (error) {
    console.error("Image loading failed:", error);
  }
};
```

### Image Validation

```ts
const validateImageFile = (file: File): boolean => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return false;
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5MB");
    return false;
  }

  return true;
};

const handleValidatedUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && validateImageFile(file)) {
    processImageFile(file);
  }
};
```

## Best Practices

### 1. Memory Management

Always revoke object URLs when done:

```ts
const cleanup = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
};

onUnmounted(cleanup);
```

### 2. Image Optimization

Resize large images before adding to canvas:

```ts
const resizeImage = (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};
```

### 3. Error Handling

```ts
const safeAddImage = (img: HTMLImageElement) => {
  try {
    addImage(img);
  } catch (error) {
    console.error("Failed to add image:", error);
    // Show user-friendly error message
  }
};

const safeUpdateImage = (config: Partial<ImgConfigs>) => {
  try {
    updateImage(config);
  } catch (error) {
    if (error.message.includes('not of type "Image"')) {
      console.warn("Selected object is not an image");
    } else {
      console.error("Failed to update image:", error);
    }
  }
};
```

## Common Issues

### CORS Errors

For external images, ensure proper CORS headers or use a proxy:

```ts
const img = new Image();
img.crossOrigin = "anonymous";
img.src = imageUrl;
```

### Large Image Performance

For large images, consider using lower resolution versions for editing and high-res for export.

### Mobile Upload

Handle mobile-specific upload scenarios:

```html
<input
  type="file"
  accept="image/*"
  capture="environment"
  @change="handleUpload"
/>
```
