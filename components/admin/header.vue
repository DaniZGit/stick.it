<template>
  <div class="flex justify-between items-center px-8 border-b-2">
    <div>
      <h1 class="text-xl font-bold">{{ $route.path }}</h1>
    </div>
    <div>
      <Avatar
        class="w-10 h-auto border-2 border-base-black"
        image="https://i.pravatar.cc/123"
        shape="circle"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: String,
  });
</script>

<style></style>
