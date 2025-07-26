# useText Composable

## Overview

The `useText` composable provides comprehensive text manipulation capabilities for your canvas. It allows you to add new text elements, update existing ones, and provides full typography control including fonts, sizes, colors, and styling options.

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
import { ref, computed } from 'vue'
import { useTemplateRef } from 'vue'
import { useCanvas, useText } from 'vue-printables'

const canvasRef = useTemplateRef('canvasRef')
const textContent = ref('Hello World')

// Initialize canvas
const canvasState = useCanvas(canvasRef, {
  productImageUrl: '/t-shirt.jpg',
  canvasSize: { width: 550, height: 600 },
  clipPathSize: { width: 200, height: 300 }
})

// Initialize text operations
const { addText, updateText } = useText(canvasState)

const isTextSelected = computed(() => 
  canvasState.activeObj.value?.type === 'text'
)

const addNewText = () => {
  addText({
    text: textContent.value,
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'normal',
    fill: '#000000'
  })
}

const updateSelectedText = () => {
  if (isTextSelected.value) {
    updateText({
      text: textContent.value,
      fontSize: 28,
      fill: '#ff0000'
    })
  }
}
</script>
```

## Parameters

### canvasRef
- **Type**: `CanvasTemplateRef`
- **Description**: Object containing canvas state from `useCanvas`

```ts
type CanvasTemplateRef = {
  canvasInstance: Ref<Canvas | null>
  designArea: Ref<Rect | null>
  clipPath: Ref<Rect | null>
  activeObj: Ref<FabricObject | null>
}
```

## Methods

### addText(textConfig)

Adds a new text element to the canvas.

**Parameters:**
- `textConfig` - `TextConfigs` object defining text properties

**Example:**
```ts
addText({
  text: 'Custom Text',
  fontFamily: 'Helvetica',
  fontSize: 32,
  fontWeight: 'bold',
  fontStyle: 'italic',
  fill: '#3366cc',
  stroke: '#ffffff',
  underline: true
})
```

### updateText(textConfig)

Updates the currently selected text element.

**Parameters:**
- `textConfig` - Partial `TextConfigs` object with properties to update

**Example:**
```ts
// Only update specific properties
updateText({
  fontSize: 36,
  fill: '#ff6600'
})
```

**Throws:**
- Error if no object is selected
- Error if selected object is not a text element

## TextConfigs Interface

```ts
interface TextConfigs {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold'
  fontStyle?: '' | 'normal' | 'italic' | 'oblique'
  underline: boolean
  fill?: string
  stroke?: string
  [key: string]: any // Allows additional Fabric.js text properties
}
```

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `text` | `string` | Yes | - | The text content to display |
| `fontFamily` | `string` | Yes | - | Font family name (e.g., 'Arial', 'Helvetica') |
| `fontSize` | `number` | Yes | - | Font size in pixels |
| `fontWeight` | `'normal' \| 'bold'` | Yes | - | Font weight |
| `fontStyle` | `string` | No | `'normal'` | Font style (italic, oblique) |
| `underline` | `boolean` | Yes | - | Whether text is underlined |
| `fill` | `string` | No | `'#000000'` | Text fill color |
| `stroke` | `string` | No | - | Text stroke color |

## Advanced Usage

### Custom Text Styling

```ts
const addStyledText = () => {
  addText({
    text: 'Stylized Text',
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fill: '#2c3e50',
    stroke: '#ecf0f1',
    strokeWidth: 2,
    underline: true,
    shadow: {
      color: 'rgba(0,0,0,0.3)',
      blur: 5,
      offsetX: 2,
      offsetY: 2
    }
  })
}
```

### Dynamic Text Updates

```ts
import { watch } from 'vue'

const textProperties = ref({
  fontSize: 24,
  fill: '#000000',
  fontWeight: 'normal' as const
})

// Watch for property changes and update selected text
watch(textProperties, (newProps) => {
  if (canvasState.activeObj.value?.type === 'text') {
    updateText(newProps)
  }
}, { deep: true })
```

### Text Validation

```ts
const addValidatedText = (textConfig: TextConfigs) => {
  // Validate text content
  if (!textConfig.text.trim()) {
    throw new Error('Text content cannot be empty')
  }
  
  // Validate font size
  if (textConfig.fontSize < 8 || textConfig.fontSize > 200) {
    throw new Error('Font size must be between 8 and 200 pixels')
  }
  
  addText(textConfig)
}
```

## Text Editing Interface

Create a complete text editing interface:

```vue
<template>
  <div class="text-editor">
    <div class="form-group">
      <label>Text Content:</label>
      <textarea v-model="textConfig.text" @input="updateIfEditing" />
    </div>
    
    <div class="form-group">
      <label>Font Family:</label>
      <select v-model="textConfig.fontFamily" @change="updateIfEditing">
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Font Size:</label>
      <input 
        type="range" 
        v-model.number="textConfig.fontSize" 
        min="8" 
        max="100" 
        @input="updateIfEditing"
      />
      <span>{{ textConfig.fontSize }}px</span>
    </div>
    
    <div class="form-group">
      <label>Font Weight:</label>
      <select v-model="textConfig.fontWeight" @change="updateIfEditing">
        <option value="normal">Normal</option>
        <option value="bold">Bold</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Color:</label>
      <input 
        type="color" 
        v-model="textConfig.fill" 
        @input="updateIfEditing"
      />
    </div>
    
    <div class="form-group">
      <label>
        <input 
          type="checkbox" 
          v-model="textConfig.underline" 
          @change="updateIfEditing"
        />
        Underline
      </label>
    </div>
    
    <button @click="addText(textConfig)" v-if="!editing">
      Add Text
    </button>
  </div>
</template>

<script setup lang="ts">
const textConfig = ref({
  text: 'Sample Text',
  fontFamily: 'Arial',
  fontSize: 24,
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  underline: false,
  fill: '#000000',
  stroke: ''
})

const editing = computed(() => 
  canvasState.activeObj.value?.type === 'text'
)

const updateIfEditing = () => {
  if (editing.value) {
    updateText(textConfig.value)
  }
}
</script>
```

## Best Practices

### 1. Text Clipping
Text elements are automatically clipped to the design area. Ensure your design area is appropriately sized for the text content.

### 2. Font Loading
For custom fonts, ensure they're loaded before adding text:

```ts
const loadCustomFont = async () => {
  await document.fonts.load('16px CustomFont')
  addText({
    text: 'Custom Font Text',
    fontFamily: 'CustomFont',
    fontSize: 16
  })
}
```

### 3. Performance
For frequently updated text, consider debouncing updates:

```ts
import { debounce } from 'lodash-es'

const debouncedUpdate = debounce((config: TextConfigs) => {
  updateText(config)
}, 300)
```

## Error Handling

```ts
const safeAddText = (config: TextConfigs) => {
  try {
    addText(config)
  } catch (error) {
    console.error('Failed to add text:', error)
    // Handle error (show notification, etc.)
  }
}

const safeUpdateText = (config: Partial<TextConfigs>) => {
  try {
    updateText(config)
  } catch (error) {
    if (error.message.includes('not of type "Text"')) {
      console.warn('Selected object is not text')
    } else if (error.message.includes('No active object')) {
      console.warn('No object selected')
    } else {
      console.error('Failed to update text:', error)
    }
  }
}
```
