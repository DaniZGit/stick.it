<template>
  <div class="h-dvh h-screen w-screen grid grid-rows-12 grid-flow-row">
    <div class="row-span-11 bg-app-primary text-app-secondary overflow-y-auto">
      <slot />
    </div>
    <AppNav class="row-span-1"></AppNav>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
