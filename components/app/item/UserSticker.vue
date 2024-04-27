<template>
  <div
    ref="container"
    class="aspect-thumbnail w-full group relative"
    @click="focus = true"
  >
    <NuxtImg
      :src="useUrl(props.userSticker?.sticker.file?.url)"
      class="w-auto h-auto aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
    ></NuxtImg>
    <div class="absolute bottom-0 left-0 right-0 flex justify-center">
      <Badge
        :value="userSticker?.amount"
        class="translate-y-1/2 !bg-app-primary !text-app-secondary ring-app-secondary group-hover:ring-1 group-focus:ring-1"
      ></Badge>
    </div>

    <!-- options -->
    <div
      class="absolute top-0 bottom-0 left-0 right-0 flex items-center px-1 duration-200"
      :class="{
        'opacity-0 pointer-events-none': !focus,
        'opacity-100': focus,
      }"
    >
      <div class="w-full flex flex-col justify-center gap-y-1 rounded-md">
        <AppButton
          v-for="(option, i) in options"
          class="w-full flex justify-center bg-app-tertiary hover:bg-app-tertiary-focus bg-opacity-50 duration-150 py-1"
          :class="{
            'rounded-t-md': i == 0,
            'rounded-b-md': i == options.length - 1,
            hidden: option.hideIf,
          }"
          @click="option.action"
        >
          <Icon v-if="option.icon" :name="option.icon" size="18" />
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const container = ref<HTMLElement | null>(null);

  const props = defineProps({
    userSticker: Object as PropType<ApiUserSticker>,
  });

  const emit = defineEmits<{
    view: [userSticker: ApiUserSticker | undefined];
    stick: [
      data: {
        userSticker: ApiUserSticker | undefined;
        userStickerContainer: HTMLElement | null;
      }
    ];
  }>();

  const focus = ref(false);
  const options = ref([
    {
      id: 0,
      icon: "i-mdi:sticker-plus-outline",
      label: "Stick it",
      action: () =>
        emit("stick", {
          userSticker: props.userSticker,
          userStickerContainer: container.value,
        }),
      hideIf: computed(() => props.userSticker?.sticked),
    },
    {
      id: 1,
      icon: "i-mdi:eye",
      label: "View",
      action: () => emit("view", props.userSticker),
      hideIf: false,
    },
  ]);

  onClickOutside(container, (e) => {
    focus.value = false;
  });
</script>

<style></style>
