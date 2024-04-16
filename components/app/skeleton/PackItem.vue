<template>
  <div class="h-full w-full group">
    <div class="flex flex-col items-center gap-y-2 aspect-thumbnail">
      <Skeleton
        width="100%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
      ></Skeleton>

      <Skeleton
        width="80%"
        height="20px"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
      ></Skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { SkeletonPassThroughOptions } from "primevue/skeleton";

  const preset: SkeletonPassThroughOptions = {
    root: "!bg-app-tertiary",
  };
</script>

<style></style>
