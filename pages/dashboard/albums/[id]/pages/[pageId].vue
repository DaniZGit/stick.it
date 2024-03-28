<template>
  <div class="h-full grid grid-rows-12 grid-flow-row">
    <AdminHeader class="row-span-1"></AdminHeader>

    <div
      class="h-full row-span-11 grid grid-cols-12 bg-base-tertiary p-4 relative"
    >
      <div class="h-full col-span-9 flex justify-center gap-x-2">
        <div class="relative aspect-thumbnail">
          <AdminEditorPage
            v-if="page"
            v-model:items="stickers"
            :page-file-url="page?.file?.url"
            @select="onSelect"
            @drag-end="onDragEnd"
            @rotate-end="onRotateEnd"
            @resize-end="onResizeEnd"
          ></AdminEditorPage>
        </div>
        <div class="h-full flex flex-col justify-between">
          <div class="flex flex-col gap-y-2">
            <div v-for="option in options" class="bg-base-white rounded-md">
              <Icon
                :name="option.icon"
                size="42"
                class="border-2 border-transparent rounded-md hover:border-black hover:cursor-pointer"
                @click="showCreateStickerModal = true"
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

      <div
        class="h-full col-span-3 p-4 flex flex-col items-center bg-white overflow-y-auto"
      >
        <h2 class="text-xl font-bold">Stickers</h2>
        <div class="h-full w-full">
          <div
            v-if="!selectedSticker"
            class="h-full flex flex-col justify-center gap-y-8"
          >
            <div v-for="option in options" class="flex flex-col items-center">
              <div class="p-2 border-2 border-base-tertiary rounded-full">
                <Icon :name="option.icon" size="42" />
              </div>
              <span class="text-sm">{{ option.description }}</span>
            </div>
          </div>
          <div v-show="selectedSticker" class="h-full px-4">
            <AdminFormUpdateSticker
              ref="updateStickerForm"
              :url="selectedSticker?.file?.url"
              class="h-full justify-between"
              @submit="onStickerUpdate"
              @delete="onStickerDelete"
              @error="toast?.show('error', t('unexpected-error'))"
            >
            </AdminFormUpdateSticker>
          </div>
        </div>
      </div>
    </div>
    <!-- Create modal -->
    <ModalCreateSticker
      :page-id="$route.params.pageId"
      v-model:visible="showCreateStickerModal"
      @created="onStickerCreated"
      @error="onStickerCreateError"
      @pending="onStickerCreating"
    />
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type { AdminFormUpdateSticker } from "#build/components";
  import type { OnDragEnd, OnResizeEnd, OnRotateEnd } from "vue3-moveable";
  import type CustomToast from "~/components/CustomToast.vue";
  import type { FetchError } from "ofetch";

  definePageMeta({
    layout: "dashboard",
  });

  const updateStickerForm = ref<InstanceType<
    typeof AdminFormUpdateSticker
  > | null>(null);
  const route = useRoute();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

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

  const page = ref<ApiPage>();
  const stickers = ref<Array<ApiSticker>>([]);
  onMounted(async () => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        page: ApiPage;
      }>(`v1/pages/${route.params.pageId}`);

      if (!response.page) {
        toast.value?.show("error", t("unexpected-error"));
        return;
      }

      page.value = response.page;
      stickers.value = response.page.stickers;
      console.log("stickers", stickers.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  });

  const selectedSticker = ref<ApiSticker | null>(null);
  const onSelect = (e: any, targets: Array<HTMLElement | SVGElement>) => {
    if (targets.length != 1) {
      selectedSticker.value = null;
      return;
    }

    const item = targets[0];
    if (item.hasAttribute("item-id")) {
      const id = item.getAttribute("item-id");
      const sticker = stickers.value.find((s) => s.id == id);

      if (sticker) {
        const container = e.currentTarget.container as HTMLElement;
        const widthInPixels =
          (sticker.width * container.getBoundingClientRect().width) / 100;
        const heightInPixels =
          (sticker.height * container.getBoundingClientRect().height) / 100;
        console.log(container);
        console.log(sticker);

        updateStickerForm.value?.resetValues({
          title: sticker.title,
          rarity: sticker.rarity_id,
          type: sticker.type,
          width: widthInPixels,
          height: heightInPixels,
          numerator: sticker.numerator,
          denominator: sticker.denominator,
          rotation: sticker.rotation,
        });

        selectedSticker.value = sticker;
      }
    }
  };

  const onDragEnd = (e: OnDragEnd) => {
    // on drag end, update selectedSticker top and left position
    if (selectedSticker.value) {
      const moveableRect = e.moveable.getRect();
      const containerRect = e.moveable.getContainer().getBoundingClientRect();

      // convert to percentages
      const left = (moveableRect.left / containerRect.width) * 100;
      const top = (moveableRect.top / containerRect.height) * 100;

      selectedSticker.value.left = left;
      selectedSticker.value.top = top;

      console.log("dragged", moveableRect);
    }
  };

  const onRotateEnd = (e: OnRotateEnd) => {
    if (selectedSticker.value) {
      const moveableRect = e.moveable.getRect();
      selectedSticker.value.rotation = moveableRect.rotation;
      updateStickerForm.value?.resetValues({
        rotation: selectedSticker.value.rotation,
      });
      console.log("rotated", moveableRect);
    }
  };

  const onResizeEnd = (e: OnResizeEnd) => {
    if (selectedSticker.value) {
      const moveableRect = e.moveable.getRect();
      const containerRect = e.moveable.getContainer().getBoundingClientRect();

      // convert to percentages %
      const width = Math.min(
        (moveableRect.offsetWidth / containerRect.width) * 100,
        100
      );
      const height = Math.min(
        (moveableRect.offsetHeight / containerRect.height) * 100,
        100
      );

      selectedSticker.value.width = width;
      selectedSticker.value.height = height;

      updateStickerForm.value?.resetValues({
        width: moveableRect.offsetWidth,
        height: moveableRect.offsetHeight,
      });
      console.log(e.moveable);
      console.log("resized", moveableRect);
      console.log("container", containerRect);
      console.log("moveable", moveableRect);
    }
  };

  // sticker create modal
  const showCreateStickerModal = ref(false);
  const creating = ref(false);
  const onStickerCreating = (status: boolean) => {
    creating.value = status;
  };

  const onStickerCreated = (createdSticker: ApiSticker) => {
    if (!stickers.value) return;

    stickers.value.push(createdSticker);

    toast.value?.show("success", t("admin-sticker-created"));
  };

  const onStickerCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // sticker update
  const onStickerUpdate = async (values: UpdateStickerForm) => {
    console.log("updating sticker", values);

    const body = new FormData();
    body.append("title", values.title);
    body.append("type", values.type);
    body.append("top", JSON.stringify(selectedSticker.value?.top));
    body.append("left", JSON.stringify(selectedSticker.value?.left));
    body.append("width", JSON.stringify(selectedSticker.value?.width));
    body.append("height", JSON.stringify(selectedSticker.value?.height));
    body.append("numerator", JSON.stringify(values.numerator));
    body.append("denominator", JSON.stringify(values.denominator));
    body.append("rotation", JSON.stringify(selectedSticker.value?.rotation));
    body.append("rarity_id", values.rarity);
    body.append("file", values.file);
    body.append("file_id", selectedSticker.value?.file?.id ?? "");

    try {
      const response = await useApi<{ sticker: ApiSticker }>(
        `/v1/stickers/${selectedSticker.value?.id}`,
        {
          method: "PUT",
          body: body,
        }
      );

      if (response.sticker) {
        // update stickers array
        const ind = stickers.value.findIndex(
          (s) => s.id == response.sticker.id
        );

        if (ind >= 0) {
          stickers.value[ind] = response.sticker;
        }
      }

      toast.value?.show("info", t("admin-sticker-updated"));
    } catch (error) {
      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        updateStickerForm.value?.setErrors(handledErrors.errors);
      } else {
        toast.value?.show("error", t("unexpected-error"));
      }
    }
  };

  // sticker delete
  const onStickerDelete = async () => {
    if (!selectedSticker.value) return;

    if (confirm(t("admin-sticker-delete-confirmation")) != true) return;

    console.log("deleting sticker");
    try {
      await useApi(`/v1/stickers/${selectedSticker.value?.id}`, {
        method: "DELETE",
      });

      const ind = stickers.value.findIndex((s) => {
        return s.id == selectedSticker.value?.id;
      });

      if (ind >= 0) {
        stickers.value.splice(ind, 1);
        selectedSticker.value = null;
      }

      toast.value?.show("success", t("admin-sticker-deleted"));
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  };
</script>

<style></style>
