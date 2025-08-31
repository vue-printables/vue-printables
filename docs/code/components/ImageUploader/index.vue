<template>
  <div class="image-uploader">
    <h2 class="image-uploader-title">Image Editor</h2>

    <div class="upload-area">
      <div v-if="values?.src" class="image-preview">
        <img alt="Uploaded preview" :src="values.src" />
        <button class="delete-btn" @click="$emit('delete')">X</button>
      </div>
      <template v-else>
        <input
          class="file-input"
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageUpload"
        />
        <button class="upload-btn" type="button" @click="triggerFileInput">
          Upload Image
        </button>
        <p class="upload-hint">or drag and drop an image here</p>
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

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-uploader-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.upload-area {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 0.75rem;
  border: 2px dashed #cbd5e0;
  padding: 3rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: var(--vp-c-brand-3);
  background: #fef6ef;
  transform: translateY(-2px);
}

.image-preview {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 0.5rem;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  color: red;
  border: 2px solid red;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-btn:hover {
  transform: scale(1.1);
}

.file-input {
  display: none;
}

.upload-btn {
  cursor: pointer;
  border-radius: 0.75rem;
  background: var(--vp-c-brand-3);
  padding: 0.75rem 1.5rem;
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
}

.upload-hint {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}
</style>
