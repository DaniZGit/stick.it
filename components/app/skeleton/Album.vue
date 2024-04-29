<template>
  <div
    class="w-full h-full flex flex-col justify-between gap-y-4 aspect-thumbnail"
  >
    <div class="w-full flex flex-col items-center gap-y-4">
      <Skeleton
        width="50%"
        height="7.5%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
      ></Skeleton>
      <Skeleton
        width="100%"
        height="92.5%"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        class="aspect-thumbnail"
      >
      </Skeleton>
      <div class="w-full flex justify-between">
        <div class="flex gap-x-2">
          <Skeleton
            width="35px"
            height="35px"
            :pt="preset"
            :pt-options="{ mergeProps: true }"
            class="self-end"
          />

          <Skeleton
            width="35px"
            height="35px"
            :pt="preset"
            :pt-options="{ mergeProps: true }"
            class="self-end"
          />
        </div>

        <div class="flex gap-x-2">
          <Skeleton
            width="35px"
            height="35px"
            :pt="preset"
            :pt-options="{ mergeProps: true }"
            class="self-end"
          />

          <Skeleton
            width="35px"
            height="35px"
            :pt="preset"
            :pt-options="{ mergeProps: true }"
            class="self-end"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <Skeleton
        width="35px"
        height="35px"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        shape="circle"
        class="self-end"
      >
      </Skeleton
      ><Skeleton
        width="35px"
        height="35px"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        shape="circle"
        class="self-end"
      >
      </Skeleton>
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
