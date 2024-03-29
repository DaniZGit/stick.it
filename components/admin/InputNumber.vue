<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon" class="rounded-l-md">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
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
        autocomplete="off"
        @update:modelValue="emit('change')"
      />
    </InputGroup>
    <AdminInlineMessage
      severity="error"
      class="h-0 transition-[height] ease-out duration-100"
      :class="{
        'h-[14px]': error,
      }"
    >
      {{ error }}
    </AdminInlineMessage>
  </div>
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
    label: String,
    min: Number,
    max: Number,
    showButtons: Boolean,
    icon: String,
    error: String,
  });

  const preset: InputNumberPassThroughOptions = {
    root: "w-full flex",
    input: {
      root: ({ props }) => ({
        class: [
          "w-full bg-base-white focus:brightness-90 p-2 focus:outline-0 border-2 focus:border-base-black duration-300",
          {
            "rounded-l-md": !icon || !icon.length,
            "rounded-r-md": !showButtons,
          },
        ],
      }),
    },
    buttonGroup: ({ state }) => ({
      class: ["shrink flex flex-col justify-between bg-base-tertiary"],
    }),
    incrementButton: {
      root: ({ context }) => ({
        class: ["flex p-1 bg-base-white hover:brightness-90 duration-200"],
      }),
    },
    decrementButton: {
      root: ({ context }) => ({
        class: ["flex p-1 bg-base-white hover:brightness-90 duration-200"],
      }),
    },
  };
</script>

<style></style>
