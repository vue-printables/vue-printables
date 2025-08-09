<template>
  <div class="rounded-lg bg-white p-6 shadow-sm">
    <h3 class="mb-6 text-lg font-medium text-gray-800">Image Properties</h3>

    <!-- Width -->
    <div class="mb-4">
      <label class="mb-1 block font-medium text-gray-700">Width (px)</label>
      <div class="flex items-center gap-4">
        <input
          type="number"
          min="10"
          max="1000"
          class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          :value="properties?.width"
          @input="handleUpdates('width', $event)"
        />
        <input
          type="range"
          min="10"
          max="1000"
          class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          :value="properties?.width"
          @input="handleUpdates('width', $event)"
        />
      </div>
    </div>

    <!-- Height -->
    <div class="mb-4">
      <label class="mb-1 block font-medium text-gray-700">Height (px)</label>
      <div class="flex items-center gap-4">
        <input
          type="number"
          min="10"
          max="1000"
          class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          :value="properties?.height"
          @input="handleUpdates('height', $event)"
        />
        <input
          type="range"
          min="10"
          max="1000"
          class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          :value="properties?.height"
          @input="handleUpdates('height', $event)"
        />
      </div>
    </div>

    <!-- Opacity -->
    <div class="mb-4">
      <label class="mb-1 block font-medium text-gray-700">Opacity</label>
      <div class="flex items-center gap-4">
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          :value="properties?.opacity"
          @input="handleUpdates('opacity', $event)"
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          :value="properties?.opacity"
          @input="handleUpdates('opacity', $event)"
        />
      </div>
    </div>

    <!-- Rotation -->
    <div class="mb-4">
      <label class="mb-1 block font-medium text-gray-700">Rotate (deg)</label>
      <div class="flex items-center gap-4">
        <input
          type="number"
          min="0"
          max="360"
          class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          :value="properties?.angle"
          @input="handleUpdates('angle', $event)"
        />
        <input
          type="range"
          min="0"
          max="360"
          class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          :value="properties?.angle"
          @input="handleUpdates('angle', $event)"
        />
      </div>
    </div>

    <!-- Reset -->
    <button
      class="mt-8 flex flex-col justify-between gap-4 rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-gray-600 sm:flex-row"
      @click="emit('reset')"
    >
      Reset Controls
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ImgConfigs } from "~/types/common";

defineProps<{
  properties?: ImgConfigs;
}>();

const emit = defineEmits<{
  (e: "update", key: string, value: any): void;
  (e: "reset"): void;
}>();

const handleUpdates = (key: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update", key, parseInt(value));
};
</script>
