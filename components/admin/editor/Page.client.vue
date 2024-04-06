<template>
  <div
    ref="container"
    class="h-full w-auto aspect-thumbnail relative bg-base-white bg-cover"
    :style="`background-image: url(${useUrl(pageFileUrl)});`"
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
      :resizable="true"
      :keep-ratio="false"
      @drag="onDrag"
      @rotate="onRotate"
      @rotate-end="onRotateEnd"
      @clickGroup="onClickGroup"
      @dragGroup="onDragGroup"
      @renderGroup="onRenderGroup"
      @dragEnd="onDragEnd"
      @resize="onResize"
      @resize-end="onResizeEnd"
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
        :key="item.id"
        :item-id="item.id"
        class="absolute target bg-transparent hover:cursor-pointer z-[25]"
        :class="[
          `target-${i} w-[${item.width}%] aspect-[${item.numerator}/${item.denominator}]`,
        ]"
        :id="`target-${i}`"
      >
        <NuxtImg
          :src="useUrl(item.file?.url)"
          class="w-full h-full fill-white"
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
    type OnResize,
    type OnResizeEnd,
    type OnRotate,
    type OnRotateEnd,
  } from "vue3-moveable";
  import VueSelecto from "vue3-selecto";

  const moveableRef = ref<InstanceType<typeof Moveable> | null>(null);
  const container = ref<HTMLElement | null>(null);
  const { width: containerWidth, height: containerHeight } =
    useElementSize(container);

  const selectoRef = ref<InstanceType<typeof VueSelecto> | null>(null);
  const targets = ref<Array<HTMLElement>>([]);

  const props = defineProps<{
    items: Array<ApiSticker>;
    pageFileUrl: string | undefined;
  }>();

  const emit = defineEmits<{
    select: [event: any, items: any];
    dragEnd: [e: OnDragEnd];
    rotateEnd: [e: OnRotateEnd];
    resizeEnd: [e: OnResizeEnd];
  }>();

  const onDrag = (e: OnDrag) => {
    e.target.style.transform = e.transform;
  };

  const onRotate = (e: OnRotate) => {
    e.target.style.transform = e.transform;
  };

  const onResize = (e: OnResize) => {
    const itemId = e.target.getAttribute("item-id");
    if (!itemId) return;

    const item = props.items.find((item) => item.id == itemId);
    if (!item) return;

    const width = e.width;
    const height = (e.width / item.numerator) * item.denominator;

    e.target.style.width = `${width}px`;
    e.target.style.height = `${height}px`;
    e.target.style.transform = e.drag.transform;
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

    const unselectedItems = e.removed as Array<HTMLElement>;
    const selectedItems = e.selected as Array<HTMLElement>;
    // lower previous selected item z-index
    unselectedItems.forEach((target) => {
      target.style.zIndex = "20";
    });
    // increase current selected item z-index
    selectedItems.forEach((target) => {
      target.style.zIndex = "25";
    });

    console.log(e);
    targets.value = selectedItems;
    emit("select", e, selectedItems);
  };

  const onDragEnd = (e: OnDragEnd) => {
    emit("dragEnd", e);
  };

  const onRotateEnd = (e: OnRotateEnd) => {
    emit("rotateEnd", e);

    // force drag event, so that we update top and left position
    moveableRef.value?.request(
      "draggable",
      {
        deltaX: 0,
        deltaY: 0,
      },
      true
    );
  };

  const onResizeEnd = (e: OnResizeEnd) => {
    emit("resizeEnd", e);

    // force drag event, so that we update top and left position
    moveableRef.value?.request(
      "draggable",
      {
        deltaX: 0,
        deltaY: 0,
      },
      true
    );
  };

  // guidelines
  const getGuidelines = computed(() => {
    const classes = [".container"];

    if (!props.items) return classes;

    classes.push(...props.items.map((item, index) => `.target-${index}`));

    return classes;
  });

  // whenever items length changes or container's size changes, update sticker positions
  // this will set sticker's initial position on first load as well
  watch(
    [() => props.items.length, containerWidth, containerHeight],
    async () => {
      console.log("initializing values");
      setTimeout(() => {
        reRenderItems();
      }, 0);
    },
    {
      deep: false, // make sure its set to false - otherwies too many changes happen in the items array and the site crashes
    }
  );

  const reRenderItems = () => {
    props.items.forEach((item, i) => {
      console.log(item);
      const el = document.getElementById(`target-${i}`);
      if (el) {
        // set current el as moveable target
        moveableRef.value?.setState({
          target: [el],
        });
        // force re-render
        moveableRef.value?.forceUpdate();

        // set size
        if (container.value) {
          const widthInPixels =
            (item.width * container.value.getBoundingClientRect().width) / 100;
          const heightInPixels =
            (item.height * container.value.getBoundingClientRect().height) /
            100;

          moveableRef.value?.request(
            "resizable",
            {
              offsetWidth: widthInPixels,
              offsetHeight: heightInPixels,
            },
            true
          );
        }

        // set rotation
        // we must set this before we set the position
        moveableRef.value?.request(
          "rotatable",
          {
            rotate: item.rotation,
          },
          true
        );

        // set position
        if (container.value) {
          // convert from percentages to pixels - moveable works with pixels
          const left =
            (item.left / 100) * container.value.getBoundingClientRect().width;
          const top =
            (item.top / 100) * container.value.getBoundingClientRect().height;
          moveableRef.value?.request(
            "draggable",
            {
              x: left,
              y: top,
            },
            true
          );
        }

        // unselect target
        moveableRef.value?.setState({
          target: [],
        });
      }
      console.log("item:", item.top, item.left, item.rotation);
    });
  };

  onKeyStroke(["ArrowUp"], () => {
    if (!moveableRef.value) return;

    moveableRef.value.request(
      "draggable",
      {
        deltaX: 0,
        deltaY: -1,
      },
      true
    );
  });

  onKeyStroke(["ArrowDown"], () => {
    if (!moveableRef.value) return;

    moveableRef.value.request(
      "draggable",
      {
        deltaX: 0,
        deltaY: 1,
      },
      true
    );
  });

  onKeyStroke(["ArrowLeft"], () => {
    if (!moveableRef.value) return;

    moveableRef.value.request(
      "draggable",
      {
        deltaX: -1,
        deltaY: 0,
      },
      true
    );
  });

  onKeyStroke(["ArrowRight"], () => {
    if (!moveableRef.value) return;

    moveableRef.value.request(
      "draggable",
      {
        deltaX: 1,
        deltaY: 0,
      },
      true
    );
  });

  const updateSelectedTargetTransform = (values: MoveableTransform) => {
    if (!moveableRef.value || !container.value) return;

    moveableRef.value.request(
      "resizable",
      {
        offsetWidth: values.width,
        offsetHeight: values.height,
      },
      true
    );

    moveableRef.value.request(
      "rotatable",
      {
        rotate: values.rotation,
      },
      true
    );
  };

  const updateSelectedTargetPosition = (values: MoveablePosition) => {
    moveableRef.value?.request(
      "draggable",
      {
        x: values.left,
        y: values.top,
      },
      true
    );
  };

  const setSelectedTarget = (selectedTarget: ApiSticker | null) => {
    // if no target, unselect all
    if (!selectedTarget) {
      moveableRef.value?.setState({
        target: [],
      });
      moveableRef.value?.forceUpdate();

      return;
    }

    // look for target to select
    props.items.forEach((item, i) => {
      if (item.id == selectedTarget?.id) {
        console.log("setting selected target", item);
        const el = document.getElementById(`target-${i}`);
        if (el) {
          setTimeout(() => el.focus(), 0);

          // set current el as moveable target
          moveableRef.value?.setState({
            target: [el],
          });
          moveableRef.value?.forceUpdate();
          console.log("found target");
        }

        return;
      }
    });
  };

  defineExpose({
    updateSelectedTargetTransform,
    updateSelectedTargetPosition,
    container,
    setSelectedTarget,
  });
</script>
