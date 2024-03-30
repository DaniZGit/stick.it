<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon" class="rounded-l-md">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
      <InputText
        v-model="model"
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :pt="preset"
        :class="attrs.class"
        autocomplete="off"
        @change="emit('change', $event)"
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
  import type { InputTextPassThroughOptions } from "primevue/inputtext";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    change: [e: any];
  }>();

  const model = defineModel();
  defineProps({
    id: String,
    name: String,
    placeholder: String,
    label: String,
    icon: String,
    error: String,
  });

  const preset: InputTextPassThroughOptions = {
    root: ({}) => ({
      class:
        "w-full bg-base-white focus:brightness-90 p-2 focus:outline-0 border-2 focus:border-base-black rounded-r-md duration-300",
    }),
  };
</script>

<style></style>
