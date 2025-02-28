<script setup lang="ts">
import { ref } from "vue";
import CanvasEditor from "./components/CanvasEditor.vue";
</script>

<template>
  <div class="min-h-screen bg-white p-4 sm:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Canvas Editor</h1>
      <p class="text-gray-600">
        Upload, resize and position images or text on a canvas
      </p>
    </header>

    <main>
      <CanvasEditor />
    </main>
  </div>
</template>
