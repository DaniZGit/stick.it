<template>
  <div
    class="bg-app-tertiary z-50 duration-500 transition-all"
    :style="`width: ${progress}%;`"
    :class="{ 'opacity-0 duration-150': hideBar }"
    @transitionend="onTransitionEnd"
  >
    &nbsp
  </div>
</template>

<script lang="ts" setup>
  const progress = defineModel<number>({ default: 0 });
  const hideBar = ref(false);

  const emit = defineEmits<{
    transitionend: [e: TransitionEvent];
  }>();

  const onTransitionEnd = (e: TransitionEvent) => {
    if (progress.value >= 100) {
      hideBar.value = true;
    }
  };
</script>

<style></style>
