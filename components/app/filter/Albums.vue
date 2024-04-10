<template>
  <div class="py-2 px-4">
    <div v-if="props.loading">
      <AppSkeletonAlbumFilter></AppSkeletonAlbumFilter>
    </div>
    <div v-else class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ex. Dragon Ball Z"
        class="w-full text-sm text-center text-app-secondary placeholder-app-secondary placeholder-opacity-50 bg-app-tertiary outline-0 ring-app-secondary focus:ring-2 rounded-full py-1 px-8"
      />
      <div
        class="absolute top-0 bottom-0 right-2 flex justify-center items-center"
      >
        <Icon
          v-show="searchQuery"
          name="i-mdi:close"
          size="18"
          class="text-app-secondary"
          @pointerdown.prevent
          @click="searchQuery = ''"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const searchQuery = ref("");

  const props = defineProps<{
    loading: boolean;
  }>();
</script>

<style></style>
