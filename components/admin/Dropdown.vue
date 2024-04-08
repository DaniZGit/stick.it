<template>
  <Dropdown
    v-model="selected"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    :highlightOnSelect="false"
    :pt="preset"
    :pt-options="{ mergeProps: true }"
    class="ring-0"
    @change="emit('change', $event)"
  >
  </Dropdown>
</template>

<script lang="ts" setup>
  import type { DropdownPassThroughOptions } from "primevue/dropdown";
  import { string } from "zod";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const selected = defineModel();
  defineProps({
    id: String,
    name: String,
    options: Array<any>,
    optionLabel: String,
    optionValue: String,
    placeholder: String,
    label: String,
    icon: String,
    error: String,
  });

  const emit = defineEmits<{
    change: [any];
  }>();

  const preset: DropdownPassThroughOptions = {
    root: "!bg-base-secondary border-2 !text-black",
    input: "!text-base-black",
    trigger: "hover:cursor-pointer",
    panel: "!z-[9999]",
    wrapper: "bg-base-tertiary !text-base-black",
    itemGroupLabel: "bg-base-tertiary !text-base-black",
    item: ({ context }) => ({
      class: [
        "!text-base-black !bg-base-tertiary",
        {
          "!bg-base-tertiary  brightness-90":
            context.selected || context.focused,
        },
      ],
    }),
    emptyMessage: "!text-base-black",
  };
</script>
