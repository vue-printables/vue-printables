<template>
  <div class="tabs-container">
    <button
      v-for="tab in tabs"
      class="tab-button"
      :key="tab.key"
      :class="{ active: activeTab === tab.key }"
      @click="onTabClick(tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type TabItem = {
  key: string;
  label: string;
};

const props = defineProps<{
  tabs: TabItem[];
  modelValue: string;
  activeClass?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const activeTab = computed(() => props.modelValue);

const onTabClick = (key: string) => {
  if (key !== activeTab.value) {
    emit("update:modelValue", key);
    emit("change", key);
  }
};
</script>

<style scoped>
.tabs-container {
  display: flex;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
}

.tab-button:hover {
  background-color: var(--vp-c-brand-1);
  color: white;
}

.tab-button.active {
  background: var(--vp-c-brand-3);
  color: white;
  font-weight: 600;
}
</style>
