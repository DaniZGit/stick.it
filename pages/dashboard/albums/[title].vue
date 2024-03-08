<template>
  <div class="text-red-500">
    {{ $route.params.title }}
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: "dashboard",
  });
</script>

<style></style>
