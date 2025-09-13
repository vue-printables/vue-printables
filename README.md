# Vue Printables

Vue Printables is a set of Vue 3 composables and utilities for building **print-ready design editors** using [Fabric.js](http://fabricjs.com/). It’s perfect for creating T-shirt designers, custom mug editors, poster creators, and more — all inside your Vue app.

## Features

With Vue Printables, you can:

- **Canvas Management** - Initialize and control canvases
- **Design Area Control** - Define dynamic design areas with optional clip paths
- **Text Manipulation** - Add, edit, and style text elements
- **Image Handling** - Upload, resize, and position images
- **JSON Support** - Import/export designs as JSON
- **Image Exporting** - Export high-resolution, print-ready images

## Quick Start

### Installation

```bash
npm install vue-printables
# or
yarn add vue-printables
# or
bun install vue-printables
```

### Basic Usage

```vue
<template>
  <div class="canvas-wrapper">
    <canvas ref="mainCanvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { useCanvas, useImage } from "vue-printables";

const canvasRef = useTemplateRef("mainCanvas");

const { canvasInstance, designArea, clipPath, activeObj, initCanvas } =
  useCanvas(canvasRef, {
    bgImg: {
      url: "/product.png",
    },
  });

const { addImage } = useImage({
  canvasInstance,
  designArea,
  clipPath,
  activeObj,
});

onMounted(async () => {
  await initCanvas();
  addImage("/logo.png");
});
</script>

<style>
.canvas-wrapper {
  position: relative;
  width: 600px;
  height: 600px;
}
</style>
```

### Demo

![demo.gif](./demo.gif)

## Core Composables

### `useCanvas()`

Manages the main [Fabric.js](http://fabricjs.com/) canvas, background images, and design areas.

### `useText()`

Handles text element creation, editing, and styling with full typography control.

### `useImage()`

Manages image uploads, positioning, scaling, and transformations.

## Requirements

- Vue 3.0+
- [Fabric.js](http://fabricjs.com/) 6.0+

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please submit issues or pull requests to help improve Vue Printables.
