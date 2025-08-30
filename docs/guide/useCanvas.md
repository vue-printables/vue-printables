# useCanvas Composable

## Overview

The `useCanvas` composable is the core of Vue Printables. It initializes and manages a [Fabric.js](https://fabricjs.com/) canvas, handles background images, creates design areas, and manages object selection. This composable provides the foundation for all canvas-based operations.

## Basic Usage

```vue
<template>
  <canvas ref="mainCanvas" />
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useCanvas } from "vue-printables";

const canvasRef = useTemplateRef("mainCanvas");

const { canvasInstance, designArea, clipPath, activeObj, initCanvas } =
  useCanvas(canvasRef, {
    bgImg: {
      url: "/product.png",
    },
  });
</script>
```

## Parameters

### canvasRef

- **Type**: `TemplateRefType<HTMLCanvasElement | null>`
- **Description**: Vue template ref pointing to the canvas element

### options

- **Type**: `CanvasOptions`
- **Description**: Configuration object for canvas initialization

```ts
interface CanvasOptions {
  initOnMount?: boolean;
  size?: Size;
  clipPathOption?: {
    size?: Size;
    position?: Position;
    movable?: boolean;
  };
  bgImg?: {
    url: string;
    position?: Position;
    size?: Size;
  };
}

type Size = {
  width: number;
  height: number;
};

type Position = {
  left: number;
  top: number;
};
```

#### Options Properties

| Property                  | Type       | Default                   | Description                                  |
| ------------------------- | ---------- | ------------------------- | -------------------------------------------- |
| `initOnMount`             | `boolean`  | `false`                   | Flag to initialize canvas on component mount |
| `size`                    | `Size`     | `width: 550, height: 600` | Canvas size (width, height) in pixels        |
| `bgImg.url`               | `string`   | -                         | URL of the background product image          |
| `bgImg.position`          | `Position` | -                         | Position of the background product image     |
| `bgImg.size`              | `Size`     | -                         | Size of the background product image         |
| `clipPathOption.size`     | `Size`     | `width: 544, height: 594` | Design area size (width, height) in pixels   |
| `clipPathOption.position` | `Position` | `200`                     | Design area position in pixels               |
| `clipPathOption.movable`  | `boolean`  | `false`                   | Flag to enable moving the design area        |

## Return Values

The composable returns an object with the following properties:

### `canvasInstance`

- **Type**: `ShallowRef<Canvas | null>`
- **Description**: The main [Fabric.js](https://fabricjs.com/) canvas instance
- **Usage**: Access canvas methods and properties

### `designArea`

- **Type**: `ShallowRef<Rect | null>`
- **Description**: Visual rectangle representing the printable design area
- **Usage**: Shows users where they can place design elements

### `clipPath`

- **Type**: `ShallowRef<Rect | null>`
- **Description**: Clipping path that constrains design elements
- **Usage**: Automatically applied to text and images to keep them within bounds

### `activeObj`

- **Type**: `ShallowRef<FabricObject | null>`
- **Description**: Currently selected object on the canvas
- **Usage**: Track which element is being edited

### `initCanvas()`

- **Type**: `() => Promise<void>`
- **Description**: Initializes the Fabric.js canvas instance with the configured options. Sets up the background image, design area, and clip path based on the provided options. Must be called before any canvas operations can be performed.

### `exportAsImg(size, designOption?, format?)`

- **Type**: `(size: Size, designOption?: {size?: Size; position?: Position; dpi?: number;}, format?: ImageFormat) => Promise<string | undefined>`
- **Description**: Export the desired design area as an image.

### `exportAsJson()`

- **Type**: `() => any`
- **Description**: Export the designed canvas as a JSON file.

### `loadAsJson(canvasJson)`

- **Type**: `(canvasJson: any) => Promise<void>`
- **Description**: Restores a previously exported canvas state from JSON data. Recreates all canvas objects and their properties exactly as they were when exported.

### `updateBgImage(bgImg)`

- **Type**: `(bgImg?: {url: string; position?: Position; size?: Size;}) => Promise<void>`
- **Description**: Updates or sets the background image of the canvas. Can be used to change the product image dynamically after canvas initialization.
