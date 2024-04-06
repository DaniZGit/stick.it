<template>
  <Toast position="bottom-right" :pt="preset">
    <template #container="{ message, closeCallback }">
      <div
        class="flex gap-x-2 py-2 border-2 rounded-md bg-base-white"
        :class="{
          'bg-green-300 border-green-700': message.severity == 'success',
          'bg-blue-300 border-blue-700': message.severity == 'info',
          'bg-red-300 border-red-700': message.severity == 'error',
          'bg-yellow-300 border-yellow-700': message.severity == 'warn',
        }"
      >
        <div
          class="flex justify-center items-center px-2 border-r-2"
          :class="{
            'border-green-700': message.severity == 'success',
            'border-blue-700': message.severity == 'info',
            'border-red-700': message.severity == 'error',
            'border-yellow-700': message.severity == 'warn',
          }"
        >
          <Icon
            size="24"
            :name="
              message.severity == 'success'
                ? 'i-mdi:success-circle'
                : message.severity == 'info'
                ? 'i-mdi:information-slab-circle'
                : message.severity == 'error'
                ? 'i-mdi:error'
                : 'i-mdi:warning'
            "
            :class="{
              'text-green-700': message.severity == 'success',
              'text-blue-700': message.severity == 'info',
              'text-red-700': message.severity == 'error',
              'text-yellow-700': message.severity == 'warn',
            }"
          />
        </div>
        <span
          class="my-auto text-base-black"
          :class="{
            'text-green-700 font-bold': message.severity == 'success',
            'text-blue-700 font-bold': message.severity == 'info',
            'text-red-700 font-bold': message.severity == 'error',
            'text-yellow-700 font-bold': message.severity == 'warn',
          }"
        >
          {{ message.summary }}
        </span>
        <div class="flex justify-center items-center px-2 ml-auto">
          <Icon
            size="36"
            name="i-mdi:close-circle-outline"
            @click="closeCallback"
            class="text-base-black grow hover:cursor-pointer"
            :class="{
              'text-green-700': message.severity == 'success',
              'text-blue-700': message.severity == 'info',
              'text-red-700': message.severity == 'error',
              'text-yellow-700': message.severity == 'warn',
            }"
          />
        </div>
      </div>
    </template>
  </Toast>
</template>

<script lang="ts" setup>
  import type { ToastPassThroughOptions } from "primevue/toast";
  import type Toast from "primevue/toast";
  import type { PropType } from "vue";

  const toast = useToast();

  const show = (
    severity: "success" | "info" | "warn" | "error",
    message: string,
    life: number = 5000
  ) => {
    toast.add({
      life,
      severity,
      summary: message,
    });
  };

  defineExpose({ show });

  const preset: ToastPassThroughOptions = {
    root: "!z-[9999]",
    container: "bg-transparent",
    message: "bg-transparent rounded-md flex flex-col gap-y-2",
    text: "bg-base-white",
  };
</script>

<style></style>
