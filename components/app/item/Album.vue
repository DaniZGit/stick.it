<template>
  <div class="h-full w-full group">
    <NuxtLink :to="`/albums/${props.album.id}`" class="">
      <div class="relative">
        <NuxtImg
          :src="useUrl(album.file?.url)"
          class="aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
        ></NuxtImg>
        <div
          class="absolute top-0 right-0 bottom-0 left-0 flex flex-col justify-between"
        >
          <div
            class="flex justify-end items-center gap-x-1 text-right pt-1 pr-1"
          >
            <Icon
              name="i-mdi:bell-notification"
              size="18"
              class="text-app-gold stroke-app-secondary"
            />
          </div>
          <div
            class="w-full py-1 text-center bg-app-secondary bg-opacity-70 text-app-primary font-bold"
          >
            {{ album.title }}
          </div>
          <div
            class="text-sm bg-app-tertiary bg-opacity-50 rounded-b-md text-app-secondary"
          >
            <div class="flex justify-between items-center px-1 py-1">
              <div class="flex items-center gap-x-1">
                <Icon name="i-ri:red-packet-line" size="18" />
                <span>5</span>
              </div>
              <div class="flex items-center gap-x-1">
                <span class="underline underline-offset-2">17</span>
                /
                <span>20</span>
                <Icon name="i-mdi:cards-outline" size="18" />
              </div>
            </div>
            <div class="w-full flex">
              <hr class="border-2 border-app-gold w-2/6 rounded-bl-md" />
              <hr class="border-2 border-app-primary w-4/6 rounded-br-md" />
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    album: ApiAlbum;
  }>();
</script>

<style></style>
