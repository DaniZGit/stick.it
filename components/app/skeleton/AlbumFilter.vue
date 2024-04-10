<template>
  <div class="w-full">
    <Skeleton
      width="100%"
      height="30px"
      :pt="preset"
      :pt-options="{ mergeProps: true }"
    >
    </Skeleton>
  </div>
</template>

<script lang="ts" setup>
  import type { SkeletonPassThroughOptions } from "primevue/skeleton";

  const preset: SkeletonPassThroughOptions = {
    root: "!bg-app-tertiary !rounded-full",
  };
</script>

<style></style>
