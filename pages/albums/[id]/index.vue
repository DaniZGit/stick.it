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
      <div
        class="row-span-11 w-full flex flex-col items-center gap-y-4"
        :class="{
          'pointer-events-none': stickingAnimationIsRunning,
        }"
      >
        <h1 class="text-xl font-bold">{{ album?.title }}</h1>
        <AppAlbumPager
          ref="albumPagerRef"
          v-model:page="currentPageNum"
          :album="album"
          :user-stickers="userStickers"
          @flipped-to-sticker-page="onFlippedToStickerPage"
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
        class="h-2/3 absolute left-0 right-0 bottom-0 flex flex-col rounded-full duration-300 z-[1]"
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
            @sticker-stick="onStickerStick"
            @sticker-view-open="isViewingSticker = true"
            @sticker-view-close="isViewingSticker = false"
          ></AppAlbumStickersTab>
        </div>
      </div>
    </div>

    <img
      ref="stickingAnimationSticker"
      class="absolute ring-2 ring-app-secondary rounded-md hidden"
      :src="useUrl(undefined)"
    />
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type { AppAlbumPager } from "#build/components";
  import CustomToast from "~/components/CustomToast.vue";

  const route = useRoute();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const userStore = useUserStore();

  const albumPagerRef = ref<InstanceType<typeof AppAlbumPager> | null>(null);
  const stickingAnimationSticker = ref<HTMLImageElement | null>(null);
  const inventory = ref<HTMLElement | null>(null);
  const stickersTabButton = ref<HTMLElement | null>(null);
  const packsTabButton = ref<HTMLElement | null>(null);
  const tabHeader = ref<HTMLElement | null>(null);
  const isStickersTabOpen = ref(false);
  const isPacksTabOpen = ref(false);
  const isPackAnimation = ref(false);
  const isViewingSticker = ref(false);

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
      if (
        (isStickersTabOpen || isPacksTabOpen) &&
        !isPackAnimation.value &&
        !isViewingSticker.value
      ) {
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
    console.log("fetching album data");
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
    console.log("fetching pages");
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

        // first condition checks if the animation is already running
        // second condition checks if we are in the middle of page flipping (in case api call was faster)
        if (
          !stickingAnimationSticker.value?.classList.contains("hidden") &&
          !stickingAnimationIsRunning.value &&
          albumPagerRef.value?.getFlipState() != "flipping"
        ) {
          startStickingToPageAnimation();
        }
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPages.value = false;
  };

  const userStickers = ref<Array<ApiUserSticker>>([]);
  const loadingStickers = ref(false);
  const fetchStickers = async () => {
    console.log("fetching stickers");
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
    console.log("fetching packs");
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
    userPacks.value = updatedUserPacks;
  };

  const onPacksTabError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };

  const onStickerStick = (data: {
    userSticker: ApiUserSticker | undefined;
    userStickerContainer: HTMLElement | null;
  }) => {
    if (
      !albumPagerRef.value ||
      !stickingAnimationSticker.value ||
      !data.userSticker ||
      !data.userStickerContainer
    )
      return;

    // make an absolute version of selected sticker
    stickingAnimationSticker.value.id = data.userSticker.sticker.id;
    stickingAnimationSticker.value.style.top =
      data.userStickerContainer.getBoundingClientRect().top + "px";
    stickingAnimationSticker.value.style.left =
      data.userStickerContainer.getBoundingClientRect().left + "px";
    stickingAnimationSticker.value.style.width =
      data.userStickerContainer.getBoundingClientRect().width + "px";
    stickingAnimationSticker.value.style.height =
      data.userStickerContainer.getBoundingClientRect().height + "px";

    // set selected sticker image
    stickingAnimationSticker.value.src = useUrl(
      data.userSticker.sticker.file?.url
    );
    stickingAnimationSticker.value.classList.remove("hidden");

    apiStickStickerRequest(data.userSticker);

    // flip to the page that the sticker is on - this will then emit an event that will run the onFlippedToStickerPage() function
    albumPagerRef.value.flipToStickerPage(data.userSticker);

    // close all tabs
    isPacksTabOpen.value = false;
    isStickersTabOpen.value = false;
  };

  // event emitted from inside the flipToStickerPage() function
  const onFlippedToStickerPage = () => {
    // if we are fetching stickers from api, wait for that to finish and start the animation from the fetchPages() function instead
    if (loadingPages.value || stickingAnimationIsRunning.value) return;

    startStickingToPageAnimation();
  };

  const stickingAnimationIsRunning = ref(false);
  const startStickingToPageAnimation = () => {
    if (!stickingAnimationSticker.value) return;

    // get the sticker element that is on the album page
    const stickerEl = document.getElementById(
      `sticker-${stickingAnimationSticker.value.id}`
    );
    if (!stickerEl) return;

    stickingAnimationIsRunning.value = true;
    setTimeout(() => {
      if (!stickingAnimationSticker.value) {
        stickingAnimationIsRunning.value = false;
        return;
      }

      // move the absolute sticker to the position that the sticker is on the album page
      stickingAnimationSticker.value.style.transitionDuration = "1000ms";
      stickingAnimationSticker.value.style.top =
        stickerEl.getBoundingClientRect().top + "px";
      stickingAnimationSticker.value.style.left =
        stickerEl.getBoundingClientRect().left + "px";
      stickingAnimationSticker.value.style.width =
        stickerEl.getBoundingClientRect().width + "px";
      stickingAnimationSticker.value.style.height =
        stickerEl.getBoundingClientRect().height + "px";
      stickingAnimationSticker.value.style.transform = `rotate(${stickerEl.style.rotate}deg)`;

      stickingAnimationSticker.value.addEventListener("transitionend", () => {
        if (stickingAnimationSticker.value) {
          // show page sticker
          const stickerEl = document.getElementById(
            `sticker-${stickingAnimationSticker.value.id}`
          );
          stickerEl?.classList.remove("opacity-0");
          stickerEl?.classList.add("opacity-100");
          // hide moving sticker
          stickingAnimationSticker.value.classList.add("hidden");
          stickingAnimationSticker.value.style.transitionDuration = "0ms";
        }

        stickingAnimationIsRunning.value = false;
      });
    }, 250);
  };

  const stickingSticker = ref(false);
  const apiStickStickerRequest = async (userSticker: ApiUserSticker) => {
    console.log("fetching album data");
    stickingSticker.value = true;
    try {
      const response = await useApi<{
        user_sticker: ApiUserSticker;
      }>(`/v1/users/${userStore.user.id}/stick-sticker`, {
        method: "PATCH",
        body: {
          sticker_id: userSticker.sticker_id,
        },
      });

      if (response.user_sticker) {
        const index = userStickers.value.findIndex((us) => {
          return us.id == response.user_sticker.id;
        });
        if (index >= 0) {
          userStickers.value[index].sticked = response.user_sticker.sticked;
          userStickers.value[index].amount = response.user_sticker.amount;
        }
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    stickingSticker.value = false;
  };
</script>

<style></style>
