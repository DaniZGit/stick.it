<template>
  <Button
    :pt="preset"
    :class="attrs.class"
    :type="type"
    :disabled="attrs.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
  import type { ButtonPassThroughOptions } from "primevue/button";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(["click"]);

  const { color } = withDefaults(
    defineProps<{
      color?: "base" | "blue" | "red";
      type?: string;
    }>(),
    {
      color: "base",
      type: "button",
    }
  );

  const preset: ButtonPassThroughOptions = {
    root: ({ props }) => ({
      class: [
        "text-md duration-300 border-2",
        {
          "bg-base-secondary text-base-black hover:brightness-90":
            color == "base",
          "bg-base-blue text-base-white border-base-blue hover:bg-base-blue-hover":
            color == "blue",
          "bg-red-500 text-base-white border-red-500 hover:bg-red-700":
            color == "red",
        },
        {
          "brightness-90": attrs.disabled,
        },
      ],
    }),
  };
</script>
