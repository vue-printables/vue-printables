<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  onImageUploaded: (image: HTMLImageElement) => void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        props.onImageUploaded(img);
        // Reset the file input to allow uploading the same file again
        if (fileInput.value) fileInput.value.value = "";
      };
    };

    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div>
    <button
      class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      @click="triggerFileInput"
    >
      Upload Image
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
