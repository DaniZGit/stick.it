<template>
  <div
    v-if="props.sticker"
    :id="`sticker-${props.sticker.id}`"
    class="absolute"
    :class="{
      'opacity-0': !isSticked,
      'opacity-100': isSticked,
    }"
    :style="`
      width: ${props.sticker.width}%;
      height: ${props.sticker.height}%;
      top: ${props.sticker.top}%;
      left: ${props.sticker.left}%;
      aspect-ratio: ${props.sticker.numerator / props.sticker.denominator};
      transform: rotate(${props.sticker.rotation}deg);
      transform-origin: 35.5% 48.5%;
    `"
  >
    <NuxtImg
      v-if="props.sticker"
      :src="useUrl(props.sticker.file?.url)"
      class="w-full h-full"
    />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    sticker: Object as PropType<ApiSticker>,
    userStickers: Array as PropType<Array<ApiUserSticker>>,
  });

  onMounted(() => {
    isStickerSticked();
  });

  const isSticked = ref(false);
  const isStickerSticked = () => {
    const item = props.userStickers?.find((us) => {
      return us.sticker_id == props.sticker?.id && us.sticked;
    });

    if (item) {
      isSticked.value = true;
    }
  };
</script>

<style></style>
