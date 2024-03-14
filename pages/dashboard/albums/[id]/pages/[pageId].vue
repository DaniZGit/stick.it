<template>
  <div class="h-full flex flex-col">
    <AdminHeader></AdminHeader>

    <div class="h-full grid grid-cols-12 bg-base-tertiary p-4 relative">
      <div class="h-full col-span-9 flex justify-center gap-x-2">
        <div ref="container" class="relative aspect-thumbnail bg-base-white">
          <div class="target w-[100px] aspect-thumbnail bg-base-tertiary"></div>
          <div
            class="titi w-[100px] aspect-thumbnail bg-base-tertiary mt-4"
          ></div>
          <Moveable
            :target="['.target', '.titi']"
            :individual-groupable="true"
            :container="container"
            :draggable="true"
            :rotatable="true"
            :throttle-rotate="90"
            :snappable="true"
            :snap-container="container"
            :snap-threshold="25"
            :snap-grid-height="40"
            :snap-grid-width="40"
            :snap-directions="{
              top: true,
              left: true,
              bottom: true,
              right: true,
            }"
            :bounds="{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              position: 'css',
            }"
            :is-display-snap-digit="true"
            :is-display-inner-snap-digit="false"
            :elementGuidelines="['.target', '.titi', '.element3']"
            :snap-gap="true"
            :element-snap-directions="{
              top: true,
              left: true,
              bottom: true,
              right: true,
              center: true,
              middle: true,
            }"
            @drag="onDrag"
            @rotate="onRotate"
          />
        </div>
        <div class="h-full flex flex-col justify-between">
          <div class="flex flex-col gap-y-2">
            <div v-for="option in options" class="bg-base-white rounded-md">
              <Icon
                :name="option.icon"
                size="42"
                class="border-2 border-transparent rounded-md hover:border-black hover:cursor-pointer"
              />
            </div>
          </div>
          <div>
            <div class="bg-base-white rounded-md">
              <Icon
                name="i-mdi:cancel-box-outline"
                size="42"
                class="border-2 border-transparent rounded-md hover:border-red-700 hover:cursor-pointer hover:text-red-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="h-full col-span-3 p-4 flex flex-col items-center bg-white">
        <h2 class="text-xl font-bold">Stickers</h2>
        <div class="h-full flex flex-col justify-center gap-y-8">
          <div v-for="option in options" class="flex flex-col items-center">
            <div class="p-2 border-2 border-base-tertiary rounded-full">
              <Icon :name="option.icon" size="42" />
            </div>
            <span class="text-sm">{{ option.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Moveable from "vue3-moveable";

  definePageMeta({
    layout: "dashboard",
  });

  const { t } = useI18n();
  const container = ref<HTMLElement | null>(null);
  const moveable = ref(null);

  const options = [
    {
      icon: "i-fluent:sticker-add-20-filled",
      description: t("admin-sticker-add-option"),
    },
    {
      icon: "i-mdi:file-gif-box",
      description: t("admin-sticker-add-gif-option"),
    },
    {
      icon: "i-mage:sound-waves",
      description: t("admin-sticker-add-audio-option"),
    },
    {
      icon: "i-fluent:sticker-20-filled",
      description: t("admin-sticker-remove-option"),
    },
  ];

  const bounds = computed((): DOMRect | undefined => {
    return container.value?.getBoundingClientRect();
  });

  const onDrag = ({
    target,
    transform,
    left,
    top,
    right,
    bottom,
    beforeDelta,
    beforeDist,
    delta,
    dist,
    clientX,
    clientY,
  }) => {
    //console.log("onDrag: ", e.target)
    console.log("onDrag left, top", left, top);
    target!.style.left = `${left}px`;
    target!.style.top = `${top}px`;
    target!.style.transform = transform;
  };

  const onRotate = ({ target, transform }) => {
    console.log("rottattig", transform);
    target!.style.transform = transform;
  };

  const onBound = (e) => {
    console.log(e);
  };

  // onMounted(() => {
  //   nextTick(() => {
  //     console.log("onMounted nextTick", moveable.value);
  //     // moveable.value.updateSelectors();
  //     // moveable.value.forceUpdate();
  //     // moveable.value.updateTarget();
  //     // moveable.value.updateRect();
  //   });
  // });
</script>

<style></style>
