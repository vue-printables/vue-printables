<template>
  <div class="mx-auto max-w-4xl rounded-lg bg-gray-50 p-6 shadow-md">
    <h2 class="mb-6 text-center text-2xl font-medium text-gray-800">
      Image Editor
    </h2>

    <div
      class="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
    >
      <div v-if="values.src" class="relative">
        <img alt="Uploaded preview" :src="values.src" />
        <button
          class="i-mdi-close-circle-outline absolute -top-5 -right-5 cursor-pointer text-2xl text-red-500 hover:text-red-400 active:text-red-600"
          @click="$emit('delete')"
        />
      </div>
      <template v-else>
        <input
          class="hidden"
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageUpload"
        />
        <button
          class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          type="button"
          @click="triggerFileInput"
        >
          Upload Image
        </button>
        <p class="text-sm text-gray-500">or drag and drop an image here</p>
      </template>
    </div>

    <!-- Image Controls Section (only visible when image is uploaded) -->
    <div v-if="editing" class="rounded-lg bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-medium text-gray-800">Image Properties</h3>

      <div class="mb-4">
        <label for="width" class="mb-1 block font-medium text-gray-700">
          Width (px)
        </label>
        <div class="flex items-center gap-4">
          <input
            type="number"
            id="width"
            min="10"
            max="1000"
            class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
            v-model="imageProperties.width"
            @input="updateConfig('width', Number(imageProperties.width))"
          />
          <input
            type="range"
            min="10"
            max="1000"
            class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
            v-model="imageProperties.width"
            @input="updateConfig('width', Number(imageProperties.width))"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="height" class="mb-1 block font-medium text-gray-700">
          Height (px)
        </label>
        <div class="flex items-center gap-4">
          <input
            type="number"
            id="height"
            min="10"
            max="1000"
            class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
            v-model="imageProperties.height"
            @input="updateConfig('height', Number(imageProperties.height))"
          />
          <input
            type="range"
            min="10"
            max="1000"
            class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
            v-model="imageProperties.height"
            @input="updateConfig('height', Number(imageProperties.height))"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="opacity" class="mb-1 block font-medium text-gray-700">
          Opacity
        </label>
        <div class="flex items-center gap-4">
          <input
            type="number"
            id="opacity"
            min="0"
            max="1"
            step="0.1"
            v-model="imageProperties.opacity"
            @input="updateConfig('opacity', Number(imageProperties.opacity))"
            class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model="imageProperties.opacity"
            @input="updateConfig('opacity', Number(imageProperties.opacity))"
            class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="rotate" class="mb-1 block font-medium text-gray-700">
          Rotate (deg)
        </label>
        <div class="flex items-center gap-4">
          <input
            type="number"
            id="rotation"
            min="0"
            max="360"
            class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
            v-model="imageProperties.angle"
            @input="updateConfig('angle', Number(imageProperties.angle))"
          />
          <input
            type="range"
            min="0"
            max="360"
            class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
            v-model="imageProperties.angle"
            @input="updateConfig('angle', Number(imageProperties.angle))"
          />
        </div>
      </div>

      <button
        class="mt-8 flex flex-col justify-between gap-4 rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-gray-600 sm:flex-row"
        @click="resetControls"
      >
        Reset Controls
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ImgConfigs } from "~/types/common";

const props = defineProps<{
  values: ImgConfigs;
  editing?: boolean;
}>();

const emit = defineEmits<{
  update: [field: string, value: any];
  imageUploaded: [image: string];
  delete: [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const imageProperties = ref<ImgConfigs>({
  width: props.values.width,
  height: props.values.height,
  opacity: props.values.opacity,
  angle: props.values.angle,
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const updateConfig = (field: string, value: number) => {
  emit("update", field, value);
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.item(0);

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        emit("imageUploaded", result.toString());
      }
    };
    reader.readAsDataURL(file);
  }
};

const resetControls = () => {
  imageProperties.value = {
    width: props.values.width,
    height: props.values.height,
    opacity: props.values.opacity,
    angle: props.values.angle,
  };
  emit("update", "width", imageProperties.value.width);
  emit("update", "height", imageProperties.value.height);
  emit("update", "opacity", imageProperties.value.opacity);
  emit("update", "angle", imageProperties.value.angle);
};
</script>
