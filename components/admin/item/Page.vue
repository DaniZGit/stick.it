<template>
  <div class="">
    <div class="flex flex-col">
      <NuxtImg
        :src="useUrl(file.url)"
        class="aspect-thumbnail w-full"
      ></NuxtImg>
      <span class="text-center bg-base-tertiary rounded-b-md text-sm"
        >#{{ props.sort_order }}</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    sort_order: ApiPage["sort_order"];
    file: ApiPage["file"];
  }>();
</script>

<style></style>
