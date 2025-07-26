# useCanvas Composable

## Overview

The `useCanvas` composable is the core of Vue Printables. It initializes and manages a Fabric.js canvas, handles background images, creates design areas, and manages object selection. This composable provides the foundation for all canvas-based operations.

## Basic Usage

```vue
<template>
  <canvas ref="canvasRef" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useCanvas } from 'vue-printables'

const canvasRef = useTemplateRef('canvasRef')

const { canvasInstance, designArea, clipPath, activeObj } = useCanvas(canvasRef, {
  productImageUrl: '/t-shirt.jpg',
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 }
})
</script>
```

## Parameters

### canvasRef
- **Type**: `TemplateRefType<HTMLCanvasElement | null>`
- **Description**: Vue template ref pointing to the canvas element

### options
- **Type**: `CanvasEditorOptions`
- **Description**: Configuration object for canvas initialization

```ts
interface CanvasEditorOptions {
  productImageUrl: string
  canvasSize?: Partial<Size>
  clipPathSize?: Partial<Size>
}

type Size = {
  width: number
  height: number
}
```

#### Options Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `productImageUrl` | `string` | - | URL of the background product image |
| `canvasSize.width` | `number` | `550` | Canvas width in pixels |
| `canvasSize.height` | `number` | `600` | Canvas height in pixels |
| `clipPathSize.width` | `number` | `200` | Design area width in pixels |
| `clipPathSize.height` | `number` | `300` | Design area height in pixels |

## Return Values

The composable returns an object with the following reactive properties:

### canvasInstance
- **Type**: `ShallowRef<Canvas | null>`
- **Description**: The main Fabric.js canvas instance
- **Usage**: Access canvas methods and properties

### designArea
- **Type**: `ShallowRef<Rect | null>`
- **Description**: Visual rectangle representing the printable design area
- **Usage**: Shows users where they can place design elements

### clipPath
- **Type**: `ShallowRef<Rect | null>`
- **Description**: Clipping path that constrains design elements
- **Usage**: Automatically applied to text and images to keep them within bounds

### activeObj
- **Type**: `ShallowRef<FabricObject | null>`
- **Description**: Currently selected object on the canvas
- **Usage**: Track which element is being edited

## Advanced Configuration

### Custom Canvas Settings

```ts
const { canvasInstance } = useCanvas(canvasRef, {
  productImageUrl: '/product.jpg',
  canvasSize: { width: 800, height: 900 },
  clipPathSize: { width: 300, height: 400 }
})

// Access canvas after initialization
watchEffect(() => {
  if (canvasInstance.value) {
    // Customize canvas properties
    canvasInstance.value.backgroundColor = '#f0f0f0'
    canvasInstance.value.selection = true
  }
})
```

### Responsive Canvas

```ts
import { ref, computed } from 'vue'

const containerWidth = ref(800)
const aspectRatio = 600 / 550 // height / width

const canvasSize = computed(() => ({
  width: containerWidth.value,
  height: containerWidth.value * aspectRatio
}))

const { canvasInstance } = useCanvas(canvasRef, {
  productImageUrl: '/product.jpg',
  canvasSize: canvasSize.value
})
```

## Event Handling

The canvas automatically handles object selection events. You can extend this by listening to additional Fabric.js events:

```ts
watchEffect(() => {
  if (canvasInstance.value) {
    canvasInstance.value.on('object:modified', (e) => {
      console.log('Object modified:', e.target)
    })
    
    canvasInstance.value.on('path:created', (e) => {
      console.log('Path created:', e.path)
    })
  }
})
```

## Best Practices

### 1. Canvas Container Styling

Ensure your canvas container has proper positioning:

```css
.canvas-container {
  position: relative;
  width: 550px;
  height: 600px;
  border: 1px solid #ddd;
}

.canvas-container .canvas-container {
  position: absolute !important;
  left: 0;
  top: 0;
}
```

### 2. Memory Management

The composable automatically cleans up resources when the component unmounts, but you can also manually dispose:

```ts
onBeforeUnmount(() => {
  canvasInstance.value?.dispose()
})
```

### 3. Error Handling

```ts
try {
  const canvas = useCanvas(canvasRef, options)
} catch (error) {
  console.error('Failed to initialize canvas:', error)
}
```

## Common Issues

### Canvas Not Rendering
- Ensure the canvas ref is properly connected to a `<canvas>` element
- Check that the product image URL is accessible
- Verify canvas container has proper dimensions

### Design Area Not Visible
- Confirm `clipPathSize` dimensions are smaller than `canvasSize`
- Check that the design area isn't positioned outside the canvas bounds

### Performance Issues
- Use `shallowRef` for large objects to avoid deep reactivity
- Disable unnecessary Fabric.js features if not needed
- Consider using `requestAnimationFrame` for frequent updates
