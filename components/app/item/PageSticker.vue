<template>
  <drop
    v-if="props.sticker"
    :id="`sticker-${props.sticker.id}`"
    class="absolute"
    :class="{
      'animate-scaling': isDraggingOverCorrectSticker,
    }"
    :style="`
      width: ${props.sticker.width}%;
      height: ${props.sticker.height}%;
      top: ${props.sticker.top}%;
      left: ${props.sticker.left}%;
      aspect-ratio: ${props.sticker.numerator / props.sticker.denominator};
      rotate: ${props.sticker.rotation}deg;
      transform-origin: 50% 35.0%;
    `"
    mode="cut"
    :accepts-data="(userSticker: ApiUserSticker) => userSticker?.sticker?.id == props.sticker?.id"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @dragend="onDragEnd"
    @drop="onDrop"
  >
    <div class="w-full h-full relative">
      <NuxtImg
        v-if="props.sticker"
        :src="useUrl(props.sticker.file?.url)"
        class="w-full h-full opacity-0"
        :class="{
          'opacity-100': showSticker,
        }"
      />
      <div
        class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[10] bg-red-300 bg-opacity-25 overflow-hidden duration-100"
        :class="{
          'opacity-0': !isDraggingOverWrongSticker,
          'opacity-100': isDraggingOverWrongSticker,
        }"
      >
        <hr
          class="absolute w-[0px] border-2 border-red-500 bg-red-500 h-[120%] rounded-full rotate-[135deg]"
        />
        <hr
          class="absolute w-[0px] border-2 border-red-500 bg-red-500 h-[120%] rounded-full rotate-45"
        />
      </div>
    </div>
  </drop>
</template>

<script lang="ts" setup>
  import { Drop } from "vue-easy-dnd";
  import { useAlbumStore } from "~/stores/album";

  const albumStore = useAlbumStore();

  const props = defineProps({
    sticker: Object as PropType<ApiSticker>,
    userStickers: Array as PropType<Array<ApiUserSticker>>,
  });

  const isStickerSticked = computed(() => {
    const item = props.userStickers?.find((us) => {
      return us.sticker_id == props.sticker?.id && us.sticked;
    });

    return item !== undefined;
  });

  const showSticker = computed(() => {
    if (
      albumStore.userSticker?.sticker.id == props.sticker?.id &&
      albumStore.pendingAnimation
    )
      return false;

    return (
      (albumStore.userSticker?.sticker.id == props.sticker?.id &&
        albumStore.pendingRequest) ||
      isStickerSticked.value ||
      isDraggingOverCorrectSticker.value
    );
  });

  const draggingEl = ref<HTMLElement | null>(null);
  const isDraggingOver = ref(false);
  const isDraggingOverCorrectSticker = ref(false);
  const isDraggingOverWrongSticker = ref(false);
  const onDragEnter = (event: { data: ApiUserSticker | undefined }) => {
    console.log("drag-enter", event);
    const els = document.getElementsByClassName("dnd-ghost");
    draggingEl.value = els && els.length ? <HTMLElement>els.item(0) : null;

    if (draggingEl.value) {
      isDraggingOver.value = true;

      if (event.data?.sticker?.id == props.sticker?.id) {
        draggingEl.value.style.opacity = "0";
        isDraggingOverCorrectSticker.value = true;
      } else {
        isDraggingOverWrongSticker.value = true;
      }
    }
  };

  const onDrop = (event: any) => {
    console.log("drag-drop", event);
  };

  const onDragOver = (event: any) => {
    if (!draggingEl.value) return;
  };

  const onDragLeave = (event: any) => {
    console.log("drag-leave", event);
    if (!draggingEl.value) return;

    draggingEl.value = null;
    isDraggingOver.value = false;
    isDraggingOverCorrectSticker.value = false;
    isDraggingOverWrongSticker.value = false;
  };

  const onDragEnd = (event: any) => {
    console.log("drag-end", event);
    if (!draggingEl.value) return;

    draggingEl.value = null;
    isDraggingOver.value = false;
    isDraggingOverCorrectSticker.value = false;
    isDraggingOverWrongSticker.value = false;
  };
</script>

<style></style>
