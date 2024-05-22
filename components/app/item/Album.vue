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
              class="text-app-gold stroke-app-secondary animate-wiggle"
              :class="{
                'opacity-0': props.album.user_packs_amount <= 0,
              }"
            />
          </div>
          <div
            class="w-full py-1 text-center bg-app-secondary bg-opacity-70 text-app-primary font-bold"
          >
            {{ album.title }}
          </div>
          <div
            class="text-sm bg-app-tertiary bg-opacity-50 rounded-b-md text-app-secondary font-semibold"
          >
            <div class="flex justify-between items-center px-1 py-1">
              <div class="flex items-center gap-x-1">
                <Icon name="i-ri:red-packet-line" size="16" />
                <span>{{ props.album.user_packs_amount }}</span>
              </div>
              <div class="flex items-center gap-x-1">
                <span class="underline underline-offset-2">{{
                  props.album.user_stickers_amount
                }}</span>
                /
                <span>{{ props.album.stickers_amount }}</span>
                <Icon name="i-mdi:cards-outline" size="18" />
              </div>
            </div>
            <div class="w-full flex bg-app-primary rounded-b-md">
              <hr
                class="border-2 border-app-gold rounded-bl-md rounded-br-md w-0 transition-[width] duration-1000"
                :style="`
                  width: ${
                    (props.album.user_stickers_amount /
                      props.album.stickers_amount) *
                    100
                  }%;
                `"
              />
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    album: ApiUserAlbum;
  }>();
</script>

<style></style>
