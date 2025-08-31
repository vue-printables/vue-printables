<template>
  <div class="update-form">
    <h3 class="form-title">Image Properties</h3>

    <!-- Width -->
    <div class="form-group">
      <label class="form-label">Width (px)</label>
      <div class="input-group">
        <input
          type="number"
          min="10"
          max="1000"
          class="number-input"
          :value="properties?.width"
          @input="handleUpdates('width', $event)"
        />
        <input
          type="range"
          min="10"
          max="1000"
          class="range-input"
          :value="properties?.width"
          @input="handleUpdates('width', $event)"
        />
      </div>
    </div>

    <!-- Height -->
    <div class="form-group">
      <label class="form-label">Height (px)</label>
      <div class="input-group">
        <input
          type="number"
          min="10"
          max="1000"
          class="number-input"
          :value="properties?.height"
          @input="handleUpdates('height', $event)"
        />
        <input
          type="range"
          min="10"
          max="1000"
          class="range-input"
          :value="properties?.height"
          @input="handleUpdates('height', $event)"
        />
      </div>
    </div>

    <!-- Opacity -->
    <div class="form-group">
      <label class="form-label">Opacity</label>
      <div class="input-group">
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          class="number-input"
          :value="properties?.opacity"
          @input="handleUpdates('opacity', $event)"
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="range-input"
          :value="properties?.opacity"
          @input="handleUpdates('opacity', $event)"
        />
      </div>
    </div>

    <!-- Rotation -->
    <div class="form-group">
      <label class="form-label">Rotate (deg)</label>
      <div class="input-group">
        <input
          type="number"
          min="0"
          max="360"
          class="number-input"
          :value="properties?.angle"
          @input="handleUpdates('angle', $event)"
        />
        <input
          type="range"
          min="0"
          max="360"
          class="range-input"
          :value="properties?.angle"
          @input="handleUpdates('angle', $event)"
        />
      </div>
    </div>

    <!-- Reset -->
    <button class="reset-btn" @click="emit('reset')">Reset Controls</button>
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

<style scoped>
.update-form {
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.form-title {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  margin-bottom: 0.5rem;
  display: block;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.number-input {
  width: 4rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e0;
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  color: #2d3748;
  background: #f7fafc;
}

.number-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.range-input {
  height: 0.375rem;
  flex: 1;
  cursor: pointer;
  appearance: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.2s;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.range-input::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.reset-btn {
  margin-top: 1.5rem;
  width: 100%;
  border-radius: 0.5rem;
  background: #64748b;
  padding: 0.75rem 1rem;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
}
</style>
