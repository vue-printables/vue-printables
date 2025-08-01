# Introduction

## What is Vue Printables?

Vue Printables is a powerful Vue.js library that leverages [Fabric.js](https://fabricjs.com/) to create interactive canvas-based design tools. It provides three essential composables that make building custom product designers, image editors, and creative tools effortless.

The library is built with Vue 3's Composition API and provides full TypeScript support, making it perfect for modern Vue applications that need canvas-based design functionality.

## Key Features

### 🎨 Canvas Management

- Initialize [Fabric.js](https://fabricjs.com/) canvas with ease
- Background image handling
- Configurable design areas with clipping
- Automatic scaling and positioning

### 📝 Text Operations

- Add and edit text elements
- Full typography control (font, size, weight, style)
- Real-time text updates
- Custom styling options

### 🖼️ Image Handling

- Image upload and positioning
- Automatic scaling to fit design areas
- Rotation and transformation controls
- Clipping path support

## Why Choose Vue Printables?

### Developer Experience

- **Vue 3 Native**: Built specifically for Vue 3 with Composition API
- **TypeScript Ready**: Full type safety and excellent IntelliSense
- **Minimal Setup**: Get started with just a few lines of code
- **Composable Architecture**: Modular design for maximum flexibility

### Production Ready

- **Performance Optimized**: Efficient canvas operations and memory management
- **Cross-browser Compatible**: Works on all modern browsers
- **Responsive Design**: Adapts to different screen sizes
- **Extensible**: Easy to customize and extend functionality

### Use Cases

- **E-commerce Product Customization**: T-shirts, mugs, phone cases
- **Print Design Tools**: Business cards, flyers, posters
- **Photo Editing Applications**: Basic image manipulation
- **Creative Platforms**: Art tools and design interfaces

## Architecture

Vue Printables follows a composable-first architecture:

```
useCanvas (Core)
├── Canvas initialization
├── Background image management
├── Design area control
└── Object selection handling

useText (Text Operations)
├── Text creation and editing
├── Typography controls
└── Style management

useImage (Image Operations)
├── Image upload handling
├── Scaling and positioning
└── Transformation controls
```

Each composable is designed to work independently or together, giving you the flexibility to use only what you need for your specific use case.
