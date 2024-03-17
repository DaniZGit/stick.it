<template>
  <div ref="container" class="w-full h-full container relative">
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
        class="target w-[15%] aspect-thumbnail bg-red-200 hover:cursor-pointer"
        :class="`target-${i}`"
      ></div>
    </div>
    <div class="empty elements"></div>
  </div>
</template>

<script setup lang="ts">
  import Moveable, {
    type OnClickGroup,
    type OnDrag,
    type OnDragGroup,
    type OnRenderGroup,
    type OnRotate,
  } from "vue3-moveable";
  import VueSelecto from "vue3-selecto";

  const moveableRef = ref<InstanceType<typeof Moveable> | null>(null);

  const container = ref<HTMLElement | null>(null);
  const selectoRef = ref<InstanceType<typeof VueSelecto> | null>(null);
  const targets = ref<Array<HTMLElement>>([]);
  const items = defineModel("items", {
    type: Array,
  });

  const emit = defineEmits<{
    select: [items: any];
  }>();

  const onDrag = (e: OnDrag) => {
    e.target.style.transform = e.transform;
  };

  const onRotate = (e: OnRotate) => {
    target.style.transform = e.transform;
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

  // guidelines
  const getGuidelines = computed(() => {
    const classes = [".container"];

    if (!items.value) return classes;

    classes.push(...items.value.map((item, index) => `.target-${index}`));

    return classes;
  });
</script>
