<template>
  <div class="w-full h-5/6 flex flex-col gap-y-2">
    <div class="w-full h-full">
      <div
        ref="book"
        class="w-full h-full book overflow-y-hidden overflow-x-hidden"
      >
        <div
          class="page w-full h-full bg-app-tertiary"
          :style="`aspect-ratio: ${getPageAspectRatio};`"
        >
          <NuxtImg
            :src="useUrl(props.album?.file?.url)"
            class="w-full h-full object-contain object-left-top"
          />
        </div>
        <div
          v-for="page in props.album?.pages"
          :key="page.id"
          class="page w-full h-full bg-app-tertiary"
          :style="`aspect-ratio: ${getPageAspectRatio};`"
        >
          <NuxtImg
            :src="useUrl(page.file?.url)"
            class="w-full h-full object-contain object-left-top"
          />

          <div class="absolute top-0 left-0 bottom-0 right-0">
            <div class="w-full h-full relative">
              <AppItemPageSticker
                v-for="sticker in page.stickers"
                :key="sticker.id"
                :sticker="sticker"
                :user-stickers="userStickers"
              >
              </AppItemPageSticker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex gap-x-1">
        <AppIconButton @click="onFirstPageButtonClick">
          <Icon name="i-mdi:chevron-double-left" size="22" />
        </AppIconButton>
        <AppIconButton @click="onPrevPageButtonClick">
          <Icon name="i-mdi:chevron-left" size="22" />
        </AppIconButton>
      </div>

      <div class="flex gap-x-1">
        <AppIconButton @click="onNextPageButtonClick">
          <Icon name="i-mdi:chevron-right" size="22" />
        </AppIconButton>
        <AppIconButton @click="onLastPageButtonClick">
          <Icon name="i-mdi:chevron-double-right" size="22" />
        </AppIconButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FlipCorner, SizeType, PageFlip } from "page-flip";
  import type { FlippingState, WidgetEvent } from "page-flip";
  import type { PropType } from "vue";

  const book = ref<HTMLElement | null>(null);
  const pageFlip = ref<PageFlip | null>(null);
  const currentPage = defineModel("page", { default: 0 });

  const props = defineProps({
    album: Object as PropType<ApiAlbum>,
    userStickers: Array as PropType<Array<ApiUserSticker>>,
  });

  const emit = defineEmits<{
    flippedToStickerPage: [];
  }>();

  const getPageAspectRatio = computed(() => {
    return (
      (props.album?.page_numerator ?? 1) / (props.album?.page_denominator ?? 1)
    );
  });

  onMounted(() => {
    setTimeout(() => {
      if (!book.value) return;

      // init page flip
      pageFlip.value = new PageFlip(book.value, {
        width: props.album?.page_numerator, // required parameter - base page width --> resizes based on init aspect ratio
        height: props.album?.page_denominator, // required parameter - base page height
        size: "stretch" as SizeType,
        minWidth: 200,
        maxWidth: 1000,
        minHeight: 100,
        maxHeight: 1350,
        showCover: false, // this doesn't seme to work well - jumps when doing first page flip
        mobileScrollSupport: false,
        maxShadowOpacity: 0,
        showPageCorners: false,
      });

      // load pages
      pageFlip.value.loadFromHTML(document.querySelectorAll(".page"));

      // when dragging pages using mouse or finger
      pageFlip.value.on("flip", (e: WidgetEvent) => {
        currentPage.value = e.data as number;

        if (flippingToStickerPage.value) {
          flippingToStickerPage.value = false;
          emit("flippedToStickerPage");
        }
      });
    }, 0);
  });

  const onFirstPageButtonClick = () => {
    if (!pageFlip.value) return;

    currentPage.value = 0;
    pageFlip.value.flip(0, "bottom" as FlipCorner);
  };

  const onPrevPageButtonClick = () => {
    if (!pageFlip.value) return;

    currentPage.value = Math.max(0, currentPage.value - 1);
    pageFlip.value.flipPrev("bottom" as FlipCorner);
  };

  const onNextPageButtonClick = () => {
    if (!pageFlip.value) return;

    currentPage.value = Math.min(
      pageFlip.value.getPageCount() - 1,
      currentPage.value + 1
    );
    pageFlip.value.flipNext("bottom" as FlipCorner);
  };

  const onLastPageButtonClick = () => {
    if (!pageFlip.value) return;

    currentPage.value = pageFlip.value.getPageCount() - 1;
    pageFlip.value.flip(
      pageFlip.value.getPageCount() - 1,
      "bottom" as FlipCorner
    );
  };

  const flippingToStickerPage = ref(false);
  // finds the sticker and flips to the page that contains that sticker
  const flipToStickerPage = (userSticker: ApiUserSticker) => {
    if (!pageFlip.value) return;

    const index = props.album?.pages.findIndex(
      (p) => p.id == userSticker.sticker.page_id
    );
    if (index == undefined || index < 0) return;

    flippingToStickerPage.value = true;

    // first page is album thumbnail so we need to increment by 1
    const pageNum = index + 1;
    if (currentPage.value == pageNum) {
      // we are already on this page
      flippingToStickerPage.value = false;
      emit("flippedToStickerPage");
    }

    currentPage.value = pageNum;
    pageFlip.value.flip(pageNum, "bottom" as FlipCorner);
  };

  // returns flip state (user_fold, fold_corner, flipping, read)
  const getFlipState = (): FlippingState | undefined => {
    return pageFlip.value?.getState();
  };

  defineExpose({
    flipToStickerPage,
    getFlipState,
  });
</script>

<style></style>
