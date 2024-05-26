<template>
  <div class="h-full flex flex-col">
    <AppFilterAlbums
      :albums-count="albums?.length"
      :loading="loading"
    ></AppFilterAlbums>
    <div
      v-if="loading && !albums?.length"
      class="grid grid-cols-2 gap-y-4 gap-x-4 py-2 px-4"
    >
      <AppSkeletonAlbumItem
        v-for="n in [1, 2, 3, 4, 5, 6]"
      ></AppSkeletonAlbumItem>
    </div>
    <div
      v-else-if="!albums || !albums?.length"
      class="w-full h-full flex flex-col justify-center items-center gap-y-2 text-center text-xl font-bold p-4"
    >
      <Icon name="i-mdi:emoji-robot-confused-outline" size="64" />
      <span> Seems like the albums are gone </span>
    </div>
    <div v-else class="grid grid-cols-2 gap-y-4 gap-x-4 py-2 px-4">
      <AppItemAlbum
        v-for="album in albums"
        :key="album.id"
        :album="album"
      ></AppItemAlbum>
    </div>
    <CustomToast ref="toast"></CustomToast>
    <!-- Sync progress bar -->
    <div class="fixed bottom-0 left-0 right-0 h-[2px]">
      <AppSyncBar v-model="dataSyncProgress"></AppSyncBar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";
  import { useAlbumsStore } from "~/stores/albums";

  definePageMeta({ auth: true });

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const userStore = useUserStore();
  const albumsStore = useAlbumsStore();

  // fetch albums on load
  const albums = ref<Array<ApiUserAlbum>>();
  const dataSyncProgress = ref(0);
  onMounted(() => {
    albums.value = albumsStore.albums;
    fetchAlbums();

    // need to add a timeout, otherwise we don't get the transition effect
    setTimeout(() => {
      dataSyncProgress.value += 50;
    }, 1);
  });

  const loading = ref(false);
  const fetchAlbums = async () => {
    loading.value = true;
    try {
      const response = await useApi<{
        albums: Array<ApiUserAlbum>;
      }>(`/v1/users/${userStore.user.id}/albums`);

      if (response.albums) {
        albums.value = response.albums;
        albumsStore.albums = response.albums;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loading.value = false;

    dataSyncProgress.value += 50;
  };
</script>

<style></style>
