<template>
  <div class="h-full overflow-y-hidden">
    <div v-if="loadingAlbum" class="h-full px-4 py-4">
      <AppSkeletonAlbum></AppSkeletonAlbum>
    </div>
    <div
      v-else
      class="w-full h-full p-4 flex flex-col justify-between gap-y-4 aspect-thumbnail relative"
    >
      <div class="w-full flex flex-col items-center gap-y-4">
        <h1 class="text-xl font-bold">{{ album?.title }}</h1>
        <AppAlbumPager
          :album="album"
          @onFirstPage="() => (currentPageNum = 0)"
          @onPrevPage="() => currentPageNum--"
          @onNextPage="() => currentPageNum++"
          @onLastPage="() => (currentPageNum = album?.pages.length ?? 0)"
        ></AppAlbumPager>
      </div>

      <div
        class="h-1/2 absolute left-0 right-0 bottom-0 flex flex-col rounded-full duration-300"
        :class="{
          'translate-y-full': !isInventoryOpen,
          'translate-y-0': isInventoryOpen,
        }"
      >
        <div
          class="self-center p-4 duration-300"
          :class="{
            '-translate-y-full': !isInventoryOpen,
            'translate-y-0': isInventoryOpen,
          }"
        >
          <AppIconButton
            ref="inventoryButton"
            class="!rounded-full !p-2 !bg-app-tertiary"
            @click="isInventoryOpen = !isInventoryOpen"
          >
            <Icon
              v-if="!isInventoryOpen"
              name="i-mdi:cards-outline"
              size="32"
            />
            <Icon v-else name="i-mdi:close" size="32" />
          </AppIconButton>
        </div>
        <div
          ref="inventory"
          class="w-full h-full flex flex-col bg-app-tertiary bg-opacity-75 rounded-t-md p-2 overflow-y-auto"
        >
          <div>sorting filter</div>
          <!-- Stickers -->
          <div class="h-full">
            <div v-if="loadingStickers">loading stickers...</div>
            <div
              v-else-if="!stickers.length"
              class="h-full flex flex-col items-center justify-center text-xl"
            >
              <span class="flex flex-col justify-center items-center">
                <Icon name="i-mdi:face-dead-outline" size="48" />
                You have no stickers
              </span>
              <span
                >Get some from the
                <NuxtLink
                  to="/albums"
                  class="text-app-gold brightness-125 font-bold underline underline-offset-2"
                >
                  store
                </NuxtLink>
              </span>
            </div>
            <div v-else>
              <AppItemSticker
                v-for="sticker in stickers"
                :key="sticker.id"
                :sticker="sticker"
              ></AppItemSticker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";

  const route = useRoute();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const inventory = ref<HTMLElement | null>(null);
  const inventoryButton = ref<HTMLElement | null>(null);
  const isInventoryOpen = ref(false);
  const currentPageNum = ref<number>(0);

  // hides inventory on click outside
  onClickOutside(
    inventory,
    (e) => {
      if (isInventoryOpen) isInventoryOpen.value = false;
    },
    { ignore: [inventoryButton] }
  );

  // fetch albums on load
  onMounted(async () => {
    fetchAlbum();
    fetchStickers();
  });

  const stickers = ref<Array<ApiSticker>>([]);
  const loadingStickers = ref(false);
  const fetchStickers = async () => {
    loadingStickers.value = true;
    try {
      const response = await useApi<{
        stickers: Array<ApiSticker>;
      }>(`/v1/stickers/`);

      if (response.stickers) {
        stickers.value = response.stickers;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingStickers.value = false;
  };

  const album = ref<ApiAlbum>();
  const loadingAlbum = ref(false);
  const fetchAlbum = async () => {
    loadingAlbum.value = true;
    try {
      const response = await useApi<{
        album: ApiAlbum;
      }>(`/v1/albums/${route.params.id}`);

      if (response.album) {
        album.value = response.album;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingAlbum.value = false;
  };

  // fetch pages when we move left/right
  watch(currentPageNum, (newPageNum, oldPageNum) => {
    fetchPages();
  });

  const pages = ref<Array<ApiPage>>([]);
  const loadingPages = ref(false);
  const fetchPages = async () => {
    loadingPages.value = true;
    try {
      const response = await useApi<{
        pages: Array<ApiPage>;
      }>(`/v1/pages/`);

      if (response.pages) {
        pages.value = response.pages;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPages.value = false;
  };
</script>

<style></style>
