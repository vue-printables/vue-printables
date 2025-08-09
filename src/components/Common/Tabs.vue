<template>
  <div class="flex gap-2 p-2">
    <button
      v-for="tab in tabs"
      class="px-4 py-2"
      :key="tab.key"
      :class="activeTab === tab.key ? activeClass : ''"
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

const activeClass = computed(
  () => props.activeClass || "border-b-2 border-blue-500 font-bold",
);
</script>
