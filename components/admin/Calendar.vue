<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
      <Calendar
        :pt="preset"
        :input-id="id"
        v-model="model"
        :show-time="showTime"
        :hour-format="hourFormat"
        :date-format="dateFormat"
        :placeholder="placeholder"
        :class="attrs.class"
      >
        <slot />
      </Calendar>
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
  import type { CalendarPassThroughOptions } from "primevue/calendar";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const model = defineModel();
  defineProps({
    id: String,
    name: String,
    showTime: Boolean,
    hourFormat: String,
    dateFormat: String,
    placeholder: String,
    label: String,
    icon: String,
    error: String,
  });

  const preset: CalendarPassThroughOptions = {
    root: "w-full",
    input:
      "w-full bg-base-white focus:brightness-90 p-2 focus:outline-0 border-2 focus:border-base-black duration-300",
  };
</script>
