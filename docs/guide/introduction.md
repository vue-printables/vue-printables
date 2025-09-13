# Introduction

Vue Printables is a set of Vue 3 composables and utilities for building **print-ready design editors** using [Fabric.js](http://fabricjs.com/). It’s perfect for creating T-shirt designers, custom mug editors, poster creators, and more — all inside your Vue app.

## Features

With Vue Printables, you can:

- Initialize and control canvases
- Define dynamic design areas with optional clip paths
- Add, edit, and delete text and images
- Import/export designs as JSON
- Export high-resolution, print-ready images

## Quick Start

Here’s a minimal example showing how to set up a canvas with a clip path:

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

<script setup lang="ts">
import Introduction from "../code/Introduction.vue"
</script>

<Introduction/>
