<template>
  <div class="h-full flex flex-col">
    <AdminHeader></AdminHeader>

    <div class="h-full grid grid-cols-12 bg-base-tertiary p-4 relative">
      <div class="h-full col-span-9 flex justify-center gap-x-2">
        <div class="relative aspect-thumbnail">
          <AdminEditorPage
            v-if="stickers.length"
            :items="stickers"
            @select="onSelect"
            @drag-end="onDragEnd"
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
            <AdminFormSticker
              ref="updateStickerForm"
              :url="selectedSticker?.file?.url"
              buttonLabel="Update"
              @submit="onStickerUpdate"
              @error="toast?.show('error', t('unexpected-error'))"
            ></AdminFormSticker>
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
  import type { AdminFormSticker } from "#build/components";
  import type { OnDragEnd } from "vue3-moveable";
  import type CustomToast from "~/components/CustomToast.vue";
  import type { FetchError } from "ofetch";

  definePageMeta({
    layout: "dashboard",
  });

  const updateStickerForm = ref<InstanceType<typeof AdminFormSticker> | null>(
    null
  );
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

      stickers.value = response.page.stickers;
      console.log("stickers", stickers.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  });

  const selectedSticker = ref<ApiSticker | null>(null);
  const onSelect = (targets: Array<HTMLElement | SVGElement>) => {
    if (targets.length != 1) {
      selectedSticker.value = null;
      return;
    }

    const item = targets[0];
    if (item.hasAttribute("item-id")) {
      const id = item.getAttribute("item-id");
      const sticker = stickers.value.find((s) => s.id == id);

      if (sticker) {
        selectedSticker.value = sticker;
        updateStickerForm.value?.resetValues({
          title: selectedSticker.value.title,
          rarity: selectedSticker.value.rarity_id,
          type: selectedSticker.value.type,
        });
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
  const onStickerUpdate = async (values: StickerForm) => {
    console.log("updating sticker", stickers.value);
    const body = new FormData();
    body.append("title", values.title);
    body.append("type", values.type);
    body.append("top", JSON.stringify(selectedSticker.value?.top));
    body.append("left", JSON.stringify(selectedSticker.value?.left));
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
</script>

<style></style>
