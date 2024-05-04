<template>
  <Toast
    attrs="$attrs"
    :pt="preset"
    :pt-options="{ mergeProps: true }"
    :position="props.position"
  >
    <template #container="{ message, closeCallback }">
      <div
        class="w-full flex px-2"
        :class="{
          'justify-center': props.position && props.position.includes('center'),
          'justify-start': props.position && props.position.includes('left'),
          'justify-end': props.position && props.position.includes('right'),
        }"
      >
        <div class="inline-flex py-2 rounded-md relative">
          <div
            class="absolute top-0 left-0 right-0 bottom-0 bg-opacity-55 border-2 rounded-md backdrop-blur-sm z-[5]"
            :class="{
              'bg-app-severity-success border-app-severity-success':
                message.severity == 'success',
              'bg-app-severity-info': message.severity == 'info',
              'bg-app-severity-warn': message.severity == 'warn',
              'bg-app-severity-error': message.severity == 'error',
              'bg-app-severity-buy border-app-severity-buy':
                message.severity == 'buy',

              'border-black':
                message.severity == 'warn' || message.severity == 'error',
            }"
          ></div>
          <div
            class="flex justify-center items-center px-2 z-[10]"
            :class="{
              'text-app-severity-success': message.severity == 'success',
              'text-app-severity-info': message.severity == 'info',
              'text-app-severity-warn': message.severity == 'warn',
              'text-app-severity-error': message.severity == 'error',
              'text-app-severity-buy': message.severity == 'buy',

              'border-r-2': message.detail || props.closable,
              'border-black':
                message.severity == 'warn' || message.severity == 'error',
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
                  : message.severity == 'warn'
                  ? 'i-mdi:warning'
                  : message.severity == 'buy'
                  ? 'i-line-md:check-all'
                  : 'i-mdi:success-circle'
              "
            />
          </div>
          <span
            v-if="message.detail"
            class="my-auto text-base-secondary font-semibold px-2 z-[10]"
            :class="{
              'text-black':
                message.severity == 'warn' || message.severity == 'error',
            }"
          >
            {{ message.detail }}
          </span>
          <div
            v-if="props.closable"
            class="flex justify-center items-center text-base-secondary pr-2 ml-auto z-[10]"
            :class="{
              'text-black':
                message.severity == 'warn' || message.severity == 'error',
            }"
          >
            <Icon
              size="24"
              name="i-mdi:close-circle-outline"
              @click="closeCallback"
              class="grow hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script lang="ts" setup>
  import type { ToastPassThroughOptions } from "primevue/toast";
  import type Toast from "primevue/toast";

  const props = defineProps({
    closable: Boolean,
    position: String,
  });

  const preset: ToastPassThroughOptions = {
    root: "!z-[9999] !w-full !left-0 !right-0 !max-h-[200px] overflow-y-auto no-scrollbar !-translate-x-[0]",
    container: "!bg-transparent !shadow-none !border-0 !ring-0",
  };
</script>

<style scoped></style>
