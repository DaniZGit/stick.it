<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon" class="rounded-l-md">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
      <SelectButton
        :id="id"
        :name="name"
        v-model="model"
        :options="options"
        :allow-empty="false"
        :pt="preset"
        :class="attrs.class"
        :option-label="optionLabel"
        :option-value="optionValue"
      >
      </SelectButton>
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
  import type { SelectButtonPassThroughOptions } from "primevue/selectbutton";
  import { any, string } from "zod";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const model = defineModel();
  defineProps({
    id: String,
    name: String,
    label: String,
    options: Array<{ title: string; value: ApiStickerType }>,
    optionLabel: String,
    optionValue: String,
    icon: String,
    error: String,
  });

  const preset: SelectButtonPassThroughOptions = {
    root: "h-full flex items-center border-collapse bg-base-secondary",
    button: ({ state, attrs, context }) => ({
      class: [
        "h-full flex px-2 py-2 bg-base-secondary border-b-2 hover:cursor-pointer hover:brightness-90 active:text-base-blue",
        {
          " font-bold border-b-2 border-base-blue": context.active,
          "border-base-secondary": !context.active,
        },
      ],
    }),
  };
</script>

<style></style>
