# Installation

## Package Installation

Install Vue Printables using your preferred package manager:

::: code-group

```bash [npm]
npm install vue-printables
```

```bash [yarn]
yarn add vue-printables
```

```bash [bun]
bun install vue-printables
```

:::

## Dependencies

Vue Printables has the following peer dependencies:

- `vue` ^3.0.0
- `fabric` ^6.0.0

These will be automatically installed if not already present in your project.

## Basic Setup

Once installed, you can start using Vue Printables in your Vue components:

```vue
<template>
  <div class="canvas-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useCanvas } from "vue-printables";

const canvasRef = useTemplateRef("canvasRef");

const { canvasInstance, activeObj } = useCanvas(canvasRef, {
  productImageUrl: "/path/to/your/product-image.jpg",
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 },
});
</script>

<style>
.canvas-container {
  position: relative;
  width: 550px;
  height: 600px;
}
</style>
```

## Import Options

You can import composables individually or all at once:

```ts
// Individual imports (recommended for tree-shaking)
import { useCanvas } from "vue-printables";
import { useText } from "vue-printables";
import { useImage } from "vue-printables";

// Or import all at once
import { useCanvas, useText, useImage } from "vue-printables";
```

## Next Steps

Now that you have Vue Printables installed, you can:

1. Learn about the [useCanvas composable](/guide/useCanvas) for canvas management
2. Explore [useText composable](/guide/useText) for text operations
3. Discover [useImage composable](/guide/useImage) for image handling
4. Check out [practical examples](/examples) to see Vue Printables in action
