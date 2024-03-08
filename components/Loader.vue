<template>
  <Teleport to="body">
    <div
      class="absolute top-0 right-0 bottom-0 left-0 w-screen h-screen bg-black bg-opacity-40"
      :class="props.class"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  const props = defineProps({
    class: String,
  });
</script>

<style></style>
