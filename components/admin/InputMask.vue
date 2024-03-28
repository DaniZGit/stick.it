<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon" class="rounded-l-md">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
      <InputMask
        v-model="model"
        :id="id"
        :name="name"
        :mask="mask"
        :slot-char="slotChar"
        :placeholder="placeholder"
        :pt="preset"
        :class="attrs.class"
        autocomplete="off"
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
  import type { InputMaskPassThroughOptions } from "primevue/inputmask";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const model = defineModel();
  defineProps({
    id: String,
    name: String,
    placeholder: String,
    mask: String,
    slotChar: String,
    label: String,
    icon: String,
    error: String,
  });

  const preset: InputMaskPassThroughOptions = {
    root: ({}) => ({
      class:
        "w-full bg-base-white focus:brightness-90 p-2 focus:outline-0 border-2 focus:border-base-black rounded-r-md duration-300",
    }),
  };
</script>

<style></style>
