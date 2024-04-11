<template>
  <div class="h-full flex flex-col">
    <AppFilterAlbums
      :albums-count="albums?.length"
      :loading="loading"
    ></AppFilterAlbums>
    <div v-if="loading" class="grid grid-cols-2 gap-y-4 gap-x-4 py-2 px-4">
      <AppSkeletonAlbumItem
        v-for="n in [1, 2, 3, 4, 5, 6]"
      ></AppSkeletonAlbumItem>
    </div>
    <div
      v-else-if="!albums || !albums?.length"
      class="h-full flex justify-center items-center px-4"
    >
      <span class="text-2xl text-center">
        Seems like our albums are gone!
        <NuxtLink to="/albums" external class="underline text-app-gold"
          >Refresh</NuxtLink
        >
        the page to get them back
      </span>
    </div>
    <div v-else class="grid grid-cols-2 gap-y-4 gap-x-4 py-2 px-4">
      <AppItemAlbum
        v-for="album in albums?.concat(albums.concat(albums))"
        :key="album.id"
        :album="album"
      ></AppItemAlbum>
    </div>
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const albums = ref<Array<ApiAlbum>>();

  // fetch albums on load
  const loading = ref(false);
  onMounted(async () => {
    loading.value = true;
    try {
      const response = await useApi<{
        albums: Array<ApiAlbum>;
      }>("/v1/albums", {
        params: {
          limit: 12,
        },
      });

      if (response.albums) {
        albums.value = response.albums;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loading.value = false;
  });
</script>

<style></style>
