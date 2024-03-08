<template>
  <div
    class="h-dvh h-screen w-screen grid grid-cols-12 grid-flow-col bg-white relative"
  >
    <AdminNav class="h-screen col-span-2"></AdminNav>
    <div class="h-screen col-span-10 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
