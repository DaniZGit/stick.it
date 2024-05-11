<template>
  <div class="h-dvh h-screen w-screen grid grid-rows-12 grid-flow-row">
    <AppHeader class="row-span-1"></AppHeader>
    <div class="row-span-10 bg-app-primary text-app-secondary overflow-y-auto">
      <slot />
    </div>
    <AppNav class="row-span-1"></AppNav>
  </div>
</template>

<script lang="ts" setup>
  onMounted(() => {
    console.log("Sync user data");
  });
</script>

<style></style>
