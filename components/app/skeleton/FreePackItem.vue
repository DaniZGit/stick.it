<template>
  <div class="h-full w-full flex flex-col justify-between py-2">
    <div class="w-full h-[6%] flex justify-center gap-x-2">
      <Skeleton
        width="30%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="my-auto"
      ></Skeleton>
      <Skeleton
        width="30%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="my-auto"
      ></Skeleton>
      <Skeleton
        width="30%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="my-auto"
      ></Skeleton>
    </div>
    <div class="w-full h-[80%] flex flex-col items-center gap-y-2">
      <Skeleton
        width="80%"
        height="10%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
      ></Skeleton>

      <Skeleton
        width="80%"
        height="auto"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="aspect-thumbnail"
      ></Skeleton>

      <div
        class="w-full h-[23%] px-16 pb-2 flex justify-center items-start gap-x-2 z-[5]"
      >
        <Skeleton
          width="100%"
          height="50%"
          :pt="preset"
          :pt-options="{ mergeProps: true }"
        ></Skeleton>
        <Skeleton
          width="100%"
          height="50%"
          :pt="preset"
          :pt-options="{ mergeProps: true }"
        ></Skeleton>
      </div>
    </div>

    <div class="h-[7.5%] flex justify-center">
      <Skeleton
        width="40%"
        height="100%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="my-auto"
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
