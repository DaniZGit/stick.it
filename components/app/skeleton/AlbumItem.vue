<template>
  <div class="w-full aspect-thumbnail">
    <Skeleton
      width="100%"
      height="100%"
      :pt="preset"
      :pt-options="{ mergeProps: true }"
    >
    </Skeleton>
  </div>
</template>

<script lang="ts" setup>
  import type { SkeletonPassThroughOptions } from "primevue/skeleton";

  const preset: SkeletonPassThroughOptions = {
    root: "!bg-app-tertiary",
  };
</script>

<style></style>
