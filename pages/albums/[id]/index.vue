<template>
  <div class="h-full overflow-y-hidden">
    <div v-if="loadingAlbum" class="h-full px-4 py-4">
      <AppSkeletonAlbum></AppSkeletonAlbum>
    </div>
    <div
      v-else-if="!album"
      class="w-full h-full flex flex-col justify-center items-center gap-y-2 text-center text-xl font-bold p-4"
    >
      <Icon name="i-mdi:emoji-robot-confused-outline" size="64" />
      <span> Seems like this album doesn't exist </span>
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
        class="h-2/3 absolute left-0 right-0 bottom-0 flex flex-col rounded-full duration-300"
        :class="{
          'translate-y-full': !isStickersTabOpen && !isPacksTabOpen,
          'translate-y-0': isStickersTabOpen || isPacksTabOpen,
        }"
      >
        <div
          class="w-full flex justify-between items-center gap-x-2 p-4 duration-300"
          :class="{
            '-translate-y-full': !isStickersTabOpen && !isPacksTabOpen,
            'translate-y-0': isStickersTabOpen || isPacksTabOpen,
          }"
        >
          <AppIconButton
            ref="packsTabButton"
            class="!rounded-full w-8 h-8"
            :class="{
              'animate-bounce duration-1000':
                userPacks.length && !isPacksTabOpen,
            }"
            :active="isPacksTabOpen"
            :color="userPacks.length && !isPacksTabOpen ? 'gold' : 'tertiary'"
            @click="onPacksButtonClick"
          >
            <Icon name="i-mingcute:red-packet-line" size="20" />
          </AppIconButton>

          <h3
            v-if="isStickersTabOpen || isPacksTabOpen"
            class="text-lg font-bold bg-app-tertiary bg-opacity-75 backdrop-blur-sm px-3 py-1.5 rounded-full ease-in-out duration-1000"
          >
            {{ isStickersTabOpen ? "Stickers" : "Packs" }}
          </h3>

          <AppIconButton
            ref="stickersTabButton"
            class="!rounded-full w-8 h-8"
            :active="isStickersTabOpen"
            color="tertiary"
            @click="onStickersButtonClick"
          >
            <Icon name="i-mdi:cards-outline" size="20" />
          </AppIconButton>
        </div>
        <div
          ref="inventory"
          class="w-full h-full bg-app-tertiary bg-opacity-75 backdrop-blur-sm rounded-t-md p-2 overflow-y-auto"
        >
          <AppAlbumPacksTab
            v-if="isPacksTabOpen"
            :userPacks="userPacks"
          ></AppAlbumPacksTab>
          <AppAlbumStickersTab
            v-else-if="isStickersTabOpen"
            :userStickers="userStickers"
          ></AppAlbumStickersTab>
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
  const userStore = useUserStore();

  const inventory = ref<HTMLElement | null>(null);
  const stickersTabButton = ref<HTMLElement | null>(null);
  const packsTabButton = ref<HTMLElement | null>(null);
  const isStickersTabOpen = ref(false);
  const isPacksTabOpen = ref(false);
  const currentPageNum = ref<number>(0);

  const onStickersButtonClick = () => {
    isStickersTabOpen.value = !isStickersTabOpen.value;
    isPacksTabOpen.value = false;
  };

  const onPacksButtonClick = () => {
    isPacksTabOpen.value = !isPacksTabOpen.value;
    isStickersTabOpen.value = false;
  };

  // hides inventory on click outside
  onClickOutside(
    inventory,
    (e) => {
      if (isStickersTabOpen || isPacksTabOpen) {
        isStickersTabOpen.value = false;
        isPacksTabOpen.value = false;
      }
    },
    { ignore: [packsTabButton, stickersTabButton] }
  );

  // fetch albums on load
  onMounted(async () => {
    fetchAlbum();
    fetchStickers();
    fetchPacks();
  });

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

  const userStickers = ref<Array<ApiUserSticker>>([]);
  const loadingStickers = ref(false);
  const fetchStickers = async () => {
    loadingStickers.value = true;
    try {
      const response = await useApi<{
        user_stickers: Array<ApiUserSticker>;
      }>(`/v1/users/${userStore.user.id}/stickers?album_id=${route.params.id}`);

      if (response.user_stickers) {
        userStickers.value = response.user_stickers;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingStickers.value = false;
  };

  const userPacks = ref<Array<ApiUserPack>>([]);
  const loadingPacks = ref(false);
  const fetchPacks = async () => {
    loadingPacks.value = true;
    try {
      const response = await useApi<{
        user_packs: Array<ApiUserPack>;
      }>(`/v1/users/${userStore.user.id}/packs?album_id=${route.params.id}`);

      if (response.user_packs) {
        userPacks.value = response.user_packs;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPacks.value = false;
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
