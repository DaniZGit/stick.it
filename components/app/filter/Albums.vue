<template>
  <div class="pt-2 px-4">
    <div v-if="props.loading && !props.albumsCount">
      <AppSkeletonAlbumFilter></AppSkeletonAlbumFilter>
    </div>
    <div v-else class="flex flex-col gap-y-2 relative">
      <div class="relative">
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
      <div class="flex justify-between items-center">
        <div>
          <span class="font-semibold">
            Showing
            <span class="font-bold underline underline-offset-2">
              {{ albumsCount }}
            </span>
            albums
          </span>
        </div>
        <div class="flex gap-x-1.5">
          <AppIconButton>
            <Icon name="i-mdi:sort" size="24" />
          </AppIconButton>
          <AppIconButton>
            <Icon name="i-mdi:filter-outline" size="24" />
          </AppIconButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const searchQuery = ref("");

  const props = defineProps<{
    albumsCount: number | undefined;
    loading: boolean;
  }>();
</script>

<style></style>
