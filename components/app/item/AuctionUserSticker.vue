<template>
  <div
    ref="container"
    class="aspect-thumbnail w-full group relative hover:cursor-pointer"
    @click="onClick"
  >
    <NuxtImg
      :src="useUrl(props.userSticker?.sticker.file?.url)"
      class="w-auto h-auto aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 duration-100"
      :class="{
        'ring-2': props.isSelected,
      }"
    ></NuxtImg>
    <div class="absolute bottom-0 left-0 right-0 flex justify-center z-10">
      <Badge
        :value="userSticker?.amount"
        class="translate-y-1/2 !bg-app-primary !text-app-secondary ring-app-secondary group-hover:ring-2 group-focus:ring-1"
        :class="{
          'ring-2': props.isSelected,
        }"
      ></Badge>
    </div>

    <div
      class="absolute top-0 bottom-0 left-0 right-0 flex items-center px-1 duration-200"
      :class="{
        'opacity-0 pointer-events-none': !props.isSelected,
        'opacity-100': props.isSelected,
      }"
    >
      <div
        class="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-35 rounded-md"
      />
      <div class="w-full rounded-md z-10">
        <Icon
          name="i-mdi:check-circle-outline"
          size="32"
          class="text-app-secondary"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const container = ref<HTMLElement | null>(null);

  const props = defineProps({
    userSticker: Object as PropType<ApiUserSticker>,
    isSelected: Boolean,
  });

  const emit = defineEmits<{
    view: [userSticker: ApiUserSticker | undefined];
    select: [userSticker: ApiUserSticker | undefined];
  }>();

  const focus = ref(false);
  const onClick = () => {
    focus.value = true;
    emit("select", props.userSticker);
  };

  onClickOutside(container, (e) => {
    focus.value = false;
  });
</script>

<style></style>
