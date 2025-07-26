# Vue Printables

A powerful Vue.js library that leverages Fabric.js to make custom product design and customization effortless. Vue Printables provides three essential composables for building interactive canvas-based design tools.

## Features

- 🎨 **Canvas Management** - Easy canvas initialization and control
- 📝 **Text Manipulation** - Add, edit, and style text elements
- 🖼️ **Image Handling** - Upload, resize, and position images
- 🎯 **Design Area Control** - Configurable printable areas with clipping
- 🔧 **TypeScript Support** - Full type safety and IntelliSense

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
  <canvas ref="canvasRef" />
</template>

<script setup>
import { useTemplateRef } from "vue";
import { useCanvas, useText, useImage } from "vue-printables";

const canvasRef = useTemplateRef("canvasRef");

// Initialize canvas
const { canvasInstance, activeObj } = useCanvas(canvasRef, {
  productImageUrl: "/path/to/product.jpg",
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 },
});

// Text operations
const { addText, updateText } = useText({ canvasInstance, activeObj });

// Image operations
const { addImage, updateImage } = useImage({ canvasInstance, activeObj });
</script>
```

## Core Composables

### useCanvas

Manages the main Fabric.js canvas, background images, and design areas.

### useText

Handles text element creation, editing, and styling with full typography control.

### useImage

Manages image uploads, positioning, scaling, and transformations.

## Requirements

- Vue 3.0+
- TypeScript (recommended)
- Modern browser with Canvas support

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please submit issues or pull requests to help improve Vue Printables.
