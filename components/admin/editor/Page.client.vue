<template>
  <div
    ref="container"
    class="w-full h-auto aspect-thumbnail relative bg-base-white+ bg-cover"
    :style="`background-image: url(${useUrl(undefined)});`"
  >
    <Moveable
      ref="moveableRef"
      :target="targets"
      :container="container"
      :draggable="true"
      :bounds="{
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        position: 'css',
      }"
      :snappable="true"
      :is-display-snap-digit="true"
      :is-display-inner-snap-digit="false"
      :element-guidelines="getGuidelines"
      :snap-gap="true"
      :snap-direction="{
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      }"
      :element-snap-directions="{
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      }"
      :rotatable="true"
      :snap-rotation-threshold="10"
      :snap-rotation-degrees="[0, 90, 180, 270]"
      :is-display-grid-guidelines="true"
      @drag="onDrag"
      @rotate="onRotate"
      @clickGroup="onClickGroup"
      @dragGroup="onDragGroup"
      @renderGroup="onRenderGroup"
      @dragEnd="onDragEnd"
    />

    <VueSelecto
      ref="selectoRef"
      :drag-container="container"
      :selectable-targets="['.selecto-area .target']"
      :hit-rate="0"
      :select-by-click="true"
      :select-from-inside="false"
      :toggle-continue-select="['shift']"
      :ratio="0"
      @dragStart="onSelectDragStart"
      @selectEnd="onSelectEnd"
    ></VueSelecto>
    <div class="elements selecto-area">
      <div
        v-for="(item, i) in items"
        :key="i"
        :item-id="item.id"
        class="target w-[15%] aspect-thumbnail bg-base-tertiary hover:cursor-pointer"
        :class="`target-${i}`"
        :id="`target-${i}`"
      >
        <NuxtImg
          :src="useUrl(item.file?.url)"
          class="w-full aspect-thumbnail"
        ></NuxtImg>
      </div>
    </div>
    <div class="empty elements"></div>
  </div>
</template>

<script setup lang="ts">
  import Moveable, {
    type OnClickGroup,
    type OnDrag,
    type OnDragEnd,
    type OnDragGroup,
    type OnRenderGroup,
    type OnRotate,
  } from "vue3-moveable";
  import VueSelecto from "vue3-selecto";

  const moveableRef = ref<InstanceType<typeof Moveable> | null>(null);
  const container = ref<HTMLElement | null>(null);
  const { width: containerWidth, height: containerHeight } =
    useElementSize(container);

  const selectoRef = ref<InstanceType<typeof VueSelecto> | null>(null);
  const targets = ref<Array<HTMLElement>>([]);
  const items = defineModel("items", {
    type: Array<ApiSticker>,
    default: [],
  });

  const emit = defineEmits<{
    select: [items: any];
    dragEnd: [e: any];
  }>();

  const onDrag = (e: OnDrag) => {
    e.target.style.transform = e.transform;
  };

  const onRotate = (e: OnRotate) => {
    e.target.style.transform = e.transform;
  };

  const onClickGroup = (e: OnClickGroup) => {
    if (!selectoRef.value) return;

    selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
  };

  const onDragGroup = (e: OnDragGroup) => {
    e.events.forEach((ev) => {
      ev.target.style.transform = ev.transform;
    });
  };

  // this forces refresh on group rotation
  const onRenderGroup = (e: OnRenderGroup) => {
    e.events.forEach((ev) => {
      ev.target.style.cssText += ev.cssText;
    });
  };

  const onSelectDragStart = (e) => {
    const moveable = moveableRef.value;
    const target = e.inputEvent.target;
    if (
      !moveable ||
      moveable.isMoveableElement(target) ||
      targets.value.some((t) => t === target || t.contains(target))
    ) {
      e.stop();
    }
  };

  const onSelectEnd = (e) => {
    const moveable = moveableRef.value;
    if (e.isDragStart && moveable) {
      e.inputEvent.preventDefault();
      moveable.waitToChangeTarget().then(() => {
        moveable.dragStart(e.inputEvent);
      });
    }
    targets.value = e.selected;

    emit("select", e.selected);
  };

  const onDragEnd = (e: OnDragEnd) => {
    emit("dragEnd", e);
  };

  // guidelines
  const getGuidelines = computed(() => {
    const classes = [".container"];

    if (!items.value) return classes;

    classes.push(...items.value.map((item, index) => `.target-${index}`));

    return classes;
  });

  // whenever container's height changes, update sticker positions
  // this will set sticker's initial position on first load as well
  watch(containerHeight, async (newHeight, oldHeight) => {
    console.log("initializing values");
    items.value.forEach((item, i) => {
      const leftPercentage = item.left;
      const topPercentage = item.top;

      // convert from percentages to pixels - moveable works with pixels
      const pos = calculateInitialPosition(leftPercentage, topPercentage);

      const el = document.getElementById(`target-${i}`);
      if (el) {
        el.setAttribute(
          "style",
          `
              transform: translate(
                ${pos.left.toString()}px,
                ${pos.top.toString()}px
              );
              position: absolute;
            `
        );
      }
    });
  });

  const calculateInitialPosition = (
    leftPercentage: number,
    topPercentage: number
  ) => {
    console.log("calculating");
    if (!container.value) return { left: 0, top: 0 };

    console.log(leftPercentage, topPercentage);
    console.log(
      container.value.getBoundingClientRect().width,
      container.value.getBoundingClientRect().height
    );

    const left =
      (leftPercentage / 100) * container.value?.getBoundingClientRect().width;
    const top =
      (topPercentage / 100) * container.value?.getBoundingClientRect().height;

    return {
      left,
      top,
    };
  };
</script>
