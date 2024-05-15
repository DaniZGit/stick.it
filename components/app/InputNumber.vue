<template>
  <InputNumber
    v-model="value"
    :id="id"
    :name="name"
    :placeholder="placeholder"
    :pt="preset"
    :class="attrs.class"
    :useGrouping="false"
    :min="min"
    :max="max"
    :show-buttons="showButtons"
    :maxFractionDigits="maxFractionDigits"
    :step="step"
    autocomplete="off"
    :input-class="inputClass"
    @update:modelValue="emit('change')"
  />
</template>

<script lang="ts" setup>
  import type { InputNumberPassThroughOptions } from "primevue/inputnumber";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    change: [];
  }>();

  const value = defineModel();
  const { icon, showButtons } = defineProps({
    id: String,
    name: String,
    placeholder: String,
    min: Number,
    max: Number,
    maxFractionDigits: {
      type: Number,
      default: 2,
    },
    step: {
      type: Number,
      default: 1,
    },
    showButtons: Boolean,
    inputClass: String,
  });

  const preset: InputNumberPassThroughOptions = {
    root: "w-full flex",
    input: {
      root: ({ props }) => ({
        class: [
          "w-full bg-app-primary text-app-secondary focus:brightness-90 py-1 px-2 focus:outline-0 border-2 rounded-lg focus:border-app-tertiary duration-300",
          {
            "rounded-r-none": showButtons,
          },
        ],
      }),
    },
    buttonGroup: ({ state }) => ({
      class: ["shrink flex flex-col justify-between bg-base-tertiary"],
    }),
    incrementButton: {
      root: ({ context }) => ({
        class: ["flex p-0.5 bg-app-secondary hover:brightness-90 duration-200"],
      }),
    },
    decrementButton: {
      root: ({ context }) => ({
        class: [
          "flex p-0.5 bg-app-secondary text-app-primary hover:brightness-90 duration-200",
        ],
      }),
    },
  };
</script>

<style></style>
