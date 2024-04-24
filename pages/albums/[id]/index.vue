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
      class="w-full h-full p-4 grid grid-flow-row grid-rows-12 relative"
    >
      <div class="row-span-11 w-full flex flex-col items-center gap-y-4">
        <h1 class="text-xl font-bold">{{ album?.title }}</h1>
        <AppAlbumPager
          :album="album"
          @onFirstPage="() => (currentPageNum = 0)"
          @onPrevPage="() => (currentPageNum = Math.max(currentPageNum - 1, 0))"
          @onNextPage="
            () =>
              (currentPageNum = Math.min(
                currentPageNum + 1,
                album?.pages.length ?? 0
              ))
          "
          @onLastPage="() => (currentPageNum = album?.pages.length ?? 0)"
        ></AppAlbumPager>
      </div>

      <!-- empty div so that the album doesn't overflow the bottom absolute buttons -->
      <div class="row-span-1 w-full">
        <div class="w-full h-8"></div>
      </div>
      <!-- 
        When the inventory is open and you click on the album it doesn't close the inventory, instead it flips the page 
          - seems like the PageFlip library calls e.preventDefault() somewhere
        thats why we have this div to cover the whole page so that VueUse onClickOutside method recognizes the click
      -->
      <div
        class="absolute top-0 left-0 right-0 bottom-0"
        :class="{
          hidden: !isStickersTabOpen && !isPacksTabOpen,
        }"
      ></div>

      <!-- Buttons and inventory -->
      <div
        class="h-2/3 absolute left-0 right-0 bottom-0 flex flex-col rounded-full duration-300"
        :class="{
          'translate-y-full': !isStickersTabOpen && !isPacksTabOpen,
          'translate-y-0': isStickersTabOpen || isPacksTabOpen,
        }"
      >
        <!-- Buttons -->
        <div
          class="w-full flex justify-between items-center gap-x-2 p-4 px-5 duration-300"
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
            ref="tabHeader"
            class="text-lg font-bold bg-app-tertiary bg-opacity-75 backdrop-blur-sm px-3 py-1.5 rounded-full ease-in-out duration-1000 ring-2 ring-app-secondary"
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
        <!-- Inventory -->
        <div
          ref="inventory"
          class="w-full h-full bg-app-tertiary bg-opacity-75 backdrop-blur-sm rounded-t-md overflow-y-auto"
        >
          <AppAlbumPacksTab
            v-show="isPacksTabOpen"
            :userPacks="userPacks"
            :loading="loadingPacks"
            @update-packs="onPacksUpdate"
            @new-stickers="onNewStickers"
            @error="onPacksTabError"
            @pack-animation-start="isPackAnimation = true"
            @pack-animation-end="isPackAnimation = false"
          ></AppAlbumPacksTab>
          <AppAlbumStickersTab
            v-show="isStickersTabOpen"
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
  const tabHeader = ref<HTMLElement | null>(null);
  const isStickersTabOpen = ref(false);
  const isPacksTabOpen = ref(false);
  const isPackAnimation = ref(false);

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
      if ((isStickersTabOpen || isPacksTabOpen) && !isPackAnimation.value) {
        isStickersTabOpen.value = false;
        isPacksTabOpen.value = false;
      }
    },
    { ignore: [packsTabButton, stickersTabButton, tabHeader] }
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

  // fetch pages when we move left/right
  const currentPageNum = ref<number>(0);
  watch(currentPageNum, (newPageNum, oldPageNum) => {
    fetchPages();
  });

  const loadingPages = ref(false);
  const fetchPages = async () => {
    loadingPages.value = true;
    try {
      const response = await useApi<{
        pages: Array<ApiPage>;
      }>(`/v1/albums/${route.params.id}/pages`, {
        params: {
          from: Math.max(currentPageNum.value - 3, 0),
          to: Math.min(
            currentPageNum.value + 3,
            album.value?.pages.length ?? 0
          ),
        },
      });

      if (response.pages) {
        // update album pages with stickers data
        response.pages.forEach((p) => {
          const index = album.value?.pages.findIndex((ap) => ap.id == p.id);
          if (index != undefined && index >= 0) {
            if (album.value) {
              album.value.pages[index].stickers = p.stickers;
            }
          }
        });
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPages.value = false;
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

  const onNewStickers = (newUserStickers: Array<ApiUserSticker>) => {
    console.log("new stickers", newUserStickers);
    newUserStickers.forEach((newUserSticker) => {
      const index = userStickers.value.findIndex(
        (us) => us.id == newUserSticker.id
      );

      if (index >= 0) {
        // we can get duplicate stickers if opening multiple packs
        // they can be in wrong order, so we want to make sure the latest amount is set
        if (userStickers.value[index].amount < newUserSticker.amount) {
          userStickers.value.splice(index, 1, newUserSticker);
        }
      } else {
        userStickers.value.push(newUserSticker);
      }
    });
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

  const onPacksUpdate = (updatedUserPacks: Array<ApiUserPack>) => {
    console.log("on packs update", updatedUserPacks);
    userPacks.value = updatedUserPacks;
  };

  const onPacksTabError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
