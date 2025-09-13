# Front/Back Product Design

This example demonstrates how to create a product designer with front and back views using Vue Printables. Users can toggle between sides while maintaining separate designs for each view.

## Demo

<script setup lang="ts">
import FrontBackProduct from "../code/examples/FrontBackProduct.vue"
</script>

<FrontBackProduct />

## Usage

### Key Concepts

1. **Canvas State Management** - Store inactive canvas JSON to preserve designs
2. **Background Switching** - Update product images when toggling sides
3. **Design Persistence** - Maintain separate element collections per side

### Template

```vue
<template>
  <div class="container">
    <!-- Toggle Controls -->
    <div class="controls">
      <div class="actions-container">
        <button @click="handleAddImage">Add Image</button>
        <button @click="handleAddText">Add Text</button>
      </div>

      <!-- Front/Back Toggle -->
      <div class="toggle-wrapper">
        <span>Front</span>
        <label class="switch">
          <input
            v-model="isBackSide"
            type="checkbox"
            @change="handleChangeSide"
          />
          <div class="switch-slider"></div>
        </label>
        <span>Back</span>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="canvas-wrapper">
      <canvas ref="mainCanvas" />
    </div>
  </div>
</template>
```

### State Management

```ts
const isBackSide = ref(false);
const inactiveCanvasJson = shallowRef();

const handleChangeSide = async () => {
  if (!canvasInstance.value) return;

  // Save current canvas state
  const activeCanvasJson = canvasInstance.value?.toJSON();

  // Load inactive side
  await loadAsJson(inactiveCanvasJson.value);

  // Store previous active state
  inactiveCanvasJson.value = { ...activeCanvasJson };

  // Update background image if needed
  if (
    canvasInstance.value.toJSON().backgroundImage.src ===
    inactiveCanvasJson.value.backgroundImage.src
  ) {
    await updateBgImage({
      url: isBackSide.value ? backImage : frontImage,
    });
  }
};
```

### Canvas Configuration

```ts
const {
  activeObj,
  canvasInstance,
  clipPath,
  designArea,
  initCanvas,
  loadAsJson,
  updateBgImage,
} = useCanvas(canvasRef, {
  bgImg: {
    url: frontImage,
  },
  clipPathOption: {
    movable: true,
  },
  size: { height: 400, width: 400 },
});
```

Check the [Source](https://github.com/vue-printables/vue-printables/blob/main/docs/code/examples/FrontBackProduct.vue) file for full code preview.
