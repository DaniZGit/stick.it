<template>
  <div
    class="w-full h-full flex flex-col justify-between gap-y-4 aspect-thumbnail"
  >
    <div class="w-full flex flex-col items-center gap-y-4">
      <Skeleton
        width="50%"
        height="30px"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
      ></Skeleton>
      <Skeleton
        width="100%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="aspect-thumbnail"
      >
      </Skeleton>
    </div>
    <Skeleton
      width="50px"
      height="50px"
      :pt="preset"
      :pt-options="{ mergeProps: true }"
      shape="circle"
      class="self-end"
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
