<template>
  <div
    class="mx-auto flex max-w-4xl flex-col gap-6 rounded-lg bg-gray-50 p-6 shadow-md"
  >
    <h2 class="text-center text-2xl font-medium text-gray-800">Image Editor</h2>

    <div
      class="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
    >
      <div v-if="values?.src" class="relative">
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

    <UpdateForm v-if="editing" :properties="values" @update="updateConfig" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UpdateForm from "~/components/ImageUploader/UpdateForm.vue";
import type { ImgConfigs } from "~/types/common";

defineProps<{
  values?: ImgConfigs;
  editing?: boolean;
}>();

const emit = defineEmits<{
  update: [field: string, value: any];
  imageUploaded: [image: string];
  delete: [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const updateConfig = (field: string, value: any) => {
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
</script>
