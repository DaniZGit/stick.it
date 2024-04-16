<template>
  <Dialog v-bind="attrs" :pt="preset" :pt-options="{ mergeProps: true }">
    <template #container="{ closeCallback }">
      <div class="border-0 py-2">
        <div class="w-full text-center text-nowrap overflow-x-hidden">
          <h1
            ref="headerRef"
            class="inline-block text-lg font-bold text-app-secondary"
            :class="{ 'overflow-animation': isElementOverflown(headerRef) }"
          >
            {{ attrs.header }}
          </h1>
        </div>
      </div>
      <div class="w-full h-full overflow-y-auto">
        <slot />
      </div>
      <div class="flex justify-center">
        <Icon
          v-if="!props.loading"
          name="i-mdi:close-circle-outline"
          size="38"
          class="text-app-secondary hover:cursor-pointer"
          @click="closeCallback"
        />
        <Icon
          v-else
          name="i-svg-spinners:6-dots-scale-middle"
          size="38"
          class="text-app-secondary hover:cursor-pointer"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import type { DialogPassThroughOptions } from "primevue/dialog";

  const headerRef = ref<HTMLElement | null>(null);
  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits<{
    close: [];
  }>();

  const onClick = (closeCallback: Function) => {
    closeCallback();
    emit("close");
  };

  const preset: DialogPassThroughOptions = {
    root: "w-5/6 h-full text-app-primary !border-0 !shadow-none",
    content: "!shadow-0",
  };
</script>

<style scoped>
  .overflow-animation {
    -webkit-animation: moving 10s infinite linear;
    animation: moving 10s infinite linear;
  }

  @keyframes moving {
    0%,
    40% {
      transform: translateX(0px);
    }
    85%,
    100% {
      transform: translateX(-50%);
    }
  }
</style>
